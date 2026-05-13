/**
 * AETHER OS // ASSET_SUMMARY_COMPONENT
 * Pfad: src/modules/shop/checkout/Summary.tsx
 */

import { ShoppingBag, Box, Activity } from "lucide-react";

interface CartItem {
    id: number | string;
    name: string;
    preis: number;
    menge: number;
}

interface SummaryProps {
    items: CartItem[];
}

export default function Summary({ items }: SummaryProps) {
    // Finanz-Kalkulation im Kernel
    const subtotal = items.reduce((acc, item) => acc + (item.preis * item.menge), 0);
    const networkFee = 0.00; // Platzhalter für spätere Gebühren
    const total = subtotal + networkFee;

    return (
        <section className="bg-zinc-900/10 border border-white/5 p-8 rounded-3xl sticky top-32 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">
                    02 // Asset_Review
                </h3>
                <Activity size={14} className="text-orange-600 animate-pulse" />
            </div>

            {/* Asset-Liste */}
            <div className="space-y-6 mb-10">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start group">
                            <div className="flex gap-3">
                                <div className="mt-1 size-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center group-hover:border-orange-500/30 transition-colors">
                                    <Box size={14} className="text-zinc-500 group-hover:text-orange-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-black italic uppercase tracking-tight group-hover:text-orange-500 transition-colors">
                                        {item.name}
                                    </span>
                                    <span className="text-[10px] text-zinc-600 font-mono">
                                        UNIT_PRICE: {item.preis.toFixed(2)} € // QTY: {item.menge}
                                    </span>
                                </div>
                            </div>
                            <span className="text-sm font-mono text-zinc-400 group-hover:text-white transition-colors">
                                {(item.preis * item.menge).toFixed(2)} €
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 border border-dashed border-white/5 rounded-2xl">
                        <p className="text-[10px] font-mono text-zinc-700 uppercase">Buffer_Empty</p>
                    </div>
                )}
            </div>

            {/* Finanz-Sektion */}
            <div className="border-t border-white/5 pt-8 space-y-3">
                <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                    <span>Subtotal_Value</span>
                    <span className="text-white">{subtotal.toFixed(2)} €</span>
                </div>

                <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                    <span>Network_Processing_Fee</span>
                    <span className="text-emerald-500">FREE_ACCESS</span>
                </div>

                <div className="pt-6 mt-4 border-t border-white/5 flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase text-orange-600 tracking-[0.4em] mb-1">
                            Total_Commitment
                        </span>
                        <span className="text-xs font-black uppercase text-zinc-400">
                            Authorized_Sum
                        </span>
                    </div>
                    <span className="text-4xl font-black italic text-orange-500 drop-shadow-[0_0_15px_rgba(234,88,12,0.3)]">
                        {total.toFixed(2)} €
                    </span>
                </div>
            </div>

            {/* System Tag */}
            <div className="mt-8 flex items-center gap-2 opacity-20 group hover:opacity-100 transition-opacity">
                <div className="size-1.5 rounded-full bg-emerald-500" />
                <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500">
                    AETHER_OS // KERNEL_VER_7.0.5
                </span>
            </div>
        </section>
    );
}