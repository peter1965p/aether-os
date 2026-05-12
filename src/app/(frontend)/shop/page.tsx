/**
 * AETHER OS // CORE MODULE REGISTRY (SHOP)
 * Pfad: /src/app/(frontend)/shop/page.tsx
 */

import db from "@/lib/db";
import { Package, Cpu, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import AddToCartButton from "@/modules/shop/components/AddToCartButton";
import ShopClient from "@/modules/shop/components/ShopClient";
import Image from "next/image";

export default async function ShopPage() {
  /* --- 1. KERNEL FETCH (PRODUCTS ONLY) --- */
  // Wir holen nur noch die Produkte. Der Warenkorb-Sync läuft autonom im Client.
  const { data: products } = await db
      .from("products")
      .select(`*, categories (name)`)
      .order("id", { ascending: false });

  const formatPrice = (price: any) => {
    const num = typeof price === "string" ? parseFloat(price.replace(/[^\d.-]/g, "")) : price;
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(num || 0);
  };

  return (
      /* 
         KORREKTUR: 'cartItems' wurde entfernt. 
         Der ShopClient benötigt keine manuellen Daten-Injektionen mehr.
      */
      <ShopClient>
        <div className="min-h-screen bg-[#020406] pt-40 pb-32 px-6 lg:px-24 font-mono relative overflow-hidden">

          {/* --- COSMIC BACKGROUND LAYER --- */}
          <div className="absolute inset-0 z-0">
            <Image
                src="/images/aether-header.png"
                alt="Aether Universe"
                fill
                className="object-cover opacity-20 scale-105 blur-[2px]"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020406] via-transparent to-[#020406]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_50%)]" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">

            {/* --- HEADER: REGISTRY STATUS --- */}
            <div className="mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-16">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                    <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">
                        Registry_Live // Node_Secure
                    </span>
                  </div>
                </div>
                <h1 className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-none">
                  CORE <span className="bg-gradient-to-r from-orange-400 via-orange-600 to-orange-900 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(234,88,12,0.3)]">MODULES</span>
                </h1>
              </div>
              <div className="flex flex-col items-end gap-2 text-[10px] text-zinc-600 font-black uppercase tracking-[0.5em] italic">
                <span>Unified_License_V4.1</span>
                <span className="text-blue-900">Encrypted_Transaction_Active</span>
              </div>
            </div>

            {/* --- PRODUCT GRID: ASSET CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {products?.map((product: any) => (
                  <div key={product.id} className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-600/20 to-orange-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-[2.5rem]"></div>

                    <div className="relative bg-black/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] flex flex-col h-full hover:border-blue-500/40 transition-all duration-500 shadow-2xl">

                      {/* Top Bar: Serial & Category */}
                      <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-3">
                          <Cpu size={14} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                          <span className="text-zinc-600 font-black text-[9px] uppercase tracking-widest">
                                MOD_{product.id.toString().padStart(4, '0')}
                            </span>
                        </div>
                        <div className="bg-white/5 border border-white/10 px-3 py-1 text-zinc-400 group-hover:text-blue-400 group-hover:border-blue-500/30 font-black uppercase rounded-lg text-[8px] tracking-widest transition-all">
                          {product.categories?.name || "Global_Asset"}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-4 mb-12 flex-grow">
                        <h3 className="text-3xl font-black uppercase italic leading-none text-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-500 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                          {product.name}
                        </h3>
                        <p className="text-zinc-500 text-xs leading-relaxed italic font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                          {product.description || "Infrastruktur-Kern bereit für sofortige System-Integration und Skalierung."}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="border border-white/5 bg-white/[0.02] p-3 rounded-xl flex items-center gap-3">
                          <Zap size={12} className="text-orange-600" />
                          <span className="text-[8px] font-black text-zinc-600 uppercase">High_Priority</span>
                        </div>
                        <div className="border border-white/5 bg-white/[0.02] p-3 rounded-xl flex items-center gap-3">
                          <ShieldCheck size={12} className="text-blue-600" />
                          <span className="text-[8px] font-black text-zinc-600 uppercase">Verified_Node</span>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <span className="block text-[9px] text-zinc-700 uppercase tracking-[0.3em] mb-1 font-black italic">Integration_Fee</span>
                          <span className="text-3xl font-black text-white tracking-tighter italic">
                            {formatPrice(product.price)}
                          </span>
                        </div>

                        <div className="scale-110 group-hover:scale-125 transition-transform duration-500">
                          <AddToCartButton productId={product.id} />
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-10 left-10 text-[80px] font-black uppercase tracking-tighter text-white/[0.02] select-none pointer-events-none">
            AETHER_MARKETPLACE
          </div>
        </div>
      </ShopClient>
  );
}