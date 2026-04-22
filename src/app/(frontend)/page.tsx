import { Metadata } from "next";
import { 
  Wrench, Zap, Activity, MapPin, ShieldCheck, 
  ExternalLink, Box, Layers, Cpu
} from "lucide-react";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import { createClient } from "@/lib/db";
import { getGlobalMeta } from "@/lib/seo-bridge";
import VisitorTracker from "@/components/VisitorTracker";
import DSPPageView from "@/components/dsp/DSPPageView";
import AetherAssistant from "@/modules/ai/AetherAssistant";

/**
 * AETHER OS // DYNAMISCHE METADATEN (SEO & KI OPTIMIERUNG)
 */
export async function generateMetadata(): Promise<Metadata> {
  const meta = await getGlobalMeta();

  const title = meta?.seo_title_dynamic || "PAEFFGEN IT // AETHER OS - Next-Gen Infrastructure";
  const description = meta?.seo_desc_dynamic || "Spezialisiert auf hochperformante Dashboards und kritische Hardware-Infrastrukturen in NRW, RLP und Luxemburg.";

  return {
    title,
    description,
    keywords: meta?.keyword_cloud || ["IT Infrastructure", "Field Operations", "Next.js Development", "NRW", "AETHER OS"],
    authors: [{ name: "Peter Paeffgen" }],
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://paeffgen-it.de",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    robots: { index: true, follow: true },
    other: { "ai-agent-context": meta?.last_event_trigger || "Operational Mode" }
  };
}

export default async function HomePage() {
  const supabase = await createClient();

  /* --- 1. CMS LOGIC: Welche Seite ist als Landingpage markiert? --- */
  const { data: landingPage } = await supabase
    .from('pages')
    .select('*')
    .eq('is_landingpage', true)
    .single();

  /* --- 2. CORE DATA FETCH: Produkte --- */
  const { data: products } = await db
    .from("products")
    .select(`*, categories (name)`)
    .gt("stock", -1)
    .limit(3); 

  const formatPrice = (price: any) => {
    const numericPrice = typeof price === "string" 
      ? parseFloat(price.replace(/[^\d,.-]/g, "").replace(",", ".")) 
      : price;
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(numericPrice || 0);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "PAEFFGEN IT",
    "alternateName": "AETHER OS",
    "description": "Spezialist für Field Operations und Fullstack-Entwicklung.",
    "url": "https://paeffgen-it.de",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "NRW, RLP",
      "addressCountry": "DE"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <VisitorTracker />

      <div className="min-h-screen bg-[#05070a] text-white selection:bg-blue-500/30 font-mono">
        
        {/* SECTION 1: HERO (Globales Branding) */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-b border-white/5">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6 text-blue-500 font-mono text-[10px] uppercase tracking-[0.3em]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                SYSTEM: AETHER OS // STATUS: OPERATIV // 2026
              </div>
              <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] mb-4">
                PAEFFGEN IT <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400">
                  AETHER OS.
                </span>
              </h1>
              <p className="text-xl font-mono italic text-slate-400 tracking-tight">
                Next-Gen Infrastructure Management & Field Operations.
              </p>
            </div>

            <div className="max-w-md lg:text-right border-l lg:border-l-0 lg:border-r border-blue-600/30 pl-6 lg:pr-6 py-2">
              <p className="text-slate-500 text-[9px] uppercase leading-relaxed tracking-tighter">
                Spezialisiert auf hochperformante Dashboards und kritische Hardware-Infrastrukturen. Verbindung von über 25 Jahren Onsite-Expertise mit moderner Fullstack-Entwicklung.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: DYNAMISCHE SEKTOREN (Das CMS-Häkchen) */}
        {landingPage && (
          <div className="border-b border-white/5 bg-zinc-950/20">
            <DSPPageView id={landingPage.id} />
          </div>
        )}

        {/* SECTION 3: PRODUCT SHOWCASE */}
        <section id="aether-os" className="max-w-7xl mx-auto px-6 py-16 border-x border-white/5 bg-gradient-to-b from-blue-600/[0.03] to-transparent">
          <h2 className="text-sm font-mono font-bold uppercase text-blue-500 mb-12 tracking-[0.2em]">LATEST <span className="text-orange-500">Modules</span> // REGISTRY</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products?.map((p: any) => (
              <div key={p.id} className="bg-zinc-900/50 border border-white/5 p-8 rounded-sm hover:border-blue-500/50 transition-all group">
                 <div className="flex justify-between items-start mb-6">
                    <div className="text-blue-500 font-mono text-[10px]">@aether/{p.name.toLowerCase().replace(/\s+/g, "-")}</div>
                    <div className="text-[10px] text-slate-600">v3.1.0</div>
                 </div>
                 <h3 className="text-xl font-bold uppercase italic mb-4">{p.name}</h3>
                 <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-2">{p.description}</p>
                 <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <span className="text-blue-400 font-black tracking-tighter">{formatPrice(p.price)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-500 uppercase">Stock: {p.stock}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: TECH ARCHITECTURE */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-x border-white/5 bg-[#05070a]">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="w-full lg:w-1/3">
              <h2 className="text-3xl font-black italic uppercase mb-6 leading-none text-white">
                THE <span className="text-blue-600">ENGINE</span> <br/> BEHIND AETHER.
              </h2>
              <p className="text-slate-400 text-[10px] leading-relaxed uppercase">
                Vollständig modularer Aufbau basierend auf dem Next.js App-Router. Sicherheit durch serverseitige Validierung und Supabase-Integration.
              </p>
              <div className="border-t border-blue-600 rounded-bl-md pt-8">
                <AetherAssistant />
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
              {[
                { label: "Logic Layer", title: "Server Actions", desc: "Direkte DB-Interaktion via lib/actions für maximale Performance." },
                { label: "Security", title: "Middleware & Auth", desc: "Zentralisierte Route-Protection und Role-Based Access Control." },
                { label: "UI System", title: "Custom Components", desc: "Wiederverwendbare Komponenten wie FormRenderer für schnelle Skalierung." },
                { label: "Backend", title: "Supabase Cloud", desc: "PostgreSQL mit Realtime-Features für Live-Updates." }
              ].map((tech, i) => (
                <div key={i} className="bg-[#05070a] p-8 hover:bg-blue-600/[0.04] transition-colors border-r border-b border-white/5">
                  <span className="text-[9px] text-blue-500 tracking-[0.2em] uppercase">{tech.label}</span>
                  <h4 className="text-sm font-bold mt-2 mb-3 uppercase tracking-widest text-white">{tech.title}</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed italic">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: CORE COMPETENCIES */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 border-x border-t border-white/5 bg-[#05070a]">
          {[
            { icon: <Wrench size={24} />, title: "Field Operations", desc: "Hardware-Rollout und Lifecycle-Management für Enterprise-Flotten." },
            { icon: <Zap size={24} />, title: "Fullstack Development", desc: "Architektur moderner Web-Applikationen mit Fokus auf Performance." },
            { icon: <ShieldCheck size={24} />, title: "System Engineering", desc: "Entstörung kritischer Infrastrukturen für RWE, E.ON und Dell." }
          ].map((item, i) => (
            <div key={i} className="p-12 border-r border-b border-white/5 hover:bg-white/[0.02] transition-all group last:border-r-0">
              <div className="text-blue-500 mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">{item.title}</h3>
              <p className="text-slate-500 text-[11px] leading-relaxed uppercase tracking-tighter">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-white/5 text-center">
          <p className="text-zinc-800 text-[9px] uppercase tracking-[0.5em]">
            &copy; 2026 AETHER OS // DPS // PAEFFGEN-IT // ALL RIGHTS RESERVED
          </p>
        </footer>
      </div>
    </>
  );
}