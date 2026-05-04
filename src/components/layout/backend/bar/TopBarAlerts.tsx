/**
 * AETHER OS // TOPBAR ALERTS
 * Pfad: src/components/layout/backend/bar/TopBarAlerts.tsx
 */

"use client";

import { Bell, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface TopBarAlertsProps {
    mode: 'admin' | 'client';
}

export default function TopBarAlerts({ mode }: TopBarAlertsProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Kontextbasierte Alerts für AETHER OS
    const alerts = mode === "admin"
        ? [
            { id: "1", title: "System Scan", message: "Kernel Integrität 100%", type: 'success', time: "Gerade eben" },
            { id: "2", title: "Datenbank", message: "Backup erfolgreich erstellt", type: 'success', time: "5 Min." }
        ]
        : [
            { id: "3", title: "Bestellung #A04", message: "Teile sind abholbereit", type: 'info', time: "2 Std." },
            { id: "4", title: "Support", message: "Deine Anfrage wurde beantwortet", type: 'info', time: "1 Tag" }
        ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-3 bg-zinc-900/50 border border-white/5 rounded-xl transition-all group ${
                    isOpen ? "text-white border-white/20" : "text-zinc-400"
                }`}
            >
                <Bell size={18} className={alerts.length > 0 ? "animate-pulse" : ""} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-[#0d0d0d] border border-white/5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,1)] py-4 z-[110] animate-in fade-in slide-in-from-top-2">
                    <div className="px-6 py-2 border-b border-white/5 flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {mode}_LOG_ALERTS
            </span>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto px-2">
                        {alerts.map((alert) => (
                            <div
                                key={alert.id}
                                className="flex gap-4 p-4 rounded-2xl hover:bg-white/[0.03] transition-colors cursor-pointer group"
                            >
                                <div className="mt-1">
                                    {alert.type === 'success' ? (
                                        <CheckCircle2 size={14} className="text-green-500" />
                                    ) : (
                                        <Info size={14} className="text-blue-500" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex justify-between items-center gap-2">
                                        <p className="text-[9px] font-black uppercase text-white group-hover:text-blue-400 transition-colors">
                                            {alert.title}
                                        </p>
                                        <span className="text-[8px] font-medium text-zinc-600">{alert.time}</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                                        {alert.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}