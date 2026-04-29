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

interface TopbarProps {
  userEmail?: string;
  userName?: string;
}

export default function Topbar({ 
  userEmail = "admin@aether-os.com", 
  userName = "Admin Node_01" 
}: TopbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const terminateSession = useCallback(async () => {
    setIsMenuOpen(false);
    await handleLogout();
  }, []);

  // 1. Der Timer: Er zählt NUR runter und resettet bei Action
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
  }, []); // Leeres Array, damit der EventListener nicht ständig neu gebunden wird

// 2. Der Rausschmeißer: Reagiert auf timeLeft === 0
  useEffect(() => {
    if (timeLeft === 0) {
      // Wir packen das in einen Timeout von 0, damit der Render-Zyklus 
      // der Topbar erst mal in Ruhe abschließen kann.
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
      router.push(`/admin/search?q=${safeQuery}`);
    }
  };

  return (
    // FIX: Wir nutzen bg-[#050505] statt transparent/white, um den Balken zu eliminieren
    <header className="h-24 border-b border-white/[0.03] bg-[#050505] sticky top-0 z-50 flex items-center justify-between px-10 gap-10">
      
      {/* SEARCH SYSTEM */}
      <div className="relative group w-full max-w-xl flex items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-700 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && initiateGlobalSearch()}
            placeholder="KUNDEN, PRODUKTE, RECHNUNGEN SCANNE..."
            className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-14 pr-12 text-[9px] font-black uppercase tracking-[0.2em] text-white placeholder-zinc-800 focus:outline-none focus:border-blue-500/30 transition-all shadow-2xl"
          />
          <div className="absolute inset-y-0 right-4 flex items-center">
             <kbd className="bg-zinc-900 border border-white/5 px-2 py-1 rounded text-[8px] font-black text-zinc-700">⌘ K</kbd>
          </div>
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
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-green-500">System Secure</span>
          </div>
        </div>

        {/* USER PROFILE */}
        <div className="relative" ref={menuRef}>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-4 group">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-tighter text-white">{userName}</p>
              <p className="text-[8px] font-bold uppercase text-zinc-600 tracking-[0.2em] mt-1">Master Key Access</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-[11px] font-black italic text-zinc-400">
              {userName.charAt(0)}
            </div>
            <ChevronDown size={12} className={`text-zinc-600 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {/* DROPDOWN */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-4 w-72 bg-[#0d0d0d] border border-white/5 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] py-4 z-[100] animate-in fade-in slide-in-from-top-2">
              <div className="px-6 py-4 border-b border-white/5 mb-2">
                <p className="text-[7px] font-black uppercase text-zinc-600 tracking-widest">Network Identity</p>
                <p className="text-[10px] font-black text-blue-500 italic truncate mt-1">{userEmail}</p>
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