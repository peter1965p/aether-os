/**
 * AETHER OS // CLIENT TRACKING TERMINAL
 * Übersicht aller Sendungen für den Kunden
 */

import React from 'react';
import { Truck, Package, Search, ExternalLink, Clock, CheckCircle2 } from 'lucide-react';
import Link from "next/link";

// Mock-Daten für das Terminal
const SHIPMENTS = [
  {
    id: 'DE-AETHER-2026-001',
    carrier: 'DHL',
    trackingNumber: '123456789012',
    status: 'IN_DELIVERY',
    destination: 'Musterstadt, DE',
    lastUpdate: '03.05.2026 - 10:45',
    items: 3
  },
  {
    id: 'DE-AETHER-2026-005',
    carrier: 'DPD',
    trackingNumber: 'DPD-987654321',
    status: 'DELIVERED',
    destination: 'Beispielort, DE',
    lastUpdate: '01.05.2026 - 14:20',
    items: 1
  }
];

export default function TrackingPage() {
  return (
      <div className="space-y-8 animate-in fade-in duration-500">

        {/* HEADER BEREICH */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">
              Shipment <span className="text-blue-500">Tracking</span>
            </h1>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-bold mt-1">
              AETHER OS // Logistics Intelligence Unit
            </p>
          </div>

          {/* SUCHE / FILTER */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input
                type="text"
                placeholder="SENDUNGSNUMMER SUCHEN..."
                className="bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-[10px] font-bold tracking-widest text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all w-full md:w-64"
            />
          </div>
        </div>

        {/* TRACKING LISTE */}
        <div className="grid gap-4">
          {SHIPMENTS.map((shipment) => (
              <div
                  key={shipment.id}
                  className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 overflow-hidden"
              >
                {/* Dekorativer Hintergrund-Glow beim Hover */}
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                  {/* Info Block 1: Status & ID */}
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl ${shipment.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      {shipment.status === 'DELIVERED' ? <CheckCircle2 size={24} /> : <Truck size={24} className="animate-pulse" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white tracking-widest uppercase">
                        {shipment.id}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{shipment.carrier}</span>
                        <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                        <span className="text-[9px] font-mono text-zinc-400">{shipment.trackingNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Info Block 2: Details */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1 lg:px-10">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Status</p>
                      <p className={`text-[10px] font-bold uppercase tracking-tighter ${shipment.status === 'DELIVERED' ? 'text-green-500' : 'text-blue-400 italic'}`}>
                        {shipment.status.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Letztes Update</p>
                      <div className="flex items-center gap-1.5 text-zinc-300 text-[10px] font-bold uppercase">
                        <Clock size={10} className="text-zinc-500" />
                        {shipment.lastUpdate}
                      </div>
                    </div>
                    <div className="hidden md:block space-y-1">
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Zielort</p>
                      <p className="text-[10px] font-bold text-zinc-300 uppercase">{shipment.destination}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={`/client/tracking/${shipment.id}`} className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5 group-hover:border-blue-400/30">
                    Details <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}