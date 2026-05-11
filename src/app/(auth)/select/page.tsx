'use client'

import Link from "next/link";
import { ShieldCheck, User, ArrowRight, Activity } from "lucide-react";

export default function SelectAccessPage() {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden text-white">
            {/* Der AETHER Background-Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)] pointer-events-none" />

            <div className="w-full max-w-md space-y-8 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 p-12 rounded-[2.5rem] shadow-2xl text-center relative z-10">

                {/* Header im AETHER OS Style */}
                <div>
                    <h2 className="text-orange-600 uppercase tracking-tighter text-xl">
                        AETHER <span className="text-blue-900">OS</span>
                    </h2>
                    <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.4em] mt-2">
                        Multi-Role Uplink Detected
                    </p>
                </div>

                {/* Die Weiche */}
                <div className="space-y-4 pt-4">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-6">
                        Select Terminal Destination
                    </p>

                    {/* ADMIN UPLINK */}
                    <Link
                        href="/admin"
                        className="group flex items-center justify-between w-full bg-[#1e5d9c]/10 border border-white/5 rounded-2xl px-6 py-5 hover:border-orange-600/30 transition-all duration-500"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-600/10 rounded-xl group-hover:bg-orange-600/20 transition-colors">
                                <ShieldCheck size={20} className="text-orange-600" />
                            </div>
                            <div className="text-left">
                                <span className="block text-[11px] font-black tracking-widest uppercase text-white">Operator Kernel</span>
                                <span className="block text-[8px] text-zinc-600 uppercase tracking-tighter">Admin Access Level 10</span>
                            </div>
                        </div>
                        <ArrowRight size={14} className="text-zinc-800 group-hover:text-orange-600 transition-colors" />
                    </Link>

                    {/* CLIENT UPLINK */}
                    <Link
                        href="/client"
                        className="group flex items-center justify-between w-full bg-black border border-white/5 rounded-2xl px-6 py-5 hover:border-blue-500/30 transition-all duration-500"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-900/10 rounded-xl group-hover:bg-blue-900/20 transition-colors">
                                <User size={20} className="text-blue-900" />
                            </div>
                            <div className="text-left">
                                <span className="block text-[11px] font-black tracking-widest uppercase text-white">Client Terminal</span>
                                <span className="block text-[8px] text-zinc-600 uppercase tracking-tighter">Standard User Access</span>
                            </div>
                        </div>
                        <ArrowRight size={14} className="text-zinc-800 group-hover:text-blue-500 transition-colors" />
                    </Link>
                </div>

                {/* Footer Info */}
                <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Activity size={10} className="text-orange-600 animate-pulse" />
                        <span className="text-[8px] text-zinc-700 uppercase tracking-[0.3em] font-bold">
              Identity: news24regional@gmail.com
            </span>
                    </div>
                    <Link href="/login" className="text-[8px] text-zinc-800 hover:text-zinc-500 uppercase tracking-widest transition-colors">
                        Terminate Session
                    </Link>
                </div>
            </div>
        </div>
    );
}