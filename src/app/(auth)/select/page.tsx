'use client'

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, User, ArrowRight, Activity, Zap, Cpu } from "lucide-react";

export default function SelectAccessPage() {
    return (
        <div className="min-h-screen bg-[#020406] flex items-center justify-center p-6 relative overflow-hidden text-white">

            {/* --- COSMIC BACKGROUND LAYER --- */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/aether-header.png"
                    alt="Aether Universe"
                    fill
                    className="object-cover opacity-30 scale-110 blur-[3px]"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020406_100%)] opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-100" />
            </div>

            {/* --- SCANLINE EFFECT --- */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

            {/* --- SELECTION TERMINAL --- */}
            <div className="w-full max-w-lg space-y-10 bg-black/40 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.9)] text-center relative z-20 overflow-hidden">

                {/* Deko-Elemente für den Tech-Vibe */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent opacity-50" />

                {/* Header Unit */}
                <div className="space-y-4">
                    <h2 className="text-4xl font-black tracking-[-0.05em] leading-none uppercase">
                        <span className="bg-gradient-to-b from-orange-200 via-orange-500 to-orange-800 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(234,88,12,0.4)]">
                            Aether
                        </span>
                        <span className="text-blue-700 italic ml-2">OS</span>
                    </h2>
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-[1px] w-12 bg-blue-500/50" />
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.6em]">
                            Multi-Role Uplink Detected
                        </p>
                    </div>
                </div>

                {/* Die Weiche: Massive Cards */}
                <div className="space-y-4 pt-4">
                    <p className="text-[9px] text-zinc-600 uppercase tracking-[0.4em] font-black mb-8 italic">
                        &gt; Select Terminal Destination
                    </p>

                    {/* ADMIN UPLINK: DER OPERATOR KERNEL */}
                    <Link
                        href="/admin"
                        className="group relative flex items-center justify-between w-full bg-gradient-to-r from-orange-600/5 to-transparent border border-white/5 rounded-[2rem] px-8 py-7 hover:border-orange-500/50 hover:bg-orange-600/10 transition-all duration-700 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(234,88,12,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center gap-6 relative z-10">
                            <div className="p-4 bg-orange-600/10 rounded-2xl border border-orange-500/20 group-hover:scale-110 group-hover:bg-orange-600/20 transition-all duration-500 shadow-[0_0_20px_rgba(234,88,12,0.1)]">
                                <ShieldCheck size={28} className="text-orange-500" />
                            </div>
                            <div className="text-left">
                                <span className="block text-[14px] font-black tracking-[0.2em] uppercase text-white group-hover:text-orange-500 transition-colors">Operator Kernel</span>
                                <span className="block text-[9px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">Priority Access // Level 10</span>
                            </div>
                        </div>
                        <div className="relative z-10 bg-black/50 p-2 rounded-full border border-white/5 group-hover:border-orange-500/50 transition-all">
                            <ArrowRight size={18} className="text-zinc-700 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>

                    {/* CLIENT UPLINK: DAS USER TERMINAL */}
                    <Link
                        href="/client"
                        className="group relative flex items-center justify-between w-full bg-gradient-to-r from-blue-900/5 to-transparent border border-white/5 rounded-[2rem] px-8 py-7 hover:border-blue-500/50 hover:bg-blue-900/10 transition-all duration-700 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(30,58,138,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center gap-6 relative z-10">
                            <div className="p-4 bg-blue-900/10 rounded-2xl border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-900/20 transition-all duration-500 shadow-[0_0_20px_rgba(30,58,138,0.1)]">
                                <User size={28} className="text-blue-500" />
                            </div>
                            <div className="text-left">
                                <span className="block text-[14px] font-black tracking-[0.2em] uppercase text-white group-hover:text-blue-500 transition-colors">Client Terminal</span>
                                <span className="block text-[9px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">Standard Network Access</span>
                            </div>
                        </div>
                        <div className="relative z-10 bg-black/50 p-2 rounded-full border border-white/5 group-hover:border-blue-500/50 transition-all">
                            <ArrowRight size={18} className="text-zinc-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                </div>

                {/* Footer Section: Identity Info */}
                <div className="pt-10 border-t border-white/5 space-y-6">
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] rounded-full border border-white/5 shadow-inner">
                            <Activity size={12} className="text-orange-600 animate-pulse" />
                            <span className="text-[9px] text-zinc-500 uppercase tracking-[0.3em] font-black">
                                ID: <span className="text-zinc-300">news24regional@gmail.com</span>
                            </span>
                        </div>
                        <Link
                            href="/login"
                            className="group flex items-center gap-2 text-[9px] text-zinc-700 hover:text-red-500 uppercase tracking-[0.5em] transition-all font-black"
                        >
                            <Zap size={10} className="group-hover:animate-bounce" />
                            Terminate Session
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Tech Label */}
            <div className="absolute bottom-10 text-[9px] font-black uppercase tracking-[1em] text-zinc-800 pointer-events-none">
                Aether // Unified // Interface
            </div>
        </div>
    );
}