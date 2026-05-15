"use client";

/**
 * AETHER OS // CLIENT NAVIGATION MODULE
 */

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
    Bell, Clock, LogOut, Settings,
    Timer, Calendar, ChevronDown, ShieldCheck
} from "lucide-react";
import db from "@/lib/db";
import { handleLogout } from "@/modules/auth/actions";

interface ClientNavProps {
    email?: string;
    customerId?: string | number;
}

export default function ClientNav({ email, customerId }: ClientNavProps) {
    const [mounted, setMounted] = useState(false);
    const [time, setTime] = useState(new Date());
    const [timeLeft, setTimeLeft] = useState(600); 
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    const menuRef = useRef<HTMLDivElement>(null);

    const resetTimer = useCallback(() => setTimeLeft(600), []);

    const fetchNotifications = useCallback(async () => {
        const { data } = await db
            .from('notifications')
            .select('*')
            .eq('source', 'CLIENT')
            .order('created_at', { ascending: false })
            .limit(5);

        if (data) {
            setNotifications(data.map((n: any) => ({
                id: n.id,
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

        fetchNotifications();

        const channel = db.channel('client_updates')
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
        window.location.href = "/login?event=client_logout";
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-[#030303] border-b border-white/[0.03] z-[100] px-6 flex items-center justify-between font-mono">

            {/* LEFT: Client Branding */}
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/40 rounded flex items-center justify-center">
                        <ShieldCheck size={16} className="text-blue-500" />
                    </div>
                    <span className="text-white font-black text-xs tracking-widest uppercase hidden md:block">
                        Aether <span className="text-blue-500">Client</span>
                    </span>
                </div>
            </div>

            {/* CENTER: Session Info */}
            <div className="flex items-center gap-6 bg-white/[0.01] border border-white/5 px-4 py-1.5 rounded-full">
                <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                    <Clock size={12} className="text-blue-500" />
                    <span className="text-[10px] text-zinc-400 font-bold">
                        {mounted ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Timer size={12} className={timeLeft < 60 ? "text-red-500 animate-pulse" : "text-blue-500"} />
                    <span className={`text-[10px] font-black tracking-tighter ${timeLeft < 60 ? "text-red-500" : "text-zinc-500"}`}>
                        SESSION: {formatCountdown(timeLeft)}
                    </span>
                </div>
            </div>

            {/* RIGHT: User Controls */}
            <div className="flex items-center gap-4" ref={menuRef}>

                {/* NOTIFICATIONS */}
                <div className="relative">
                    <button onClick={() => setIsNotifyOpen(!isNotifyOpen)} className="p-2 text-zinc-500 hover:text-blue-400">
                        <Bell size={18} className={notifications.length > 0 ? "animate-pulse text-blue-500" : ""} />
                    </button>
                    {isNotifyOpen && (
                        <div className="absolute right-0 mt-2 w-72 bg-[#080808] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-[120]">
                            <div className="px-4 py-2 bg-blue-500/5 border-b border-white/5 text-[9px] font-black text-blue-500 uppercase tracking-widest">Client_Feed</div>
                            <div className="max-h-[200px] overflow-y-auto">
                                {notifications.length > 0 ? notifications.map((n) => (
                                    <div key={n.id} className="px-4 py-3 border-b border-white/5 hover:bg-white/[0.02]">
                                        <p className="text-[10px] text-zinc-300 font-medium">{n.msg}</p>
                                        <span className="text-[7px] text-zinc-600 uppercase font-bold">{n.time} // {n.type}</span>
                                    </div>
                                )) : <div className="p-6 text-center text-[9px] text-zinc-600 uppercase tracking-widest">No Updates</div>}
                            </div>
                        </div>
                    )}
                </div>

                {/* USER MENU */}
                <div className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-lg hover:border-blue-500/30 transition-all">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-white uppercase">{email?.split('@')[0] || "CLIENT"}</span>
                            <span className="text-[7px] text-blue-500 font-bold uppercase italic tracking-tighter">Verified_Node</span>
                        </div>
                        <ChevronDown size={12} className={`text-zinc-600 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-[#0a0a0a] border border-white/10 rounded-xl p-1 shadow-2xl z-[110]">
                            <Link
                                href={`/profiles/${customerId}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 text-[10px] text-zinc-400 hover:text-white hover:bg-blue-500/10 rounded-lg transition-all font-bold uppercase"
                            >
                                <Settings size={14} /> Profile
                            </Link>
                            <button onClick={onTerminate} className="w-full flex items-center gap-3 px-3 py-2 text-[10px] text-red-500 hover:bg-red-500/10 rounded-lg transition-all font-bold uppercase mt-1">
                                <LogOut size={14} /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}