/**
 * AETHER OS // GLOBAL NAVIGATION
 * Pfad: src/components/navigation/Navbar.tsx
 */

import Link from "next/link";
import {Terminal, User, Shield, LayoutGrid, User2, Cpu, UserPlus} from "lucide-react";

export default function Navbar() {
    // Später können wir hier den echten User-Namen aus der DB/Session ziehen
    const currentIdentity = "Peter P.";

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-black/60 backdrop-blur-xl px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* LOGO & SYSTEM STATUS */}
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-all">
                        <Cpu size={18} className="text-orange-600" />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-[14px] text-orange-600 leading-none">AETHER <span className="text-blue-900">OS</span></p>
                        <p className="text-[8px] font-mono text-slate-700 uppercase tracking-widest mt-1">System_Active</p>
                    </div>
                </Link>

                {/* CENTER: PRIMARY NAVIGATION */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                        Home
                    </Link>
                    <Link href="/blog" className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                        Blog
                    </Link>
                    <Link href="/shop" className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                        Shop
                    </Link>
                    <Link href="/impressum" className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                        Impressum
                    </Link>
                </div>

                {/* RIGHT: USER STATUS & ADMIN QUICKLINK */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/register"
                        className="p-2 border border-white/5 rounded-lg text-zinc-500 hover:text-blue-500 hover:border-blue-500/20 transition-all"
                        title="add new User Account"
                    >
                        <UserPlus size={16} />
                    </Link>

                    <div className="h-6 w-[1px] bg-white/10 hidden sm:block"></div>

                    <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2 rounded-2xl">
                        <Link href="/login" className="flex flex-col items-end hidden sm:flex">
                            <span className="text-[9px] font-black text-white uppercase italic">System Login</span>                            
                        </Link>
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                            <User size={14} className="text-zinc-400" />
                        </div>
                    </div>
                </div>

            </div>
        </nav>
    );
}