/**
 * AETHER OS // PROFILE_SYSTEM_LAYOUT
 * Konsolidierung von Identitäts-Daten und System-Navigation.
 */

import React from "react";
import { db } from '@/lib/db';
import { cookies } from "next/headers";
import Sidebar from "@/components/admin/Sidebar";
import ClientNav from "@/components/navigation/client/ClientNav";

export default async function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Session-Context & ID-Uplink
    const cookieStore = await cookies();
    const customerId = cookieStore.get("aether_customer_id")?.value;

    // 2. User-Daten für Sidebar & Nav
    const { data: user } = await db
        .from('users')
        .select('settings, email')
        .eq('email', 'news24regional@gmail.com')
        .single();

    return (
        <div className="flex h-screen bg-[#020202] text-zinc-300 selection:bg-blue-500/30 overflow-hidden font-mono">
            
            {/* CORE SIDEBAR: Bleibt im Client-Modus persistent */}
            <Sidebar userSettings={user?.settings} isClient={true} />

            {/* INTERFACE LAYER */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#020202] relative border-l border-white/[0.03]">

                {/* GLOBAL CLIENT NAV: Hält den Session-Timer aktiv */}
                <ClientNav email={user?.email} customerId={customerId} />

                {/* SCROLLABLE IDENTITY CONTENT */}
                <main className="flex-1 overflow-y-auto pt-16 custom-scrollbar relative">
                    
                    {/* AETHER ATMOSPHERE: Der dezente Identity-Glow */}
                    <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(29,78,216,0.03),transparent_70%)] z-0" />

                    <div className="relative z-10 p-8 lg:p-12 max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>

                {/* KERNEL FOOTER: Identitäts-Verschlüsselung Status */}
                <footer className="h-8 flex items-center justify-center border-t border-white/[0.02] bg-[#050505] relative z-20">
                    <div className="flex items-center gap-4 text-[7px] font-black uppercase tracking-[0.6em] text-zinc-700">
                        <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                        AETHER OS // IDENTITY_NODE_LINKED // STATUS: ENCRYPTED
                        <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                </footer>
            </div>
        </div>
    );
}