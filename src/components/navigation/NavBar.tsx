/**
 * AETHER OS // UNIFIED INTELLIGENT NAVIGATION
 * Pfad: src/components/navigation/NavBar.tsx
 */

"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
    Search, LogOut, ChevronDown, SearchCode,
    Clock, User, Cpu, UserPlus
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

    // Hydration Guard
    useEffect(() => {
        setMounted(true);
    }, []);

    // Kontext-Erkennung
    const isBackend = useMemo(() => pathname?.startsWith("/admin") || pathname?.startsWith("/client"), [pathname]);
    const isClientMode = pathname?.startsWith("/client");
    const mode = isClientMode ? "client" : "admin";

    // ---------------------------------------------------------
    // --- FARB-MARKER: DYNAMISCHE STYLING-VARIABLEN ---
    // ---------------------------------------------------------
    const accentColor = isClientMode ? "text-blue-900" : "text-blue-900"; // Akzentfarbe (Client vs Admin)
    const logoBgColor = isBackend ? "bg-slate-900" : "bg-slate-900";    // Hintergrund des Logo-Icons
    const cpuIconColor = "text-orange-600";                             // CPU Icon Farbe (Immer Orange)
    // ---------------------------------------------------------

    const terminateSession = useCallback(async () => {
        setIsMenuOpen(false);
        await handleLogout();
    }, []);

    // Session Timer Logik
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

    if (!mounted) return <nav className="fixed top-0 left-0 right-0 z-[100] h-20 bg-black/60 border-b border-white/5" />;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] border-b transition-all duration-500 
      ${isBackend ? 'h-24 bg-[#050505] border-white/[0.03]' : 'h-20 bg-black/60 backdrop-blur-xl border-white/5'}`}>

            <div className="h-full max-w-[1800px] mx-auto flex items-center justify-between px-8 gap-8">

                {/* LINKS: LOGO & BRANDING */}
                <Link href="/" className="flex items-center gap-4 group shrink-0">
                    {/* --- FARB-MARKER: LOGO ICON CONTAINER --- */}
                    <div className={`w-10 h-10 ${logoBgColor} rounded flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.3)] group-hover:scale-110 transition-all`}>
                        <Cpu size={20} className={cpuIconColor} />
                    </div>
                    <div className="hidden lg:block">
                        <p className="text-[16px]  tracking-tighter text-orange-600 uppercase">
                            AETHER <span className={isBackend ? accentColor : "text-blue-900"}>OS</span>
                        </p>
                        <p className="text-[8px] font-mono text-green-800 uppercase tracking-widest mt-1">
                            {isBackend ? `Node ${mode} active` : 'System Active'}
                        </p>
                    </div>
                </Link>

                {/* MITTE: NAVIGATION / SUCHE */}
                {isBackend ? (
                    <div className="relative group w-full max-w-xl flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
                        <div className="relative flex-1">
                            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:${accentColor}`} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && initiateGlobalSearch()}
                                placeholder={isClientMode ? "BESTELLUNGEN SCANNEN..." : "KUNDEN, PRODUKTE SCANNEN..."}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-14 pr-12 text-[9px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-white/20 transition-all"
                            />
                        </div>
                        <button onClick={initiateGlobalSearch} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-white/5 px-4 py-3 rounded-2xl transition-all">
                            <SearchCode size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="hidden md:flex items-center gap-8">
                        {['Home', 'Blog', 'Shop', 'Impressum'].map((item) => (
                            <Link key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                  className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">
                                {item}
                            </Link>
                        ))}
                    </div>
                )}

                {/* RECHTS: AUTH & STATUS */}
                <div className="flex items-center gap-4 shrink-0">
                    {isBackend && (
                        <div className="hidden sm:flex items-center gap-6 border-r border-white/5 pr-6">
                            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${
                                timeLeft <= 30 ? "bg-red-500/10 border-red-500/50 text-red-500 animate-pulse" : "bg-zinc-900/50 border-white/5 text-zinc-500"
                            }`}>
                                <Clock size={12} />
                                <span className="text-[10px] font-mono font-bold">{formatTime(timeLeft)}</span>
                            </div>
                            <TopBarAlerts mode={mode} />
                        </div>
                    )}

                    <div className="relative" ref={menuRef}>
                        {session ? (
                            /* EINGELOGGT: USER MENU */
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-4 group bg-white/5 border border-white/5 pl-4 pr-2 py-2 rounded-2xl hover:bg-white/10 transition-all">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black uppercase text-orange-600">{userName}</p>
                                    <p className={`text-[7px] font-bold uppercase tracking-widest ${isBackend ? accentColor : 'text-green-800'}`}>
                                        {isBackend ? (isClientMode ? "Authorized Client" : "Master Access") : "Active Session"}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-[11px] font-black italic text-zinc-400">
                                    {userName.charAt(0)}
                                </div>
                                <ChevronDown size={12} className={`text-zinc-600 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
                            </button>
                        ) : (
                            /* NICHT EINGELOGGT: LOGIN & REGISTER */
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="flex items-center gap-3 bg-white/5 border border-white/5 px-5 py-2.5 rounded-2xl hover:bg-white/10 transition-all group">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">Sign_In</span>
                                    <User size={14} className="text-zinc-500 group-hover:text-blue-500" />
                                </Link>
                                {/* --- FARB-MARKER: REGISTER BUTTON (JOIN SYSTEM) --- */}
                                <Link href="/register" className="hidden sm:flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 px-5 py-2.5 rounded-2xl hover:bg-blue-600/20 transition-all group">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 group-hover:text-blue-300">Join_System</span>
                                    <UserPlus size={14} className="text-blue-500" />
                                </Link>
                            </div>
                        )}

                        {/* DROPDOWN */}
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-4 w-64 bg-[#0d0d0d] border border-white/5 rounded-2xl shadow-2xl py-2 z-[110] animate-in slide-in-from-top-2">
                                <div className="px-6 py-3 border-b border-white/5 mb-1">
                                    <p className="text-[7px] font-black text-zinc-600 uppercase">Network Identity</p>
                                    <p className={`text-[10px] font-black italic truncate ${isBackend ? accentColor : 'text-blue-400'}`}>{userEmail}</p>
                                </div>
                                <button onClick={terminateSession} className="w-full flex items-center gap-4 px-6 py-3 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all text-left">
                                    <LogOut size={14} />
                                    <span className="text-[9px] font-black uppercase">Terminate Session</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}