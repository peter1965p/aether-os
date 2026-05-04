/**
 * AETHER OS // CLIENT KERNEL
 * Zweck: Sicherer Zugriff auf persönliche Kundendaten
 */

"use server";

import db from "@/lib/db";

/**
 * Filtert strikt nach der customerId des eingeloggten Users.
 * So stellen wir sicher, dass niemand fremde Bestellungen sieht.
 */
export async function getClientOrderHistory(customerId: string | number) {
    try {
        const { data, error } = await db
            .from("orders")
            .select(`
        id,
        order_date,
        total_price,
        status,
        order_items (
          quantity,
          products ( name, price )
        )
      `)
            .eq("customer_id", customerId) // Sicherheits-Barriere
            .order("order_date", { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("AETHER_CLIENT_HISTORY_ERROR:", error);
        return [];
    }
}


/**
 * AETHER OS // CLIENT KERNEL
 * Holt detaillierte Informationen zu einer spezifischen Bestellung.
 */
export async function getOrderDetails(orderId: string | number, customerId: number) {
    try {
        const { data, error } = await db
            .from("orders")
            .select(`
        id,
        order_date,
        total_price,
        status,
        order_items (
          quantity,
          price_at_purchase,
          products (
            name,
            description
          )
        )
      `)
            .eq("id", orderId)
            .eq("customer_id", customerId) // Sicherheitsbarriere: Nur eigene Bestellungen sehen
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("AETHER_ORDER_SYNC_ERROR:", error);
        return null;
    }
}