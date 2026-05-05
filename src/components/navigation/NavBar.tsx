/**
 * AETHER OS // UNIFIED INTELLIGENT NAVIGATION
 * Pfad: src/components/navigation/NavBar.tsx
 * Status: Finalized with Admin-Menu & Global Settings
 */

"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
    Search, LogOut, ChevronDown, SearchCode,
    Clock, User, Cpu, UserPlus, Settings
} from "lucide-react";
import { handleLogout } from "@/modules/auth/actions";
import TopBarAlerts from "@/components/layout/backend/bar/TopBarAlerts";

interface NavBarProps {
    session: boolean;
    userEmail?: string;
    userName?: string;
}

export default function NavBar({
                                   session,
                                   userEmail = "admin@aether-os.com",
                                   userName = "Admin Node_01"
                               }: NavBarProps) {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [timeLeft, setTimeLeft] = useState(300);
    const [mounted, setMounted] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const menuRef = useRef<HTMLDivElement>(null);

    // Hydration Guard zur Vermeidung von Server/Client Mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Schließt das Menü bei Klicks außerhalb der Komponente
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Kontext-Erkennung (Admin vs. Client vs. Public)
    const isBackend = useMemo(() => pathname?.startsWith("/admin") || pathname?.startsWith("/client"), [pathname]);
    const isClientMode = pathname?.startsWith("/client");
    const mode = isClientMode ? "client" : "admin";

    const accentColor = "text-blue-500";
    const logoBgColor = "bg-[#0d0d0d]";
    const cpuIconColor = "text-orange-600";

    const terminateSession = useCallback(async () => {
        setIsMenuOpen(false);
        await handleLogout();
    }, []);

    // Session Timer Logik: Reset bei Aktivität
    useEffect(() => {
        if (!session || !isBackend || !mounted) return;
        const resetTimer = () => setTimeLeft(300);
        const events = ["mousemove", "keydown", "click", "scroll"];
        events.forEach(event => window.addEventListener(event, resetTimer));
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => {
            clearInterval(timer);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [session, isBackend, mounted]);

    // Automatischer Logout nach Ablauf des Timers
    useEffect(() => {
        if (timeLeft === 0 && session && isBackend && mounted) terminateSession();
    }, [timeLeft, terminateSession, session, isBackend, mounted]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const initiateGlobalSearch = () => {
        if (searchQuery.trim().length > 1) {
            const safeQuery = encodeURIComponent(searchQuery.trim());
            router.push(`/${mode}/search?q=${safeQuery}`);
        }
    };

    if (!mounted) return <nav className="fixed top-0 left-0 right-0 z-[100] h-24 bg-[#050505] border-b border-white/5" />;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] border-b transition-all duration-500 
      ${isBackend ? 'h-24 bg-[#050505] border-white/[0.03]' : 'h-20 bg-black/60 backdrop-blur-xl border-white/5'}`}>

            <div className="h-full max-w-[1920px] mx-auto flex items-center justify-between px-8 gap-8">

                {/* LINKS: LOGO & BRANDING */}
                <Link href="/" className="flex items-center gap-4 group shrink-0">
                    <div className={`w-10 h-10 ${logoBgColor} border border-white/5 rounded flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.15)] group-hover:scale-110 transition-all`}>
                        <Cpu size={20} className={cpuIconColor} />
                    </div>
                    <div className="hidden lg:block">
                        <p className="text-[16px] font-black tracking-tighter text-white uppercase italic">
                            AETHER <span className="text-blue-500">OS</span>
                        </p>
                        <p className="text-[7px] font-mono text-gray-600 uppercase tracking-[0.3em] mt-0.5">
                            {isBackend ? `Node_${mode}_active` : 'System_Active'}
                        </p>
                    </div>
                </Link>

                {/* MITTE: UNIFIED SEARCH (Nur im Backend aktiv) */}
                {isBackend && (
                    <div className="relative group w-full max-w-xl flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
                        <div className="relative flex-1">
                            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700 group-focus-within:${accentColor}`} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && initiateGlobalSearch()}
                                placeholder={isClientMode ? "BESTELLUNGEN SCANNEN..." : "KUNDEN, PRODUKTE SCANNEN..."}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-14 pr-12 text-[9px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
                            />
                        </div>
                        <button onClick={initiateGlobalSearch} className="bg-zinc-900/50 hover:bg-zinc-800 text-zinc-600 border border-white/5 px-4 py-3 rounded-2xl transition-all">
                            <SearchCode size={14} />
                        </button>
                    </div>
                )}

                {/* RECHTS: STATUS & ADMIN ACCESS */}
                <div className="flex items-center gap-6 shrink-0">

                    {/* SYSTEM STATUS (Nur Backend) */}
                    {isBackend && (
                        <div className="hidden xl:flex items-center gap-4 border-r border-white/5 pr-6">
                            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${
                                timeLeft <= 30 ? "bg-red-500/10 border-red-500/50 text-red-500 animate-pulse" : "bg-zinc-900/50 border-white/5 text-zinc-600"
                            }`}>
                                <Clock size={12} />
                                <span className="text-[10px] font-mono font-bold tracking-widest">{formatTime(timeLeft)}</span>
                            </div>
                            <TopBarAlerts mode={mode} />
                        </div>
                    )}

                    {/* AUTH AREA & ADMIN DROPDOWN */}
                    <div className="flex items-center gap-3" ref={menuRef}>

                        {/* PERSISTENTE AUTH BUTTONS (Gemäß grafik_28.png) */}
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="flex items-center gap-3 bg-white/5 border border-white/5 px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all group">
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">Sign_In</span>
                                <User size={14} className="text-zinc-500 group-hover:text-blue-500" />
                            </Link>

                            <Link href="/register" className="hidden sm:flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 px-5 py-2.5 rounded-xl hover:bg-blue-600/20 transition-all group">
                                <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 group-hover:text-blue-300">Join_System</span>
                                <UserPlus size={14} className="text-blue-500" />
                            </Link>
                        </div>

                        {/* ADMIN DROPDOWN TRIGGER (Erscheint nur bei aktiver Session) */}
                        {session && (
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="ml-2 w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-blue-500 hover:border-blue-500/50 transition-all relative group"
                            >
                                <ChevronDown size={16} className={`transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`} />

                                {isMenuOpen && (
                                    <div className="absolute right-0 top-14 w-64 bg-[#0d0d0d] border border-white/5 rounded-2xl shadow-2xl py-3 z-[110] animate-in slide-in-from-top-2">
                                        <div className="px-6 py-3 border-b border-white/5 mb-2">
                                            <p className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.2em]">Logged as</p>
                                            <p className="text-[10px] font-black italic text-blue-500 truncate">{userEmail}</p>
                                        </div>

                                        {/* GLOBAL SETTINGS LINK */}
                                        <Link
                                            href="/admin/settings"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-4 px-6 py-3 text-zinc-400 hover:text-white hover:bg-white/5 transition-all group/item"
                                        >
                                            <Settings size={14} className="group-hover/item:rotate-90 transition-transform duration-500" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Global Settings</span>
                                        </Link>

                                        <div className="h-[1px] bg-white/5 my-2 mx-4" />

                                        {/* LOGOUT BUTTON */}
                                        <button
                                            onClick={terminateSession}
                                            className="w-full flex items-center gap-4 px-6 py-3 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all text-left"
                                        >
                                            <LogOut size={14} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Terminate Session</span>
                                        </button>
                                    </div>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}