import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Box, Tag, CreditCard } from 'lucide-react';
import { getOrderDetails } from "@/lib/actions/client.actions";
import { getActiveClientId } from "@/modules/auth/lib/auth-service";
import { notFound, redirect } from 'next/navigation';

/**
 * AETHER OS // ORDER TERMINAL [DETAIL VIEW]
 * Diese Seite zeigt die spezifischen Daten einer Bestellung an.
 * Der Zugriff wird über die aktive Session validiert.
 */
export default async function OrderDetailPage({ params }: { params: { id: string } }) {

  // 1. IDENTITY SYNC: Wer greift auf das System zu?
  const customerId = await getActiveClientId();

  // 2. SECURITY GATE: Ohne gültige ID kein Zugriff auf die Daten
  if (!customerId) {
    redirect("/login");
  }

  // 3. DATA FETCH: Bestellung spezifisch für diesen Kunden laden
  const order = await getOrderDetails(params.id, customerId);

  // 4. INTEGRITY CHECK: Falls Bestellung nicht existiert oder nicht zum Kunden gehört
  if (!order) {
    notFound();
  }

  return (
      <main className="p-8 max-w-4xl mx-auto space-y-8 bg-black min-h-screen text-white">

        {/* HEADER SECTION */}
        <div className="flex items-center gap-4">
          <Link href="/client/orders" className="text-zinc-500 hover:text-blue-500 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              Order <span className="text-blue-500">#{order.id}</span>
            </h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Data_Set_ID: {order.id} // Status: {order.status}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* MAIN TERMINAL: PRODUCT LIST */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 flex items-center gap-2">
              <Box size={14} /> Enthaltene_Module
            </h2>

            {order.order_items.map((item: any, index: number) => (
                <div key={index} className="p-4 bg-[#050505] border border-white/5 rounded-2xl flex justify-between items-center group hover:border-blue-500/20 transition-all">
                  <div>
                    <p className="font-bold text-white uppercase italic">{item.products.name}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">{item.products.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-blue-500">{item.quantity}x</p>
                    <p className="text-xs font-bold text-white">
                      {Number(item.price_at_purchase).toFixed(2)} €
                    </p>
                  </div>
                </div>
            ))}
          </div>

          {/* SIDEBAR: SUMMARY & LOGS */}
          <div className="space-y-6">
            <div className="p-6 bg-[#050505] border border-blue-500/10 rounded-3xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 blur-2xl" />

              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-2">
                <CreditCard size={14} /> Billing_Summary
              </h3>

              <div className="space-y-2 border-t border-white/5 pt-4">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase">
                  <span>Subtotal</span>
                  <span>{Number(order.total_price).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-xl font-black italic tracking-tighter text-white pt-2">
                  <span>TOTAL</span>
                  <span className="text-blue-500">{Number(order.total_price).toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#050505] border border-white/5 rounded-3xl">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-2 flex items-center gap-2">
                <Tag size={14} /> Info_Log
              </h3>
              <p className="text-[10px] font-mono text-zinc-500 leading-relaxed uppercase">
                Bestelldatum: {new Date(order.order_date).toLocaleString('de-DE')}<br />
                Zahlungsstatus: Verified<br />
                System: AETHER OS v3.0
              </p>
            </div>
          </div>
        </div>
      </main>
  );
}