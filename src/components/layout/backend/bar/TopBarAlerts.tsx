/**
 * AETHER OS // TOPBAR ALERT MANAGER
 * Pfad: src/components/layout/backend/bar/TopBarAlerts.tsx
 */

'use client';

import React from 'react';
import AdminAlerts from './alerts/AdminAlerts';
import ClientAlerts from './alerts/ClientAlerts';

interface TopBarAlertsProps {
    mode?: 'admin' | 'client';
}

export default function TopBarAlerts({ mode = 'admin' }: TopBarAlertsProps) {
    // Der Manager rendert nur das, was für den aktuellen Kontext wichtig ist
    return (
        <div className="flex items-center gap-2">
            {mode === 'admin' ? (
                <AdminAlerts />
            ) : (
                <ClientAlerts />
            )}
        </div>
    );
}