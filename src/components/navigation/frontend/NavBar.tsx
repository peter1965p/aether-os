/**
 * src/components/navigation/frontend/Navbar.tsx
 * STATUS: FULLY_DYNAMIC // SESSION_SYNC_READY
 */

import Link from "next/link";
import { Cpu, ChevronRight, LayoutGrid, Zap } from "lucide-react";
import { getGlobalSettings } from "@/lib/actions/settings.actions";
import { getActiveDspNodes } from "@/lib/actions/dsp.actions";
import db from "@/lib/db";
import CartNavTrigger from "./CartNavTrigger";
import { cookies } from "next/headers"; // WICHTIG: Für den Cookie-Zugriff

export default async function Navbar() {
    // 1. Session ID aus den Cookies extrahieren
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("aether_session_id")?.value || "GUEST_SESSION";

    // 2. Daten parallel laden
    const [config, dspNodes, cartData] = await Promise.all([
        getGlobalSettings(),
        getActiveDspNodes(),
        db.from("cart_items")
            .select("quantity")
            .eq("session_id", sessionId) // <--- NUTZT JETZT DIE DYNAMISCHE ID
    ]);

    // 3. Gesamtanzahl berechnen (Summe der Quantities)
    const cartCount = cartData.data?.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) || 0;

    const companyName = config?.company_name || "AETHER OS";
    const systemDesignation = config?.system_designation || "AETHER OS";
    const ownerName = config?.owner_name || "PAEFFGEN-IT";

    return (
        <nav className="fixed top-0 left-0 right-0 h-24 bg-black/60 backdrop-blur-2xl border-b border-white/5 z-[100] px-10 flex items-center justify-between font-mono transition-all duration-500 overflow-hidden">

            {/* Scanline Effekt */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />

            {/* BRANDING-SEKTOR */}
            <Link href="/" className="flex items-center gap-5 group relative z-10">
                <div className="relative">
                    <div className="absolute -inset-2 bg-blue-600/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-black transition-all duration-500 shadow-2xl relative z-10">
                        <Cpu size={22} className="text-blue-500 group-hover:scale-110 transition-transform" />
                    </div>
                </div>

                <div className="flex flex-col text-left border-l border-white/10 pl-5">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-black text-base tracking-tighter uppercase italic group-hover:text-blue-400 transition-colors">
                            {companyName}
                        </span>
                        <span className="text-orange-600 font-black text-[10px] tracking-widest animate-pulse">
                            //
                        </span>
                    </div>
                    <span className="text-[9px] text-zinc-500 font-black tracking-[0.4em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                        {ownerName} <span className="text-blue-900">|</span> {systemDesignation}
                    </span>
                </div>
            </Link>

            {/* NAVIGATION: THE UPLINKS */}
            <div className="hidden lg:flex items-center gap-10 relative z-10">
                {dspNodes.map((node: any) => (
                    <Link
                        key={node.id}
                        href={node.virtual_path}
                        className="relative text-[10px] text-zinc-500 font-black tracking-[0.3em] hover:text-white transition-all uppercase group"
                    >
                        <span className="relative z-10">{node.name}</span>
                        <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 transition-all group-hover:w-full" />
                    </Link>
                ))}

                <div className="h-4 w-[1px] bg-white/10 mx-2" />

                <Link href="/shop" className="flex items-center gap-2 text-[10px] text-orange-500 font-black tracking-[0.3em] hover:text-orange-400 transition-all uppercase group">
                    <LayoutGrid size={12} className="group-hover:rotate-90 transition-transform duration-500" />
                    Store
                </Link>

                <Link href="/blog" className="flex items-center gap-2 text-[10px] text-blue-500 font-black tracking-[0.3em] hover:text-blue-400 transition-all uppercase group">
                    <Zap size={12} className="group-hover:animate-bounce" />
                    Feed
                </Link>
            </div>

            {/* ACTION-SEKTOR: TERMINAL ACCESS */}
            <div className="flex items-center gap-6 relative z-10">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-orange-600/10 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* Übergeben der berechneten Anzahl an die Client-Komponente */}
                    <CartNavTrigger initialCount={cartCount} />
                </div>

                <Link
                    href="/login"
                    className="relative flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl transition-all group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:animate-ping" />
                    <span className="text-[10px] text-white font-black uppercase tracking-[0.2em] italic">
                        Terminal_Access
                    </span>
                    <ChevronRight size={14} className="text-zinc-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </Link>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </nav>
    );
}