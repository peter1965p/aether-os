"use client";

/**
 * AETHER OS // CLIENT DASHBOARD CORE
 * Pfad: src/app/(dashboard)/client/page.tsx
 *
 * Verknüpft die getRecentOrders Action mit dem High-End Terminal Design.
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import {
    Package,
    LayoutDashboard,
    History,
    ArrowUpRight,
    Clock,
    Shield,
    Zap
} from 'lucide-react';
import { getRecentOrders, type Order } from '@/modules/shop/actions';

export default function ClientDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                const orders = await getRecentOrders();
                setRecentOrders(orders);
            } catch (error) {
                console.error("[AETHER_KERNEL]: Fehler beim Laden der Assets:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // --- LOADING STATE (AETHER SYNC) ---
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#020406] gap-8">
                <div className="relative">
                    <div className="absolute inset-0 blur-2xl bg-blue-600/20 animate-pulse" />
                    <LayoutDashboard className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="font-black italic text-blue-500 tracking-[0.8em] text-[10px] uppercase animate-pulse">
                        Aether // Synchronisiere Datenströme
                    </div>
                    <div className="h-[2px] w-32 bg-white/5 overflow-hidden">
                        <div className="h-full bg-blue-500 animate-[loading_2s_infinite]" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="relative min-h-screen bg-[#020406] text-white p-8 font-mono overflow-x-hidden">

            {/* --- BACKGROUND AMBIENCE LAYER --- */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-16">

                {/* --- HEADER UNIT --- */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-12">
                    <div className="space-y-4">
                        <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-[0.8]">
                            <span className="text-zinc-700">DEIN </span> 
                            <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                DASHBOARD
              </span>
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="h-[1px] w-12 bg-blue-500/50" />
                            <p className="text-[9px] tracking-[0.6em] text-zinc-500 uppercase font-black">
                                Uplink_Established // Node: Verified
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-md">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <div className="text-[8px] uppercase tracking-widest leading-tight">
                            <span className="text-zinc-500 block">Security Status</span>
                            <span className="text-white font-black">Encrypted Connection</span>
                        </div>
                    </div>
                </header>

                {/* --- NAVIGATION CARDS --- */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/client/orders" className="group relative bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 p-10 rounded-[2.5rem] flex flex-col gap-6 hover:border-blue-500/40 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-100 group-hover:scale-110 transition-all">
                            <Package size={64} className="text-blue-500" />
                        </div>
                        <div className="p-4 bg-blue-500/10 rounded-2xl w-fit border border-blue-500/20">
                            <Package className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tight">Bestellungen</h2>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">Manage your Assets</p>
                        </div>
                        <ArrowUpRight className="absolute bottom-8 right-8 text-zinc-700 group-hover:text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </Link>

                    {/* Platzhalter für weitere Cards im gleichen Stil */}
                </section>

                {/* --- RECENT ACTIVITIES --- */}
                <section className="space-y-8">
                    <div className="flex items-center gap-6">
                        <h2 className="text-[12px] font-black uppercase tracking-[0.8em] text-zinc-500 flex items-center gap-3">
                            <Zap size={14} className="text-blue-500" />
                            Letzte Aktivitäten
                        </h2>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>

                    {recentOrders.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {recentOrders.map((order) => (
                                <Link
                                    href={`/client/orders/${order.id}`}
                                    key={order.id}
                                    className="group flex flex-col md:flex-row justify-between items-start md:items-center bg-white/[0.01] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.03] hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5 group-hover:border-blue-500/20">
                                            <span className="text-[10px] font-black italic">#{order.id}</span>
                                        </div>
                                        <div>
                                            <span className="block text-lg font-black italic uppercase tracking-tight">Bestellung {order.id}</span>
                                            <span className="block text-[9px] text-zinc-500 uppercase tracking-widest font-bold mt-1">
                            Eingang: {new Date(order.order_date).toLocaleDateString('de-DE')} // System Time
                          </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 mt-6 md:mt-0 relative z-10 w-full md:w-auto justify-between">
                                        <div className="text-right">
                                            <span className="block text-[9px] text-zinc-600 uppercase tracking-widest font-black mb-1">Total Assets</span>
                                            <span className="text-xl font-black italic text-blue-500">{order.total_price.toFixed(2)} €</span>
                                        </div>
                                        <div className="px-4 py-2 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">
                            {order.status}
                          </span>
                                        </div>
                                    </div>

                                    {/* Interactive Glow Element */}
                                    <div className="absolute left-0 top-0 h-full w-[2px] bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="relative group bg-black/40 border border-white/5 rounded-[3rem] p-24 flex flex-col items-center justify-center backdrop-blur-3xl overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
                            <div className="relative z-10 flex flex-col items-center opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
                                <History size={48} className="text-zinc-700 mb-6 group-hover:text-blue-500 group-hover:animate-spin-slow" />
                                <p className="text-zinc-500 font-mono text-[11px] uppercase tracking-[0.5em] italic text-center">
                                    Keine aktiven Datenströme gefunden. <br />
                                    <span className="text-[9px] mt-2 block opacity-50 underline">Warte auf User-Input...</span>
                                </p>
                            </div>
                            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
                        </div>
                    )}
                </section>

                {/* --- FOOTER STATUS --- */}
                <footer className="pt-12 text-[9px] font-black uppercase tracking-[1em] text-zinc-800 flex justify-center pointer-events-none select-none">
                    Aether // Client // Terminal // 16.1.6
                </footer>
            </div>
        </main>
    );
}