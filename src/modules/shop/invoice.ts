/**
 * AETHER OS // FINANCIAL KERNEL
 * Erzeugt strukturierte Rechnungsdaten basierend auf der Order-ID.
 *
 * @param orderId - Die numerische ID der Bestellung
 */

"use server";

import { createClient } from "@/lib/db";

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