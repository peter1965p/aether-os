"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
    Bell, Clock, LogOut, Settings,
    Timer, Calendar, ChevronDown, Cpu
} from "lucide-react";
import db from "@/lib/db";
import { handleLogout } from "@/modules/auth/actions";

export default function AdminNav({ email }: { email?: string }) {
    // --- STATES ---
    const [mounted, setMounted] = useState(false);
    const [time, setTime] = useState(new Date());
    const [timeLeft, setTimeLeft] = useState(300);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    const menuRef = useRef<HTMLDivElement>(null);

    // --- LOGIC ---
    const resetTimer = useCallback(() => setTimeLeft(300), []);

    const fetchNotifications = useCallback(async () => {
        const { data } = await db
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (data) {
            setNotifications(data.map((n: { id: any; source: any; type: any; msg: any; created_at: string | number | Date; }) => ({
                id: n.id,
                source: n.source,
                type: n.type,
                msg: n.msg,
                time: new Date(n.created_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
            })));
        }
    }, []);

    useEffect(() => {
        setMounted(true);
        const clockInterval = setInterval(() => setTime(new Date()), 1000);
        const countdownInterval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
                setIsNotifyOpen(false);
            }
        };

        const activities = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
        activities.forEach(e => window.addEventListener(e, resetTimer));
        document.addEventListener("mousedown", handleClickOutside);

        // Initial Fetch
        fetchNotifications();

        // Realtime Subscription
        const channel = db.channel('sentinel_updates')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, () => {
                fetchNotifications();
            })
            .subscribe();

        return () => {
            clearInterval(clockInterval);
            clearInterval(countdownInterval);
            activities.forEach(e => window.removeEventListener(e, resetTimer));
            document.removeEventListener("mousedown", handleClickOutside);
            db.removeChannel(channel);
        };
    }, [resetTimer, fetchNotifications]);

    const formatCountdown = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const onTerminate = async () => {
        await db.auth.signOut();
        await handleLogout();
        localStorage.clear();
        window.location.href = "/login?event=terminated";
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-[#050505] border-b border-white/[0.05] z-[100] px-6 flex items-center justify-between font-mono">

            {/* LEFT: Logo */}
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/40 rounded flex items-center justify-center">
                        <Cpu size={16} className="text-orange-500" />
                    </div>
                    <span className="text-white font-black text-xs tracking-widest uppercase hidden md:block text-shadow-glow">
                        Aether <span className="text-orange-500">Core</span>
                    </span>
                </div>
            </div>

            {/* CENTER: System Stats */}
            <div className="flex items-center gap-6 bg-white/[0.02] border border-white/5 px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                    <Clock size={12} className="text-orange-500" />
                    <span className="text-[10px] text-zinc-300 font-bold w-[65px]">
                        {mounted ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "--:--:--"}
                    </span>
                </div>

                <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                    <Calendar size={12} className="text-zinc-500" />
                    <span className="text-[10px] text-zinc-400">
                        {mounted ? time.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "--.--.----"}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Timer size={12} className={timeLeft < 60 ? "text-red-500 animate-pulse" : "text-emerald-500"} />
                    <span className={`text-[10px] font-black tracking-tighter ${timeLeft < 60 ? "text-red-500" : "text-zinc-300"}`}>
                        EXP: {formatCountdown(timeLeft)}
                    </span>
                </div>
            </div>

            {/* RIGHT: User Dropdown & Sentinel */}
            <div className="flex items-center gap-4" ref={menuRef}>

                {/* SENTINEL NOTIFICATIONS */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                        className="relative p-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <Bell size={18} className={notifications.length > 0 ? "animate-pulse" : ""} />
                        {notifications.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-600 rounded-full border-2 border-[#050505]"></span>
                        )}
                    </button>

                    {isNotifyOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-[#0a0a0a]/98 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-[120] animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Aether_Sentinel</span>
                                <button onClick={() => setNotifications([])} className="text-[9px] text-orange-500 hover:text-orange-400 uppercase font-bold">Clear</button>
                            </div>

                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((n, idx) => (
                                        <div key={n.id || idx} className="px-4 py-3 border-b border-white/5 hover:bg-white/[0.03] transition-colors relative overflow-hidden">
                                            <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${n.source === 'CLIENT' ? 'bg-blue-500' : n.source === 'PROFILE' ? 'bg-purple-500' : 'bg-orange-500'}`} />
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">
                                                    {n.source || 'SYSTEM'} // {n.type}
                                                </span>
                                                <span className="text-[8px] text-zinc-700">{n.time}</span>
                                            </div>
                                            <p className="text-[10px] text-zinc-300 font-medium">{n.msg}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-8 text-center text-[10px] text-zinc-600 italic uppercase">System Nominal</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* USER MENU */}
                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-3 bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-lg transition-all hover:bg-white/[0.06]"
                    >
                        <div className="flex flex-col items-end leading-none">
                            <span className="text-[9px] font-black text-white uppercase">{email?.split('@')[0] || "ADMIN"}</span>
                            <span className="text-[7px] text-orange-500 font-bold tracking-tighter uppercase italic">Secure_Node</span>
                        </div>
                        <ChevronDown size={12} className={`text-zinc-600 transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110] animate-in fade-in zoom-in-95 duration-200">
                            <Link
                                href="/admin/settings"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 text-[10px] text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all font-bold uppercase group"
                            >
                                <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" /> Settings
                            </Link>
                            <div className="h-px bg-white/5 my-1" />
                            <button
                                onClick={onTerminate}
                                className="w-full flex items-center gap-3 px-3 py-2 text-[10px] text-red-500 hover:bg-red-500/10 rounded-lg transition-all font-bold uppercase"
                            >
                                <LogOut size={14} /> Terminate
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}