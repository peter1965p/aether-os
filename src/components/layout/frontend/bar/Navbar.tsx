"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { handleLogout } from "@/modules/auth/actions";
import { LogIn, LogOut, ShieldCheck, Cpu } from "lucide-react";

/**
 * AETHER OS // CORE NAVBAR
 * @param session - Kommt vom RootLayout (Server Side)
 */
export default function Navbar({ session }: { session: boolean }) {
  const pathname = usePathname();

  // Wir verstecken die Navbar im Terminal-Modus, falls nötig
  if (pathname.startsWith("/admin/terminal")) return null;

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
              AETHER <span className="text-orange-500">//</span>  <span className="font-black uppercase tracking-tighter text-xl text-[#1e5d9c] leading-none">PAEFFGEN-IT</span>
            </span>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              OS Core Engine v4.3 <span className="text-orange-500">|</span> PLATINIUM
            </span>
          </div>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-widest text-slate-500">
          <Link
            href="/"
            className="hover:text-orange-500 transition-colors relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-700 transition-all group-hover:w-full"></span>
          </Link> 
          <Link
            href="/shop"
            className="hover:text-orange-500 transition-colors relative group"
          >
            Store
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-700 transition-all group-hover:w-full"></span>
          </Link>
          <Link
            href="/blog"
            className="hover:text-orange-500 transition-colors relative group"
          >
            AETHER Blog
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-700 transition-all group-hover:w-full"></span>
          </Link> 
          <Link
            href="/impressum"
            className="hover:text-orange-500 transition-colors relative group"
          >
            Impressum
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-700 transition-all group-hover:w-full"></span>
          </Link>          
        </div>

        {/* AUTH CONTROLS */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-[10px] font-black uppercase hover:bg-orange-500 hover:text-white transition-all"
              >
                <ShieldCheck size={14} /> Dashboard
              </Link>

              <button
                onClick={async () => await handleLogout()}
                className="p-2.5 text-gray-400 hover:text-red-500 bg-gray-50 rounded-xl hover:bg-red-50 transition-all"
                title="System Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
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
