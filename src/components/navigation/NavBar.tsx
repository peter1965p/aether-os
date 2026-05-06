/**
 * AETHER OS // UNIFIED NAV-KERNEL V4.2.5
 * Status: TYPESCRIPT_STRICT_COMPLIANT
 * Fix: Behebt TS7006, TS6192 und ignorierte Promises.
 */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
// Importe werden jetzt aktiv in den Typzuweisungen genutzt
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ChevronDown, LogOut, Settings, Cpu, Search, AlertTriangle } from "lucide-react";
import db from "@/lib/db";
import { handleLogout } from "@/modules/auth/actions";

interface NavbarProps {
    session: boolean;
    userName: string;
    userEmail: string;
}

export default function NavBar({ session: initialSessionActive, userName, userEmail }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(initialSessionActive ? { email: userEmail } : null);
    const [loading, setLoading] = useState(!initialSessionActive);
    const pathname = usePathname();

    const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const countdownRef = useRef<NodeJS.Timeout | null>(null);

    const isBackend = pathname?.startsWith("/admin");

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog" },
        { name: "Shop", href: "/shop" },
        { name: "Impressum", href: "/impressum" },
    ];

    const startTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
        setShowTimeoutWarning(false);
        setCountdown(30);

        timerRef.current = setTimeout(() => {
            setShowTimeoutWarning(true);
            startCountdown();
        }, 300000);
    }, []);

    const startCountdown = () => {
        countdownRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    if (countdownRef.current) clearInterval(countdownRef.current);
                    void handleLogout(); // void markiert das Promise als bewusst ignoriert
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        const handleActivity = () => { if (!showTimeoutWarning) startTimer(); };
        if (user || initialSessionActive) {
            window.addEventListener("mousemove", handleActivity);
            window.addEventListener("keydown", handleActivity);
            startTimer();
        }
        return () => {
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("keydown", handleActivity);
            if (timerRef.current) clearTimeout(timerRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, [user, initialSessionActive, showTimeoutWarning, startTimer]);

    useEffect(() => {
        // initAuth als async Funktion innerhalb von useEffect
        const initAuth = async () => {
            try {
                const { data: { user: currentUser } } = await db.auth.getUser();
                if (currentUser) setUser(currentUser);
            } catch (error) {
                console.error("AETHER AUTH ERROR:", error);
            } finally {
                setLoading(false);
            }
        };

        // Der Aufruf wird mit void markiert, um TS-Fehler zu vermeiden
        void initAuth();

        // Explizite Typisierung der Parameter für onAuthStateChange
        const { data: { subscription } } = db.auth.onAuthStateChange(
            (_event: AuthChangeEvent, session: Session | null) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => { setIsMenuOpen(false); }, [pathname]);

    return (
        <>
            {showTimeoutWarning && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999] flex items-center justify-center p-4 text-white">
                    <div className="bg-[#0d0d0d] border border-red-500/30 p-8 rounded-2xl max-w-sm w-full text-center">
                        <AlertTriangle className="text-red-500 mx-auto mb-4" size={40} />
                        <h2 className="text-white font-black uppercase tracking-tighter text-xl mb-2 text-[10px]">Session Expiring</h2>
                        <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-6">
                            Logout in <span className="text-red-500 font-bold">{countdown}s</span>
                        </p>
                        <button onClick={startTimer} className="w-full bg-white text-black py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-200 transition-all">
                            Extend Session
                        </button>
                    </div>
                </div>
            )}

            <nav className="fixed top-0 left-0 right-0 h-24 bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.03] z-[100] px-8 flex items-center justify-between font-mono">
                <div className="flex items-center gap-4 shrink-0">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-[#0d0d0d] border border-white/5 rounded flex items-center justify-center group-hover:border-orange-600 transition-all">
                            <Cpu size={20} className="text-orange-600" />
                        </div>
                        <div className="hidden lg:block">
                            <p className="text-[20px] font-extrabold tracking-tighter uppercase italic leading-none text-white">
                                <span className="text-orange-600">AETHER</span> OS
                            </p>
                            <p className="text-[7px] text-zinc-600 uppercase tracking-[0.4em] mt-1.5 font-bold">
                                {isBackend ? "NODE_ADMIN_ACTIVE" : "SYSTEM_STABLE"}
                            </p>
                        </div>
                    </Link>
                </div>

                <div className="flex-1 flex justify-center px-12">
                    {isBackend ? (
                        <div className="w-full max-w-md hidden md:flex relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                            <input type="text" placeholder="SYSTEM_SCAN: ASSETS..." className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-800" />
                        </div>
                    ) : (
                        <div className="flex gap-8">
                            {navLinks.map((link) => (
                                <Link key={link.name} href={link.href} className={`text-[10px] font-black uppercase tracking-widest transition-all hover:text-blue-500 ${pathname === link.href ? 'text-blue-500' : 'text-zinc-500'}`}>
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 shrink-0 min-w-[150px] justify-end">
                    {loading && !initialSessionActive ? (
                        <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    ) : (user || initialSessionActive) ? (
                        <div className="relative">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-4 bg-white/5 border border-white/10 pl-4 pr-2 py-2 rounded-2xl hover:bg-white/10 transition-all group">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black text-blue-500 uppercase italic leading-none mb-1">
                                        {(userName || "Admin").toUpperCase()}
                                    </p>
                                    <p className="text-[7px] text-zinc-600 uppercase tracking-widest">Master_Access</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-blue-500 group-hover:border-blue-500 transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                                    <User size={18} />
                                </div>
                                <ChevronDown size={14} className={`text-zinc-600 transition-all ${isMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 mt-4 w-64 bg-[#0d0d0d] border border-white/5 rounded-2xl shadow-2xl py-3 z-[110] animate-in fade-in slide-in-from-top-2">
                                    <div className="px-6 py-3 border-b border-white/5 mb-2 text-white">
                                        <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">Identify</p>
                                        <p className="text-[10px] font-black text-zinc-400 truncate">{userEmail}</p>
                                    </div>
                                    <Link href="/admin/settings" className="flex items-center gap-4 px-6 py-3 text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                                        <Settings size={14} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Settings</span>
                                    </Link>
                                    <button onClick={() => { void handleLogout(); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 px-6 py-3 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all text-left">
                                        <LogOut size={14} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Logout System</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className="flex items-center gap-3 bg-white/5 border border-white/5 px-6 py-3 rounded-xl hover:bg-white/10 transition-all group">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors">Sign In</span>
                            <User size={14} className="text-zinc-500 group-hover:text-blue-500" />
                        </Link>
                    )}
                </div>
            </nav>
        </>
    );
}