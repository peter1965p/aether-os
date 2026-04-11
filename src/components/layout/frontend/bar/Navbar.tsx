"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { handleLogout } from "@/modules/auth/actions";
import { LogIn, LogOut, Cpu } from "lucide-react";

/**
 * AETHER OS // CORE NAVBAR
 * @param session - Kommt vom RootLayout (Server Side)
 */
export default function Navbar({ session }: { session: boolean }) {
  const pathname = usePathname();

  // SICHERHEITS-CHECK: Navbar nur im Frontend anzeigen.
  // Wenn der Pfad mit /admin oder /login beginnt, wird die Navbar nicht gerendert.
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;

  // Hilfsfunktion für den aktiven Status
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 w-full z-[100] bg-slate-800 backdrop-blur-md border-b border-blue-900">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* BRANDING: THE COMPANY */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="size-10 bg-slate-800 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-90">
            <Cpu className="text-orange-500" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-black uppercase tracking-tighter text-xl text-[#ffffff] leading-none">
              AETHER <span className="text-orange-500">//</span> <span className="font-black uppercase tracking-tighter text-xl text-[#1e5d9c] leading-none">PAEFFGEN-IT</span>
            </span>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              OS Core Engine v4.3 <span className="text-orange-500">|</span> PLATINIUM
            </span>
          </div>
        </Link>

        {/* NAV LINKS WITH ACTIVE INDICATOR */}
        <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-widest">
          <Link
            href="/"
            className={`${isActive('/') ? 'text-orange-500' : 'text-slate-500'} hover:text-orange-500 transition-colors relative group`}
          >
            Home
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-red-700 transition-all ${isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link> 
          
          <Link
            href="/shop"
            className={`${isActive('/shop') ? 'text-orange-500' : 'text-slate-500'} hover:text-orange-500 transition-colors relative group`}
          >
            Store
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-red-700 transition-all ${isActive('/shop') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>

          <Link
            href="/blog"
            className={`${isActive('/blog') ? 'text-orange-500' : 'text-slate-500'} hover:text-orange-500 transition-colors relative group`}
          >
            AETHER Blog
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-red-700 transition-all ${isActive('/blog') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link> 

          <Link
            href="/impressum"
            className={`${isActive('/impressum') ? 'text-orange-500' : 'text-slate-500'} hover:text-orange-500 transition-colors relative group`}
          >
            Impressum
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-red-700 transition-all ${isActive('/impressum') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>          
        </div>

        {/* AUTH CONTROLS */}
        <div className="flex items-center gap-4">
          {session ? (
            <button
              onClick={async () => await handleLogout()}
              className="p-2.5 text-gray-400 hover:text-red-500 bg-gray-50 rounded-xl hover:bg-red-50 transition-all"
              title="System Logout"
            >
              <LogOut size={18} />
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-6 py-3 bg-[#425d79] text-white rounded-xl text-[10px] font-black uppercase hover:bg-orange-600 transition-all shadow-lg shadow-black/5"
            >
              <LogIn size={14} /> Login Kernel
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}