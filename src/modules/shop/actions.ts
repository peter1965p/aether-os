/**
 * AETHER OS // UNIFIED SHOP & ORDER KERNEL
 * Full Integration: Cart, Transactions, Admin, Orders & Sentinel-Uplink
 */

"use server";

import db from "@/lib/db"; // Dein Standard-Client
import { createClient } from '@/lib/db'; // Für Auth-spezifische Abfragen (aus orders)
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { randomUUID, randomBytes } from "crypto";
import { triggerSentinelNotification } from "@/modules/notifications/actions";

/* --- 1. INTERFACES (Wichtig für das Dashboard) --- */

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

/* --- 2. CORE HELPERS --- */

const parsePrice = (price: any): number => {
  if (typeof price === 'number') return price;
  const cleaned = price?.toString().replace("€", "").replace(",", ".").trim() || "0";
  return parseFloat(cleaned) || 0;
};

async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existingSession = cookieStore.get("aether_session_id")?.value;
  if (existingSession) return existingSession;

  const newSessionId = randomUUID();
  cookieStore.set("aether_session_id", newSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return newSessionId;
}

/* --- 3. CART OPERATIONS --- */

export async function addToCartAction(productId: number) {
  try {
    const sessionId = await getOrCreateSessionId();
    const { error } = await db.from('cart_items').insert([{ product_id: productId, quantity: 1, session_id: sessionId }]);
    if (error) throw error;
    revalidatePath('/shop');
    return { success: true };
  } catch { return { success: false, error: "CART_ERROR" }; }
}

export async function removeFromCartAction(cartItemId: string) {
  try {
    const { error } = await db.from('cart_items').delete().eq('id', cartItemId);
    if (error) throw error;
    revalidatePath("/shop");
    return { success: true };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function getCartItemsAction() {
  try {
    const sessionId = await getOrCreateSessionId();
    const { data } = await db.from('cart_items').select(`id, product_id, quantity, products (name, price)`).eq("session_id", sessionId);
    return data?.map((item: any) => ({
      id: item.id,
      produkt_id: item.product_id,
      name: item.products?.name || "Unknown Asset",
      preis: item.products?.price || 0,
      menge: item.quantity
    })) || [];
  } catch { return []; }
}

/* --- 4. ORDER MANAGEMENT (The "Orders" Integration) --- */

export async function getRecentOrders(limit: number = 5): Promise<Order[]> {
  const supabase = createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: customerData } = await supabase.from('customers').select('id').eq('email', user.email).single();
    if (!customerData) return [];

    const { data, error } = await supabase.from('orders').select('id, order_date, status, total_price')
        .eq('customer_id', customerData.id).order('order_date', { ascending: false }).limit(limit);

    if (error) throw error;
    return (data || []) as Order[];
  } catch (err) { return []; }
}

export async function getOrderDetails(orderId: string | number): Promise<Order | null> {
  const supabase = createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: orderData, error } = await supabase.from('orders')
        .select(`id, customer_id, order_date, status, total_price, order_items (id, product_id, quantity, price_at_purchase, products (name))`)
        .eq('id', typeof orderId === 'string' ? parseInt(orderId) : orderId).single();

    if (error || !orderData) return null;

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
  } catch { return null; }
}

export async function cancelOrder(orderId: number) {
  const supabase = createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) return { success: false, error: "Nicht autorisiert." };

    const { error } = await supabase.from('orders').update({ status: 'Storniert' }).eq('id', orderId);
    if (error) throw error;

    triggerSentinelNotification({
      userId: user.id,
      email: user.email,
      type: 'SYSTEM',
      subject: 'ORDER_CANCELLED',
      message: `Bestätigung: Deine Bestellung #${orderId} wurde storniert.`
    }).catch(() => {});

    revalidatePath("/client/orders");
    return { success: true };
  } catch (err: any) { return { success: false, error: err.message }; }
}

/* --- 5. TRANSACTION ENGINE (The Checkout Flow) --- */

export async function finalizeTransactionAction(guestData?: { email: string; full_name: string }) {
  const sessionId = await getOrCreateSessionId();
  try {
    const { data: cartItems } = await db.from("cart_items").select(`*, products(*)`).eq("session_id", sessionId);
    if (!cartItems || cartItems.length === 0) return { success: false, error: "Empty Cart" };

    let customerId = null;
    if (guestData) {
      const { data: customer } = await db.from("customers").upsert({ email: guestData.email, full_name: guestData.full_name, tier: 'guest' }, { onConflict: 'email' }).select().single();
      if (customer) customerId = customer.id;
    }

    const total_price = cartItems.reduce((acc: number, item: { products: { price: any; }; quantity: number; }) => acc + (parsePrice(item.products.price) * item.quantity), 0);
    const { data: order, error: orderError } = await db.from("orders")
        .insert([{ customer_id: customerId, order_date: new Date().toISOString(), status: "pending", total_price: total_price }]).select().single();

    if (orderError) throw orderError;

    for (const item of cartItems) {
      await db.from("order_items").insert({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: parsePrice(item.products.price),
      });
    }

    const magicToken = randomBytes(32).toString('hex');
    await db.from("cart_items").delete().eq("session_id", sessionId);
    revalidatePath("/shop");
    return { success: true, orderId: order.id, magicToken };
  } catch { return { success: false, error: "Kernel Fault" }; }
}

/* --- 6. ADMIN OPERATIONS --- */

export async function saveProductToDB(data: any) {
  try {
    const { error } = await db.from("products").insert([{ ...data, price: parsePrice(data.price) }]);
    if (error) throw error;
    revalidatePath("/admin/shop");
    revalidatePath("/shop");
    return { success: true };
  } catch { return { success: false }; }
}

export async function updateProductInDB(id: number, data: any) {
  try {
    const { error } = await db.from("products").update(data).eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/shop");
    return { success: true };
  } catch { return { success: false }; }
}

export async function deleteProductFromDB(id: number) {
  try {
    const { error } = await db.from("products").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/shop");
    return { success: true };
  } catch { return { success: false }; }
}

export async function generateInvoiceData(orderId: number) {
  const supabase = await createClient();

  try {
    // 1. Datenabfrage mit Supabase-Relationen
    // Wir holen die Bestellung und 'joinen' über verschachtelte Selects
    const { data: order, error } = await supabase
        .from("orders")
        .select(`
        id,
        order_date,
        total_price,
        customers (
          full_name,
          email
        ),
        order_items (
          quantity,
          price_at_purchase,
          products (
            name,
            vat_rate
          )
        )
      `)
        .eq("id", orderId)
        .single();

    if (error || !order) {
      console.error("AETHER_INVOICE_FETCH_ERROR:", error?.message);
      return null;
    }

    // 2. Berechnung der Finanzwerte
    // Wir nutzen den Steuersatz des ersten Produkts für die Kalkulation
    const vatRate = order.order_items?.[0]?.products?.vat_rate || 19;
    const grossTotal = Number(order.total_price) || 0;

    // Formel: Netto = Brutto / (1 + (Satz / 100))
    const netTotal = grossTotal / (1 + vatRate / 100);
    const taxAmount = grossTotal - netTotal;

    // 3. Rückgabe des formatierten Objekts
    return {
      invoiceNumber: `INV-${order.id.toString().padStart(6, '0')}`,
      date: new Date(order.order_date).toLocaleDateString('de-DE'),
      customer: order.customers?.full_name || "Gast-Kunde",
      email: order.customers?.email || "N/A",
      items: order.order_items.map((item: any) => ({
        name: item.products?.name || "System-Modul",
        qty: item.quantity,
        price: item.price_at_purchase
      })),
      totals: {
        net: netTotal.toFixed(2),
        tax: taxAmount.toFixed(2),
        gross: grossTotal.toFixed(2),
        rate: vatRate
      }
    };
  } catch (error) {
    console.error("CRITICAL_INVOICE_FAULT:", error);
    return null;
  }
}

export async function getCustomerInvoices(customerId: number) {
  try {
    const { data, error } = await db
        .from("orders")
        .select("*")
        .eq("customer_id", customerId)
        .order("order_date", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}