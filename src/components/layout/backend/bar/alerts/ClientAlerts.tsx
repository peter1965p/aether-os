/**
 * AETHER OS // CLIENT ALERTS & TRACKING HUB
 * Fokus: Echtzeit-Versandstatus (DHL, DPD, UPS)
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Truck, FileText, Package, ChevronRight, MapPin } from 'lucide-react';
import Link from "next/link";

// Beispiel-Struktur für Tracking-Daten
interface TrackingEvent {
    id: string;
    carrier: 'DHL' | 'DPD' | 'UPS';
    status: string;
    location: string;
    time: string;
    isNew: boolean;
}

export default function ClientAlerts() {
    const [isOpen, setIsOpen] = useState(false);
    const [shipments, setShipments] = useState<TrackingEvent[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Schließen des Dropdowns bei Klick außerhalb
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        // Hier später: const data = await getClientTracking(userId);
        const mockData: TrackingEvent[] = [
            {
                id: 'DE123456789',
                carrier: 'DHL',
                status: 'In Zustellung',
                location: 'Zustellzentrum Köln',
                time: 'Vor 10 Min',
                isNew: true
            },
            {
                id: 'DPD987654321',
                carrier: 'DPD',
                status: 'Paket sortiert',
                location: 'HUB Raunheim',
                time: 'Heute, 08:30',
                isNew: false
            }
        ];
        setShipments(mockData);
    }, []);

    const newAlertsCount = shipments.filter(s => s.isNew).length;

    return (
        <div className="flex items-center gap-4" ref={dropdownRef}>

            {/* SHIPPING TRACKING HUB */}
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-2 rounded-xl transition-all relative ${
                        newAlertsCount > 0
                            ? 'bg-blue-500/10 text-blue-500 animate-pulse'
                            : 'text-zinc-600 hover:text-white'
                    }`}
                >
                    <Truck size={18} />
                    {newAlertsCount > 0 && (
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-[#050505]" />
                    )}
                </button>

                {/* TRACKING DROPDOWN PANEL */}
                {isOpen && (
                    <div className="absolute right-0 mt-6 w-80 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-5 z-[999] animate-in fade-in slide-in-from-top-2">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package size={12} className="text-blue-500" /> Live_Tracking
              </span>
                            <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-[8px] border border-blue-500/20">
                {shipments.length} Active
              </span>
                        </div>

                        <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {shipments.map((item) => (
                                <div key={item.id} className="group cursor-pointer border-b border-white/5 pb-3 last:border-0">
                                    <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-black text-zinc-400 tracking-tighter uppercase">
                      {item.carrier} // {item.id}
                    </span>
                                        <span className="text-[8px] font-mono text-zinc-600">{item.time}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.isNew ? 'bg-blue-500 animate-pulse' : 'bg-zinc-800'}`} />
                                        <p className="text-[11px] font-bold text-white uppercase italic tracking-tight group-hover:text-blue-400 transition-colors">
                                            {item.status}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1 mt-1 pl-4">
                                        <MapPin size={10} className="text-zinc-700" />
                                        <span className="text-[9px] text-zinc-600 font-medium uppercase tracking-widest">
                      {item.location}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link href="/client/tracking" className="w-full mt-5 py-3 bg-white/5 hover:bg-blue-500/10 hover:text-blue-400 text-[9px] uppercase font-black tracking-[0.3em] rounded-xl transition-all border border-white/5 group flex items-center justify-center gap-2">
                            All Shipments <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>

            {/* DOCUMENT VAULT */}
            <button className="p-2 text-zinc-600 hover:text-white transition-all group relative">
                <FileText size={18} />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/5 whitespace-nowrap pointer-events-none">
            RECHNUNGEN_HUB
        </span>
            </button>

        </div>
    );
}