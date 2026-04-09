import db from "@/lib/db";
import { Package, Box, ShoppingCart } from "lucide-react";
import { addToCartAction } from "@/modules/shop/actions";

export default async function ShopPage() {
  /* --- AETHER OS: CLOUD FETCH (SUPABASE UPGRADE) --- */
  
  // Wir ersetzen das alte SQL .prepare durch den Supabase-Join
  const { data: products, error } = await db
    .from("products") // Achte auf Englisch: 'products' statt 'produkte'
    .select(`
      *,
      categories (
        name
      )
    `)
    .order("id", { ascending: false });

  if (error) {
    console.error("AETHER_SHOP_FETCH_ERROR:", error.message);
  }

  // Hilfsfunktion für die Währung (Enterprise Standard)
  const formatPrice = (price: any) => {
    const num = typeof price === "string" ? parseFloat(price.replace(/[^\d.-]/g, "")) : price;
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(num || 0);
  };

  return (
    <div className="min-h-screen bg-[#05070a] pt-32 pb-24 px-6 lg:px-24">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-16 flex justify-between items-end border-b border-white/5 pb-12">
        <div>
          <div className="flex items-center gap-3 mb-4 text-blue-500 font-mono text-[10px] uppercase tracking-[0.3em]">
            <Package size={14} /> SYSTEM: REGISTRY // STATUS: LIVE
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
            CORE <span className="text-orange-600 uppercase">Modules</span>
          </h1>
        </div>
        <div className="text-right font-mono text-[10px] text-slate-600 uppercase italic">
          v4.1 // Verified Auth
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products?.map((product: any) => (
          <div key={product.id} className="group bg-zinc-900/30 border border-white/5 p-10 rounded-sm hover:border-blue-500/30 transition-all flex flex-col h-full">
            <div className="flex justify-between items-start mb-8 font-mono text-[10px]">
              <div className="text-blue-500 uppercase tracking-widest">
                @aether/{product.name.toLowerCase().replace(/\s+/g, "-")}
              </div>
              <div className="bg-white/5 px-2 py-1 text-slate-400">
                {product.categories?.name || "Standard"}
              </div>
            </div>

            <h3 className="text-2xl font-black uppercase italic mb-4 group-hover:text-blue-500 transition-colors">
              {product.name}
            </h3>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-12 flex-grow italic">
              {product.description || "Systemmodul bereit für Integration."}
            </p>

            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="block text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em] mb-1">Cost Unit</span>
                <span className="text-2xl font-black text-white">{formatPrice(product.price)}</span>
              </div>
              
              {/* Checkout-Button für später (schon mal vorbereitet) */}
              <button className="bg-slate-800 text-orange-600 p-4 rounded-sm hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5">
                <ShoppingCart size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}