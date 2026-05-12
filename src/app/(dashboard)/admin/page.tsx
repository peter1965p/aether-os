import {
    Activity, Users, ShoppingBag, Euro, Database,
    Zap, ArrowUpRight, BrainCircuit, ShieldAlert, Cpu
} from "lucide-react";
import {
    getAccountingStats,
    getAIInventoryStrategy,
    getCustomerDatabase,
    getRegistredUsers,
    getSystemMetrics
} from "@/modules/inventory/actions";
import { AiControlCenter } from "@/modules/ai/components/AiControlCenter";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Dashboard() {
    const [stats, aiStrategy, customers, users, system] = await Promise.all([
        getAccountingStats(),
        getAIInventoryStrategy(),
        getCustomerDatabase(),
        getRegistredUsers(),
        getSystemMetrics(),
    ]);

    const marketPulse = system.stats.find(s => s.label === 'Market Pulse')?.value || "50%";
    const pulseColor = system.stats.find(s => s.label === 'Market Pulse')?.color || "text-green-500";
    const criticalNodes = system.stats.find(s => s.label === 'Kritische Produkte')?.value || 0;

    return (
        <div className="p-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 bg-[#020406] min-h-screen">

            {/* --- TOP KERNEL HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.6em]">
                            Aether Kernel // Admin Elevation Active
                        </p>
                    </div>
                    <h1 className="text-7xl font-black italic uppercase tracking-tighter text-white select-none">
                        Control <span className="bg-gradient-to-r from-orange-400 via-orange-600 to-orange-900 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(234,88,12,0.3)]">Center</span>
                    </h1>
                </div>

                <div className="flex gap-12 bg-black/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                    <div className="text-right">
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Response Time</p>
                        <p className="text-2xl font-black italic text-blue-500 font-mono tracking-tighter">
                            {system.responseTime}
                        </p>
                    </div>
                    <div className="text-right border-l border-white/10 pl-8">
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">System Load</p>
                        <p className={`text-2xl font-black italic transition-all duration-500 font-mono tracking-tighter ${pulseColor}`}>
                            {marketPulse}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- CORE METRICS: GLAS-MORPHISM TILES --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Database State */}
                <div className="relative group overflow-hidden bg-black/40 border border-white/5 p-8 rounded-[2rem] hover:border-blue-500/40 transition-all duration-500">
                    <Database className="absolute -right-4 -top-4 w-32 h-32 opacity-[0.03] text-blue-500 group-hover:opacity-[0.07] transition-all" />
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-6">Kernel_Database</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-4xl font-black italic text-white uppercase tracking-tighter">Online</h3>
                        <div className="flex items-center gap-2 mb-1 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                            <span className="text-[8px] font-black text-green-500 uppercase">Supabase_Active</span>
                        </div>
                    </div>
                </div>

                {/* Identity Nodes */}
                <div className="relative group overflow-hidden bg-black/40 border border-white/5 p-8 rounded-[2rem] hover:border-blue-500/40 transition-all duration-500">
                    <Users className="absolute -right-4 -top-4 w-32 h-32 opacity-[0.03] text-blue-500" />
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-6">Identity_Nodes</p>
                    <h3 className="text-6xl font-black italic text-white tracking-tighter">{users?.length || 0}</h3>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase mt-2">Verified_Protocols</p>
                </div>

                {/* Market Relations */}
                <div className="relative group overflow-hidden bg-black/40 border border-white/5 p-8 rounded-[2rem] hover:border-blue-500/40 transition-all duration-500">
                    <ShoppingBag className="absolute -right-4 -top-4 w-32 h-32 opacity-[0.03] text-blue-500" />
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-6">Market_Relations</p>
                    <h3 className="text-6xl font-black italic text-white tracking-tighter">{customers.length}</h3>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase mt-2">Active_Client_Base</p>
                </div>

                {/* Neural Pulse */}
                <div className="relative group overflow-hidden bg-gradient-to-br from-orange-600/10 to-transparent border border-orange-500/20 p-8 rounded-[2.5rem] shadow-[0_20px_60px_rgba(234,88,12,0.1)]">
                    <Zap className="absolute -right-4 -top-4 w-32 h-32 opacity-[0.05] text-orange-500" />
                    <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-6">Neural_Performance</p>
                    <h3 className="text-5xl font-black italic text-white uppercase tracking-tighter">Stable</h3>
                    <div className="mt-3 w-full bg-zinc-900 h-[2px]">
                        <div className="bg-orange-600 h-full w-[85%] shadow-[0_0_10px_#ea580c]"></div>
                    </div>
                </div>
            </div>

            {/* --- AI STRATEGY HUB (Holographic Overlay) --- */}
            <div className="relative p-1 border border-white/5 bg-white/[0.01] rounded-[3rem]">
                <div className="p-10 space-y-8 bg-[#050505]/60 backdrop-blur-3xl rounded-[2.9rem]">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
                            <BrainCircuit className="text-blue-500" size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black uppercase tracking-[0.4em] text-white">Neural Strategy Hub</h2>
                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Autonomous Inventory Intelligence</p>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
                    </div>
                    <AiControlCenter initialStrategy={aiStrategy} />
                </div>
            </div>

            {/* --- FINANCIAL INTEGRITY: MASSIVE CARDS --- */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-zinc-500">Fiscal // Integrity_Scan</h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] flex flex-col justify-between h-48 group hover:border-blue-500/40 transition-all">
                        <Euro className="text-blue-500 group-hover:scale-110 transition-transform" size={24} />
                        <div>
                            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-2">Cumulative Sales</p>
                            <p className="text-4xl font-black italic text-white tracking-tighter">
                                {stats.totalSales.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                            </p>
                        </div>
                    </div>

                    <div className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] flex flex-col justify-between h-48 group hover:border-blue-500/40 transition-all">
                        <Cpu className="text-blue-500 group-hover:scale-110 transition-transform" size={24} />
                        <div>
                            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-2">Infrastructure EK Value</p>
                            <p className="text-4xl font-black italic text-white tracking-tighter">
                                {stats.inventoryValueEK.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                            </p>
                        </div>
                    </div>

                    {/* DYNAMISCHER LOW STOCK ALERT (BILD 2 VIBE) */}
                    <div className={`p-10 rounded-[2.5rem] border transition-all duration-700 flex flex-col justify-between h-48 relative overflow-hidden ${criticalNodes > 0 ? 'bg-red-950/20 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.15)]' : 'bg-black/40 border-white/5'}`}>
                        {criticalNodes > 0 && <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.1),transparent_70%)] animate-pulse" />}
                        <ShieldAlert className={criticalNodes > 0 ? 'text-red-500 animate-bounce' : 'text-zinc-700'} size={24} />
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-2">Critical Node Alerts</p>
                            <p className={`text-4xl font-black italic tracking-tighter ${criticalNodes > 0 ? 'text-red-500' : 'text-white'}`}>
                                {criticalNodes} <span className="text-xs opacity-50 not-italic uppercase tracking-[0.2em] ml-2">Nodes compromised</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- QUICK COMMANDS: ACTION GRID --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Inventory_Nodes', 'Client_Database', 'Fiscal_Archive', 'Operator_List'].map((item) => (
                    <button key={item} className="p-8 bg-black/40 border border-white/5 rounded-3xl flex flex-col gap-6 hover:bg-blue-600/10 hover:border-blue-500/40 transition-all group text-left relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-0 bg-blue-500 transition-all duration-500 group-hover:h-full" />
                        <ArrowUpRight className="text-zinc-800 group-hover:text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 group-hover:text-white transition-colors">{item}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}