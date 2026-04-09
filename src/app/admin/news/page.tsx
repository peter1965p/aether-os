import React from 'react';
import db from '@/lib/db';
import { 
  Mail, 
  Users, 
  Trash2, 
  Download, 
  Search, 
  CheckCircle, 
  Clock 
} from 'lucide-react';

export default async function NewsCenterPage() {
  // 1. Daten aus der neuen Newsletter-Tabelle holen
  const { data: subscribers, error } = await db
    .from('newsletter_subs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <p className="text-blue-500 font-mono text-[10px] tracking-[0.3em] uppercase mb-2">
            Aether OS // Communication Stack
          </p>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
            News <span className="text-blue-500">Center</span>
          </h1>
        </div>
        <div className="flex gap-4">
            <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-4 rounded-xl font-black flex items-center gap-3 transition-all active:scale-95">
              <Download size={20} /> EXPORT CSV
            </button>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-black flex items-center gap-3 transition-transform active:scale-95 shadow-lg shadow-blue-600/20">
              <Mail size={20} /> BROADCAST
            </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-[#050505] border border-white/5 p-8 rounded-[2rem]">
          <div className="flex justify-between items-start mb-4">
            <Users className="text-blue-500" size={24} />
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Active Subs</span>
          </div>
          <h3 className="text-5xl font-black italic tracking-tighter">{subscribers?.length || 0}</h3>
          <p className="text-[10px] text-green-500 font-bold uppercase mt-2 tracking-widest">Nodes Verified</p>
        </div>
        
        <div className="bg-[#050505] border border-white/5 p-8 rounded-[2rem]">
          <div className="flex justify-between items-start mb-4">
            <CheckCircle className="text-green-500" size={24} />
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Delivery Rate</span>
          </div>
          <h3 className="text-5xl font-black italic tracking-tighter">99.8%</h3>
          <p className="text-[10px] text-white/20 font-bold uppercase mt-2 tracking-widest">Optimized Kernel</p>
        </div>

        <div className="bg-[#050505] border border-white/5 p-8 rounded-[2rem]">
          <div className="flex justify-between items-start mb-4">
            <Clock className="text-orange-500" size={24} />
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Last Activity</span>
          </div>
          <h3 className="text-5xl font-black italic tracking-tighter text-white/40">2M</h3>
          <p className="text-[10px] text-white/20 font-bold uppercase mt-2 tracking-widest">Sync Interval</p>
        </div>
      </div>

      {/* SUBSCRIBER TABLE */}
      <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h2 className="text-xl font-black italic uppercase tracking-tighter">
            Registry <span className="text-white/20">// Global Leads</span>
          </h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH NODE..." 
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-blue-500/50 w-64"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase font-black tracking-[0.2em] text-white/20 border-b border-white/5">
                <th className="p-6">Subscriber Identity</th>
                <th className="p-6">Status</th>
                <th className="p-6">Subscription Date</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subscribers?.map((sub: any) => (
                <tr key={sub.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-black italic">
                        {sub.email[0].toUpperCase()}
                      </div>
                      <span className="font-black italic text-white group-hover:text-blue-400 transition-colors uppercase">
                        {sub.email}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <span className="text-[9px] font-black uppercase px-2 py-1 rounded border border-green-500/20 text-green-500 bg-green-500/5">
                      {sub.status || 'Active'}
                    </span>
                  </td>
                  <td className="p-6 font-mono text-[10px] text-white/40 italic">
                    {new Date(sub.created_at).toLocaleString('de-DE')}
                  </td>
                  <td className="p-6 text-right">
                    <button className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {(!subscribers || subscribers.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-white/10 font-black uppercase italic tracking-[0.5em]">
                    No Nodes Registered
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}