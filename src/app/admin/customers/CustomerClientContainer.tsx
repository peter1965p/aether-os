"use client";

import { useState } from "react";
import { registerCustomer } from "@/modules/pos/actions";
import { useRouter } from "next/navigation";
import CustomerProfileOverlay from "./CustomerProfileOverlay";

export default function CustomerClientContainer({
  initialCustomers,
}: {
  initialCustomers: any[];
}) {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const filteredCustomers = initialCustomers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.kundenkarte_id &&
        c.kundenkarte_id.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="space-y-16">
      {/* SEARCH BAR - Synchronisiert mit dem Identity Provider Look */}
      <div className="max-w-3xl relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
        <input
          type="text"
          placeholder="SEARCH SYSTEM (NAME, EMAIL OR ID)..."
          className="relative w-full bg-[#070707] border border-white/5 rounded-2xl px-10 py-6 text-[11px] font-black tracking-[0.2em] text-orange-500 outline-none focus:border-orange-500/50 transition-all uppercase placeholder:text-white/10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-4">
          <span className="text-[8px] font-black text-white/20 tracking-widest uppercase">
            Filter_Active
          </span>
          <div className="px-3 py-1 bg-white/5 rounded border border-white/10 text-[8px] font-black text-gray-500 tracking-tighter italic">
            CMD + K
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {/* DYNAMISCHE KUNDEN-LISTE */}
        {filteredCustomers.map((customer: any) => (
          <div
            key={customer.id}
            className="relative group bg-[#070707] border border-white/[0.03] rounded-[2.5rem] p-8 hover:border-orange-500/30 transition-all duration-500 shadow-2xl overflow-hidden min-h-[350px] flex flex-col justify-between"
          >
            {/* Tier Badge - Schwebend wie im Screenshot */}
            <div
              className={`absolute top-0 right-10 px-6 py-2 rounded-b-xl shadow-lg transition-transform group-hover:translate-y-1 ${
                customer.tier === "Premium"
                  ? "bg-orange-500 text-black"
                  : "bg-[#111] text-white/40"
              }`}
            >
              <span className="text-[9px] font-black uppercase italic tracking-tighter">
                {customer.tier || "Standard"}
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-600 italic">
                  Active Node
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white group-hover:text-orange-500 transition-colors leading-none">
                  {customer.full_name}
                </h3>
                <div className="flex flex-col gap-1">
                  <p className="text-[9px] font-black text-blue-500/50 uppercase tracking-widest">
                    {customer.kundenkarte_id ||
                      `AE-${customer.id.toString().padStart(6, "0")}`}
                  </p>
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                    {customer.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Preview (Optional, falls Daten vorhanden) */}
            <div className="py-6 border-y border-white/[0.03] my-4">
              <span className="text-[7px] font-black text-white/10 uppercase tracking-[0.4em]">
                Connection_Stable
              </span>
            </div>

            <button
              className="w-full py-5 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:bg-orange-600 hover:text-white hover:border-orange-500 transition-all italic group-hover:text-white"
              onClick={() => setSelectedCustomer(customer)}
            >
              Access Profile
            </button>

            {/* Background Glow Effekt */}
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-orange-500/5 rounded-full blur-[60px] group-hover:bg-orange-500/10 transition-all" />
          </div>
        ))}

        {/* REGISTRIERUNGS-MODUL (Im Grid integriert) */}
        {isAdding ? (
          <section className="relative bg-[#0a0a0a] border border-orange-500/30 rounded-[2.5rem] p-8 shadow-[0_0_40px_rgba(249,115,22,0.1)] transition-all">
            <form
              action={async (fd) => {
                setLoading(true);
                const res = await registerCustomer(fd);
                setLoading(false);
                if (res.success) {
                  setIsAdding(false);
                  router.refresh();
                } else {
                  alert("Error: " + res.error);
                }
              }}
              className="space-y-5 h-full flex flex-col justify-between"
            >
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 italic mb-6">
                  Initialize_Entity
                </h3>
                <div className="space-y-3">
                  <input
                    name="full_name"
                    placeholder="FULL NAME"
                    required
                    className="w-full bg-black/50 border border-white/5 p-5 rounded-2xl text-[10px] font-black text-white outline-none focus:border-orange-500/50 transition-all tracking-widest"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    required
                    className="w-full bg-black/50 border border-white/5 p-5 rounded-2xl text-[10px] font-black text-white outline-none focus:border-orange-500/50 transition-all tracking-widest"
                  />
                  <div className="relative">
                    <select
                      name="tier"
                      className="w-full bg-black/50 border border-white/5 p-5 rounded-2xl text-[10px] font-black text-gray-500 outline-none focus:border-orange-500/50 appearance-none tracking-widest uppercase italic"
                    >
                      <option value="Standard">TIER: STANDARD</option>
                      <option value="Premium">TIER: PREMIUM</option>
                      <option value="Enterprise">TIER: ENTERPRISE</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-orange-500 text-[8px]">
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-5 bg-orange-600 text-white font-black uppercase italic text-[10px] tracking-widest rounded-2xl hover:bg-orange-500 disabled:opacity-50 transition-all shadow-xl shadow-orange-900/20"
                >
                  {loading ? "EXECUTING..." : "REGISTER"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-5 bg-white/5 text-gray-500 font-black uppercase text-[10px] rounded-2xl hover:text-white transition-all hover:bg-red-500/10"
                >
                  ✕
                </button>
              </div>
            </form>
          </section>
        ) : (
          <div
            onClick={() => setIsAdding(true)}
            className="relative group border-2 border-dashed border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-6 hover:border-orange-500/30 cursor-pointer bg-white/[0.01] min-h-[350px] transition-all duration-700 hover:bg-orange-500/[0.02]"
          >
            <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center text-gray-700 group-hover:text-orange-500 group-hover:border-orange-500/50 group-hover:scale-110 transition-all duration-500">
              <span className="text-3xl font-light">+</span>
            </div>
            <div className="text-center space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-700 group-hover:text-orange-500 transition-colors">
                Register New Entity
              </span>
              <span className="block text-[7px] font-bold text-white/5 uppercase tracking-[0.2em]">
                Add to customer registry
              </span>
            </div>
          </div>
        )}
      </div>

      {/* OVERLAY RENDERING */}
      {selectedCustomer && (
        <CustomerProfileOverlay
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}
