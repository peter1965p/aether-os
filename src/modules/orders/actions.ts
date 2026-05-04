"use server";

import { createClient } from '@/lib/db';

/**
 * --- INTERFACES ---
 * Wir definieren die Typen einmalig am Anfang der Datei.
 */

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  product_name?: string;
}

export interface Order {
  id: number;
  customer_id: number | null;
  order_date: string;
  status: string;
  total_price: number;
  items?: OrderItem[];
}

/**
 * --- ACTIONS ---
 */

/**
 * Holt die neuesten Bestellungen des aktuell angemeldeten Kunden.
 * @param limit Anzahl der abzurufenden Bestellungen (Standard: 5)
 */
export async function getRecentOrders(limit: number = 5): Promise<Order[]> {
  const supabase = createClient();

  try {
    // 1. Authentifizierten User holen
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // 2. Customer-ID anhand der E-Mail finden
    const { data: customerData } = await supabase
        .from('customers')
        .select('id')
        .eq('email', user.email)
        .single();

    if (!customerData) return [];

    // 3. Bestellungen laden, gefiltert auf diesen Kunden
    const { data, error } = await supabase
        .from('orders')
        .select('id, order_date, status, total_price')
        .eq('customer_id', customerData.id)
        .order('order_date', { ascending: false })
        .limit(limit);

    if (error) {
      console.error("AETHER // DB-Fehler:", error.message);
      return [];
    }

    return (data || []) as Order[];
  } catch (err) {
    console.error("AETHER // System-Fehler:", err);
    return [];
  }
}

/**
 * Holt die detaillierten Informationen für eine spezifische Bestellung inkl. Artikel.
 */
export async function getOrderDetails(orderId: string | number): Promise<Order | null> {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: customerData } = await supabase
        .from('customers')
        .select('id')
        .eq('email', user.email)
        .single();

    if (!customerData) return null;

    const { data: orderData, error } = await supabase
        .from('orders')
        .select(`
          id,
          customer_id,
          order_date,
          status,
          total_price,
          order_items (
            id,
            product_id,
            quantity,
            price_at_purchase,
            products ( name )
          )
        `)
        .eq('id', typeof orderId === 'string' ? parseInt(orderId) : orderId)
        .eq('customer_id', customerData.id)
        .single();

    if (error || !orderData) return null;

    // Transformation der verschachtelten Supabase-Daten in unser Order-Interface
    return {
      id: orderData.id,
      customer_id: orderData.customer_id,
      order_date: orderData.order_date,
      status: orderData.status,
      total_price: Number(orderData.total_price),
      items: (orderData.order_items as any[]).map((item) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: Number(item.price_at_purchase),
        product_name: item.products?.name || "Aether Komponente"
      })),
    };
  } catch (err) {
    console.error("AETHER // Fehler bei OrderDetails:", err);
    return null;
  }
}

/**
 * Storniert eine bestehende Bestellung des Kunden.
 */
export async function cancelOrder(orderId: number): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Nicht autorisiert." };

    const { data: customerData } = await supabase
        .from('customers')
        .select('id')
        .eq('email', user.email)
        .single();

    if (!customerData) return { success: false, error: "Kunde nicht gefunden." };

    const { error } = await supabase
        .from('orders')
        .update({ status: 'Storniert' })
        .eq('id', orderId)
        .eq('customer_id', customerData.id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: "Systemfehler bei Stornierung." };
  }
}