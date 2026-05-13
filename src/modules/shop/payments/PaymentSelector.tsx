/**
 * AETHER OS // PAYMENT_GATEWAY_SELECTOR
 * Pfad: src/modules/shop/payments/PaymentSelector.tsx
 */

'use client'

import { useState } from 'react';
import { CreditCard, Zap, ShieldCheck, Cpu } from "lucide-react";
import TerminalPay from "./TerminalPay";
// import StripeProvider from "./StripeProvider"; // Später aktivieren

type PaymentMethod = 'TERMINAL_UPLINK' | 'STRIPE' | 'CRYPTO';

interface PaymentSelectorProps {
    userData: {
        email: string;
        full_name: string;
    };
}

export default function PaymentSelector({ userData }: PaymentSelectorProps) {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('TERMINAL_UPLINK');

    const methods = [
        {
            id: 'TERMINAL_UPLINK',
            name: 'Aether_Uplink',
            desc: 'Direct Kernel Sync (Internal)',
            icon: Zap,
            color: 'text-orange-500',
            borderColor: 'border-orange-500/50'
        },
        {
            id: 'STRIPE',
            name: 'External_Credit',
            desc: 'Visa, Mastercard, Link',
            icon: CreditCard,
            color: 'text-blue-400',
            borderColor: 'border-blue-500/20'
        },
        {
            id: 'CRYPTO',
            name: 'Neural_Ledger',
            desc: 'BTC / ETH Network',
            icon: Cpu,
            color: 'text-emerald-400',
            borderColor: 'border-emerald-500/20'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">
                02 // Select_Payment_Protocol
            </h3>

            {/* Methode-Auswahl-Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {methods.map((method) => {
                    const Icon = method.icon;
                    const isActive = selectedMethod === method.id;

                    return (
                        <button
                            key={method.id}
                            type="button"
                            onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                            className={`relative p-4 rounded-2xl border transition-all duration-300 text-left group ${
                                isActive
                                    ? `bg-zinc-900 ${method.borderColor} shadow-lg shadow-${method.id === 'TERMINAL_UPLINK' ? 'orange' : 'blue'}-500/10`
                                    : 'bg-black border-white/5 hover:border-white/10'
                            }`}
                        >
                            <div className={`mb-3 ${isActive ? method.color : 'text-zinc-600'} group-hover:scale-110 transition-transform`}>
                                <Icon size={20} />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-white mb-1">
                                {method.name}
                            </div>
                            <div className="text-[8px] font-mono text-zinc-500 uppercase leading-tight">
                                {method.desc}
                            </div>

                            {isActive && (
                                <div className="absolute top-2 right-2">
                                    <ShieldCheck size={12} className={method.color} />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Dynamische Payment-Komponente */}
            <div className="mt-12 pt-8 border-t border-white/5">
                {selectedMethod === 'TERMINAL_UPLINK' && (
                    <div className="animate-in zoom-in-95 duration-300">
                        <TerminalPay userData={userData} />
                    </div>
                )}

                {selectedMethod === 'STRIPE' && (
                    <div className="p-8 border border-dashed border-white/10 rounded-3xl text-center">
                        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
                            External_Gateway_Standby // Waiting for API Keys
                        </p>
                    </div>
                )}

                {selectedMethod === 'CRYPTO' && (
                    <div className="p-8 border border-dashed border-white/10 rounded-3xl text-center">
                        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
                            Ledger_Connection_Offline
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}