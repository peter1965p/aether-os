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

  // VOLLSTÄNDIGES REGISTER - JETZT KONZENTRIERT IM ORANGE-600 BRANDING
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
    
    // INTELLIGENCE CORE: ALLE IM ORANGE BRANDING, ABER MIT NEON GRÜNEM FREE BADGE
    { id: 'seo', name: 'SEO & GEO Intel', status: 'FREE', icon: MapPin, sector: 'Intelligence' },
    { id: 'news', name: 'News Center', status: 'FREE', icon: Zap, sector: 'Intelligence' },
    { id: 'analytics', name: 'Analytics', status: 'FREE', icon: BarChart3, sector: 'Intelligence' },
    { id: 'multi_tenancy', name: 'Multi-Tenancy', status: 'FREE', icon: Settings, sector: 'Intelligence' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="font-black italic animate-pulse text-orange-600 tracking-tighter text-2xl uppercase">
        AETHER // SYNCING NEWS HUB...
      </div>
    </div>
  );

  return (
    <main className="p-10 space-y-16 bg-black min-h-screen text-white">
      {/* HEADER SECTION */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-orange-600 rounded-full shadow-[0_0_10px_#ea580c]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600">Aether // System Core Ecosystem</span>
        </div>
        <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none text-white">
          Active <span className="text-zinc-800">Modules</span>
        </h1>
      </section>

      {/* GRID SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
        {allModules.map((m) => (
          <div 
            key={m.id} 
            className="bg-[#050505] border border-orange-600/10 p-8 rounded-[2.5rem] relative group transition-all duration-500 hover:bg-[#0a0a0a] hover:border-orange-600 shadow-[0_10px_40px_rgba(234,88,12,0.05)] hover:shadow-[0_10px_60px_rgba(234,88,12,0.1)]"
          >
            {/* --- NEON GRÜNER FREE RAHMEN & BADGE (OBERES VIERTEL) --- */}
            <div className="absolute top-4 left-4 right-4 h-1/4 rounded-2xl border-2 border-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.05)] group-hover:border-green-500 transition-all duration-500 flex items-center justify-center overflow-hidden">
                {/* Das eigentliche Badge */}
                <div className="absolute top-0 right-0 font-black text-[9px] px-6 py-2 rounded-bl-xl italic uppercase tracking-widest transition-all bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  {m.status}
                </div>
            </div>
            
            <div className="space-y-6 relative pt-6"> {/* pt-6 damit es unter dem Rahmen anfängt */}
              <div className="flex justify-between items-start">
                {/* ICON CONTAINER - JETZT IN ORANGE */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-orange-600/30 bg-orange-600/5 text-orange-500 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(234,88,12,0.2)]">
                  <m.icon size={24} strokeWidth={2.5} />
                </div>
                {/* SECTOR - JETZT IN ORANGE */}
                <span className="text-[8px] font-black uppercase tracking-[0.3em] italic text-zinc-700 group-hover:text-orange-600 transition-colors">
                  {m.sector}
                </span>
              </div>

              {/* NAME & ID */}
              <div>
                <h4 className="font-black italic uppercase tracking-tighter text-2xl leading-none mb-1 text-white group-hover:text-white transition-colors">
                  {m.name}
                </h4>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                  Node ID: {m.id}_v4.3
                </p>
              </div>

              {/* ACTION FOOTER - JETZT IN ORANGE */}
              <div className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-orange-600/20 bg-orange-600/5 text-orange-500 group-hover:bg-orange-600/10 transition-all">
                ● Intelligence Active
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}