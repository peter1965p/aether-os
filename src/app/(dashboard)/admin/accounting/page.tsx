// src/app/(dashboard)/accounting/page.tsx

import React from 'react';
import db from '@/lib/db';
import {
  getProfitLossData,
  getAccountingStats,
  getGrowthStats,
  getIntelligenceConfig // Neu: Hol dir den Strategy-Mode!
} from "@/modules/inventory/actions";
import {
  Download,
  TrendingUp,
  AlertTriangle,
  Package,
  Clock,
  Monitor,
  BarChart3,
  FileText,
  ShieldCheck,
  Cpu
} from "lucide-react";

// --- AUDIT TRAIL KOMPONENTE ---
async function AuditTrail() {
  try {
    const { data: logs, error } = await db
      .from('orders')
      .select(`
        id, 
        order_date, 
        status, 
        total_price, 
        order_items (
          product_id,
          products ( name )
        )
      `)
      .order('order_date', { ascending: false })
      .limit(8);

    if (error) throw error;

    return (
      <div className="w-full bg-[#050505]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden mt-12 shadow-2xl relative">
        {/* Dekoratives Element oben rechts */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Cpu size={120} />
        </div>

        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="relative">
                <Clock className="text-green-500" size={20} />
                <div className="absolute inset-0 bg-green-500 blur-md opacity-20 animate-pulse" />
            </div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter">
              Audit Trail <span className="text-white/20">// Global Ledger</span>
            </h2>
          </div>
          <div className="flex gap-4 items-center">
             <span className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-black border border-white/10 rounded-full text-[8px] font-black text-zinc-500 uppercase tracking-widest">
               <ShieldCheck size={10} className="text-green-500" /> Integrity_Hash: 0x8F2...
             </span>
             <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[9px] font-black text-green-500 uppercase tracking-widest">
               <Monitor size={10} /> {logs?.[0]?.status || 'IDLE'}
             </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[9px] uppercase font-black tracking-[0.3em] text-white/20 border-b border-white/5 bg-white/[0.01]">
                <th className="p-6">Timestamp</th>
                <th className="p-6">Asset_ID / Node</th>
                <th className="p-6 text-right">Verification</th>
                <th className="p-6 text-right">Net_Amount</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs?.map((log: any) => {
                const productInfo = log.order_items?.[0]?.products;
                return (
                  <tr key={log.id} className="group hover:bg-green-500/[0.03] transition-all duration-300">
                    <td className="p-6 font-mono text-[10px] text-zinc-500 italic">
                      {log.order_date ? new Date(log.order_date).toLocaleTimeString('de-DE') : '--:--'}
                    </td>
                    <td className="p-6">
                        <div className="flex flex-col">
                            <span className="font-black uppercase italic text-sm text-white group-hover:text-green-400 transition-colors">
                                {productInfo?.name || 'Bulk_Asset_Entry'}
                            </span>
                            <span className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest">UID: {log.id}</span>
                        </div>
                    </td>
                    <td className="p-6 text-right">
                      <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-sm border ${
                        log.status === 'completed' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-zinc-800 text-zinc-600'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="p-6 text-right font-black italic text-xl tracking-tighter text-zinc-100">
                      {(Number(log.total_price) || 0).toLocaleString('de-DE')} <span className="text-[10px] text-zinc-600">€</span>
                    </td>
                    <td className="p-6 text-right">
                      <button className="p-2.5 bg-zinc-900 border border-white/5 hover:border-green-500 hover:text-green-500 rounded-xl transition-all active:scale-90">
                        <FileText size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  } catch (e) {
    return <div className="p-8 text-red-500/50 font-mono text-[10px] uppercase text-center border border-red-500/10 rounded-[2rem] mt-12 bg-red-500/5">System_Link_Failure</div>;
  }
}

export default async function AccountingPage() {
  const [financeData, generalStats, growth, aiConfig] = await Promise.all([
    getProfitLossData(),
    getAccountingStats(),
    getGrowthStats(),
    getIntelligenceConfig() // Dein Intelligence Hub Context!
  ]);

  return (
    <div className="p-8 bg-[#020202] min-h-screen text-white font-mono selection:bg-green-500/30 animate-in fade-in duration-1000">
      
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.03)_0%,transparent_50%)] pointer-events-none" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             <p className="text-green-500 text-[9px] tracking-[0.5em] uppercase font-black">Aether_OS // Financial_Core_v2.1</p>
          </div>
          <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">
            Accounting <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">Engine</span>
          </h1>
        </div>
        <div className="flex gap-4">
            <div className="px-6 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl flex flex-col items-end justify-center">
                <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">System_Mode</span>
                <span className="text-xs font-black text-green-500 uppercase italic">{(aiConfig as any)?.strategy_mode || 'STANDARD'}</span>
            </div>
            <button className="bg-green-600 hover:bg-green-500 text-black px-10 py-5 rounded-2xl font-black flex items-center gap-4 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] active:scale-95 group">
                <Download size={20} className="group-hover:-translate-y-1 transition-transform" /> 
                <span className="tracking-tighter italic">EXPORT_LEDGER</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        
        {/* MAIN PERFORMANCE CARD */}
        <div className="lg:col-span-3 bg-zinc-900/20 backdrop-blur-md border border-white/5 rounded-[3rem] p-12 relative overflow-hidden group hover:border-green-500/20 transition-colors">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-16">
               <div className="flex items-center gap-4">
                  <BarChart3 size={24} className="text-green-500" />
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.4em]">Performance_Metrics</p>
                    <p className="text-[8px] text-zinc-700 font-black uppercase tracking-widest mt-1">Status: Operational_Stable</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Calculated_Net_Profit</p>
                <h2 className="text-8xl font-black italic tracking-tighter text-white drop-shadow-2xl">
                  {((financeData as any).netProfit || 0).toLocaleString('de-DE')} <span className="text-2xl text-zinc-600">€</span>
                </h2>
                <div className="flex items-center gap-4 pt-4">
                  <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${((growth as any).dayDiff || 0) >= 0 ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    <TrendingUp size={14} className={((growth as any).dayDiff || 0) < 0 ? 'rotate-180' : ''} />
                    {((growth as any).dayPercentage || 0).toFixed(1)}%
                  </div>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic">vs_Previous_Cycle</p>
                </div>
              </div>

              <div className="flex flex-col justify-end space-y-6">
                <div>
                    <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-2">Gross_Revenue</p>
                    <h2 className="text-5xl font-black italic tracking-tighter text-zinc-700">
                    {((financeData as any).grossRevenue || 0).toLocaleString('de-DE')} €
                    </h2>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Orders_Processed</span>
                        <span className="text-xl font-black italic">{(financeData as any).orderCount || 0}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Inventory_Valuation</span>
                        <span className="text-xl font-black italic text-zinc-400">{(generalStats as any).inventoryValueVK?.toLocaleString('de-DE')} €</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR: STOCK ALERTS / KI STRATEGY */}
        <div className="bg-zinc-900/10 border border-white/5 rounded-[3rem] p-10 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3 text-orange-500">
                <AlertTriangle size={20} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Stock_Critical</p>
            </div>
            <span className="text-[10px] font-black text-zinc-800">0{(financeData as any).suggestions?.length || 0}</span>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {(financeData as any).suggestions && (financeData as any).suggestions.length > 0 ? (
              (financeData as any).suggestions.map((item: any, i: number) => (
                <div key={i} className="bg-black/40 border border-white/5 p-6 rounded-2xl group hover:border-orange-500/40 transition-all border-l-4 border-l-orange-500/20">
                  <p className="text-xs font-black uppercase italic tracking-tighter text-zinc-300 group-hover:text-orange-500 transition-colors mb-2">{item.name}</p>
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Cur: {item.lagerbestand}</span>
                        <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest text-orange-500/50">Min: {item.min_bestand}</span>
                    </div>
                    <div className="text-2xl font-black italic text-orange-500 leading-none">+{item.suggest_amount}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <ShieldCheck size={48} className="mb-4" />
                <p className="text-[8px] font-black uppercase tracking-[0.5em]">Inventory_Optimized</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/5">
             <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                <p className="text-[8px] text-green-500 font-black uppercase tracking-[0.2em] mb-1">Neural_Update</p>
                <p className="text-[9px] text-zinc-400 leading-relaxed italic">System_Mode: <span className="text-white">Strategy_Active</span>. Cashflow-Optimierung abgeschlossen.</p>
             </div>
          </div>
        </div>
      </div>

      <AuditTrail />
    </div>
  );
}