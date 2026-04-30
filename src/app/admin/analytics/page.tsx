"use client";

import React, { useState, useEffect } from 'react';
import { getSystemMetrics } from '@/modules/inventory/actions';
import {
    Globe, Search, Link as LinkIcon, Share2, Loader2,
    Package, ShoppingCart, User, Activity, Zap
} from 'lucide-react';

/**
 * AETHER OS - Analytics Engine
 * Mapping-Funktion für dynamische Icons aus der Datenbank
 */
const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
        search: Search,
        share: Share2,
        globe: Globe,
        package: Package,
        shopping: ShoppingCart,
        user: User,
        activity: Activity,
        zap: Zap
    };
    return icons[iconName] || LinkIcon;
};

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [pulseData, setPulseData] = useState<number[]>(new Array(12).fill(40));

    // Simulation des Live-Datenstroms für das UI
    useEffect(() => {
        if (loading) return;
        const interval = setInterval(() => {
            setPulseData((prev) => {
                const newData = [...prev.slice(1)];
                const lastValue = prev[prev.length - 1];
                const change = Math.floor(Math.random() * 31) - 15;
                const nextValue = Math.max(20, Math.min(100, lastValue + change));
                newData.push(nextValue);
                return newData;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [loading]);

    // Initiales Laden der Metriken
    useEffect(() => {
        async function loadData() {
            try {
                const metrics = await getSystemMetrics();
                if (metrics) setData(metrics);
            } catch (error) {
                console.error("AETHER // Telemetry Link Failed", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-6">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <div className="font-black italic animate-pulse text-blue-500 tracking-[0.5em] text-xs uppercase">
                    Aether // Establishing Neural Link...
                </div>
            </div>
        );
    }

    if (!data || !data.stats) {
        return <div className="p-10 text-red-500 font-black italic">ERROR // DATA_STREAM_EMPTY</div>;
    }

    return (
        <main className="p-10 space-y-12 bg-black min-h-screen text-white">
            {/* Header Bereich */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
            Aether // Protocol: Online
          </span>
                </div>
                <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none">
                    System <span className="text-zinc-900">Metrics</span>
                </h1>
            </section>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data.stats.map((stat: any, i: number) => (
                    <div key={i} className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl group hover:border-blue-500/20 transition-all">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4">{stat.label}</p>
                        <div className="flex items-baseline gap-4">
                            <span className="text-5xl font-black italic tracking-tighter text-white">{stat.value}</span>
                            <span className="text-[10px] font-bold text-zinc-500 italic uppercase">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Traffic Pulse Chart */}
            <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="flex justify-between items-start mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <Activity className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black italic uppercase tracking-tight">Traffic Pulse</h3>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic tracking-[0.2em]">Real-time Stream</p>
                        </div>
                    </div>
                </div>

                <div className="h-64 w-full flex items-end gap-2 px-2 border-b border-white/5 pb-2">
                    {pulseData.map((h, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-blue-600/20 to-blue-500 rounded-t-lg transition-all duration-[1500ms] ease-in-out"
                            style={{ height: `${h}%` }}
                        />
                    ))}
                </div>
            </div>

            {/* Footer Grid: Nodes & Origins */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
                <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                    <h3 className="text-xl font-black italic uppercase tracking-tight mb-8">Top Active Nodes</h3>
                    <div className="space-y-6">
                        {data.topPages?.map((page: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-bold text-zinc-400 uppercase italic">{page.path}</span>
                                    <span className="text-sm font-black italic">{page.views}</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600" style={{ width: `${page.percentage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                    <h3 className="text-xl font-black italic uppercase tracking-tight mb-8">Traffic Origin</h3>
                    <div className="space-y-4">
                        {data.trafficSources?.map((source: any, i: number) => {
                            const Icon = getIcon(source.iconName);
                            return (
                                <div key={i} className="flex items-center justify-between p-5 bg-zinc-900/20 border border-white/5 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <Icon size={18} className="text-blue-500" />
                                        <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">{source.source}</span>
                                    </div>
                                    <span className="text-sm font-black italic text-white">{source.visitors} Signals</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </main>
    );
}