import {
    Activity, Users, ShoppingBag, Euro, Database,
    Zap, ArrowUpRight, BrainCircuit
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
    // 1. Datenabruf in Lichtgeschwindigkeit
    const [stats, aiStrategy, customers, users, system] = await Promise.all([
        getAccountingStats(),
        getAIInventoryStrategy(),
        getCustomerDatabase(),
        getRegistredUsers(),
        getSystemMetrics(),
    ]);

    // 2. Dynamische Variablen-Extraktion
    const marketPulse = system.stats.find(s => s.label === 'Market Pulse')?.value || "50%";
    const pulseColor = system.stats.find(s => s.label === 'Market Pulse')?.color || "text-green-500";
    const criticalNodes = system.stats.find(s => s.label === 'Kritische Produkte')?.value || 0;

    return (
        <div className="p-10 space-y-10 animate-in fade-in duration-700">

            {/* HEADER: Aether Kernel & System Load */}
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-2">
                        AETHER OS // KERNEL V16.1.6
                    </p>
                    <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white">
                        CONTROL <span className="text-orange-600">CENTER</span>
                    </h1>
                </div>
                <div className="text-right border-l border-white/10 pl-8">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">System Load</p>
                    <p className={`text-2xl font-black italic transition-all duration-500 ${pulseColor}`}>
                        {marketPulse}
                    </p>
                </div>
            </div>

            {/* CORE METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Database */}
                <div className="bg-[#0a0a0a] border border-white/[0.05] p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/30 transition-all">
                    <Database size={80} className="absolute top-0 right-0 p-8 opacity-10 text-blue-500" />
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Database Status</p>
                    <h3 className="text-4xl font-black italic text-white mb-2 uppercase">Online</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                        <span className="text-[9px] font-bold text-green-500 uppercase tracking-[0.2em]">Supabase Active</span>
                    </div>
                </div>

                {/* Identity Nodes */}
                <div className="bg-[#0a0a0a] border border-white/[0.05] p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/30 transition-all">
                    <Users size={80} className="absolute top-0 right-0 p-8 opacity-10 text-blue-500" />
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Identity Nodes</p>
                    <h3 className="text-5xl font-black italic text-white mb-2 uppercase">{users?.length || 0}</h3>
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Verified Users</span>
                </div>

                {/* Customers */}
                <div className="bg-[#0a0a0a] border border-white/[0.05] p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/30 transition-all">
                    <ShoppingBag size={80} className="absolute top-0 right-0 p-8 opacity-10 text-blue-500" />
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Customers</p>
                    <h3 className="text-5xl font-black italic text-white mb-2 uppercase">{customers.length}</h3>
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Market Relations</span>
                </div>

                {/* Performance */}
                <div className="bg-[#0a0a0a] border border-white/[0.05] p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-orange-500/30 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <Zap size={80} className="absolute top-0 right-0 p-8 opacity-10 text-orange-500" />
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Response Time</p>
                    <h3 className="text-4xl font-black italic text-white mb-2 uppercase">{system.responseTime}</h3>
                    <span className="text-[9px] font-bold text-orange-500 uppercase tracking-[0.2em]">Live Performance</span>
                </div>
            </div>

            {/* AI STRATEGY HUB */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500 flex items-center gap-2">
                        <BrainCircuit size={14} /> AI // Strategy Analytics
                    </h2>
                    <div className="h-px flex-1 bg-blue-500/20" />
                </div>
                <AiControlCenter initialStrategy={aiStrategy} />
            </div>

            {/* FINANCIAL & INVENTORY INTEGRITY */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white">Financial // Inventory Integrity</h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#0d0d0d] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-between h-40 hover:border-blue-500/30 transition-all">
                        <Euro className="text-blue-500" size={20} />
                        <div>
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Total Sales</p>
                            <p className="text-3xl font-black italic text-white tracking-tighter">
                                {stats.totalSales.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#0d0d0d] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-between h-40">
                        <ShoppingBag className="text-blue-500" size={20} />
                        <div>
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Inventory EK Value</p>
                            <p className="text-3xl font-black italic text-white tracking-tighter">
                                {stats.inventoryValueEK.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                            </p>
                        </div>
                    </div>

                    {/* DYNAMISCHER LOW STOCK ALERT */}
                    <div className={`p-8 rounded-[2rem] border transition-all duration-500 flex flex-col justify-between h-40 ${criticalNodes > 0 ? 'bg-red-500/5 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-[#0d0d0d] border-white/5'}`}>
                        <Activity className={criticalNodes > 0 ? 'text-red-500 animate-pulse' : 'text-blue-500'} size={20} />
                        <div>
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Low Stock Alerts</p>
                            <p className={`text-3xl font-black italic tracking-tighter ${criticalNodes > 0 ? 'text-red-500' : 'text-white'}`}>
                                {criticalNodes} <span className="text-xs opacity-50 not-italic uppercase">Nodes Critical</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK ACCESS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Inventory', 'Kunden', 'Rechnungen', 'Mitarbeiter'].map((item) => (
                    <button key={item} className="p-6 bg-[#0a0a0a] border border-white/5 rounded-3xl flex flex-col gap-4 hover:bg-blue-600/10 hover:border-blue-500 transition-all group text-left">
                        <ArrowUpRight className="text-gray-700 group-hover:text-blue-500 transition-all" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{item}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}