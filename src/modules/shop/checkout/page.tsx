/**
 * AETHER OS // UPLINK GATEWAY
 * Pfad: src/modules/shop/checkout/page.tsx
 */

import { getCartItemsAction } from "../actions";
import CheckoutForm from "./CheckForm";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

// 1. Sauberes Interface definieren - Schluss mit dem Typ-Chaos!
interface CartItem {
    id: number | string;
    produkt_id: number;
    name: string;
    preis: number;
    menge: number;
}

export default async function CheckoutPage() {
    // Daten holen und als CartItem[] casten
    const items = await getCartItemsAction() as CartItem[];

    // 2. Gesamtsumme berechnen - Jetzt weiß TS, dass preis und menge Zahlen sind
    const total = items.reduce((acc, item) => acc + (item.preis * item.menge), 0);

    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
                    <div>
                        <Link
                            href="/shop"
                            className="text-zinc-500 hover:text-orange-500 flex items-center gap-2 text-[10px] uppercase font-black tracking-[0.2em] mb-4 transition-colors group"
                        >
                            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform"/>
                            Return_to_Store
                        </Link>
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter">
                            Finalize_<span className="text-orange-600">Uplink</span>
                        </h1>
                        <p className="text-zinc-500 font-mono text-[10px] mt-2 uppercase tracking-widest">
                            Node: {process.env.NODE_ENV === 'development' ? 'Localhost_CachyOS' : 'Production_Core'} // Ready to sync
                        </p>
                    </div>

                    <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                        <div className="size-12 bg-orange-600/10 border border-orange-500/20 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="text-orange-500" size={24}/>
                        </div>
                        <div>
                            <div className="text-[10px] text-zinc-500 uppercase font-black">Buffer_Value</div>
                            <div className="text-2xl font-black italic">{total.toFixed(2)} €</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Linke Seite: Identity Protocol */}
                    <div className="lg:col-span-7 space-y-8">
                        <section className="bg-zinc-900/20 border border-white/5 p-8 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-600"/>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-8">
                                01 // Identity_Protocol
                            </h3>
                            <CheckoutForm />
                        </section>
                    </div>

                    {/* Rechte Seite: Asset Review */}
                    <div className="lg:col-span-5">
                        <section className="bg-zinc-900/10 border border-white/5 p-8 rounded-3xl sticky top-32">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">
                                02 // Asset_Review
                            </h3>

                            <div className="space-y-4 mb-8">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center group">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black italic uppercase group-hover:text-orange-500 transition-colors">
                                                {item.name}
                                            </span>
                                            <span className="text-[10px] text-zinc-600 font-mono">
                                                QTY: {item.menge} x {item.preis.toFixed(2)} €
                                            </span>
                                        </div>
                                        <span className="text-sm font-mono text-zinc-400">
                                            {(item.preis * item.menge).toFixed(2)} €
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/5 pt-6 space-y-2">
                                <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-black">
                                    <span>Subtotal</span>
                                    <span>{total.toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-black">
                                    <span>Network_Fee</span>
                                    <span className="text-emerald-500">0.00 €</span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-xs font-black uppercase text-white">Total_Commit</span>
                                    <span className="text-3xl font-black italic text-orange-500">
                                        {total.toFixed(2)} €
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </main>
    );
}