import { Metadata } from "next";
import Image from "next/image";
import {
    Activity, Globe, Cpu, Layers, ArrowUpRight, Command, Shield
} from "lucide-react";
import db, { createClient } from "@/lib/db";
import { getGlobalMeta } from "@/lib/seo-bridge";
import { getSystemMetrics, getRegistredUsers, getAccountingStats } from "@/modules/inventory/actions";
import VisitorTracker from "@/components/VisitorTracker";
import DSPPageView from "@/components/dsp/DSPPageView";
import AetherAssistant from "@/modules/ai/AetherAssistant";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
    const meta = await getGlobalMeta();
    return {
        title: "AETHER OS // UNIFIED ECONOMIC INTELLIGENCE",
        description: "The end of legacy licensing. Unified infrastructure for global commerce.",
        robots: { index: true, follow: true },
    };
}

export default async function RootHomePage() {
    const supabase = await createClient();

    const [system, users, stats, { data: landingPage }, { data: modules }] = await Promise.all([
        getSystemMetrics(),
        getRegistredUsers(),
        getAccountingStats(),
        supabase.from('pages').select('*').eq('is_landingpage', true).single(),
        db.from("products").select(`*, categories (name)`).limit(4)
    ]);

    const marketPulse = system.stats.find(s => s.label === 'Market Pulse')?.value || "0%";

    return (
        <>
            <VisitorTracker />
            <div className="min-h-screen bg-[#020406] text-zinc-300 font-mono selection:bg-blue-500/30 scroll-smooth w-full overflow-x-hidden">

                {/* --- GLOBAL STATUS BAR (PERMANENT UPLINK) --- */}
                <div className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-2 flex justify-between items-center text-[10px] tracking-[0.3em] uppercase text-zinc-500">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-blue-500 font-black">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            KERNEL_ACTIVE // V16.1.6
                        </div>
                    </div>
                    <div className="flex gap-8 italic font-bold">
                        <span className="hidden md:inline text-zinc-700 tracking-tighter">NODE_SYNC: 100%</span>
                        <span className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">LATENCY: {system.responseTime}</span>
                    </div>
                </div>

                {landingPage ? (
                    <section className="pt-12"><DSPPageView id={landingPage.id} /></section>
                ) : (
                    <main className="w-full">

                        {/* --- HERO SECTION: THE UNIVERSE CALLING (EDGE-TO-EDGE) --- */}
                        <section className="relative w-screen left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] min-h-screen flex items-center justify-center overflow-hidden bg-black">

                            {/* DYNAMIC BACKGROUND LAYER */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src="/images/aether-header.png"
                                    alt="Aether OS Cosmic Interface"
                                    fill
                                    priority
                                    className="object-cover opacity-80 select-none scale-105 transition-transform duration-[20s] animate-pulse"
                                />
                                {/* High-End Gradients for depth */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#020406_100%)] opacity-90"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-[#020406] via-transparent to-[#020406] opacity-100"></div>
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                            </div>

                            {/* CORE CONTENT UNIT */}
                            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 text-center">
                                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-orange-500/30 bg-black/60 backdrop-blur-2xl text-orange-500 text-[10px] tracking-[0.5em] uppercase mb-16 animate-pulse shadow-[0_0_40px_rgba(234,88,12,0.1)]">
                                    <Shield size={14} /> Neural_Link_Established
                                </div>

                                {/* --- THE ULTRA-TECH LOGO (BILD 2 LOOK) --- */}
                                <div className="relative mb-20 group">
                                    <h1 className="text-[6rem] md:text-[14rem] font-black tracking-[-0.08em] leading-none select-none flex flex-wrap justify-center items-center">
                                        {/* AETHER: Chrome-Reflektionseffekt */}
                                        <span className="relative bg-gradient-to-b from-orange-200 via-orange-500 to-orange-950 bg-clip-text text-transparent drop-shadow-[0_0_70px_rgba(234,88,12,0.5)] uppercase transition-all duration-1000 group-hover:tracking-normal">
                                            Aether
                                        </span>
                                        {/* OS: Deep-Space Blue Italic */}
                                        <span className="relative ml-6 italic bg-gradient-to-br from-blue-400 via-blue-600 to-blue-950 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(30,58,138,0.6)]">
                                            OS
                                        </span>
                                    </h1>
                                    <div className="mt-6">
                                        <p className="text-blue-400/40 font-mono text-[11px] tracking-[1.8em] uppercase italic opacity-60">
                                            Unified_Enterprise_Protocol_2026
                                        </p>
                                    </div>
                                </div>

                                <p className="max-w-3xl mx-auto text-xl md:text-2xl text-zinc-300 font-light italic tracking-[0.15em] opacity-80 uppercase mb-16 leading-relaxed">
                                    Die Revolution der globalen Wertschöpfung.
                                    <span className="block mt-4 text-orange-600 font-black font-mono text-xs tracking-[0.6em] not-italic">NO_LEGACY // ONLY_RESULTS</span>
                                </p>

                                <div className="flex flex-wrap justify-center gap-10 relative z-30">
                                    <Link href="/login" className="group">
                                        <button className="px-16 py-7 bg-orange-600 text-white text-[13px] font-black uppercase tracking-[0.5em] hover:bg-orange-500 transition-all border border-orange-400 shadow-[0_0_60px_rgba(234,88,12,0.4)] relative overflow-hidden group-hover:scale-105">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                            <span className="relative z-10 flex items-center gap-4">
                                                Establish Uplink <ArrowUpRight size={22} />
                                            </span>
                                        </button>
                                    </Link>
                                    <a href="#specs" className="group">
                                        <button className="px-16 py-7 bg-transparent backdrop-blur-xl border border-blue-500/30 text-blue-400 text-[13px] font-black uppercase tracking-[0.5em] hover:bg-blue-500/10 transition-all hover:border-blue-400">
                                            Core Specifications
                                        </button>
                                    </a>
                                </div>
                            </div>

                            {/* Decorative Scroll Indicator */}
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
                                <div className="w-[1px] h-20 bg-gradient-to-b from-blue-500 to-transparent"></div>
                            </div>
                        </section>

                        {/* --- CONTENT HUB: GRID SYSTSEM --- */}
                        <div className="max-w-7xl mx-auto px-6">

                            {/* MODULE NODES */}
                            <section className="grid grid-cols-1 md:grid-cols-4 border-x border-b border-white/5 bg-white/[0.01]">
                                {modules?.map((m: any) => (
                                    <div key={m.id} className="p-12 border-r border-white/5 last:border-r-0 group hover:bg-orange-600/[0.03] transition-all relative overflow-hidden">
                                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-orange-600 transition-all duration-700 group-hover:w-full shadow-[0_0_15px_#ea580c]"></div>
                                        <div className="flex justify-between items-start mb-12">
                                            <div className="p-3 border border-blue-500/20 group-hover:border-orange-500/50 transition-colors">
                                                <Layers className="text-blue-500 group-hover:text-orange-500" />
                                            </div>
                                            <span className="text-[10px] text-zinc-700 font-mono italic font-bold">NODE_{String(m.id).padStart(3, '0')}</span>
                                        </div>
                                        <h3 className="text-white font-black uppercase tracking-widest mb-4 italic text-sm group-hover:text-orange-500 transition-colors">{m.name}</h3>
                                        <div className="text-blue-400 font-mono font-bold text-xs bg-blue-500/5 inline-block px-3 py-1.5 border border-blue-500/10">
                                            {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(m.price)}
                                        </div>
                                    </div>
                                ))}
                            </section>

                            {/* SPECIFICATIONS & LIVE FEED */}
                            <section id="specs" className="py-48 border-x border-white/5 scroll-mt-24">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                                    <div className="space-y-20">
                                        <div className="space-y-4">
                                            <h2 className="text-[10px] text-blue-500 font-black tracking-[0.8em] uppercase italic">Intelligence_Briefing</h2>
                                            <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Global Economic <span className="text-orange-600">Sentinel</span></h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Registered_Nodes</p>
                                                <p className="text-7xl font-black italic text-white tracking-tighter">{users?.length || 0}</p>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Market_Cap_Index</p>
                                                <p className="text-4xl font-black italic text-orange-600 tracking-tighter">
                                                    {stats.totalSales.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TERMINAL UI (Hologram Style) */}
                                    <div className="relative">
                                        <div className="absolute -inset-4 bg-blue-500/5 blur-3xl rounded-full"></div>
                                        <div className="relative bg-[#050505] border border-white/10 p-12 font-mono text-[11px] text-blue-400 shadow-2xl overflow-hidden">
                                            <div className="absolute top-0 right-0 p-3 text-[8px] text-zinc-800 font-black">SYS_LOG_V16</div>
                                            <div className="flex justify-between border-b border-white/10 pb-8 mb-10 uppercase font-black tracking-[0.3em]">
                                                <span className="flex items-center gap-3 text-blue-500">
                                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_#3b82f6]"></div>
                                                    Kernel_Output
                                                </span>
                                                <span className="text-zinc-700 italic tracking-tighter text-[9px]">Uplink: Secure</span>
                                            </div>
                                            <div className="space-y-5 text-zinc-400 font-bold italic">
                                                <p className="text-zinc-600">&gt; Initializing Aether_Protocol...</p>
                                                <p className="flex justify-between"><span>&gt; Latency:</span> <span className="text-blue-500">{system.responseTime}</span></p>
                                                <p className="flex justify-between"><span>&gt; Market_Pulse:</span> <span className="text-orange-600">{marketPulse}</span></p>
                                                <p className="flex justify-between text-green-600/70"><span>&gt; Security_Layer:</span> <span>Active_AES_256</span></p>

                                                <div className="pt-10">
                                                    <div className="flex justify-between text-[9px] mb-2 text-zinc-700">
                                                        <span>Processing_Power</span>
                                                        <span>{marketPulse}</span>
                                                    </div>
                                                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                                                        <div className="bg-gradient-to-r from-orange-600 to-orange-400 h-full shadow-[0_0_20px_#ea580c] transition-all duration-[2s]" style={{ width: marketPulse }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="border-x border-white/5 py-24 px-12 bg-gradient-to-b from-transparent to-orange-600/[0.02]">
                                <AetherAssistant />
                            </div>
                        </div>

                        {/* --- FOOTER: ENTERPRISE FINAL --- */}
                        <footer className="w-full py-40 border-t border-white/5 bg-black/60 relative overflow-hidden">
                            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
                                <div className="text-[14px] font-black uppercase tracking-[0.8em] italic opacity-50 hover:opacity-100 transition-opacity cursor-default">
                                    <span className="text-orange-600">Aether</span> OS // PAEFFGEN-IT © 2026
                                </div>
                                <div className="flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">
                                    <span className="hover:text-blue-500 transition-colors cursor-pointer">Protocol_Logs</span>
                                    <span className="hover:text-blue-500 transition-colors cursor-pointer">Security_Vault</span>
                                    <span className="hover:text-blue-500 transition-colors cursor-pointer">Identity_Node</span>
                                </div>
                            </div>
                        </footer>
                    </main>
                )}
            </div>
        </>
    );
}