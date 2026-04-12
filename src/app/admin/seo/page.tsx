import { 
  Radio, Search, ChevronRight, Activity, Database, Terminal, Settings, RadioTower, Globe as GlobeIcon
} from "lucide-react";
import db from "@/lib/db";
import { getGlobalMeta } from "@/lib/seo-bridge";
// WICHTIG: Wir importieren den WRAPPER, nicht die Lib direkt
import GeoRadarWrapper from "@/components/admin/GeoRadarWrapper";

export default async function SeoGeoIntelPage() {
  const meta = await getGlobalMeta();
  const { data: recentLogs } = await db
    .from("visitor_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div className="min-h-screen bg-[#05070a] text-white font-mono selection:bg-blue-500/30">
      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">AETHER OS // KERNEL</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-4 text-zinc-500 text-[9px] uppercase tracking-widest">
              <span>Admin</span>
              <ChevronRight size={10} />
              <span className="text-white">SEO & Geo Radar</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1800px] mx-auto p-10">
        <header className="mb-16">
          <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none mb-4">
            Mission <span className="text-blue-600">Control.</span>
          </h1>
          <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Zentralisierte Geo-Analytik & SEO Kernel Steuerung.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LINKS: SEO & LOGS */}
          <div className="lg:col-span-8 space-y-12">
            <section className="bg-zinc-950/40 border border-white/5 p-10 rounded-[3.5rem] relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-sm font-black uppercase tracking-widest mb-10">SEO Master Registry</h2>
                <div className="space-y-8">
                  <div className="bg-black/40 border border-white/5 p-6 rounded-3xl">
                    <span className="text-lg font-bold italic">{meta?.seo_title_dynamic || "AETHER OS // INFRASTRUCTURE"}</span>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-6 rounded-3xl">
                    <p className="text-sm text-zinc-400 italic">{meta?.ai_context_briefing || "KI-Kontext bereit..."}</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-zinc-950/40 border border-white/5 p-10 rounded-[3.5rem]">
                <h3 className="text-xs font-black uppercase mb-8">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {meta?.keyword_cloud?.map((kw: string) => (
                    <span key={kw} className="bg-blue-600/10 border border-blue-500/20 px-3 py-1 rounded-xl text-[10px] text-blue-400 font-bold">{kw}</span>
                  ))}
                </div>
              </div>
              <div className="bg-zinc-950/40 border border-white/5 p-10 rounded-[3.5rem]">
                <h3 className="text-xs font-black uppercase mb-8">Recent Ingest</h3>
                {recentLogs?.map((log: any) => (
                  <div key={log.id} className="flex justify-between text-[9px] border-b border-white/5 py-2">
                    <span className="text-blue-500">{log.page_path}</span>
                    <span className="text-zinc-600">{new Date(log.created_at).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RECHTS: GLOBE */}
          <div className="lg:col-span-4 space-y-12">
            <div className="bg-zinc-950/60 border border-white/5 p-10 rounded-[4rem]">
              <h2 className="text-xs font-black uppercase mb-10 flex items-center gap-2">
                <Radio size={16} className="text-blue-600 animate-pulse" /> Live Geo Radar
              </h2>
              <div className="w-full h-[32rem] bg-zinc-900/30 rounded-[3rem] border border-white/5 relative overflow-hidden shadow-inner">
                {/* HIER NUTZEN WIR DEN WRAPPER */}
                <GeoRadarWrapper />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-700 to-indigo-900 p-10 rounded-[4rem] relative overflow-hidden group">
              <h3 className="text-lg font-black italic uppercase text-white flex items-center gap-3 mb-8">
                <RadioTower size={24} className="animate-bounce" /> Intel Hub
              </h3>
              <div className="space-y-4 relative z-10">
                <div className="bg-black/30 p-5 rounded-3xl border border-white/10 flex justify-between">
                  <span className="text-[10px] font-bold uppercase text-white/70">Stability</span>
                  <span className="text-xs font-black text-white italic">Optimal</span>
                </div>
              </div>
              <GlobeIcon size={200} className="absolute -bottom-10 -right-10 opacity-10 rotate-12" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}