/**
 * AETHER OS // CORE FRONT-END DISPATCHER
 * Standort: /src/app/(frontend)/page.tsx
 */

import { Metadata } from "next";
import {
    Wrench, Zap, ShieldCheck
} from "lucide-react";
import db, { createClient } from "@/lib/db";
import { getGlobalMeta } from "@/lib/seo-bridge";
import VisitorTracker from "@/components/VisitorTracker";
import DSPPageView from "@/components/dsp/DSPPageView";
import AetherAssistant from "@/modules/ai/AetherAssistant";

// SEO Metadata Engine
export async function generateMetadata(): Promise<Metadata> {
    const meta = await getGlobalMeta();
    const title = meta?.seo_title_dynamic || "PAEFFGEN IT // AETHER OS";
    const description = meta?.seo_desc_dynamic || "Next-Gen Infrastructure Management.";

    return {
        title,
        description,
        robots: { index: true, follow: true },
    };
}

export default async function RootHomePage() {
    const supabase = await createClient();

    /* --- 1. CMS LOGIC: Prüfung auf aktive Landingpage --- */
    const { data: landingPage } = await supabase
        .from('pages')
        .select('*')
        .eq('is_landingpage', true)
        .single();

    /* --- 2. FALLBACK DATA: Falls die Standard-Seite angezeigt wird --- */
    const { data: products } = await db
        .from("products")
        .select(`*, categories (name)`)
        .gt("stock", -1)
        .limit(3);

    const formatPrice = (price: any) => {
        return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price || 0);
    };

    return (
        <>
            <VisitorTracker />
            <div className="min-h-screen bg-[#05070a] text-white font-mono">

                {/* WEICHE: Wenn im Admin eine Seite aktiviert wurde, wird NUR der DSP-Content geladen */}
                {landingPage ? (
                    <section className="animate-in fade-in duration-1000">
                        {/* Hier wird der im Admin gestaltete Inhalt gerendert */}
                        <DSPPageView id={landingPage.id} />
                    </section>
                ) : (
                    /* --- START FALLBACK LANDINGPAGE (Dein Marketing-Design) --- */
                    <>
                        {/* HERO SECTION */}
                        <section className="max-w-7xl mx-auto px-6 py-24 border-b border-white/5">
                            <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-6 text-blue-500 text-[10px] uppercase tracking-[0.3em]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                                        SYSTEM: AETHER OS // DEFAULT_MARKETING_MODE
                                    </div>
                                    <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] mb-4">
                                        PAEFFGEN IT <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400">
                      AETHER OS.
                    </span>
                                    </h1>
                                </div>
                            </div>
                        </section>

                        {/* PRODUCT SHOWCASE */}
                        <section className="max-w-7xl mx-auto px-6 py-16 border-x border-white/5 bg-gradient-to-b from-blue-600/[0.03] to-transparent">
                            <h2 className="text-sm font-bold uppercase text-blue-500 mb-12 tracking-[0.2em]">LATEST Modules</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {products?.map((p: any) => (
                                    <div key={p.id} className="bg-zinc-900/50 border border-white/5 p-8 rounded-sm hover:border-blue-500/50 transition-all">
                                        <h3 className="text-xl font-bold uppercase italic mb-4">{p.name}</h3>
                                        <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                            <span className="text-blue-400 font-black tracking-tighter">{formatPrice(p.price)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* TECH & COMPETENCIES SECTION */}
                        <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 border-x border-t border-white/5">
                            {[
                                { icon: <Wrench size={24} />, title: "Field Operations" },
                                { icon: <Zap size={24} />, title: "Fullstack Development" },
                                { icon: <ShieldCheck size={24} />, title: "System Engineering" }
                            ].map((item, i) => (
                                <div key={i} className="p-12 border-r border-b border-white/5 hover:bg-white/[0.02] transition-all group">
                                    <div className="text-blue-500 mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4">{item.title}</h3>
                                </div>
                            ))}
                        </section>

                        {/* ASSISTANT LAYER */}
                        <div className="max-w-7xl mx-auto p-12 border-x border-white/5">
                            <AetherAssistant />
                        </div>
                    </>
                    /* --- ENDE FALLBACK LANDINGPAGE --- */
                )}

                <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-white/5 text-center">
                    <p className="text-zinc-800 text-[9px] uppercase tracking-[0.5em]">
                        &copy; 2026 AETHER OS // PAEFFGEN-IT
                    </p>
                </footer>
            </div>
        </>
    );
}