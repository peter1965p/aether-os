"use client";

import React, { useState, useEffect } from 'react';
import { getSystemMetrics } from '@/modules/inventory/actions';
import {
    Globe, Search, Link as LinkIcon, Share2, Loader2,
    Package, ShoppingCart, User, Activity, Zap
} from 'lucide-react';

// Hilfsfunktion für die Icons mit Fallback
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

    // Neural Pulse Generator
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

    // Fallback, falls keine Daten kommen
    if (!data || !data.stats) {
        return <div className="p-10 text-red-500 font-black italic">ERROR // DATA_STREAM_EMPTY</div>;
    }

    return (
        <main className="p-10 space-y-12 bg-black min-h-screen text-white">
            {/* Header mit Live-Status */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
            {/* Sicherer Zugriff mit Fallback */}
                        Aether // Protocol: {data.stats[2]?.trend || 'Analyzing...'}
          </span>
                </div>
                <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none">
                    System <span className="text-zinc-900">Metrics</span>
                </h1>
            </section>

            {/* Die weiteren Sektionen (Stats Grid, Pulse Chart etc.) bleiben wie zuvor, 
          verwenden aber nun die sicher geladenen Daten. */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data.stats.map((stat: any, i: number) => (
                    <div key={i} className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4">{stat.label}</p>
                        <div className="flex items-baseline gap-4">
                            <span className={`text-5xl font-black italic tracking-tighter ${stat.color || 'text-white'}`}>{stat.value}</span>
                            <span className="text-[10px] font-bold text-zinc-500 italic uppercase">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ... Rest der Page ... */}
        </main>
    );
}