/**
 * AETHER OS // CLIENT ORDER HISTORY UI
 * Visualisiert die persönlichen Bestellungen eines Kunden.
 */

import React from 'react';
import { Package, Clock, CheckCircle, ArrowUpRight } from 'lucide-react';

interface OrderHistoryProps {
    orders: any[];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
    // Helfer für Status-Farben
    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'pending': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        }
    };

    if (orders.length === 0) {
        return (
            <div className="p-8 border border-white/5 bg-white/2 rounded-3xl text-center">
                <Package className="mx-auto text-zinc-600 mb-4" size={32} />
                <p className="text-zinc-500 text-sm font-medium italic">Keine Bestellungen im System gefunden.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div
                    key={order.id}
                    className="group relative p-6 bg-[#0a0a0a] border border-white/5 rounded-3xl hover:border-blue-500/30 transition-all duration-500 overflow-hidden"
                >
                    {/* Hintergrund-Effekt */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] -z-10 group-hover:bg-blue-500/10 transition-all" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">ID: {order.id}</span>
                                <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getStatusStyle(order.status)}`}>
                                    {order.status}
                                </div>
                            </div>

                            <h3 className="text-white font-bold text-lg tracking-tight uppercase italic">
                                {order.order_items?.[0]?.products?.name || 'AETHER OS Order'}
                                {order.order_items?.length > 1 && <span className="text-blue-500 ml-2">+{order.order_items.length - 1} weitere</span>}
                            </h3>

                            <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={12} />
                                    {new Date(order.order_date).toLocaleDateString('de-DE')}
                                </div>
                            </div>
                        </div>

                        <div className="text-right flex flex-col items-end gap-2">
              <span className="text-2xl font-black text-white tracking-tighter">
                {Number(order.total_price).toFixed(2)}€
              </span>
                            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-white transition-colors group/btn">
                                Details ansehen <ArrowUpRight size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}