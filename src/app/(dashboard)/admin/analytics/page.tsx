"use client";

import React, { useState, useEffect } from 'react';
import { getSystemMetrics } from '@/modules/inventory/actions';
import { createClient } from '@/lib/db'; // Dein Supabase-Client
import {
    Globe, Search, Link as LinkIcon, Share2, Loader2,
    Package, ShoppingCart, User, Activity, Zap
} from 'lucide-react';
import {
    RealtimePostgresInsertPayload
} from '@supabase/supabase-js';

interface InventoryItem {
    id: string;
    name: string;
    price?: number;
}

// 2. Wir definieren den Status-Typ manuell, falls der Export fehlt
// Das entspricht den Werten, die Supabase tatsächlich sendet.
type SupabaseChannelStatus = 'SUBSCRIBED' | 'TIMED_OUT' | 'CLOSED' | 'CHANNEL_ERROR';

const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
        search: Search, share: Share2, globe: Globe,
        package: Package, shopping: ShoppingCart,
        user: User, activity: Activity, zap: Zap
    };
    return icons[iconName] || LinkIcon;
};

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [pulseData, setPulseData] = useState<number[]>(new Array(12).fill(20));

    // REALTIME MARKET PULSE LOGIC
    useEffect(() => {
        if (loading) return;

        const supabase = createClient();

        // Typisierter Handler für neue Datenbank-Einträge
        const handleInsert = (payload: RealtimePostgresInsertPayload<InventoryItem>) => {
            const newEntry = payload.new;
            console.log("🚀 AETHER // Realtime Data:", newEntry.name);

            // Puls-Intensität berechnen (z.B. basierend auf Preis oder statisch)
            const intensity = newEntry.price ? Math.min(100, newEntry.price / 1000) : 80;
            triggerPulse(intensity);
        };

        // Kanal abonnieren
        const channel = supabase
            .channel('market-pulse-events')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'inventory'
                },
                handleInsert
            )
            // Wir nutzen den manuellen Typ oder lassen ihn einfach weg, 
            // da TS ihn im Callback meist korrekt inferiert (ableitet).
            .subscribe((status: SupabaseChannelStatus) => {
                if (status === 'SUBSCRIBED') {
                    console.log("📡 AETHER // Connection: ONLINE");
                }
                if (status === 'CHANNEL_ERROR') {
                    console.error("⚠️ AETHER // Connection: ERROR");
                }
            });

        // Grundrauschen (Intervall für das UI-Feeling)
        const heartbeat = setInterval(() => {
            triggerPulse(Math.floor(Math.random() * 10) + 15);
        }, 4000);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(heartbeat);
        };
    }, [loading]);

    // Hilfsfunktion, um den Puls zu aktualisieren
    const triggerPulse = (height: number) => {
        setPulseData((prev) => {
            const newData = [...prev.slice(1)];
            newData.push(height);
            return newData;
        });
    };

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
                    Aether // Syncing Market Pulse...
                </div>
            </div>
        );
    }

    return (
        <main className="p-10 space-y-12 bg-black min-h-screen text-white">
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
                        Aether // Protocol: Online
                    </span>
                </div>
                <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none">
                    Global <span className="text-blue-900">Metrics</span>
                </h1>
            </section>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data?.stats.map((stat: any, i: number) => (
                    <div key={i} className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl group hover:border-blue-500/20 transition-all">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4">{stat.label}</p>
                        <div className="flex items-baseline gap-4">
                            <span className="text-5xl font-black italic tracking-tighter text-white">{stat.value}</span>
                            <span className="text-[10px] font-bold text-zinc-500 italic uppercase">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Market Pulse Chart (Echtzeit Visualisierung) */}
            <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="flex justify-between items-start mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <Zap className="w-6 h-6 text-blue-500 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black italic uppercase tracking-tight">Traffic Pulse</h3>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic">Neural Database Stream</p>
                        </div>
                    </div>
                </div>

                <div className="h-64 w-full flex items-end gap-2 px-2 border-b border-white/5 pb-2">
                    {pulseData.map((h, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-t-lg transition-all duration-[800ms] ease-in-out ${
                                h > 60 ? 'bg-blue-500 shadow-[0_0_15px_#3b82f6]' : 'bg-blue-900/40'
                            }`}
                            style={{ height: `${h}%` }}
                        />
                    ))}
                </div>
            </div>

            
        </main>
    );
}