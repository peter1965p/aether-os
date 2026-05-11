/**
 * AETHER OS // CLIENT HYBRID LAYOUT
 * Konsolidierung von Sidebar, Nav und Content-Fluss.
 */

import React from "react";
import { db } from '@/lib/db';
import Sidebar from "@/components/admin/Sidebar";
import ClientNav from "@/components/navigation/client/ClientNav";
import SessionTimeout from "@/modules/auth/SessionTimeout";

export default async function ClientLayout({
                                               children,
                                           }: {
    children: React.ReactNode;
}) {
    // 1. Kontext-Daten für die Sidebar
    const { data: user } = await db
        .from('users')
        .select('settings, email')
        .eq('email', 'news24regional@gmail.com')
        .single();

    return (
        <div className="flex h-screen bg-[#020202] text-zinc-300 selection:bg-blue-500/30 overflow-hidden font-mono">

            {/* SESSION-SENTINEL: Passt im Hintergrund auf */}
            <SessionTimeout />

            {/* SIDEBAR: Jetzt mit Client-Flag für die spartanische Ansicht */}
            <Sidebar userSettings={user?.settings} isClient={true} />

            {/* MAIN INTERFACE STACK */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#020202] relative border-l border-white/[0.03]">

                {/* NAV: Fixiert am oberen Rand des Content-Bereichs */}
                <ClientNav email={user?.email} />

                {/* CONTENT AREA: Mit Padding für die fixed Nav (h-16) */}
                <main className="flex-1 overflow-y-auto pt-16 custom-scrollbar relative">

                    {/* AETHER ATMOSPHERE: Der blaue Engine-Glow */}
                    <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(29,78,216,0.07),transparent_50%)] z-0" />

                    <div className="relative z-10 p-8 lg:p-12 max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>

                {/* KERNEL FOOTER: Minimalistisch und Informatisch */}
                <footer className="h-8 flex items-center justify-center border-t border-white/[0.02] bg-[#050505] relative z-20">
                    <div className="flex items-center gap-4 text-[7px] font-black uppercase tracking-[0.6em] text-zinc-700">
                        <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                        AETHER OS // Customer Terminal Link Established // Status: Secure
                        <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                </footer>
            </div>
        </div>
    );
}