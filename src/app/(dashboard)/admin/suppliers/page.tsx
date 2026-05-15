'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, MoreVertical, 
  ArrowUpRight, Zap, Globe, TrendingUp, 
  Package, ShieldCheck,
  Search, RefreshCcw, Share2,
  Activity, Database, ZapOff, Loader2, Mail
} from 'lucide-react';
import { getFullSupplierAnalytics } from "@/lib/actions/supplier.actions";
import { executeAutomatedOrder } from "@/lib/actions/procurement.actions";
import { SupplierNode } from "@/types/supplier";

export default function SupplierCenter() {
  const [suppliers, setSuppliers] = useState<SupplierNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const initKernel = async () => {
    setLoading(true);
    try {
      const data = await getFullSupplierAnalytics();
      setSuppliers(data || []);
    } catch (err) {
      console.error("Uplink_Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { initKernel(); }, []);

  // --- PROCUREMENT LOGIC ---
  async function handleOrder(formData: FormData) {
    const sId = formData.get("supplierId") as string;
    setProcessingId(sId);
    
    try {
      const result = await executeAutomatedOrder(formData);
      if (result.success) {
        console.log("AETHER OS // ORDER_SYNC_COMPLETE");
        await initKernel(); // Refresh des Kernels nach erfolgreicher Buchung
      }
    } catch (err) {
      console.error("CRITICAL_PROCUREMENT_ERROR:", err);
    } finally {
      setProcessingId(null);
    }
  }

  const stats = useMemo(() => {
    if (suppliers.length === 0) return { totalRevenue: 0, avgTrend: 0 };
    const totalRevenue = suppliers.reduce((acc, s) => acc + (s.revenue_ytd || 0), 0);
    const avgTrend = suppliers.reduce((acc, s) => acc + (s.trend_percentage || 0), 0) / suppliers.length;
    return { totalRevenue, avgTrend };
  }, [suppliers]);

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#020406] overflow-hidden">
      <div className="relative">
        <div className="w-24 h-24 border-2 border-orange-500/10 border-t-orange-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className="text-orange-500 animate-pulse" size={32} />
        </div>
        <p className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] whitespace-nowrap">
          Syncing_Aether_Nodes...
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-10 space-y-20 bg-[#020406] min-h-screen text-white font-sans selection:bg-orange-500/30">
      
      {/* --- HEADER BLOCK: THE UPLINK --- */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-12 relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
        
        <div className="space-y-6 relative">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <Database className="text-orange-500" size={20} />
            </div>
            <div className="flex flex-col">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.6em]">System_Core // Supply_Chain</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping" />
                <span className="text-[8px] font-mono text-zinc-500 uppercase italic">Uplink_Stable // Buffer: 0.1ms</span>
              </div>
            </div>
          </div>
          <h1 className="text-[5rem] font-black italic uppercase tracking-[-0.02em] leading-[0.8]">
            Supplies <span className="text-orange-600">Center | Active {suppliers.length}</span>
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-4 relative z-10">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="FILTER_DATA_STREAM..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl px-12 py-5 text-[11px] font-black focus:border-orange-500/50 outline-none w-80 transition-all backdrop-blur-md"
            />
          </div>
          <button onClick={initKernel} className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-orange-500/10 hover:border-orange-500/30 transition-all">
            <RefreshCcw size={22} className="text-zinc-400" />
          </button>
          <button className="bg-orange-600 text-white px-12 py-5 rounded-2xl font-black uppercase text-[11px] flex items-center gap-4 hover:bg-orange-500 transition-all shadow-[0_0_50px_rgba(249,115,22,0.2)] border border-orange-400/30 group">
            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Register_New_Node
          </button>
        </div>
      </header>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active_Nodes', val: suppliers.length, trend: 'Stable', icon: Globe },
          { label: 'Market_Forecast', val: `+${stats.avgTrend.toFixed(2)}%`, trend: 'Bullish', icon: TrendingUp },
          { label: 'System_Bandwidth', val: '0.82 GB/s', trend: 'Optimal', icon: Zap },
          { label: 'Audit_Status', val: 'Secure', trend: 'Verified', icon: ShieldCheck },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/[0.04] transition-all group">
            <div className="flex justify-between items-start mb-6">
              <stat.icon className="text-zinc-600 group-hover:text-orange-500 transition-colors" size={20} />
              <span className="text-[8px] font-black text-orange-500/40 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">{stat.label}</p>
            <h3 className="text-5xl font-black italic mt-2 tracking-tighter">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* --- SECTOR 2: INFRASTRUCTURE & ORDER CONTROL --- */}
      <section className="space-y-12">
        <div className="flex items-center gap-6">
          <h2 className="text-[12px] font-black text-orange-500 uppercase tracking-[0.6em] italic">Procurement_Control // Automated_Restock</h2>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {filteredSuppliers.map((sup) => (
            <div key={`card-${sup.id}`} className="bg-[#05070a] border border-white/5 rounded-[4rem] p-14 hover:border-orange-500/40 transition-all duration-700 relative group shadow-2xl overflow-hidden">
              <div className="relative z-10 flex flex-col h-full space-y-10">
                
                {/* Info Block */}
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full animate-pulse shadow-[0_0_15px] ${sup.load_level > 80 ? 'bg-red-500 shadow-red-500' : 'bg-orange-500 shadow-orange-500'}`} />
                      {/* FIX: Explicit string conversion to prevent .slice() crash */}
                      <p className="text-[10px] font-mono text-orange-500/50 uppercase tracking-[0.4em] italic">
                        Node_ID: {sup.id ? String(sup.id).slice(0, 8) : '--------'}
                      </p>
                    </div>
                    <h3 className="text-5xl font-black italic uppercase tracking-tighter">{sup.name}</h3>
                    <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.4em]">{sup.category}</p>
                  </div>
                  <button className="p-5 bg-white/5 rounded-2xl hover:bg-orange-500/20 hover:text-orange-500 transition-all">
                    <MoreVertical size={24} />
                  </button>
                </div>

                {/* Meter Section */}
                <div className="space-y-4 p-8 bg-black/40 rounded-[2.5rem] border border-white/5">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
                    <span>Supply_Load</span>
                    <span className={sup.load_level < 20 ? 'text-red-500' : 'text-orange-500'}>{sup.load_level}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-gradient-to-r from-orange-600 to-orange-400 h-full transition-all duration-1000 shadow-[0_0_20px_#f97316]" 
                      style={{ width: `${sup.load_level}%` }} 
                    />
                  </div>
                </div>

                {/* ACTION BLOCK: THE PROCUREMENT FORM */}
                <form action={handleOrder} className="grid grid-cols-1 gap-4 pt-6 border-t border-white/5">
                    <input type="hidden" name="supplierId" value={sup.id} />
                    <input type="hidden" name="email" value={sup.email} />
                    <input type="hidden" name="name" value={sup.name} />
                    
                    <div className="flex gap-4">
                        <div className="relative flex-1 group/input">
                            <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-orange-500" size={14} />
                            <input 
                                type="number" 
                                name="amount"
                                placeholder="QTY" 
                                defaultValue="50"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-5 text-[11px] font-black focus:border-orange-500/50 outline-none transition-all"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={processingId === sup.id}
                            className="bg-white text-black hover:bg-orange-600 hover:text-white px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 transition-all disabled:opacity-50 active:scale-95"
                        >
                            {processingId === sup.id ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
                            EXECUTE_REORDER
                        </button>
                    </div>
                </form>

                {/* Footer Metadata */}
                <div className="flex justify-between items-center pt-4 opacity-40 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                        <Mail size={12} /> {sup.email}
                    </div>
                    <div className="text-[9px] font-mono italic text-zinc-600">
                        AUTH: SECURED_NODE_GATE
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER: SYSTEM ACTIONS --- */}
      <footer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-white/5 pt-20 pb-10">
        {[
          { label: 'Establish_New_Chain', icon: ShieldCheck, color: 'text-orange-500' },
          { label: 'Audit_Market_Relations', icon: RefreshCcw, color: 'text-blue-500' },
          { label: 'Sync_Core_Ledger', icon: Share2, color: 'text-green-500' },
          { label: 'Terminal_Access', icon: ZapOff, color: 'text-red-500' }
        ].map((action, i) => (
          <button key={i} className="group relative p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-between hover:bg-white/[0.05] hover:border-orange-500/20 transition-all overflow-hidden">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 group-hover:text-white transition-colors relative z-10">{action.label}</span>
            <action.icon size={20} className={`${action.color} group-hover:scale-125 transition-transform relative z-10`} />
          </button>
        ))}
      </footer>

    </div>
  );
}