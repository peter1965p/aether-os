"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Package, Activity } from 'lucide-react';
import { getClientOrderHistory } from "@/lib/actions/client.actions";

interface Order {
  id: number | string;
  order_date: string;
  total_price: number;
  status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const userOrders = await getClientOrderHistory(1);
        setOrders(userOrders as Order[]);
      } catch (error) {
        console.error("[AETHER_CRITICAL]: Sync_Failed", error);
      } finally {
        setIsSyncing(false);
      }
    };
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const query = searchTerm.toLowerCase().trim();
    return (
        order.id.toString().toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query)
    );
  });

  return (
      <main className="relative min-h-screen bg-[#050505] text-white font-mono overflow-hidden p-8">

        {/* --- CLEAN & COLORFUL BACKGROUND LAYER --- */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="relative w-full h-full transform scale-125 -translate-y-20">
            {/* scale & translate schieben das Logo oben rechts aus dem Bild */}
            <Image
                src="/images/your-online-orders.jpg"
                alt="AETHER_SYSTEM_VISUAL"
                fill
                priority
                className="object-cover opacity-50 brightness-90 contrast-110"
                // grayscale entfernt -> Jetzt in Farbe!
            />
          </div>
          {/* Sanfter Verlauf, um den Übergang zum Schwarz unten zu sichern */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-12">

          {/* --- MINIMALIST TERMINAL HEADER --- */}
          <div className="flex flex-col items-center text-center pt-12 space-y-4">
            <h1 className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-300 to-zinc-500 drop-shadow-2xl">
              Order Management
            </h1>
            <div className="flex items-center gap-3 bg-black/40 px-4 py-1 backdrop-blur-md rounded-full border border-white/5">
              <Activity size={12} className="text-orange-500 animate-pulse" />
              <p className="text-[10px] tracking-[0.8em] text-zinc-400 uppercase font-black">
                AETHER // SECURE_STREAM
              </p>
            </div>
          </div>

          {/* --- SEARCH BAR (Neon Orange Highlight) --- */}
          <div className="flex justify-center border-y border-white/10 py-10 backdrop-blur-xl bg-black/20">
            <div className="relative w-full md:w-[600px] group">
              <input
                  type="text"
                  placeholder="> SCAN_ORDER_ID..."
                  className="w-full bg-black/60 border border-orange-500/30 p-5 pl-14 rounded-none text-[10px] tracking-[0.3em] font-black outline-none focus:border-orange-500 focus:shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all placeholder:text-zinc-800 text-orange-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500/50 group-focus-within:text-orange-500 transition-colors" />
            </div>
          </div>

          {/* ORDER GRID */}
          {filteredOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
                {filteredOrders.map((order) => (
                    <div key={order.id} className="group relative bg-gradient-to-br from-white/10 to-transparent p-[1px] rounded-none hover:from-orange-500/50 transition-all duration-500 shadow-2xl">
                      <div className="relative z-10 bg-[#080808]/90 backdrop-blur-md p-8 space-y-8">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.3em]">Module_Reference</span>
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter group-hover:text-orange-500 transition-colors">#{order.id}</h2>
                          </div>
                          <div className={`text-[8px] font-black px-4 py-1.5 border tracking-widest uppercase ${
                              order.status === 'completed'
                                  ? 'border-emerald-500/40 text-emerald-500 bg-emerald-500/5'
                                  : 'border-orange-500/40 text-orange-500 bg-orange-500/5 animate-pulse'
                          }`}>
                            {order.status}
                          </div>
                        </div>

                        <div className="space-y-4 border-t border-white/5 pt-6 font-bold uppercase tracking-widest">
                          <div className="flex justify-between text-[10px] text-zinc-500">
                            <span>Logged</span>
                            <span className="text-white font-mono">{new Date(order.order_date).toLocaleDateString('de-DE')}</span>
                          </div>
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] text-zinc-500 mb-1">Value</span>
                            <span className="text-2xl text-orange-500 font-black italic">
                                {Number(order.total_price).toFixed(2)} €
                            </span>
                          </div>
                        </div>

                        <Link href={`/client/orders/${order.id}`} className="block w-full border border-white/10 p-4 text-center text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/5 transition-all">
                          Details
                        </Link>
                      </div>
                    </div>
                ))}
              </div>
          ) : (
              <div className="relative z-10 p-32 flex flex-col items-center justify-center border border-white/5 bg-black/20 backdrop-blur-md">
                <Package className="w-16 h-16 text-zinc-800 mb-6" />
                <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-600 italic">Empty_Archive</p>
              </div>
          )}

        </div>
      </main>
  );
}