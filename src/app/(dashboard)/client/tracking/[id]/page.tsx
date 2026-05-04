/**
 * AETHER OS // SHIPMENT DETAIL KERNEL
 * Detaillierte Verfolgung einer spezifischen Sendung
 */

import React from 'react';
import {
    ArrowLeft,
    Package,
    Truck,
    MapPin,
    CheckCircle2,
    Clock,
    ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

// Mock-Funktion für die Datenabfrage (später durch DB-Action ersetzen)
const getTrackingDetails = (id: string) => {
    return {
        id: id,
        carrier: 'DHL',
        status: 'IN_TRANSIT',
        estimatedDelivery: '05.05.2026',
        history: [
            { time: '03.05.2026 - 10:45', msg: 'In Zustellung', loc: 'Zustellzentrum Köln', done: false },
            { time: '02.05.2026 - 22:15', msg: 'Sendung im Ziel-Paketzentrum bearbeitet', loc: 'Köln', done: true },
            { time: '02.05.2026 - 08:30', msg: 'Sendung im Start-Paketzentrum bearbeitet', loc: 'Bruchsal', done: true },
            { time: '01.05.2026 - 14:00', msg: 'Elektronische Sendungsdaten übermittelt', loc: 'System', done: true },
        ]
    };
};

export default function TrackingDetailPage({ params }: { params: { id: string } }) {
    const data = getTrackingDetails(params.id);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* BACK-LINK & HEADER */}
            <div className="flex items-center gap-6">
                <Link
                    href="/client/tracking"
                    className="p-3 bg-white/5 hover:bg-blue-500/10 text-zinc-400 hover:text-blue-500 rounded-xl transition-all border border-white/5"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black uppercase tracking-tighter text-white">
                            Shipment <span className="text-blue-500">#{data.id}</span>
                        </h1>
                        <span className="bg-blue-500/10 text-blue-500 text-[8px] font-black px-2 py-1 rounded border border-blue-500/20 tracking-[0.2em]">
                LIVE_STATUS
            </span>
                    </div>
                    <p className="text-zinc-600 text-[9px] uppercase tracking-widest font-bold">
                        Provider: {data.carrier} Logistics System
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LINKS: DER ZEITSTRAHL (TRACKING HISTORY) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Truck size={120} className="text-blue-500" />
                        </div>

                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 mb-10 flex items-center gap-3">
                            <Clock size={16} className="text-blue-500" /> Event_Protocol
                        </h2>

                        <div className="relative space-y-12">
                            {/* Die vertikale Linie des Zeitstrahls */}
                            <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-blue-500 via-blue-500/20 to-transparent" />

                            {data.history.map((event, index) => (
                                <div key={index} className="relative pl-10 group">
                                    {/* Status Punkt */}
                                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-[#0a0a0a] z-10 transition-all ${
                                        event.done ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-zinc-800'
                                    } ${index === 0 && !event.done ? 'animate-pulse scale-110' : ''}`} />

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                        <div>
                                            <p className={`text-xs font-black uppercase tracking-tight ${event.done ? 'text-white' : 'text-blue-400 italic'}`}>
                                                {event.msg}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1 text-zinc-500 text-[10px]">
                                                <MapPin size={10} />
                                                <span className="font-bold uppercase tracking-widest">{event.loc}</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-mono text-zinc-600 bg-white/5 px-2 py-1 rounded">
                      {event.time}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RECHTS: QUICK-INFO BOXEN */}
                <div className="space-y-6">
                    {/* ESTIMATED DELIVERY */}
                    <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-[0_15px_30px_rgba(37,99,235,0.3)]">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70">Voraussichtliche Zustellung</p>
                        <div className="flex items-end justify-between mt-2">
                            <span className="text-3xl font-black italic tracking-tighter">{data.estimatedDelivery}</span>
                            <Package size={32} className="opacity-50" />
                        </div>
                    </div>

                    {/* SECURITY CARD */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-green-500/10 text-green-500 rounded-2xl">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-white">AETHER_SECURE</p>
                                <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Versicherter Versand</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-relaxed">
                            Dieses Paket ist über das **AETHER OS Global Network** bis zu einem Wert von 500€ gegen Verlust geschützt.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}