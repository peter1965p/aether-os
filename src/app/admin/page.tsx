import { 
  Activity, 
  Users, 
  ShoppingBag, 
  Euro, 
  Database, 
  Zap,
  ArrowUpRight
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-2">
            AETHER OS // KERNEL V16.1.6
          </p>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white">
            CONTROL <span className="text-blue-500">CENTER</span>
          </h1>
        </div>
        <div className="text-right border-l border-white/5 pl-8">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Load</p>
          <p className="text-2xl font-black text-white italic">0.4%</p>
        </div>
      </div>

      {/* CORE METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
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

        {/* TOTAL USERS */}
        <div className="bg-[#0a0a0a] border border-white/[0.05] p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={80} className="text-blue-500" />
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Total Users</p>
          <h3 className="text-5xl font-black italic text-white mb-2 uppercase">2</h3>
          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Regional Identity Nodes</span>
        </div>

        {/* SYSTEM LOAD / OPTIMIZATION */}
        <div className="bg-[#0a0a0a] border border-white/[0.05] p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={80} className="text-blue-500" />
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Response Time</p>
          <h3 className="text-4xl font-black italic text-white mb-2 uppercase">12ms</h3>
          <span className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.2em]">Optimized Kernel</span>
        </div>
      </div>

      {/* FINANCIAL SECTION */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white">Financial // Global Assets</h2>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#0d0d0d] to-[#050505] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-between h-40">
             <div className="flex justify-between items-start">
                <Euro className="text-blue-500" size={20} />
                <span className="text-[9px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-md">↑ 12.5%</span>
             </div>
             <div>
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Total Revenue</p>
                <p className="text-3xl font-black italic text-white tracking-tighter">0,00 €</p>
             </div>
          </div>

          <div className="bg-gradient-to-br from-[#0d0d0d] to-[#050505] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-between h-40">
             <ShoppingBag className="text-blue-500" size={20} />
             <div>
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Total Orders</p>
                <p className="text-3xl font-black italic text-white tracking-tighter text-nowrap">00</p>
             </div>
          </div>

          <div className="bg-gradient-to-br from-[#0d0d0d] to-[#050505] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-between h-40">
             <Activity className="text-blue-500" size={20} />
             <div>
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Avg Ticket</p>
                <p className="text-3xl font-black italic text-white tracking-tighter">0,00 €</p>
             </div>
          </div>
        </div>
      </div>

      {/* MODULE ACCESS GRID */}
      <div className="grid grid-cols-4 gap-4">
        {['Inventory', 'Kunden', 'Rechnungen', 'Mitarbeiter'].map((item) => (
          <button key={item} className="p-6 bg-[#0a0a0a] border border-white/5 rounded-3xl flex flex-col gap-4 hover:bg-blue-600/10 hover:border-blue-500 transition-all group">
            <ArrowUpRight className="text-gray-700 group-hover:text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">{item}</span>
          </button>
        ))}
      </div>

    </div>
  );
}