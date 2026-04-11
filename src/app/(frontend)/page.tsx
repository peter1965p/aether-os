import { Metadata } from "next";
import { 
  Wrench, Zap, Activity, MapPin, ShieldCheck, 
  ExternalLink, Box, Layers 
} from "lucide-react";
import db from "@/lib/db";

/**
 * AETHER OS // DYNAMISCHE METADATEN (SEO & KI OPTIMIERUNG)
 * Diese Funktion sorgt dafür, dass Crawler und KIs immer die aktuellsten 
 * Meta-Informationen aus der Datenbank erhalten.
 */
export async function generateMetadata(): Promise<Metadata> {
  // Wir holen uns die SEO-Settings aus der DB (Tabelle: site_settings)
  const { data: seo } = await db
    .from("site_settings")
    .select("value")
    .eq("key", "homepage_seo")
    .single();

  const title = seo?.value?.title || "PAEFFGEN IT // AETHER OS - Next-Gen Infrastructure";
  const description = seo?.value?.description || "Spezialisiert auf hochperformante Dashboards und kritische Hardware-Infrastrukturen in NRW, RLP und Luxemburg.";

  return {
    title,
    description,
    keywords: seo?.value?.keywords || ["IT Infrastructure", "Field Operations", "Next.js Development", "NRW", "AETHER OS"],
    authors: [{ name: "Peter Paeffgen" }],
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://paeffgen-it.de", // Deine finale Domain hier
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function HomePage() {
  /* --- AETHER OS: CORE DATA FETCH --- */
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

  /**
   * JSON-LD SCHEMA (STRUKTURIERTE DATEN FÜR KI & GOOGLE)
   * Hiermit "füttern" wir KIs direkt mit Fakten über dein Unternehmen.
   */
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
    },
    "knowsAbout": ["IT Infrastructure", "Next.js", "Supabase", "Field Service Engineering"],
    "areaServed": ["NRW", "RLP", "Saarland", "Luxemburg"]
  };

  return (
    <>
      {/* Script-Tag für strukturierte Daten */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#05070a] text-white font-sans selection:bg-blue-500/30">
        
        {/* 1. HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-b border-white/5">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6 text-blue-500 font-mono text-[10px] uppercase tracking-[0.3em]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                SYSTEM: AETHER OS // STATUS: OPERATIV // READY 05/2026
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
              <p className="text-slate-500 font-mono text-[10px] uppercase leading-relaxed tracking-tighter">
                Spezialisiert auf hochperformante Dashboards und kritische Hardware-Infrastrukturen. Verbindung von über 25 Jahren Onsite-Expertise mit moderner Fullstack-Entwicklung.
              </p>
            </div>
          </div>
        </section>

        {/* 2. PRODUCT SHOWCASE */}
        <section id="aether-os" className="max-w-7xl mx-auto px-6 py-16 border-x border-white/5 bg-gradient-to-b from-blue-600/[0.03] to-transparent">
          <h2 className="text-sm font-mono font-bold uppercase text-blue-500 mb-12 tracking-[0.2em]">LATEST <span className="text-orange-500 uppercase">Modules</span> // REGISTRY</h2>
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

        {/* 3. TECH ARCHITECTURE */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-x border-white/5 bg-[#05070a]">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="w-full lg:w-1/3">
              <h2 className="text-3xl font-black italic uppercase mb-6 leading-none">
                THE <span className="text-blue-600">ENGINE</span> <br/> BEHIND AETHER.
              </h2>
              <p className="text-slate-400 font-mono text-[10px] leading-relaxed uppercase">
                Vollständig modularer Aufbau basierend auf dem Next.js App-Router. Sicherheit durch serverseitige Validierung und Supabase-Integration.
              </p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
              {[
                { label: "Logic Layer", title: "Server Actions", desc: "Direkte DB-Interaktion via lib/actions für maximale Performance ohne REST-Overhead." },
                { label: "Security", title: "Middleware & Auth", desc: "Zentralisierte Route-Protection und Role-Based Access Control (RBAC) über Next-Middleware." },
                { label: "UI System", title: "Custom Components", desc: "Wiederverwendbare Komponenten wie FormRenderer und Card für schnelle Skalierung." },
                { label: "Backend", title: "Supabase Cloud", desc: "PostgreSQL mit Realtime-Features für Live-Updates im Dashboard-Status." }
              ].map((tech, i) => (
                <div key={i} className="bg-[#05070a] p-8 hover:bg-blue-600/[0.04] transition-colors border-r border-b border-white/5">
                  <span className="text-[9px] font-mono text-blue-500 tracking-[0.2em] uppercase">{tech.label}</span>
                  <h4 className="text-sm font-bold mt-2 mb-3 uppercase tracking-widest">{tech.title}</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed italic">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. CORE COMPETENCIES */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 border-x border-t border-white/5 bg-[#05070a]">
          {[
            { icon: <Wrench size={24} />, title: "Field Operations", desc: "Präziser Hardware-Rollout, Lifecycle-Management und Vor-Ort-Instandsetzung für Enterprise-Flotten." },
            { icon: <Zap size={24} />, title: "Fullstack Development", desc: "Architektur moderner Web-Applikationen mit Next.js. Fokus auf Performance, Security und Realtime-Daten." },
            { icon: <ShieldCheck size={24} />, title: "System Engineering", desc: "Jahrzehntelange Erfahrung in der Entstörung kritischer Infrastrukturen (z.B. RWE, E.ON, Dell Technologies)." }
          ].map((item, i) => (
            <div key={i} className="p-12 border-r border-b border-white/5 hover:bg-white/[0.02] transition-all group last:border-r-0">
              <div className="text-blue-500 mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-widest mb-4">{item.title}</h3>
              <p className="text-slate-500 text-[11px] leading-relaxed uppercase tracking-tighter">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* 5. EXPERIENCE BAR */}
        <section className="bg-slate-950 py-10 overflow-hidden border-y border-blue-700/50">
          <div className="flex justify-around items-center opacity-20 grayscale contrast-125 font-black italic text-xl tracking-[0.2em] whitespace-nowrap animate-pulse">
            <span>HEMMERSBACH</span> <span className="text-blue-500">/</span>
            <span>DELL TECHNOLOGIES</span> <span className="text-blue-500">/</span>
            <span>RWE PROJECT</span> <span className="text-blue-500">/</span>
            <span>E.ON OPS</span> <span className="text-blue-500">/</span>
            <span>FIELD SERVICE</span>
          </div>
        </section>

        {/* 6. REGION & CONTACT */}
        <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row gap-16 items-center border-x border-white/5">
          <div className="flex-1">
            <h2 className="text-3xl font-black italic uppercase mb-8">SERVICE <span className="text-blue-600">REGIONS</span></h2>
            <div className="grid grid-cols-2 gap-3 font-mono text-[10px] text-slate-400">
              {["NRW", "RLP", "SAARLAND", "HESSEN", "LUXEMBURG"].map(region => (
                <div key={region} className="flex items-center gap-3 border border-white/5 p-4 rounded-sm bg-zinc-900/20 hover:border-blue-500/30 transition-colors">
                  <MapPin size={12} className="text-blue-500" /> {region} // ACTIVE ZONE
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 bg-blue-600/5 border border-blue-500/20 p-10 rounded-sm relative overflow-hidden bg-[#05070a]">
            <div className="absolute top-0 right-0 p-2 font-mono text-[8px] bg-blue-600 text-white uppercase italic tracking-widest">Available May 2026</div>
            <h3 className="text-xs font-mono font-bold uppercase mb-6 text-blue-500 tracking-widest">CURRENT STATUS // RECRUITING OPEN</h3>
            <p className="text-sm text-slate-300 leading-relaxed italic mb-8">"Nach erfolgreichem Abschluss der Onsite-Projekte für RWE & E.ON stehe ich ab Mai 2026 für neue Herausforderungen zur Verfügung."</p>
            <a href="/impressum" className="group flex items-center gap-3 font-mono text-[11px] text-white uppercase tracking-widest border-b border-blue-500 w-fit pb-2 hover:text-blue-400 transition-all">
              PROJEKT ANFRAGE SENDEN <ExternalLink size={12} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </section>      
      </div>
    </>
  );
}