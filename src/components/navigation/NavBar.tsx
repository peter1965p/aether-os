/**
 * AETHER OS // MULTIFUNCTIONAL NAV-KERNEL
 * Standort: src/components/navigation/NavBar.tsx
 * Zweck: Kombiniert Frontend-Navigation und Admin-Kontrollzentrum mit korrekten Links.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, UserPlus, ChevronDown, LogOut, Settings, Cpu, Search } from "lucide-react";
import { handleLogout } from "@/modules/auth/actions";

interface NavBarProps {
    session: boolean;
    userEmail?: string;
    userName?: string;
}

export default function NavBar({ session, userEmail, userName }: NavBarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    // Erkennt, ob wir im Admin-Dashboard oder auf der Landingpage sind
    const isBackend = pathname?.startsWith("/admin");

    /**
     * KORRIGIERTE FRONTEND-LINKS
     * Hier sind jetzt Home, Blog, Shop und Impressum enthalten.
     */
    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog" },
        { name: "Shop", href: "/shop" },
        { name: "Impressum", href: "/impressum" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 h-24 bg-[#050505]/80 backdrop-blur-md border-b border-white/[0.03] z-[100] px-8 flex items-center justify-between font-mono">

            {/* 01 // BRANDING SECTION */}
            <div className="flex items-center gap-4 shrink-0">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-[#0d0d0d] border border-white/5 rounded flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.15)] group-hover:border-blue-500 transition-all">
                        <Cpu size={20} className="text-blue-500" />
                    </div>
                    <div className="hidden lg:block">
                        <p className="text-[16px] font-black tracking-tighter text-white uppercase italic">
                            AETHER <span className="text-blue-500">OS</span>
                        </p>
                        <p className="text-[7px] text-gray-600 uppercase tracking-[0.3em]">
                            {isBackend ? "NODE_ADMIN_ACTIVE" : "SYSTEM_STABLE"}
                        </p>
                    </div>
                </Link>
            </div>

            {/* 02 // DYNAMIC INTERFACE: SEARCH (Admin) OR LINKS (Frontend) */}
            <div className="flex-1 flex justify-center px-12">
                {isBackend ? (
                    /* ADMIN SEARCH KERNEL */
                    <div className="w-full max-w-md hidden md:flex relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="KUNDEN, PRODUKTE SCANNEN..."
                            className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                        />
                    </div>
                ) : (
                    /* FRONTEND MENU LINKS - Jetzt mit korrekten Zielen */
                    <ul className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-blue-500 ${pathname === link.href ? 'text-blue-500' : 'text-zinc-400'}`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 03 // AUTH CONTROL SECTION */}
            <div className="flex items-center gap-4 shrink-0">
                {session ? (
                    /* ADMIN PROFILE DROPDOWN */
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-4 bg-white/5 border border-white/10 pl-4 pr-2 py-2 rounded-2xl hover:bg-white/10 transition-all group"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-blue-500 uppercase italic leading-none mb-1">{userName}</p>
                                <p className="text-[7px] text-zinc-600 uppercase tracking-widest">Master_Access</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-blue-500 group-hover:border-blue-500 transition-all">
                                <User size={18} />
                            </div>
                            <ChevronDown size={14} className={`text-zinc-600 transition-all ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-4 w-64 bg-[#0d0d0d] border border-white/5 rounded-2xl shadow-2xl py-3 z-[110] animate-in fade-in slide-in-from-top-2">
                                <div className="px-6 py-3 border-b border-white/5 mb-2">
                                    <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">Identify</p>
                                    <p className="text-[10px] font-black text-zinc-400 truncate">{userEmail}</p>
                                </div>
                                <Link href="/admin/settings" className="flex items-center gap-4 px-6 py-3 text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                                    <Settings size={14} />
                                    <span className="text-[9px] font-black uppercase">System Settings</span>
                                </Link>
                                <button
                                    onClick={() => handleLogout()}
                                    className="w-full flex items-center gap-4 px-6 py-3 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all text-left"
                                >
                                    <LogOut size={14} />
                                    <span className="text-[9px] font-black uppercase font-mono">Terminate Session</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* GUEST ACCESS BUTTONS */
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="flex items-center gap-3 bg-white/5 border border-white/5 px-6 py-3 rounded-xl hover:bg-white/10 transition-all group">
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Sign_In</span>
                            <User size={14} className="text-zinc-500 group-hover:text-blue-500" />
                        </Link>
                        <Link href="/register" className="hidden sm:flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 px-6 py-3 rounded-xl hover:bg-blue-600/20 transition-all group">
                            <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 group-hover:text-blue-300 transition-colors">Join_System</span>
                            <UserPlus size={14} className="text-blue-500" />
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}