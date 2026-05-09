/**
 * src/components/navigation/frontend/Navbar.tsx
 * Dokumentation: Zieht Branding aus 'settings' und Links aus 'pages'.
 */

import Link from "next/link";
import { Cpu, ChevronRight } from "lucide-react";
import { getGlobalSettings } from "@/lib/actions/settings.actions";
import { getActiveDspNodes } from "@/lib/actions/dsp.actions";

export default async function Navbar() {
    // Daten parallel laden
    const [config, dspNodes] = await Promise.all([
        getGlobalSettings(),
        getActiveDspNodes()
    ]);

    // Mapping basierend auf deiner 'settings' Tabelle
    const companyName = config?.company_name || "AETHER OS";
    const systemDesignation = config?.system_designation || "AETHER OS";
    const ownerName = config?.owner_name || "PAEFFGEN-IT";

    return (
        <nav className="fixed top-0 left-0 right-0 h-20 bg-[#050505]/90 backdrop-blur-md border-b border-white/5 z-[100] px-8 flex items-center justify-between font-mono">

            {/* BRANDING-SEKTOR */}
            <Link href="/" className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/30 rounded flex items-center justify-center group-hover:border-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                    <Cpu size={20} className="text-blue-500" />
                </div>
                <div className="flex flex-col text-left">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-black text-sm tracking-tighter uppercase italic">
                            {companyName} <span className="text-blue-500">//</span>
                        </span>
                        <span className="text-blue-400 font-bold text-[10px] tracking-[0.1em]">
                            {ownerName}
                        </span>
                    </div>
                    <span className="text-[8px] text-zinc-500 font-bold tracking-[0.3em] uppercase">
                        {systemDesignation} V4.3 | PLATINIUM
                    </span>
                </div>
            </Link>

            {/* DYNAMISCHE NAVIGATION */}
            <div className="hidden md:flex items-center gap-8">
                {dspNodes.map((node: any) => (
                    <Link
                        key={node.id}
                        href={node.virtual_path}
                        className="text-[10px] text-zinc-500 font-black tracking-[0.2em] hover:text-white transition-colors uppercase"
                    >
                        {node.name}
                    </Link>
                ))}

                {/* FESTE MODULE: Basierend auf deiner Logik */}
                <Link href="/shop" className="text-[10px] text-blue-400 font-black tracking-[0.2em] hover:text-white">STORE</Link>
                <Link href="/blog" className="text-[10px] text-blue-400 font-black tracking-[0.2em] hover:text-white">AETHER BLOG</Link>
            </div>

            {/* SYSTEM ACCESS */}
            <Link
                href="/admin"
                className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-blue-500/50 px-5 py-2 rounded-lg transition-all group"
            >
                <Cpu size={14} className="text-blue-500 group-hover:animate-pulse" />
                <span className="text-[10px] text-white font-black uppercase tracking-widest italic">
                    Login Kernel
                </span>
                <ChevronRight size={12} className="text-zinc-600 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
            </Link>
        </nav>
    );
}