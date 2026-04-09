import { Search, Bell, ShieldCheck } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="h-20 border-b border-white/5 bg-[#050505] flex items-center justify-between px-10">
      {/* Search Engine Look */}
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={16} />
        <input
          type="text"
          placeholder="SEARCH SYSTEM (CMD + K)"
          className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-[10px] font-bold tracking-widest text-white focus:outline-none focus:border-blue-500/50 transition-all"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-white/20 font-black">⌘ K</div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/5 border border-green-500/20 rounded-full">
          <ShieldCheck size={14} className="text-green-500" />
          <span className="text-[9px] font-black text-green-500 uppercase tracking-widest text-nowrap">System Secure</span>
        </div>

        <div className="flex items-center gap-4 border-l border-white/10 pl-6 text-right">
          <div>
            <p className="text-[9px] font-black text-white uppercase tracking-tighter">Admin Node_01</p>
            <p className="text-[8px] font-bold text-white/20 uppercase">Master Key Access</p>
          </div>
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-black text-white border border-white/10 italic">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
