/**
 * AETHER OS // ADMIN ALERTS
 * Fokus: Lagerbestand, POS, System-Health
 */

'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Database } from 'lucide-react';
import { getLowStockAlerts } from '@/modules/pos/actions';

export default function AdminAlerts() {
    const [stockAlerts, setStockAlerts] = useState<any[]>([]);

    useEffect(() => {
        const checkAdminSystems = async () => {
            const data = await getLowStockAlerts();
            setStockAlerts(data || []);
        };
        checkAdminSystems();
        const interval = setInterval(checkAdminSystems, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-4">
            {/* POS WARNINGS */}
            <button className={`p-2 rounded-xl transition-all ${
                stockAlerts.length > 0 ? 'bg-red-500/10 text-red-600 animate-pulse' : 'text-zinc-600'
            }`}>
                <AlertTriangle size={18} />
            </button>

            {/* DATABASE STATUS */}
            <button className="p-2 text-zinc-600 hover:text-green-500 transition-all">
                <Database size={18} />
            </button>
        </div>
    );
}