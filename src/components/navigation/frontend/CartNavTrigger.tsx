'use client'

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/modules/shop/useCartStore";

export default function CartNavTrigger({ initialCount }: { initialCount: number }) {
    // 1. Wir holen uns die Funktion 'openCart' direkt aus dem Store
    const openCart = useCartStore((state) => state.openCart);

    return (
        <button
            // 2. Jetzt rufen wir die existierende Funktion auf
            onClick={openCart}
            className="flex items-center gap-3 px-4 py-2 bg-blue-600/5 border border-blue-500/20 rounded-lg hover:border-blue-500/50 transition-all group relative"
        >
            <div className="relative">
                <ShoppingBag size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
                {initialCount > 0 && (
                    <span className="absolute -top-3 -right-3 bg-orange-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in">
                        {initialCount}
                    </span>
                )}
            </div>
            <div className="hidden lg:flex flex-col text-left leading-none">
                <span className="text-[8px] text-blue-400 font-bold uppercase tracking-widest mb-1">Assets</span>
                <span className="text-[10px] text-white font-black italic uppercase">Buffer</span>
            </div>
        </button>
    );
}