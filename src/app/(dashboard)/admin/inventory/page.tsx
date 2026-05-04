"use client";

import { useState, useEffect } from "react";
import {
  getInventoryData,
  getPendingOrders,
  completeOrder,
  getCategories,
} from "@/modules/inventory/actions";
import {
  Package,
  Plus,
  Truck,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function StockControlPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadAllData = async () => {
    const [p, o, c] = await Promise.all([
      getInventoryData(),
      getPendingOrders(),
      getCategories(),
    ]);
    setProducts(p);
    setPendingOrders(o);
    setCategories(c);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* HEADER BEREICH */}
      <header className="flex justify-between items-end">
        <div>
          <p className="text-[#444444] text-[10px] font-black tracking-[0.4em] uppercase mb-2">
            System // Logistics // v2.0
          </p>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none text-white">
            STOCK <span className="text-orange-500">CONTROL</span>
          </h1>
        </div>

        <Link href="/admin/inventory/items/new">
          <button className="bg-orange-500 hover:bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 transition-all transform hover:scale-105">
            <Plus size={20} /> Add Article
          </button>
        </Link>
      </header>

      {/* SEARCH & FILTER BAR */}
      <div className="flex gap-4">
        <div className="flex-1 bg-[#080808] border border-white/5 rounded-2xl flex items-center px-6 py-4 focus-within:border-orange-500/50 transition-all">
          <Search size={18} className="text-gray-500 mr-4" />
          <input
            placeholder="Search Inventory..."
            className="bg-transparent border-none outline-none text-white w-full uppercase font-bold text-xs tracking-widest"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-[#080808] border border-white/5 px-6 rounded-2xl text-gray-500 hover:text-white transition-colors">
          <Filter size={18} />
        </button>
      </div>

      {/* PRODUKT LISTE */}
      <section className="space-y-4">
        {products
          .filter((p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map((item) => (
            <div
              key={item.id}
              className="group bg-[#050505] border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between hover:border-orange-500/20 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-black transition-all">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">
                    {item.name}
                  </h3>
                  <div className="flex gap-4 mt-1">
                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                      ID: {item.id} // Price: {item.preis}€
                    </p>
                    <p className="text-[9px] text-orange-500/50 font-bold uppercase tracking-widest">
                      {categories.find((c) => c.id === item.category_id)
                        ?.name || "Uncategorized"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-right">
                  <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] mb-1">
                    Current_Stock
                  </p>
                  <p
                    className={`text-2xl font-black ${item.bestand <= item.min_bestand ? "text-red-500" : "text-white"}`}
                  >
                    {item.bestand}{" "}
                    <span className="text-[10px] text-gray-700 uppercase">
                      Units
                    </span>
                  </p>
                </div>
                <button className="bg-orange-500/10 text-orange-500 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-black transition-all">
                  Reorder
                </button>
              </div>
            </div>
          ))}
      </section>

      {/* INCOMING SHIPMENTS */}
      <section className="pt-10 space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 flex items-center gap-3">
          <Truck size={14} /> Incoming Shipments
        </h3>

        {pendingOrders.length > 0 ? (
          <div className="grid gap-4">
            {pendingOrders.map((order) => (
              <div
                key={order.id}
                className="bg-orange-500/5 border border-orange-500/10 p-6 rounded-3xl flex justify-between items-center"
              >
                <div>
                  <p className="text-[9px] font-black text-orange-500/50 uppercase mb-2">
                    Order #{order.id} // {order.datum}
                  </p>
                  <h4 className="text-lg font-bold text-white uppercase">
                    {order.produkt_name}
                  </h4>
                </div>
                <div className="flex items-center gap-8">
                  <p className="text-xl font-black text-white">
                    {order.menge}{" "}
                    <span className="text-[10px] text-gray-600 uppercase">
                      Units
                    </span>
                  </p>
                  <button
                    onClick={async () => {
                      await completeOrder(order.id);
                      loadAllData();
                    }}
                    className="bg-yellow-500 hover:bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all"
                  >
                    <Package size={14} /> Wareneingang buchen
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 border border-white/5 rounded-[3rem] text-center">
            <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">
              No pending orders in queue.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
