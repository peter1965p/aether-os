"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Truck, XCircle, LayoutDashboard, History, FileText } from 'lucide-react';
// Importiere die Action UND den Typ Order
import { getRecentOrders, type Order } from '@/modules/orders/actions';

export default function ClientDashboardPage() {
  const [loading, setLoading] = useState(true);

  // Initialisiere den State mit dem importierten Order-Typ
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const orders = await getRecentOrders();
        setRecentOrders(orders);
      } catch (error) {
        console.error("AETHER // Fehler beim Laden:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-6 text-white">
          <LayoutDashboard className="w-12 h-12 text-blue-500 animate-spin" />
          <div className="font-black italic animate-pulse text-blue-500 tracking-[0.5em] text-xs uppercase">
            Aether // Synchronisiere Daten...
          </div>
        </div>
    );
  }

  return (
      <main className="p-8 space-y-12 bg-black min-h-screen text-white">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-8">
          Dein <span className="text-blue-500">Dashboard</span>
        </h1>

        {/* Navigation Cards (gekürzt für Übersicht) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/client/orders" className="bg-[#050505] border border-white/5 p-6 rounded-2xl flex items-center gap-4 hover:border-blue-500/20 transition-all group">
            <Package className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
            <h2 className="text-lg font-bold">Bestellungen</h2>
          </Link>
          {/* ... weitere Links ... */}
        </section>

        <section>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-4">
            Letzte <span className="text-zinc-500">Aktivitäten</span>
          </h2>

          {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                    <Link
                        href={`/client/orders/${order.id}`}
                        key={order.id}
                        className="block bg-[#050505] border border-white/5 p-5 rounded-xl hover:border-blue-500/20 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-black italic">ORDER #{order.id}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500 px-2 py-1 rounded">
                    {order.status}
                  </span>
                      </div>
                      {/* KORREKTUR: order.order_date statt order.date */}
                      <p className="text-xs text-zinc-500 mt-2 uppercase font-bold tracking-widest">
                        Eingang: {new Date(order.order_date).toLocaleDateString('de-DE')}
                      </p>
                      <p className="text-blue-500 font-black italic mt-1">{order.total_price.toFixed(2)} €</p>
                    </Link>
                ))}
              </div>
          ) : (
              <div className="p-10 bg-[#050505] border border-white/5 rounded-2xl text-center text-zinc-600">
                <History className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="italic">Keine aktuellen Bestellungen gefunden.</p>
              </div>
          )}
        </section>
      </main>
  );
}