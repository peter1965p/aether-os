"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Search, Loader2, ArrowLeft, Eye } from 'lucide-react'; // XCircle entfernt
import { getClientOrderHistory } from "@/lib/actions/client.actions";

// Typ-Definition für sauberes TypeScript
interface Order {
  id: number | string;
  order_date: string;
  total_price: number;
  status: string;
}

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fehlerbehebung: Promise korrekt handhaben
    const loadOrders = async () => {
      try {
        const testCustomerId = 1;
        const userOrders = await getClientOrderHistory(testCustomerId);
        setOrders(userOrders as Order[]);
      } catch (error) {
        console.error("AETHER_SYNC_ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders(); // Aufruf ohne Warnung
  }, []);

  const filteredOrders = orders.filter(order =>
      order.id.toString().includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-mono">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <div className="text-[10px] uppercase tracking-[0.5em] text-blue-500 animate-pulse">Aether // Sync_Ongoing</div>
        </div>
    );
  }

  return (
      <main className="p-8 space-y-8 bg-black min-h-screen text-white">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/client" className="text-zinc-500 hover:text-blue-500 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            System // <span className="text-blue-500">Orders</span>
          </h1>
        </div>

        <div className="relative mb-8">
          <input
              type="text"
              placeholder="Filter Terminal..."
              className="w-full p-4 pl-12 bg-[#050505] border border-white/5 rounded-xl focus:border-blue-500 outline-none transition-all font-mono text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
        </div>

        {filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-[#050505] border border-white/5 p-6 rounded-2xl flex flex-col justify-between group hover:border-blue-500/30 transition-all duration-500 relative">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-black italic tracking-tight uppercase">Order #{order.id}</h2>
                        {/* FIX: Hier waren die doppelten CSS-Klassen aus deinem Screenshot */}
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                            order.status === 'completed'
                                ? 'border-green-500/20 bg-green-500/10 text-green-400'
                                : order.status === 'pending'
                                    ? 'border-orange-500/20 bg-orange-500/10 text-orange-400'
                                    : 'border-blue-500/20 bg-blue-500/10 text-zinc-400'
                        }`}>
                    {order.status}
                  </span>
                      </div>

                      <div className="space-y-1 font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
                        <p>Timestamp: {new Date(order.order_date).toLocaleDateString('de-DE')}</p>
                        <p>Total_Sum: <span className="text-white font-bold">{Number(order.total_price).toFixed(2)} €</span></p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-white/5">
                      <Link
                          href={`/client/orders/${order.id}`}
                          className="flex items-center gap-2 text-blue-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-tighter"
                      >
                        <Eye size={12} />
                        Details_Data
                      </Link>
                    </div>
                  </div>
              ))}
            </div>
        ) : (
            <div className="p-12 border border-white/5 border-dashed rounded-3xl text-center">
              <Package className="w-10 h-10 mx-auto mb-4 text-zinc-800" />
              <p className="font-mono text-[10px] uppercase text-zinc-500 tracking-[0.2em]">No_Records_Found</p>
            </div>
        )}
      </main>
  );
}