import { 
  Radio, BarChart3, Clock, Search, Wrench, Zap, 
  Mail, Bot, RadioTower, ShieldCheck, Globe as GlobeIcon 
} from "lucide-react";
import db from "@/lib/db";
import { getGlobalMeta } from "@/lib/seo-bridge";
import GeoRadarGlobe from "@/lib/geo-radar";

/**
 * AETHER OS // MISSION CONTROL: SEO & GEO INTEL
 */
export default async function SeoGeoIntelPage() {
  // 1. Daten aus dem Intelligence Hub (Kernel) laden
  const meta = await getGlobalMeta();

  // 2. Neueste Traffic-Logs für die Liste holen
  const { data: recentLogs } = await db
    .from("visitor_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen bg-[#05070a] text-white font-mono p-8">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Mission <span className="text-blue-600">Control</span>
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mt-2">
            System: AETHER OS // Service: SEO & Geo Intelligence
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-sm text-blue-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Kernel Live
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LINKE SPALTE: SEO CONFIG & KEYWORDS */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* SEO OVERRIDE PANEL */}
          <div className="bg-zinc-950/50 border border-white/5 p-8 rounded-[3rem]">
            <h2 className="text-xs font-black uppercase text-blue-500 tracking-widest mb-8 flex items-center gap-2">
              <Search size={14} /> Global SEO Override
            </h2>
            
            <div className="space-y-6">
              <div className="group">
                <label className="text-[9px] uppercase text-zinc-500 font-bold mb-2 block tracking-widest">Dynamic Title</label>
                <div className="bg-black/50 border border-white/10 p-4 rounded-2xl group-hover:border-blue-500/30 transition-all">
                  <span className="text-sm text-white italic">{meta?.seo_title_dynamic || "Nicht konfiguriert"}</span>
                </div>
              </div>

              <div className="group">
                <label className="text-[9px] uppercase text-zinc-500 font-bold mb-2 block tracking-widest">AI Context Briefing</label>
                <div className="bg-black/50 border border-white/10 p-4 rounded-2xl group-hover:border-blue-500/30 transition-all">
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    {meta?.ai_context_briefing || "Keine KI-Instruktionen hinterlegt."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* KEYWORD CLOUD REISTRY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-950/50 border border-white/5 p-8 rounded-[3rem]">
               <h3 className="text-[10px] font-bold uppercase text-white mb-6 tracking-widest">Active Keywords</h3>
               <div className="flex flex-wrap gap-2">
                 {meta?.keyword_cloud?.map((kw: string) => (
                   <span key={kw} className="bg-blue-600/5 border border-blue-500/20 px-3 py-1 rounded-full text-[9px] text-blue-400 uppercase font-bold italic">
                     {kw}
                   </span>
                 )) || <span className="text-zinc-700 italic text-[9px]">Empty Registry</span>}
               </div>
            </div>
            
            <div className="bg-zinc-950/50 border border-white/5 p-8 rounded-[3rem]">
               <h3 className="text-[10px] font-bold uppercase text-white mb-6 tracking-widest">Recent Ingest</h3>
               <div className="space-y-3">
                 {recentLogs?.map((log: any) => (
                   <div key={log.id} className="text-[9px] flex justify-between border-b border-white/5 pb-2">
                     <span className="text-blue-500 truncate max-w-[150px]">{log.page_path}</span>
                     <span className="text-zinc-600 italic">
                        {new Date(log.created_at).toLocaleTimeString()}
                     </span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* RECHTE SPALTE: GEO RADAR & INTEL */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* LIVE GEO RADAR WIDGET */}
          <div className="bg-zinc-950/80 border border-white/5 p-8 rounded-[3rem] space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-[10px] font-black uppercase text-white tracking-widest flex items-center gap-2">
                  <Radio size={14} className="text-blue-600" /> Live Geo Radar
                </h2>
                <div className="text-[8px] bg-white/5 px-2 py-1 rounded text-zinc-500 uppercase font-bold">
                   Syncing
                </div>
             </div>
             
             {/* GLOBUS CONTAINER */}
             <div className="h-[28rem] bg-zinc-900/50 rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden group hover:border-blue-500/20 transition-all">
                <GeoRadarGlobe />
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 border border-white/5 rounded-full text-[8px] font-bold uppercase tracking-widest text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Klick auf Arcs für Daten-Intercept
                </div>
             </div>
          </div>

          {/* GLOBAL INTEL NODE */}
          <div className="bg-gradient-to-br from-blue-600/80 to-black p-8 rounded-[3rem] space-y-6 shadow-[0_25px_50px_rgba(37,99,235,0.1)] relative overflow-hidden group border border-blue-500/20">
            <div className="relative z-10 space-y-4">
              <h3 className="text-sm font-black uppercase italic tracking-widest text-white flex items-center gap-2">
                <RadioTower size={16} className="text-white animate-pulse" /> Global Intel Node
              </h3>
              
              <div className="space-y-3 pt-4">
                  {[
                    { kw: "Infrastructure Management", score: 98 },
                    { kw: "Field Operations NRW", score: 94 },
                    { kw: "AETHER OS Deployment", score: 88 }
                  ].map((item) => (
                    <div key={item.kw} className="bg-black/30 border border-white/5 p-5 rounded-2xl flex justify-between items-center group/item hover:bg-blue-600/10 hover:border-blue-500/20 transition-all duration-300">
                      <span className="text-[10px] font-mono text-white/80 uppercase tracking-tighter">{item.kw}</span>
                      <span className="text-xs font-black text-white italic">{item.score}%</span>
                    </div>
                  ))}
                </div>
            </div>
            <RadioTower className="absolute -bottom-4 -right-4 text-white/5 w-24 h-24 rotate-12 transition-transform group-hover:scale-110" />
          </div>

        </div>
      </div>
    </div>
  );
}