/**
 * AETHER OS // CORE KERNEL ACTIONS
 * Synchronisiert mit SQL-Schema: products, orders, order_items, tickets
 */

"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- TYPEN DEFINITIONEN ---
export type ActionResult =
    | { success: true; id?: number | string }
    | { success: false; error: string };

/**
 * AETHER OS: PRODUCT CREATION
 * Erstellt ein Produkt und setzt vat_rate sowie cost_price korrekt.
 */
export async function createFullProduct(data: {
    name: string;
    preis: number;
    ek_preis: number;
    ust_satz: number;
    category_id: number;
    supplier_id: number;
    min_stock?: number;
}): Promise<ActionResult> {
    try {
        const { data: newProduct, error } = await db
            .from("products")
            .insert([
                {
                    name: data.name,
                    price: data.preis,
                    cost_price: data.ek_preis,
                    vat_rate: data.ust_satz, // Synchronisiert mit SQL 'vat_rate'
                    category_id: data.category_id,
                    supplier_id: data.supplier_id,
                    stock: 0,
                    min_stock: data.min_stock || 5,
                    in_stock: true
                }
            ])
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/admin/inventory");
        return { success: true, id: newProduct.id };
    } catch (error: any) {
        console.error("AETHER_PRODUCT_CREATE_ERROR [KERNEL]:", error.message);
        return { success: false, error: error.message };
    }
}

/**
 * AETHER OS: FINANCE & ANALYTICS
 * Berechnet Profit und Umsatz basierend auf abgeschlossenen Bestellungen.
 */
export async function getProfitLossData() {
    try {
        const { data: completedOrders, error } = await db
            .from("orders")
            .select(`
        id,
        total_price,
        order_date,
        order_items (
          quantity,
          price_at_purchase,
          products ( cost_price )
        )
      `)
            .eq("status", "completed")
            .order("order_date", { ascending: true });

        if (error) throw error;

        let totalProfit = 0;
        let totalRevenue = 0;

        const chartData = (completedOrders || []).map((order: any) => {
            let orderTotalCost = 0;

            order.order_items?.forEach((item: any) => {
                const qty = item.quantity || 0;
                const costPerUnit = item.products?.cost_price || 0;
                orderTotalCost += qty * costPerUnit;
            });

            const revenue = Number(order.total_price) || 0;
            const profit = revenue - orderTotalCost;

            totalProfit += profit;
            totalRevenue += revenue;

            return {
                name: new Date(order.order_date).toLocaleDateString("de-DE", { day: "2-digit", month: "short" }),
                revenue: revenue,
                profit: profit,
            };
        });

        return { success: true, chartData, totalProfit, totalRevenue };
    } catch (error) {
        console.error("AETHER_FINANCE_ERROR [KERNEL_FATAL]:", error);
        return { success: false, chartData: [], totalProfit: 0, totalRevenue: 0 };
    }
}

export async function getSystemMetrics() {
    const startTime = Date.now();

    try {
        // Parallele Abfrage aller relevanten Tabellen für maximale Performance
        const [
            { count: ticketsCount },
            { count: postsCount },
            { count: subsCount },
            { count: ordersCount },
            { data: hub },
            { data: productsData }
        ] = await Promise.all([
            db.from('tickets').select('*', { count: 'exact', head: true }),
            db.from('blog_posts').select('*', { count: 'exact', head: true }),
            db.from('newsletter_subs').select('*', { count: 'exact', head: true }),
            db.from('orders').select('*', { count: 'exact', head: true }),
            db.from('intelligence_hub').select('*').single(),
            db.from('products').select('name, stock, min_stock')
        ]);

        const duration = Date.now() - startTime;

        // Logik für kritische Bestände
        const lowStockItems = productsData?.filter((p: any) => p.stock <= p.min_stock) || [];
        const totalStock = productsData?.reduce((sum: number, p: any) => sum + (p.stock || 0), 0) || 0;

        // Dynamischer Pulse-Check
        // Ein hoher Stressfaktor (viele kritische Produkte) senkt den Market Pulse
        const hubPulse = hub?.market_pulse || 50;
        const stressFactor = (lowStockItems.length * 5);
        const dynamicPulse = Math.max(0, Math.min(100, hubPulse + (ticketsCount || 0) - stressFactor));

        return {
            responseTime: `${duration}ms`,
            stats: [
                {
                    label: 'System Nodes',
                    value: postsCount || 0,
                    trend: `${totalStock} Units in Stock`,
                    color: 'text-blue-500'
                },
                {
                    label: 'Kritische Produkte',
                    value: lowStockItems.length,
                    trend: lowStockItems.length > 0 ? 'Nachbestellen!' : 'Alles OK',
                    color: lowStockItems.length > 0 ? 'text-red-500' : 'text-green-500'
                },
                {
                    label: 'Market Pulse',
                    value: `${dynamicPulse}%`,
                    trend: hub?.strategy_mode || 'Stable',
                    color: 'text-green-500'
                },
                {
                    label: 'Kernel-Speed',
                    value: `${duration}ms`,
                    trend: 'Optimal',
                    color: 'text-orange-500'
                }
            ]
        };
    } catch (error) {
        console.error("AETHER_METRICS_CRITICAL_ERROR:", error);
        return null;
    }
}