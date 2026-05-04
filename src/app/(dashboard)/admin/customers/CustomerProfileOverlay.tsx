"use client";

import { useState, useEffect } from "react";
import { getCustomerOrders } from "@/modules/pos/actions";
import { QRCodeSVG } from "qrcode.react";

export default function CustomerProfileOverlay({
  customer,
  onClose,
}: {
  customer: any;
  onClose: () => void;
}) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (customer?.id) {
        const data = await getCustomerOrders(customer.id);
        setOrders(data);
        setLoading(false);
      }
    }
    loadData();
  }, [customer]);

  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-2xl no-print animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-[#070707] border border-white/5 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] relative flex flex-col max-h-[90vh]">
        {/* HEADER AREA */}
        <div className="p-12 border-b border-white/[0.03] flex justify-between items-end bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${customer.tier === "Premium" ? "bg-orange-500 shadow-[0_0_12px_#f97316]" : "bg-blue-500"}`}
              />
              <span
                className={`text-[10px] font-black uppercase tracking-[0.4em] italic ${customer.tier === "Premium" ? "text-orange-500" : "text-blue-500"}`}
              >
                Entity_Profile // {customer.tier || "Standard"}
              </span>
            </div>
            <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">
              {customer.full_name}
            </h2>
            <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.3em]">
              Registry_ID:{" "}
              {customer.kundenkarte_id ||
                `AE-${customer.id.toString().padStart(6, "0")}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-16 h-16 rounded-2xl border border-white/5 text-white/20 hover:text-white hover:border-orange-500/50 hover:bg-orange-500/10 transition-all flex items-center justify-center text-xl font-light"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-12 flex-1 overflow-hidden">
          {/* LEFT COLUMN: SYSTEM STATS */}
          <div className="col-span-12 lg:col-span-4 border-r border-white/[0.03] p-12 space-y-12 bg-black/20">
            {/* QR-CODE TERMINAL */}
            <div className="relative p-8 border border-white/5 rounded-[2rem] bg-[#0a0a0a] flex flex-col items-center group">
              <div className="absolute top-4 left-4 flex gap-1">
                <div className="w-1 h-1 bg-orange-500/30 rounded-full" />
                <div className="w-1 h-1 bg-orange-500/30 rounded-full" />
              </div>
              <div className="bg-white p-4 rounded-2xl mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-transform group-hover:scale-105 duration-500">
                <QRCodeSVG
                  value={customer.kundenkarte_id || ""}
                  size={160}
                  level="H"
                />
              </div>
              <div className="text-center space-y-1">
                <span className="text-[9px] font-mono text-orange-500/50 tracking-[0.3em] uppercase block">
                  Encrypted_Access_Token
                </span>
                <span className="text-[11px] font-black text-white tracking-widest font-mono">
                  {customer.kundenkarte_id}
                </span>
              </div>
            </div>

            {/* REVENUE STATS */}
            <div className="p-8 border border-white/5 rounded-[2rem] bg-gradient-to-br from-orange-500/[0.02] to-transparent">
              <label className="text-[9px] font-black uppercase text-gray-600 tracking-[0.2em] block mb-2">
                Total_System_Revenue
              </label>
              <div className="text-5xl font-black text-white italic tracking-tighter leading-none">
                {new Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency: "EUR",
                }).format(customer.umsatz_total || 0)}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-[2px] flex-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[65%]" />
                </div>
                <span className="text-[8px] font-black text-orange-500/50">
                  LVL_65
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: MATRIX LOG (TRANSACTIONS) */}
          <div className="col-span-12 lg:col-span-8 p-12 overflow-y-auto custom-scrollbar bg-[#080808]">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic flex items-center gap-3">
                <span className="w-8 h-px bg-orange-500/30" />
                Matrix_Log // Recent_Transmissions
              </h3>
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                {orders.length} Entries detected
              </span>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-white/[0.02] rounded-2xl animate-pulse border border-white/5"
                    />
                  ))}
                </div>
              ) : orders.length > 0 ? (
                orders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-6 bg-white/[0.01] border border-white/5 rounded-[1.5rem] hover:border-orange-500/30 hover:bg-orange-500/[0.02] transition-all group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-[10px] font-black text-gray-500 group-hover:text-orange-500 transition-colors">
                        #{order.id.toString().slice(-3)}
                      </div>
                      <div>
                        <div className="text-[12px] font-black text-white uppercase italic tracking-widest group-hover:text-orange-500 transition-colors">
                          Transmission_{order.id}
                        </div>
                        <div className="text-[9px] font-mono text-gray-600 uppercase tracking-tighter mt-1">
                          Timestamp:{" "}
                          {new Date(order.datum).toLocaleString("de-DE")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-white italic tracking-tighter">
                        {order.gesamtpreis.toFixed(2)}€
                      </div>
                      <div className="text-[7px] font-black text-green-500/40 uppercase tracking-widest">
                        Success // Finalized
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-20">
                  <div className="text-4xl mb-4">∅</div>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                    No Data in Buffer
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER ACTION BAR */}
        <div className="p-8 bg-black/50 border-t border-white/[0.03] flex gap-4">
          <button
            onClick={() => window.print()}
            className="flex-1 py-5 bg-white text-black font-black uppercase italic text-[11px] tracking-[0.2em] rounded-2xl hover:bg-orange-600 hover:text-white transition-all shadow-xl active:scale-[0.98]"
          >
            Generate Identity Card (Print)
          </button>
          <button
            onClick={onClose}
            className="px-10 py-5 bg-white/5 text-gray-500 font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl hover:text-white hover:bg-red-500/10 transition-all border border-white/5"
          >
            Close_Terminal
          </button>
        </div>
      </div>

      {/* PRINT-OPTIMIERTE KARTE */}
      <div
        id="printable-card"
        className="fixed left-[-9999px] top-0 print:static print:flex flex-col justify-between p-8 bg-white text-black border-[3px] border-black rounded-[1rem] w-[85mm] h-[55mm] shadow-none"
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">
              AETHER // OS IDENTITY
            </div>
            <div className="text-2xl font-black uppercase italic leading-none">
              {customer.full_name}
            </div>
            <div className="text-[10px] font-mono mt-1">
              {customer.kundenkarte_id}
            </div>
          </div>
          <div className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase italic">
            {customer.tier || "Standard"}
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div className="text-[8px] font-bold uppercase tracking-widest leading-tight opacity-50">
            Authorized Node Access
            <br />
            Valid for all company locations
          </div>
          <div className="p-1 border-2 border-black bg-white">
            <QRCodeSVG
              value={customer.kundenkarte_id || ""}
              size={60}
              fgColor="#000000"
              bgColor="#ffffff"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
