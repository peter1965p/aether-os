import {
    Activity,
    Users,
    ShoppingBag,
    Euro,
    Database,
    Zap,
    ArrowUpRight,
    BrainCircuit,
    AlertTriangle
} from "lucide-react";
import {
    getAccountingStats,
    getAIInventoryStrategy,
    getCustomerDatabase,
    getRegistredUsers,
    getSystemMetrics // NEU: Unser Motor für die Echtzeit-Werte
} from "@/modules/inventory/actions";
import { AiControlCenter } from "@/modules/ai/components/AiControlCenter";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Dashboard() {
    // Paralleler Datenabruf - Jetzt mit System Metrics für Response Time & Pulse
    const [stats, aiStrategy, customers, users, system] = await Promise.all([
        getAccountingStats(),
        getAIInventoryStrategy(),
        getCustomerDatabase(),
        getRegistredUsers(),
        getSystemMetrics(), // Holt die echten ms und den dynamischen Puls
    ]);

    // Wir extrahieren den Market Pulse Wert aus den Stats für den Header
    const marketPulse = system.stats.find(s => s.label === 'Market Pulse')?.value || "50%";

    return (
        <div className="p-10 space-y-10 animate-in fade-in duration-700">

            {/* HEADER SECTION */}
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-2">
                        AETHER OS // KERNEL V16.1.6
                    </p>
                    <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white">
                        CONTROL <span className="text-orange-600">CENTER</span>
                    </h1>
                </div>
                <div className="text-right border-l border-blue-900 pl-8">
                    <p className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">System Load</p>
                    {/* ECHTZEIT WERT AUS DER DB / INTELLIGENCE HUB */}
                    <p className="text-2xl font-black text-green-500 italic">{marketPulse}</p>
                </div>
            </div>

            {/* CORE METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* DATABASE STATUS */}
                <div className="bg-[#0a0a0a] border border-white/[0.05] p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/30 transition-all">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Database size={80} className="text-blue-500" />
                    </div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Database Status</p>
                    <h3 className="text-4xl font-black italic text-white mb-2 uppercase">Online</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                        <span className="text-[9px] font-bold text-green-500 uppercase tracking-[0.2em]">Supabase Engine Active</span>
                    </div>
                </div>

                {/* TOTAL USERS (Identity Nodes) */}
                <div className="bg-[#0a0a0a] border border-white/[0.05] p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/30 transition-all">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={80} className="text-blue-500" />
                    </div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Identity Nodes</p>
                    <h3 className="text-5xl font-black italic text-white mb-2 uppercase">{users?.length || 0}</h3>
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Verified Users</span>
                </div>

                {/* TOTAL Customers */}
                <div className="bg-[#0a0a0a] border border-white/[0.05] p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/30 transition-all">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingBag size={80} className="text-blue-500" />
                    </div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Customers</p>
                    <h3 className="text-5xl font-black italic text-white mb-2 uppercase">{customers.length}</h3>
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Market Relations</span>
                </div>

                {/* SYSTEM PERFORMANCE - JETZT DYNAMISCH */}
                <div className="bg-[#0a0a0a] border border-white/[0.05] p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={80} className="text-blue-500" />
                    </div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Response Time</p>
                    {/* HIER STEHEN JETZT DIE ECHTEN MS AUS DER AKTION */}
                    <h3 className="text-4xl font-black italic text-white mb-2 uppercase">{system.responseTime}</h3>
                    <span className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.2em]">Live Performance</span>
                </div>
            </div>

            {/* INTELLIGENCE HUB SECTION */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500 flex items-center gap-2">
                        <BrainCircuit size={14} /> AI // Strategy Analytics
                    </h2>
                    <div className="h-px flex-1 bg-blue-500/20" />
                </div>
                <AiControlCenter initialStrategy={aiStrategy} />
            </div>

            {/* FINANCIAL SECTION */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white">Financial // Inventory Integrity</h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-[#0d0d0d] to-[#050505] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-between h-40 hover:border-blue-500/30 transition-all">
                        <div className="flex justify-between items-start">
                            <Euro className="text-blue-500" size={20} />
                            <span className="text-[9px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-md">LIVE REVENUE</span>
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Total Sales</p>
                            <p className="text-3xl font-black italic text-white tracking-tighter">
                                {stats.totalSales.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0d0d0d] to-[#050505] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-between h-40">
                        <ShoppingBag className="text-blue-500" size={20} />
                        <div>
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Inventory EK Value</p>
                            <p className="text-3xl font-black italic text-white tracking-tighter text-nowrap">
                                {stats.inventoryValueEK.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                            </p>
                        </div>
                    </div>

                    {/* LOW STOCK ALERT - JETZT MIT DYNAMISCHER FARBE */}
                    <div className={`bg-gradient-to-br from-[#0d0d0d] to-[#050505] border p-8 rounded-[2rem] flex flex-col justify-between h-40 transition-all ${stats.lowStock > 0 ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-white/5'}`}>
                        <Activity className={stats.lowStock > 0 ? 'text-red-500' : 'text-blue-500'} size={20} />
                        <div>
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Low Stock Alerts</p>
                            <p className={`text-3xl font-black italic tracking-tighter ${stats.lowStock > 0 ? 'text-red-500' : 'text-white'}`}>
                                {stats.lowStock} <span className="text-xs text-gray-500 not-italic uppercase">Nodes Critical</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODULE ACCESS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Inventory', 'Kunden', 'Rechnungen', 'Mitarbeiter'].map((item) => (
                    <button key={item} className="p-6 bg-[#0a0a0a] border border-white/5 rounded-3xl flex flex-col gap-4 hover:bg-blue-600/10 hover:border-blue-500 transition-all group text-left">
                        <ArrowUpRight className="text-gray-700 group-hover:text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{item}</span>
                    </button>
                ))}
            </div>

        </div>
    );
}