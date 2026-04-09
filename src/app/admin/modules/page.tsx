"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, MessageSquare, Users, ShoppingCart, Box, 
  MonitorSmartphone, FolderKanban, Landmark, 
  Truck, BarChart3, Layers, Settings, UserCheck, 
  Boxes, ClipboardList, Mail, MapPin, Zap
} from 'lucide-react';

export default function ModuleLicensePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const allModules = [
    { id: 'blog', name: 'Blog Engine', status: 'FREE', icon: FileText, sector: 'Content' },
    { id: 'comments', name: 'Comment Modul', status: 'FREE', icon: MessageSquare, sector: 'Content' },
    { id: 'forms', name: 'Formular Center', status: 'FREE', icon: ClipboardList, sector: 'Content' },
    { id: 'message', name: 'Message Center', status: 'FREE', icon: Mail, sector: 'Communication' },

    { id: 'projects', name: 'Project Management', status: 'FREE', icon: FolderKanban, sector: 'Operations' },
    { id: 'customers', name: 'Kunden (CRM)', status: 'FREE', icon: Users, sector: 'Operations' },
    { id: 'suppliers', name: 'Lieferanten Hub', status: 'FREE', icon: Truck, sector: 'Operations' },
    { id: 'staff', name: 'Mitarbeiter / HR', status: 'FREE', icon: UserCheck, sector: 'Operations' },
    
    { id: 'inventory', name: 'Inventory Management', status: 'FREE', icon: Box, sector: 'Commerce' },
    { id: 'shop', name: 'Shop System', status: 'FREE', icon: ShoppingCart, sector: 'Commerce' },
    { id: 'pos', name: 'POS Terminal', status: 'FREE', icon: MonitorSmartphone, sector: 'Commerce' },
    { id: 'categories', name: 'Kategorien', status: 'FREE', icon: Layers, sector: 'Commerce' },
    
    { id: 'accounting', name: 'Accounting / Finanzen', status: 'FREE', icon: Landmark, sector: 'Finance' },
    { id: 'datev', name: 'DATEV Export', status: 'FREE', icon: Boxes, sector: 'Finance' },
    
    // --- INTELLIGENCE CORE: BEIDE JETZT ALS SPECIAL GEBRANDET ---
    { id: 'seo', name: 'SEO & GEO Intel', status: 'FREE', icon: MapPin, sector: 'Intelligence', special: true },
    { id: 'news', name: 'News Center', status: 'FREE', icon: Zap, sector: 'Intelligence', special: true },
    { id: 'analytics', name: 'Analytics', status: 'FREE', icon: BarChart3, sector: 'Intelligence' },
    { id: 'multi_tenancy', name: 'Multi-Tenancy', status: 'FREE', icon: Settings, sector: 'Intelligence' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="font-black italic animate-pulse text-blue-500 tracking-tighter text-2xl uppercase">
        AETHER // SYNCING NEWS HUB...
      </div>
    </div>
  );

  return (
    <main className="p-10 space-y-16 bg-black min-h-screen text-white">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Aether // System Core Ecosystem</span>
        </div>
        <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none">
          Active <span className="text-zinc-800">Modules</span>
        </h1>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
        {allModules.map((m) => (
          <div 
            key={m.id} 
            className={`bg-[#050505] border p-8 rounded-[2.5rem] relative group transition-all duration-500 hover:bg-[#0a0a0a] 
              ${m.special 
                ? 'border-[#b33927]/40 shadow-[0_10px_40px_rgba(179,57,39,0.1)] hover:border-[#b33927]' 
                : 'border-blue-500/10 shadow-[0_10px_40px_rgba(59,130,246,0.05)] hover:border-blue-500/40'}`}
          >
            {/* SPECIAL STATUS BADGE */}
            <div className={`absolute top-0 right-0 font-black text-[9px] px-6 py-2 rounded-tr-[2.5rem] rounded-bl-2xl italic uppercase tracking-widest transition-all
              ${m.special ? 'bg-[#b33927] text-white shadow-[0_0_15px_rgba(179,57,39,0.3)]' : 'bg-blue-600 text-black'}`}>
              {m.status}
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:rotate-6 group-hover:scale-110
                  ${m.special 
                    ? 'bg-[#b33927]/10 border-[#b33927]/30 text-[#b33927]' 
                    : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                  <m.icon size={24} strokeWidth={2.5} />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-[0.3em] italic 
                  ${m.special ? 'text-[#b33927]' : 'text-zinc-700'}`}>
                  {m.sector}
                </span>
              </div>

              <div>
                <h4 className="font-black italic uppercase tracking-tighter text-2xl leading-none mb-1">
                  {m.name}
                </h4>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                  Node ID: {m.id}_v4.3
                </p>
              </div>

              <div className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border text-center transition-all
                ${m.special 
                  ? 'bg-[#b33927]/5 text-[#b33927] border-[#b33927]/20 group-hover:bg-[#b33927]/10' 
                  : 'bg-blue-500/5 text-blue-400 border-blue-500/20 group-hover:bg-blue-500/10'}`}>
                ● {m.special ? 'Intelligence Active' : 'System Active'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}