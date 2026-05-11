/**
 * src/components/navigation/frontend/Navbar.tsx
 */

import Link from "next/link";
import { Cpu, ChevronRight } from "lucide-react";
import { getGlobalSettings } from "@/lib/actions/settings.actions";
import { getActiveDspNodes } from "@/lib/actions/dsp.actions";
import db from "@/lib/db"; // Wichtig für den Cart-Fetch
import CartNavTrigger from "./CartNavTrigger";

export default async function Navbar() {
    // Daten parallel laden: Settings, Seiten UND Cart-Items
    const [config, dspNodes, cartData] = await Promise.all([
        getGlobalSettings(),
        getActiveDspNodes(),
        db.from("cart_items")
            .select("quantity")
            .eq("session_id", "SESSION_01") // Später durch dynamische Session/Auth ersetzen
    ]);

    // Summiere die Anzahl aller Artikel im Warenkorb
    const cartCount = cartData.data?.reduce((acc: any, item: { quantity: any; }) => acc + item.quantity, 0) || 0;

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
                    <span className="text-[8px] text-slate-400 font-bold tracking-[0.3em] uppercase">
                        {systemDesignation} V4.3.1 | PLATINIUM
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
                <Link href="/shop" className="text-[10px] text-blue-400 font-black tracking-[0.2em] hover:text-white uppercase">Store</Link>
                <Link href="/blog" className="text-[10px] text-blue-400 font-black tracking-[0.2em] hover:text-white uppercase">Aether Blog</Link>
            </div>

            {/* SYSTEM ACCESS & WARENKORB */}
            <div className="flex items-center gap-4">

                {/* DER CONRAD-TRIGGER */}
                <CartNavTrigger initialCount={cartCount} />

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
            </div>
        </nav>
    );
}