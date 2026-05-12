/**
 * AETHER OS // UNIFIED NAVIGATION UNIT
 * Trigger für den Asset_Buffer (Warenkorb)
 */

'use client'

import { ShoppingBag, Zap } from "lucide-react";
import { useCartStore } from "@/modules/shop/useCartStore";

interface CartNavTriggerProps {
    initialCount: number;
}

export default function CartNavTrigger({ initialCount }: CartNavTriggerProps) {
    // Zugriff auf den Store: Wir holen nur, was existiert.
    // Falls 'items' noch nicht im Store ist, nutzen wir einen Fallback auf [].
    const openCart = useCartStore((state) => state.openCart);
    const cartItems = useCartStore((state) => (state as any).items || []);

    /**
     * LOGIK-CHECK:
     * Wir priorisieren die Länge der Items aus dem Store (Client-Zustand).
     * Wenn der Store leer ist (z.B. nach Page-Refresh), nutzen wir den initialCount vom Server.
     */
    const currentCount = cartItems.length > 0 ? cartItems.length : initialCount;

    return (
        <button
            onClick={openCart}
            type="button"
            className="flex items-center gap-4 px-5 py-2.5 bg-zinc-900/40 border border-white/5 rounded-xl hover:border-orange-500/40 hover:bg-orange-500/5 transition-all duration-500 group relative overflow-hidden"
        >
            {/* Hintergrund-Effekt */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative">
                <ShoppingBag
                    size={20}
                    className="text-zinc-500 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-500"
                />

                {/* Counter Badge */}
                {currentCount > 0 && (
                    <span className="absolute -top-3 -right-3 min-w-[18px] h-[18px] px-1 bg-orange-600 text-white text-[9px] font-black flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(234,88,12,0.6)] border border-orange-400 animate-in zoom-in duration-300 italic">
                        {currentCount}
                    </span>
                )}
            </div>

            <div className="hidden lg:flex flex-col text-left leading-tight relative z-10">
                <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[8px] text-zinc-600 group-hover:text-orange-500 font-black uppercase tracking-[0.2em] transition-colors">
                        Asset_Buffer
                    </span>
                    {currentCount > 0 && (
                        <Zap size={8} className="text-orange-500 animate-pulse" />
                    )}
                </div>
                <span className="text-[11px] text-white font-black italic uppercase tracking-tighter group-hover:translate-x-1 transition-transform">
                    {currentCount > 0 ? 'Ready_To_Uplink' : 'Buffer_Empty'}
                </span>
            </div>

            {/* Untere Scanner-Linie */}
            <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-orange-600 group-hover:w-full transition-all duration-700" />
        </button>
    );
}