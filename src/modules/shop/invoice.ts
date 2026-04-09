"use server";

import db from "@/lib/db";

export async function generateInvoiceData(orderId: string) {
  // Holt Order, Items und Produkt-Details (Steuern/Preise) in einem Join
  const orderData = db.prepare(`
    SELECT
      o.id as order_id, o.datum, o.gesamtpreis, o.typ,
      oi.menge, oi.einzelpreis,
      p.name as produkt_name, p.ust_satz,
      c.full_name, c.email
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN produkte p ON oi.produkt_id = p.id
    LEFT JOIN customers c ON o.id = c.id
    WHERE o.id = ?
  `).all(orderId) as any[];

  if (orderData.length === 0) return null;

  const order = orderData[0];
  const netTotal = order.gesamtpreis / (1 + order.ust_satz / 100);
  const taxAmount = order.gesamtpreis - netTotal;

  return {
    invoiceNumber: `INV-${order.order_id.toString().padStart(6, '0')}`,
    date: new Date(order.datum).toLocaleDateString('de-DE'),
    customer: order.full_name || "Valued Customer",
    items: orderData.map(item => ({
      name: item.produkt_name,
      qty: item.menge,
      price: item.einzelpreis
    })),
    totals: {
      net: netTotal.toFixed(2),
      tax: taxAmount.toFixed(2),
      gross: order.gesamtpreis.toFixed(2),
      rate: order.ust_satz
    }
  };
}
