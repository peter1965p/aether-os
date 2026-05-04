/**
 * AETHER OS // MULTI-MODE TOPBAR
 * Unterstützt Admin- und Client-Kontext durch das 'mode' Prop.
 */

"use client";

import {
  Search,
  Bell,
  Shield,
  Settings,
  User,
  LogOut,
  ChevronDown,
  SearchCode,
  Clock
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { handleLogout } from "@/modules/auth/actions";
import TopBarAlerts from "@/components/layout/backend/bar/TopBarAlerts";

// 1. Das Interface: Hier definieren wir 'mode' als optionalen Parameter
interface TopbarProps {
  userEmail?: string;
  userName?: string;
  mode?: 'admin' | 'client'; // Erlaubt 'admin' oder 'client'
}

export default function Topbar({
                                 userEmail = "admin@aether-os.com",
                                 userName = "Admin Node_01",
                                 mode = "admin" // Default ist admin
                               }: TopbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Dynamische Styling-Konstante basierend auf dem Mode
  const isClientMode = mode === "client";
  const accentColor = isClientMode ? "text-blue-500" : "text-red-600";
  const focusBorder = isClientMode ? "focus:border-blue-500/30" : "focus:border-red-600/30";

  const terminateSession = useCallback(async () => {
    setIsMenuOpen(false);
    await handleLogout();
  }, []);

  // Timer-Logik (unverändert übernommen)
  useEffect(() => {
    const resetTimer = () => setTimeLeft(300);
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      const logoutSequence = setTimeout(() => {
        terminateSession();
      }, 0);
      return () => clearTimeout(logoutSequence);
    }
  }, [timeLeft, terminateSession]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const initiateGlobalSearch = () => {
    if (searchQuery.trim().length > 1) {
      const safeQuery = encodeURIComponent(searchQuery.trim());
      // Dynamische Suche: Clients suchen woanders als Admins
      const searchPath = isClientMode ? `/client/search` : `/admin/search`;
      router.push(`${searchPath}?q=${safeQuery}`);
    }
  };

  return (
      <header className="h-24 border-b border-white/[0.03] bg-[#050505] sticky top-0 z-50 flex items-center justify-between px-10 gap-10">

        {/* SEARCH SYSTEM */}
        <div className="relative group w-full max-w-xl flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className={`w-4 h-4 text-zinc-700 group-focus-within:${isClientMode ? 'text-blue-500' : 'text-red-600'} transition-colors`} />
            </div>
            <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && initiateGlobalSearch()}
                placeholder={isClientMode ? "BESTELLUNGEN, SUPPORT SCANNE..." : "KUNDEN, PRODUKTE, RECHNUNGEN SCANNE..."}
                className={`w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-14 pr-12 text-[9px] font-black uppercase tracking-[0.2em] text-white placeholder-zinc-800 focus:outline-none ${focusBorder} transition-all shadow-2xl`}
            />
          </div>

          <button
              onClick={initiateGlobalSearch}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-white/5 px-4 py-3 rounded-2xl flex items-center gap-2 transition-all active:scale-95"
          >
            <SearchCode size={16} />
            <span className="text-[9px] font-black uppercase tracking-widest hidden lg:block">Execute</span>
          </button>
        </div>

        <div className="flex items-center gap-8">
          {/* TIMER & STATUS */}
          <div className="flex items-center gap-6 border-r border-white/5 pr-8">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-500 ${
                timeLeft <= 30 ? "bg-red-500/10 border-red-500/50 text-red-500 animate-pulse" : "bg-zinc-900/50 border-white/5 text-zinc-500"
            }`}>
              <Clock size={12} />
              <span className="text-[10px] font-mono font-bold tracking-[0.2em]">{formatTime(timeLeft)}</span>
            </div>

            <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/20 px-4 py-2 rounded-xl">
              <Shield className="w-3 h-3 text-green-500" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-green-500">
              {isClientMode ? "Encrypted Link" : "System Secure"}
            </span>
            </div>
          </div>

          {/* System Alerts */}
          <TopBarAlerts mode={mode} />          

          {/* USER PROFILE */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-4 group">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-tighter text-white">{userName}</p>
                <p className={`text-[8px] font-bold uppercase ${isClientMode ? 'text-blue-500/50' : 'text-zinc-600'} tracking-[0.2em] mt-1`}>
                  {isClientMode ? "Authorized Client" : "Master Key Access"}
                </p>
              </div>
              <div className={`w-11 h-11 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-[11px] font-black italic ${isClientMode ? 'text-blue-500' : 'text-zinc-400'}`}>
                {userName.charAt(0)}
              </div>
              <ChevronDown size={12} className={`text-zinc-600 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* DROPDOWN */}
            {isMenuOpen && (
                <div className="absolute right-0 mt-4 w-72 bg-[#0d0d0d] border border-white/5 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] py-4 z-[100] animate-in fade-in slide-in-from-top-2">
                  <div className="px-6 py-4 border-b border-white/5 mb-2">
                    <p className="text-[7px] font-black uppercase text-zinc-600 tracking-widest">Network Identity</p>
                    <p className={`text-[10px] font-black ${isClientMode ? 'text-blue-500' : 'text-red-600'} italic truncate mt-1`}>{userEmail}</p>
                  </div>
                  <button onClick={terminateSession} className="w-full flex items-center gap-4 px-6 py-4 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all text-left">
                    <LogOut size={16} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Terminate Session</span>
                  </button>
                </div>
            )}
          </div>
        </div>
      </header>
  );
}