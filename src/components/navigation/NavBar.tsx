"use client";

import { useState, useEffect } from "react";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    User, LogOut, Settings, Cpu
} from "lucide-react";
import db from "@/lib/db";
import { handleLogout } from "@/modules/auth/actions";
import { getNavLinks } from "@/lib/actions/nav.actions";

// --- 1. SCHRITT: Interface erweitern ---
// Wir fügen userName hinzu, damit TypeScript weiß, dass dieser Prop erlaubt ist.
interface NavbarProps {
    session: boolean;
    userName: string;  // Neu hinzugefügt
    userEmail: string;
}

// --- 2. SCHRITT: Props im Funktionskopf aufnehmen ---
export default function NavBar({ session: initialSessionActive, userName, userEmail }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [dynamicLinks, setDynamicLinks] = useState<any[]>([]);

    // --- 3. SCHRITT: State mit den übergebenen Props initialisieren ---
    // Wir nutzen hier userName und userEmail für den initialen State
    const [user, setUser] = useState<any>(initialSessionActive ? {
        email: userEmail,
        user_metadata: { full_name: userName } // Speicherung im Metadaten-Format von Supabase
    } : null);

    const [loading, setLoading] = useState(true);

    const pathname = usePathname();
    const isBackend = pathname?.startsWith("/admin");

    // --- AUTH SYNC ---
    useEffect(() => {
        const sync = async () => {
            const { data: { session } } = await db.auth.getSession();
            if (session) setUser(session.user);
            setLoading(false);
        };
        sync();

        const { data: { subscription } } = db.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });
        return () => subscription.unsubscribe();
    }, []);

    // --- LINKS LADEN ---
    useEffect(() => {
        const loadLinks = async () => {
            const links = await getNavLinks();
            if (links) setDynamicLinks(links);
        };
        loadLinks();
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 h-20 bg-[#050505]/80 backdrop-blur-md border-b border-white/[0.03] z-[100] px-10 flex items-center justify-between font-mono">

            <div className="flex items-center gap-6 shrink-0">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className={`w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center ${isBackend ? 'border-orange-500' : 'border-blue-500'}`}>
                        <Cpu size={20} className={isBackend ? 'text-orange-500' : 'text-blue-500'} />
                    </div>
                    <p className="text-[18px] font-black text-white uppercase tracking-tighter">
                        AETHER <span className={isBackend ? 'text-orange-500' : 'text-blue-500'}>OS</span>
                    </p>
                </Link>
            </div>

            <div className="flex-1 flex justify-center max-w-2xl px-10">
                {!isBackend && (
                    <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                        {dynamicLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${pathname === link.href ? 'bg-blue-500 text-black' : 'text-zinc-500'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 shrink-0 justify-end min-w-[200px]">
                {loading ? (
                    <div className="w-4 h-4 border-2 border-white/10 border-t-white animate-spin rounded-full" />
                ) : user ? (
                    <div className="relative">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-4 bg-white/5 border border-white/10 pl-4 pr-3 py-2 rounded-2xl hover:bg-white/10 transition-all">
                            <div className="text-right hidden sm:block">
                                {/* Hier wird nun bevorzugt der userName genutzt */}
                                <p className="text-[10px] font-black text-white uppercase leading-none mb-1">
                                    {userName || (user.email?.split('@')[0] || "ADMIN")}
                                </p>
                                <p className="text-[7px] text-zinc-600 uppercase font-bold">Authorized</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-blue-500">
                                <User size={18} />
                            </div>
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-4 w-64 bg-[#0d0d0d] border border-white/10 rounded-2xl py-4 shadow-2xl">
                                <Link href="/admin/settings" className="flex items-center gap-4 px-8 py-3 text-zinc-400 hover:text-white transition-all text-[9px] font-bold uppercase">
                                    <Settings size={14} /> Settings
                                </Link>
                                <button onClick={() => handleLogout()} className="w-full flex items-center gap-4 px-8 py-3 text-red-500 hover:bg-red-500/10 transition-all text-[9px] font-bold uppercase">
                                    <LogOut size={14} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link href="/login" className="bg-blue-500 text-black px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}