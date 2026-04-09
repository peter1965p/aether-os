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
  ArrowRight
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Zentrale Search-Funktion für Enter & Button
  const initiateGlobalSearch = () => {
    if (searchQuery.trim().length > 1) {
      // encodeURIComponent ist ÜBERLEBENSWICHTIG für Sonderzeichen wie @ oder .
      const safeQuery = encodeURIComponent(searchQuery.trim());
      router.push(`/admin/search?q=${safeQuery}`);
    }
  };

  // Outside Click Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // CMD + K Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTerminate = async () => {
    setIsMenuOpen(false);
    await handleLogout();
  };

  return (
    <header className="h-24 border-b border-white/[0.05] bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-10 gap-10">
      
      {/* GLOBAL SEARCH SYSTEM */}
      <div className="relative group w-full max-w-xl flex items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && initiateGlobalSearch()}
            placeholder="KUNDEN, PRODUKTE, RECHNUNGEN SCANNE..."
            className="w-full bg-[#0d0d0d] border border-white/[0.05] rounded-2xl py-3 pl-14 pr-12 text-[9px] font-black uppercase tracking-[0.2em] text-white placeholder-gray-800 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
          />
          
          <div className="absolute inset-y-0 right-4 flex items-center">
             <kbd className="bg-[#151515] border border-white/10 px-2 py-1 rounded text-[8px] font-black text-gray-600 uppercase group-focus-within:opacity-0 transition-opacity">
               ⌘ K
             </kbd>
          </div>
        </div>

        {/* SEARCH EXECUTE BUTTON */}
        <button 
          onClick={initiateGlobalSearch}
          disabled={searchQuery.length < 2}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-[#111] disabled:text-gray-800 disabled:border-transparent text-white border border-blue-400/20 px-4 py-3 rounded-2xl flex items-center gap-2 transition-all active:scale-95 group/btn"
        >
          <SearchCode className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-widest hidden lg:block">Execute</span>
        </button>
      </div>

      <div className="flex items-center gap-8">
        
        {/* SYSTEM STATUS */}
        <div className="flex items-center gap-6 border-r border-white/5 pr-8">
          <button className="relative p-2 text-gray-600 hover:text-white transition-colors group">
            <Bell className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] animate-pulse" />
          </button>

          <div className="flex items-center gap-3 bg-green-500/[0.02] border border-green-500/20 px-4 py-2 rounded-xl group hover:border-green-500/40 transition-all cursor-crosshair">
            <Shield className="w-3 h-3 text-green-500" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-green-500 text-nowrap">
              System Secure
            </span>
          </div>
        </div>

        {/* PROFIL & SESSION */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-4 group cursor-pointer transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-tighter text-white group-hover:text-blue-400 transition-colors">
                {userName}
              </p>
              <p className="text-[8px] font-bold uppercase text-gray-600 tracking-[0.2em] leading-none mt-1">
                Master Key Access
              </p>
            </div>
            
            <div
              className={`w-11 h-11 rounded-2xl bg-gradient-to-br from-[#111] to-[#050505] border ${
                isMenuOpen ? "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "border-white/10"
              } flex items-center justify-center text-[11px] font-black italic transition-all group-hover:border-blue-500/50`}
            >
              {userName.charAt(0)}
            </div>
            
            <ChevronDown
              className={`w-3 h-3 text-gray-600 transition-transform duration-500 ${isMenuOpen ? "rotate-180 text-blue-500" : ""}`}
            />
          </button>

          {/* DROPDOWN MENU */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-4 w-72 bg-[#0d0d0d]/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.9)] py-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[100]">
              
              <div className="px-8 py-5 border-b border-white/5 mb-4 bg-white/[0.02]">
                <p className="text-[7px] font-black uppercase text-gray-600 tracking-[0.4em] mb-2">
                  Network Identity
                </p>
                <p className="text-[10px] font-black text-blue-500 truncate tracking-wider italic">
                  {userEmail}
                </p>
              </div>

              <div className="px-3 space-y-1">
                <Link
                  href="/admin/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/[0.03] text-gray-500 hover:text-white transition-all group"
                >
                  <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-700" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">System Config</span>
                </Link>

                <Link
                  href="/admin/users"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/[0.03] text-gray-500 hover:text-white transition-all group"
                >
                  <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Identity Portal</span>
                </Link>
              </div>

              <div className="mt-6 pt-2 border-t border-white/5 px-3">
                <button
                  onClick={handleTerminate}
                  className="flex items-center gap-4 w-full px-5 py-5 rounded-[1.8rem] bg-red-500/[0.02] hover:bg-red-500/10 text-red-600/60 hover:text-red-500 transition-all text-left group/logout"
                >
                  <LogOut className="w-4 h-4 group-hover/logout:-translate-x-1 transition-transform" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Terminate Session</span>
                    <span className="text-[7px] font-bold text-red-900 uppercase tracking-widest opacity-0 group-hover/logout:opacity-100 transition-opacity">Disconnecting Node...</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}