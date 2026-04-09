import React from 'react';
import db from '@/lib/db';
import {
  getProfitLossData,
  getAccountingStats,
  getGrowthStats
} from "@/modules/inventory/actions";
import {
  Download,
  TrendingUp,
  AlertTriangle,
  Package,
  Clock,
  Monitor,
  Globe,
  BarChart3,
  FileText
} from "lucide-react";

async function AuditTrail() {
  // SQL Query basierend auf dem ER-Diagramm
  const logs = db.prepare(`
    SELECT o.id, o.datum, o.typ, o.gesamtpreis, o.status, p.name as artikel_name, p.ust_satz
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN produkte p ON oi.produkt_id = p.id
    ORDER BY o.datum DESC LIMIT 8
  `).all() as any[];

  return (
    <div className="w-full bg-[#050505] border border-white/5 rounded-[2.5rem] overflow-hidden mt-12 shadow-2xl">
      <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <Clock className="text-green-500" size={20} />
          <h2 className="text-xl font-black italic uppercase tracking-tighter">
            Audit Trail <span className="text-white/20">// Realtime Log</span>
          </h2>
        </div>
        <div className="flex gap-2">
           <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-black text-amber-500 uppercase tracking-widest">
             <Monitor size={10} /> POS
           </span>
           <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-500 uppercase tracking-widest">
             <Globe size={10} /> ONLINE
           </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase font-black tracking-[0.2em] text-white/20 border-b border-white/5">
              <th className="p-6">Timestamp</th>
              <th className="p-6">Source</th>
              <th className="p-6">Asset</th>
              <th className="p-6 text-right">Tax</th>
              <th className="p-6 text-right">Amount</th>
              <th className="p-6 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log) => (
              <tr key={log.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-mono text-[10px] text-white/40 italic">
                  {new Date(log.datum).toLocaleString('de-DE')}
                </td>
                <td className="p-6">
                  {log.typ === 'POS' ? (
                    <div className="flex items-center gap-2 text-amber-500">
                      <Monitor size={14} />
                      <span className="text-[10px] font-black uppercase italic">Terminal</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-blue-500">
                      <Globe size={14} />
                      <span className="text-[10px] font-black uppercase italic">Webstore</span>
                    </div>
                  )}
                </td>
                <td className="p-6 font-black uppercase italic text-white group-hover:text-green-400 transition-colors">
                  {log.artikel_name}
                </td>
                <td className="p-6 text-right font-mono text-[10px] text-white/40">{log.ust_satz}%</td>
                <td className="p-6 text-right font-black italic text-lg tracking-tighter">
                  {log.gesamtpreis.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </td>
                <td className="p-6 text-right">
                  <button
                    className="p-2 bg-white/5 hover:bg-green-500 hover:text-black rounded-lg transition-all active:scale-90"
                    title="Generate PDF Invoice"
                  >
                    <FileText size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function AccountingPage() {
  // Daten abrufen
  const financeDataRaw = await getProfitLossData();
  const generalStatsRaw = await getAccountingStats();
  const growthRaw = await getGrowthStats();

  // Typsichere Fallbacks für den Build (verhindert Property-Not-Found Errors)
  const financeData = {
    netProfit: 0,
    grossRevenue: 0,
    orderCount: 0,
    suggestions: [],
    ...((Array.isArray(financeDataRaw) ? {} : financeDataRaw) as any)
  };

  const generalStats = {
    inventoryValueVK: 0,
    ...((generalStatsRaw || {}) as any)
  };

  const growth = {
    revenueWeek: 0,
    dayDiff: 0,
    dayPercentage: 0,
    ...((growthRaw || {}) as any)
  };

  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans selection:bg-green-500/30 animate-in fade-in duration-700">

      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <p className="text-green-500 font-mono text-[10px] tracking-[0.3em] uppercase mb-2">Aether OS // Financial Auditing Engine</p>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">Accounting <span className="text-green-500">Center</span></h1>
        </div>
        <button className="bg-green-500 hover:bg-green-400 text-black px-8 py-4 rounded-xl font-black flex items-center gap-3 transition-transform active:scale-95 shadow-lg shadow-green-500/20">
          <Download size={20} /> DOWNLOAD .CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* REVENUE & PROFIT ANALYSIS */}
        <div className="lg:col-span-2 bg-[#050505] border border-white/5 rounded-[3rem] p-12 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-10">
               <div className="flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-green-500 rounded-full" />
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.3em]">Performance Metrics</p>
               </div>
               <div className="bg-white/5 px-4 py-2 rounded-2xl flex items-center gap-3 border border-white/5">
                  <BarChart3 size={16} className="text-green-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60">
                    7D Trend: <span className="text-white">{(growth.revenueWeek || 0).toLocaleString('de-DE')} €</span>
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <p className="text-[10px] text-white/30 mb-2 uppercase font-black tracking-widest text-white/40">Projected Net Profit</p>
                <h2 className="text-7xl font-black italic tracking-tighter text-white">
                  {(financeData.netProfit || 0).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </h2>
                <div className="flex items-center gap-4 mt-6">
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${(growth.dayDiff || 0) >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    <TrendingUp size={12} className={(growth.dayDiff || 0) < 0 ? 'rotate-180' : ''} />
                    {(growth.dayDiff || 0) >= 0 ? '+' : ''}{(growth.dayPercentage || 0).toFixed(1)}%
                  </div>
                  <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">vs. Yesterday</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-white/30 mb-2 uppercase font-black tracking-widest text-white/40">Gross Revenue</p>
                <h2 className="text-7xl font-black italic tracking-tighter text-white/30">
                  {(financeData.grossRevenue || 0).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </h2>
              </div>
            </div>

            <div className="flex gap-12 border-t border-white/5 pt-10 mt-12">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Orders: <span className="text-white ml-2">{financeData.orderCount || 0}</span></p>
              </div>
              <div className="flex items-center gap-3">
                <Package size={14} className="text-blue-500" />
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Stock (VK): <span className="text-white ml-2">{(generalStats.inventoryValueVK || 0).toLocaleString('de-DE')} €</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* REORDER LOGIC */}
        <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-10">
          <div className="flex items-center gap-3 mb-10 text-orange-500">
            <AlertTriangle size={20} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Stock Alerts</p>
          </div>
          <div className="space-y-4">
            {financeData.suggestions && financeData.suggestions.length > 0 ? (
              financeData.suggestions.map((item: any, i: number) => (
                <div key={i} className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl flex justify-between items-center group hover:bg-white/5 transition-colors border-l-2 border-l-orange-500/50">
                  <div>
                    <p className="text-xs font-black uppercase italic tracking-tighter text-white mb-1 group-hover:text-orange-500">{item.name}</p>
                    <p className="text-[10px] text-white/20 font-bold uppercase">STOCK: {item.lagerbestand} / MIN: {item.min_bestand}</p>
                  </div>
                  <div className="text-right font-black italic text-lg text-orange-500">+{item.suggest_amount}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 opacity-20"><Package size={40} className="mx-auto mb-4" /><p className="text-[10px] font-black uppercase tracking-widest italic tracking-[0.3em]">All nodes stable</p></div>
            )}
          </div>
        </div>
      </div>

      <AuditTrail />
    </div>
  );
}