"use client";

import { useState, useEffect } from "react";
import { executeSql } from "@/modules/db/actions";
import { Banknote, CreditCard, Trash2, Zap, LayoutGrid } from "lucide-react";
import { InvoiceModal } from "@/components/admin/InvoiceModal";

export default function AetherPOS() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [lastOrderData, setLastOrderData] = useState<any>(null);

  useEffect(() => {
    // Initialer Kernel-Uplink: Produkte & Kategorien laden [cite: 2026-03-28]
    const loadInitialData = async () => {
      const prodRes = await executeSql("SELECT * FROM products ORDER BY name ASC");
      const catRes = await executeSql("SELECT * FROM categories ORDER BY name ASC");
      
      if (prodRes.success) setProducts(prodRes.data);
      if (catRes.success) setCategories(catRes.data);
    };
    loadInitialData();
  }, []);

  // Filter-Logik für die Anzeige
  const filteredProducts = activeCat 
    ? products.filter(p => p.category_id === activeCat)
    : products;

  const addToTerminalCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // Korrektur: Nutzt jetzt 'price' statt 'preis' [cite: 2026-03-28]
  const total = cart.reduce((acc, item) => acc + (Number(item.price) || 0) * item.qty, 0);

  const handleBarverkauf = async () => {
    if (cart.length === 0 || isExecuting) return;
    setIsExecuting(true);

    const currentCart = [...cart];
    const currentTotal = total;

    try {
      // Nutzt jetzt 'order_date' und 'total_price' [cite: 2026-03-28]
      const orderQuery = `
        INSERT INTO orders (order_date, status, total_price)
        VALUES ('${new Date().toISOString()}', 'COMPLETED', ${currentTotal})
        RETURNING id;
      `;

      const res = await executeSql(orderQuery);

      if (res?.success && res.data?.[0]) {
        const orderId = res.data[0].id;
        
        setLastOrderData({
          order: { id: orderId, datum: new Date().toISOString(), gesamtpreis: currentTotal },
          items: currentCart.map(item => ({
            name: item.name,
            menge: item.qty,
            einzelpreis: item.price,
            ust_satz: 19,
          })),
        });

        setIsInvoiceOpen(true);
        setCart([]);
      }
    } catch (err) {
      console.error("CRITICAL FAULT:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white p-6 gap-6 overflow-hidden selection:bg-orange-500/30">
      <div className="flex-1 flex flex-col gap-6">
        <header className="flex justify-between items-end">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-500 italic mb-2">
              Aether // Retail Engine
            </h2>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
              POS <span className="opacity-30 italic">TERMINAL</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/5 border border-blue-500/10 rounded-full">
            <Zap size={12} className={`text-blue-500 ${isExecuting ? "animate-ping" : "animate-pulse"}`} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-500">
              {isExecuting ? "Processing..." : "Kernel Online"}
            </span>
          </div>
        </header>

        {/* --- KATEGORIEN FILTER BAR --- */}
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          <button
            onClick={() => setActiveCat(null)}
            className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 whitespace-nowrap ${
              activeCat === null ? "bg-orange-600 border-orange-600 text-black" : "bg-white/5 border-white/5 text-gray-400"
            }`}
          >
            <LayoutGrid size={14} /> All Units
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                activeCat === cat.id ? "bg-orange-600 border-orange-600 text-black" : "bg-white/5 border-white/5 text-gray-400"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar pb-10">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => addToTerminalCart(product)}
              className="relative group bg-[#080808] border border-white/5 rounded-[2rem] p-6 cursor-pointer hover:border-orange-500/50 transition-all duration-300 active:scale-95 shadow-2xl"
            >
              <div className="absolute top-0 right-0 bg-white/5 group-hover:bg-orange-500 px-4 py-2 rounded-bl-xl transition-colors">
                <span className="text-[10px] font-black group-hover:text-black">
                  {Number(product.price).toFixed(2)}€
                </span>
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter group-hover:text-orange-500 truncate pr-10">
                {product.name}
              </h3>
              <div className="mt-2 text-[8px] font-bold text-gray-600 uppercase">Stock: {product.stock}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RECHTE SEITE: WARENKORB BLEIBT FAST GLEICH, ABER FIX PREIS MAPPING */}
      <div className="w-[380px] bg-[#050505] rounded-[2.5rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        <div className="p-8 flex-1 flex flex-col">
          <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600 italic mb-6">Current Transaction</h3>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                <div>
                  <div className="text-[10px] font-black uppercase">{item.name}</div>
                  <div className="text-[9px] text-orange-500 font-mono">
                    {item.qty} UNIT(S) @ {Number(item.price).toFixed(2)}€
                  </div>
                </div>
                <button onClick={() => setCart(cart.filter((i) => i.id !== item.id))} className="text-gray-600 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-dashed border-white/10">
            <div className="flex justify-between items-end mb-6">
              <span className="text-[9px] font-black uppercase text-gray-600 tracking-[0.2em]">Total Amount</span>
              <span className="text-4xl font-black italic text-white tracking-tighter leading-none">{total.toFixed(2)}€</span>
            </div>
            <button
              onClick={handleBarverkauf}
              disabled={isExecuting || cart.length === 0}
              className="w-full flex flex-col items-center justify-center gap-2 py-6 bg-orange-600 text-black rounded-2xl hover:bg-green-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
            >
              <Banknote size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Complete Transaction</span>
            </button>
          </div>
        </div>
      </div>

      {isInvoiceOpen && lastOrderData && (
        <InvoiceModal data={lastOrderData} onClose={() => setIsInvoiceOpen(false)} />
      )}
    </div>
  );
}