/**
 * AETHER OS // CLIENT HYBRID LAYOUT
 * Trennt das Client-Dashboard strikt vom Frontend-Layout.
 */

import React from "react";
import { db } from '@/lib/db';
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/layout/backend/bar/Topbar";
import SessionTimeout from "@/modules/auth/SessionTimeout";

export default async function ClientLayout({
                                               children,
                                           }: {
    children: React.ReactNode;
}) {
    // 1. Daten holen (Hier laden wir spezifische Client-Settings)
    const { data: user } = await db
        .from('users')
        .select('settings')
        .eq('email', 'news24regional@gmail.com') // Deine hinterlegte E-Mail als Kontext
        .single();

    return (
        <div className="flex min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden">

            {/* 2. Sitzungsschutz: Logout nach 5 Min Inaktivität */}
            <SessionTimeout />

            {/* 3. Sidebar: Wir übergeben 'isClient', um Admin-Funktionen auszublenden */}
            <Sidebar userSettings={user?.settings} isClient={true} />

            {/* 4. Haupt-Content-Bereich */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#050505] relative">

                {/* Topbar: Jetzt auch im Client-Dashboard sichtbar */}
                <Topbar />

                {/* Scrollbarer Main-Bereich */}
                <main className="p-8 flex-1 overflow-y-auto custom-scrollbar relative z-10">
                    {/* Subtiler blauer Glow-Effekt für den Client-Kontext */}
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,#1d4ed8,transparent)] opacity-10" />

                    <div className="relative z-20">
                        {children}
                    </div>
                </main>

                {/* System-Footer */}
                <footer className="p-4 border-t border-white/5 bg-[#0a0a0a]/50 text-center">
                    <p className="text-[7px] text-zinc-600 font-black uppercase tracking-[0.5em]">
                        AETHER OS // Customer Terminal Link Established // Status: Secure
                    </p>
                </footer>
            </div>
        </div>
    );
}