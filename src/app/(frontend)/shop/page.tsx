import db from "@/lib/db";
import { Package } from "lucide-react";
import AddToCartButton from "@/modules/shop/components/AddToCartButton";
import ShopClient from "@/modules/shop/components/ShopClient";

export default async function ShopPage() {
  /* --- 1. KERNEL FETCH: Daten vom Server --- */
  const { data: products } = await db
      .from("products")
      .select(`*, categories (name)`)
      .order("id", { ascending: false });

  const { data: cartItems } = await db
      .from("cart_items")
      .select(`id, product_id, quantity, products(name, price)`)
      .eq("session_id", "SESSION_01"); // Später deine Auth-ID

  // Mapping für den Drawer (Wichtig für die Namens-Konvention)
  const formattedCart = cartItems?.map((item: { id: any; product_id: any; products: any; quantity: any; }) => ({
    id: item.id,
    produkt_id: item.product_id,
    name: (item.products as any)?.name || "Unbekanntes Asset",
    preis: (item.products as any)?.price || 0,
    menge: item.quantity
  })) || [];

  const formatPrice = (price: any) => {
    const num = typeof price === "string" ? parseFloat(price.replace(/[^\d.-]/g, "")) : price;
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(num || 0);
  };

  /* --- 2. RENDER: Alles innerhalb des ShopClient Wrappers --- */
  return (
      <ShopClient cartItems={formattedCart}>
        <div className="min-h-screen bg-[#05070a] pt-32 pb-24 px-6 lg:px-24 font-mono">

          {/* HEADER SECTION */}
          <div className="max-w-7xl mx-auto mb-16 flex justify-between items-end border-b border-white/5 pb-12">
            <div>
              <div className="flex items-center gap-3 mb-4 text-blue-500 text-[10px] uppercase tracking-[0.3em]">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                SYSTEM: REGISTRY // STATUS: LIVE
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
                CORE <span className="text-orange-600">Modules</span>
              </h1>
            </div>
            <div className="text-right text-[10px] text-slate-600 uppercase italic">
              v4.1 // Secure_Node_Access
            </div>
          </div>

          {/* PRODUCT GRID */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products?.map((product: any) => (
                <div key={product.id} className="group bg-zinc-900/20 border border-white/5 p-10 rounded-xl hover:border-blue-500/30 transition-all flex flex-col h-full hover:shadow-[0_0_40px_rgba(59,130,246,0.03)]">

                  {/* Meta Info */}
                  <div className="flex justify-between items-start mb-8 text-[9px]">
                    <div className="text-blue-500/70 uppercase tracking-widest font-black">
                      @aether/mod-{product.id.toString().padStart(3, '0')}
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 px-2 py-1 text-blue-400 font-bold uppercase rounded text-[8px]">
                      {product.categories?.name || "Standard"}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black uppercase italic mb-4 text-white group-hover:text-blue-500 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed mb-12 flex-grow italic font-medium">
                    {product.description || "Systemmodul bereit für Integration."}
                  </p>

                  {/* ACTION AREA */}
                  <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="block text-[8px] text-slate-600 uppercase tracking-[0.2em] mb-1 font-bold">Uplink Cost</span>
                      <span className="text-2xl font-black text-white">{formatPrice(product.price)}</span>
                    </div>

                    {/* Dein funktionsfähiger Button */}
                    <AddToCartButton productId={product.id} />
                  </div>
                </div>
            ))}
          </div>
        </div>
      </ShopClient>
  );
}