import { 
  Radio, BarChart3, Clock, Search, Wrench, Zap, 
  Mail, Bot, RadioTower, ShieldCheck, Globe as GlobeIcon,
  ChevronRight, Activity, Database, Terminal, Settings
} from "lucide-react";
import db from "@/lib/db";
import { getGlobalMeta } from "@/lib/seo-bridge";
import dynamic from "next/dynamic";

/**
 * AETHER OS // DYNAMIC COMPONENT LOADING
 * Verhindert SSR-Fehler (Server Side Rendering) für die Weltkugel.
 */
const GeoRadarGlobe = dynamic(() => import("@/lib/geo-radar"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-zinc-900/50 animate-pulse">
      <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">
        Initializing Orbital View...
      </span>
    </div>
  )
});

/**
 * AETHER OS // MISSION CONTROL // SEO & GEO INTELLIGENCE CENTER
 */
export default async function SeoGeoIntelPage() {
  // CORE DATA FETCH
  const meta = await getGlobalMeta();
  
  const { data: recentLogs } = await db
    .from("visitor_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div className="min-h-screen bg-[#05070a] text-white font-mono selection:bg-blue-500/30">
      
      {/* 1. TOP NAVIGATION BAR */}
      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">AETHER OS // KERNEL</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-4 text-zinc-500 text-[9px] uppercase tracking-widest">
              <span className="text-blue-500/50">Admin</span>
              <ChevronRight size={10} />
              <span>Intelligence Hub</span>
              <ChevronRight size={10} />
              <span className="text-white">SEO & Geo Radar</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-zinc-600 uppercase">Uptime</span>
              <span className="text-[10px] text-zinc-300">99.98%</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 p-px">
              <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                <Settings size={14} className="text-white/50" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1800px] mx-auto p-10">
        
        {/* HEADER SECTION */}
        <header className="mb-16">
          <div className="flex items-end gap-4 mb-4">
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
              Mission <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-500 to-indigo-700">Control.</span>
            </h1>
            <div className="mb-1 bg-blue-600/10 border border-blue-500/20 px-3 py-1 rounded-sm">
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">v3.4.0_STABLE</span>
            </div>
          </div>
          <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] max-w-2xl leading-relaxed">
            Zentralisierte Steuerung der Sichtbarkeitsparameter und globale Besucher-Analytik. 
            Automatisierte Injektion von KI-Kontexten in die Metadaten-Struktur.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: CONTROL INTERFACE (8 COLS) */}
          <div className="lg:col-span-8 space-y-12">
            
            <section className="bg-zinc-950/40 border border-white/5 p-10 rounded-[3.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Database size={80} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-3 bg-blue-600/10 rounded-2xl">
                    <Search size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-white">SEO Master Registry</h2>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-tighter">Direct Database Override // Intelligence Hub</p>
                  </div>
                </div>

                <div className="grid gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-[0.2em] ml-2">Dynamic SEO Title</label>
                    <div className="bg-black/40 border border-white/5 p-6 rounded-3xl hover:border-blue-500/30 transition-all cursor-pointer">
                      <span className="text-lg font-bold italic text-white/90">
                        {meta?.seo_title_dynamic || "AETHER OS // NEXT-GEN INFRASTRUCTURE"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-[0.2em] ml-2">AI Agent Briefing Context</label>
                    <div className="bg-black/40 border border-white/5 p-6 rounded-3xl hover:border-blue-500/30 transition-all cursor-pointer">
                      <p className="text-sm text-zinc-400 leading-relaxed italic">
                        {meta?.ai_context_briefing || "Definiere hier, wie KI-Crawler deine Infrastruktur verstehen sollen..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-zinc-950/40 border border-white/5 p-10 rounded-[3.5rem]">
                <div className="flex items-center gap-3 mb-8">
                  <Terminal size={18} className="text-blue-500" />
                  <h3 className="text-xs font-black uppercase text-white tracking-widest">Active Keyword Cloud</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {meta?.keyword_cloud?.map((kw: string) => (
                    <div key={kw} className="bg-blue-600/5 border border-blue-500/10 px-4 py-2 rounded-xl text-[10px] text-blue-400 font-bold hover:bg-blue-600/10 transition-colors cursor-default">
                      {kw}
                    </div>
                  )) || <div className="text-zinc-800 uppercase text-[10px]">Registry Empty</div>}
                </div>
              </div>

              <div className="bg-zinc-950/40 border border-white/5 p-10 rounded-[3.5rem]">
                <div className="flex items-center gap-3 mb-8">
                  <Activity size={18} className="text-green-500" />
                  <h3 className="text-xs font-black uppercase text-white tracking-widest">Ingest Stream</h3>
                </div>
                <div className="space-y-4">
                  {recentLogs?.map((log: any) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:bg-white/[0.04]">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-blue-500 font-bold truncate max-w-[120px]">{log.page_path}</span>
                        <span className="text-[8px] text-zinc-600 uppercase">{new Date(log.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400 italic">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: GEO-RADAR (4 COLS) */}
          <div className="lg:col-span-4 space-y-12">
            
            <div className="bg-zinc-950/60 border border-white/5 p-10 rounded-[4rem] flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-10">
                <h2 className="text-xs font-black uppercase text-white tracking-[0.2em] flex items-center gap-2">
                  <Radio size={16} className="text-blue-600 animate-pulse" /> Live Geo Radar
                </h2>
                <div className="bg-white/5 px-3 py-1 rounded-full text-[8px] font-black text-zinc-500 uppercase">
                  Realtime
                </div>
              </div>

              {/* DYNAMIC GLOBE - JETZT MIT SSR: FALSE */}
              <div className="w-full h-[32rem] bg-zinc-900/30 rounded-[3rem] border border-white/5 relative overflow-hidden group shadow-inner">
                <GeoRadarGlobe />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>

              <div className="mt-8 w-full p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase">Active Nodes</span>
                  <span className="text-[10px] font-black text-blue-500">12</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[65%] h-full bg-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-700 to-indigo-900 p-10 rounded-[4rem] shadow-2xl relative overflow-hidden group border border-white/10">
              <div className="relative z-10">
                <h3 className="text-lg font-black italic uppercase text-white flex items-center gap-3 mb-8">
                  <RadioTower size={24} className="animate-bounce" /> Intel Hub
                </h3>
                
                <div className="space-y-4">
                  {[
                    { title: "Infrastructure Score", val: "98.2" },
                    { title: "SEO Market Reach", val: "High" },
                    { title: "Node Stability", val: "Optimal" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-black/30 backdrop-blur-md p-5 rounded-3xl border border-white/10 flex justify-between items-center group-hover:translate-x-1 transition-transform">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">{stat.title}</span>
                      <span className="text-xs font-black text-white italic">{stat.val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform">
                <GlobeIcon size={200} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-20 py-10 px-10 text-center">
        <p className="text-[9px] text-zinc-800 font-black uppercase tracking-[1em]">
          AETHER OS // SYSTEM_KERNEL_ACCESS_GRANTED // 2026
        </p>
      </footer>
    </div>
  );
}