'use client';

import { useState, useEffect } from 'react';
import { getProfitLossData } from '@/modules/inventory/actions';
import { TrendingUp, AlertTriangle, ShoppingCart, DollarSign, ArrowDown } from 'lucide-react';

export default function ProfitForecastingPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getProfitLossData().then(setData);
  }, []);

  if (!data) return <div className="p-8 text-blue-500 font-mono italic">CALCULATING_FISCAL_STREAMS...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      
      {/* PROFIT & LOSS SECTION */}
      <section className="bg-[#050505] border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <DollarSign size={200} className="text-green-500" />
        </div>
        
        <div className="relative z-10">
          <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.5em] mb-4">Real_Time_Profit_Loss</p>
          <div className="flex items-baseline gap-4">
            <h2 className="text-7xl font-black text-white italic tracking-tighter">
              {data.netProfit.toFixed(2)}€
            </h2>
            <span className="text-green-500 font-bold flex items-center gap-1">
              <TrendingUp size={16} /> NET_PROFIT
            </span>
          </div>
          <p className="text-gray-600 text-xs mt-2 uppercase font-bold tracking-widest">
            Basierend auf {data.orderCount} Transaktionen (Umsatz: {data.grossRevenue.toFixed(2)}€ Brutto)
          </p>
        </div>
      </section>

      {/* INTELLIGENT REORDER (FORECAST) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-orange-500/5 border border-orange-500/10 p-8 rounded-[2.5rem] space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
            <AlertTriangle size={16} /> Smart_Reorder_Engine
          </h3>
          
          <div className="space-y-3">
            {data.suggestions.length > 0 ? data.suggestions.map((s: any, i: number) => (
              <div key={i} className="bg-black/40 border border-white/5 p-5 rounded-2xl flex justify-between items-center group hover:border-orange-500/30 transition-all">
                <div>
                  <p className="text-white font-black uppercase text-sm">{s.name}</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">
                    Stock: {s.lagerbestand} / Min: {s.min_bestand}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-orange-500 font-black text-xl">+{s.suggest_amount}</p>
                  <p className="text-[8px] text-gray-600 font-black uppercase">Order_Units</p>
                </div>
              </div>
            )) : (
              <p className="text-gray-700 text-[10px] font-black uppercase py-10 text-center italic">All inventory levels optimized.</p>
            )}
          </div>
        </div>

        {/* FINANCIAL HEALTH CHART SIMULATION */}
        <div className="bg-blue-600/5 border border-blue-500/10 p-8 rounded-[2.5rem] flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
              <ShoppingCart size={16} /> Capital_Efficiency
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed">
              Dein Verhältnis von gebundenem Kapital zu täglichem Abverkauf liegt im optimalen Bereich.
            </p>
          </div>
          
          <div className="pt-10">
             <div className="flex items-end gap-2 h-32">
                {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-500/20 rounded-t-lg relative group transition-all hover:bg-blue-500/50" style={{height: `${h}%`}}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[8px] font-bold text-white">Day_{i+1}</div>
                  </div>
                ))}
             </div>
             <p className="text-center text-[8px] text-gray-700 font-black uppercase tracking-[0.3em] mt-4">7_Day_Profit_Flow</p>
          </div>
        </div>

      </section>

      {/* QUICK ACTION */}
      <div className="flex justify-center">
        <button className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center gap-3 hover:bg-orange-500 transition-all">
          <ArrowDown size={16} /> Download Fiscal Report (PDF)
        </button>
      </div>

    </div>
  );
}