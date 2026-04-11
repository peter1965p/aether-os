import { Metadata } from "next";
import { 
  Wrench, Zap, ShieldCheck, 
  ExternalLink, MapPin, Cpu,
  Layers, Database, Lock
} from "lucide-react";
import db from "@/lib/db";

/**
 * AETHER OS // DYNAMISCHE METADATEN
 */
export async function generateMetadata(): Promise<Metadata> {
  const { data: seo } = await db
    .from("site_settings")
    .select("value")
    .eq("key", "homepage_seo")
    .single();

  const title = seo?.value?.title || "PAEFFGEN IT // AETHER OS - Next-Gen Infrastructure";
  const description = seo?.value?.description || "Spezialisiert auf hochperformante Dashboards und kritische Hardware-Infrastrukturen.";

  return {
    title,
    description,
    keywords: seo?.value?.keywords || ["IT Infrastructure", "Field Operations", "AETHER OS"],
    authors: [{ name: "Peter Paeffgen" }],
  };
}

export default async function HomePage() {
  /* --- AETHER OS: CORE DATA FETCH --- */
  
  // 1. Produkte aus dem Inventory-Roman
  const { data: products } = await db
    .from("produkte")
    .select(`*, categories (name)`)
    .limit(3);

  // 2. Intelligence Hub für den System-Status
  const { data: hub } = await db
    .from("intelligence_hub")
    .select("*")
    .eq("id", "global_config")
    .single();

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price || 0);
  };

  const pulseColor = (hub?.market_pulse || 50) > 70 ? "bg-orange-500" : "bg-blue-600";

  return (
    <div className="min-h-screen bg-[#05070a] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
        
        {/* 1. HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-32 border-b border-white/5 relative">
          {/* Dynamic Background Glow basierend auf Intelligence Hub */}
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${pulseColor} opacity-[0.03] blur-[120px] rounded-full -z-10 animate-pulse`} />
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-8 text-blue-500 font-mono text-[10px] uppercase tracking-[0.4em]">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pulseColor} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${pulseColor}`}></span>
                </span>
                SYSTEM: AETHER OS // STATUS: {hub?.strategy_mode?.toUpperCase() || "OPERATIV"} // v4.3
              </div>
              <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] mb-6">
                PAEFFGEN IT <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e5d9c] to-blue-400">
                  AETHER OS.
                </span>
              </h1>
              <p className="text-xl font-mono italic text-slate-500 tracking-tight">
                Next-Gen Infrastructure Management & Field Operations.
              </p>
            </div>
            <div className="max-w-md lg:text-right border-l lg:border-l-0 lg:border-r border-blue-600/30 pl-6 lg:pr-6 py-2">
              <p className="text-slate-500 font-mono text-[10px] uppercase leading-relaxed tracking-[0.1em] italic">
                Verbindung von über 25 Jahren Onsite-Expertise mit moderner Fullstack-Architektur. 
                Spezialisierung auf kritische Infrastrukturen (RWE, E.ON, Dell).
              </p>
            </div>
          </div>
        </section>

        {/* 2. PRODUCT SHOWCASE (DYNAMIC FROM DB) */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-x border-white/5 bg-gradient-to-b from-blue-600/[0.02] to-transparent">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-xs font-mono font-black uppercase text-blue-500 tracking-[0.3em]">
              CORE <span className="text-white">REGISTRY</span> // MODULES
            </h2>
            <div className="h-px flex-1 bg-white/5 mx-8 hidden md:block"></div>
            <span className="text-[10px] font-mono text-zinc-600 uppercase italic">Total_Nodes: {products?.length || 0}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products?.map((p: any) => (
              <div key={p.id} className="bg-zinc-950/40 border border-white/5 p-10 rounded-[2.5rem] hover:border-blue-500/30 transition-all group backdrop-blur-xl relative overflow-hidden">
                 <div className="flex justify-between items-start mb-8">
                    <div className="px-3 py-1 bg-zinc-900 rounded-lg text-blue-500 font-mono text-[9px] border border-white/5 tracking-widest">
                      @{p.categories?.name?.toLowerCase() || "system"}
                    </div>
                    <div className="text-[10px] text-zinc-800 font-black italic">v3.1.0</div>
                 </div>
                 <h3 className="text-2xl font-black uppercase italic mb-3 text-white group-hover:text-blue-400 transition-colors">
                    {p.name}
                 </h3>
                 <p className="text-zinc-500 text-xs leading-relaxed mb-8 italic font-light">
                    {p.description || "System-Modul zur Erweiterung der AETHER OS Kernfunktionalität."}
                 </p>
                 <div className="flex justify-between items-center pt-8 border-t border-white/5">
                    <span className="text-xl font-black text-white tracking-tighter">{formatPrice(p.preis)}</span>
                    <div className={`w-2 h-2 rounded-full ${p.lagerbestand > 0 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. TECH STACK (DIE ARCHITEKTUR) */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-x border-white/5 bg-[#05070a]">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="w-full lg:w-1/3">
              <h2 className="text-4xl font-black italic uppercase mb-8 leading-[0.9]">
                THE <span className="text-blue-600">ENGINE</span> <br/> 
                <span className="text-zinc-800">BEHIND AETHER.</span>
              </h2>
              <p className="text-zinc-500 font-mono text-[10px] leading-relaxed uppercase tracking-widest italic">
                Vollständig modularer Aufbau basierend auf dem Next.js App-Router. 
                Sicherheit durch serverseitige Validierung und Supabase-Integration.
              </p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
              {[
                { label: "Logic Layer", title: "Server Actions", icon: <Layers size={16}/>, desc: "Direkte DB-Interaktion via lib/actions für maximale Performance." },
                { label: "Security", title: "Protected Nodes", icon: <Lock size={16}/>, desc: "RBAC Access Control und Middleware-Protection auf Kernel-Ebene." },
                { label: "Data Hub", title: "PostgreSQL", icon: <Database size={16}/>, desc: "Strukturierte Datenhaltung mit Realtime-Features über Supabase." },
                { label: "UI System", title: "Aether UI", icon: <Cpu size={16}/>, desc: "Custom Komponenten-Bibliothek für konsistente User Experience." }
              ].map((tech, i) => (
                <div key={i} className="bg-[#05070a] p-10 hover:bg-blue-600/[0.03] transition-colors group">
                  <div className="text-blue-500 mb-4 group-hover:scale-110 transition-transform">{tech.icon}</div>
                  <span className="text-[9px] font-mono text-zinc-600 tracking-[0.2em] uppercase">{tech.label}</span>
                  <h4 className="text-sm font-black mt-2 mb-3 uppercase tracking-widest text-white">{tech.title}</h4>
                  <p className="text-zinc-500 text-[11px] leading-relaxed italic font-light">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. EXPERIENCE BAR */}
        <section className="bg-zinc-950 py-12 overflow-hidden border-y border-blue-900/30">
          <div className="flex justify-around items-center opacity-10 grayscale hover:opacity-40 transition-opacity font-black italic text-2xl tracking-[0.3em] whitespace-nowrap">
            <span>HEMMERSBACH</span> <span>/</span>
            <span>DELL TECHNOLOGIES</span> <span>/</span>
            <span>RWE PROJECT</span> <span>/</span>
            <span>E.ON OPS</span> <span>/</span>
            <span>FIELD SERVICE</span>
          </div>
        </section>

        {/* 5. CONTACT & STATUS */}
        <section className="max-w-7xl mx-auto px-6 py-32 flex flex-col md:flex-row gap-20 items-center border-x border-white/5">
          <div className="flex-1">
            <h2 className="text-4xl font-black italic uppercase mb-10 tracking-tighter text-white">
              SERVICE <span className="text-blue-600">REGIONS</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {["NRW", "RLP", "SAARLAND", "LUXEMBURG"].map(region => (
                <div key={region} className="flex items-center gap-4 border border-white/5 p-5 rounded-2xl bg-zinc-900/20 hover:border-blue-500/30 transition-all group">
                  <MapPin size={14} className="text-blue-500 group-hover:animate-bounce" />
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">{region} // ACTIVE</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 bg-zinc-950/80 border border-blue-500/20 p-12 rounded-[3rem] relative overflow-hidden backdrop-blur-3xl">
            <div className="absolute top-0 right-0 p-3 font-mono text-[8px] bg-blue-600 text-white uppercase italic tracking-[0.2em] font-black">
              Available 05/2026
            </div>
            <h3 className="text-xs font-mono font-black uppercase mb-8 text-blue-500 tracking-[0.3em]">
              SYSTEM STATUS // RECRUITING_OPEN
            </h3>
            <p className="text-lg text-zinc-300 leading-relaxed italic mb-10 font-light italic">
              "Bereit für neue Herausforderungen in der Architektur kritischer IT-Infrastrukturen und moderner Fullstack-Lösungen."
            </p>
            <a href="mailto:news24regional@gmail.com" className="group flex items-center gap-4 font-black text-[12px] text-white uppercase tracking-[0.2em] border-b-2 border-blue-600 w-fit pb-3 hover:text-blue-400 hover:border-blue-400 transition-all">
              INITIALISIERE KONTAKT <ExternalLink size={14} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
            </a>
          </div>
        </section>      

        {/* FOOTER */}
        <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-white/5 text-center">
            <p className="text-zinc-800 font-mono text-[9px] uppercase tracking-[0.5em]">
              &copy; 2026 AETHER OS // PAEFFGEN-IT // ALL RIGHTS RESERVED
            </p>
        </footer>
      </div>
  );
}