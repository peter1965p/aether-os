/**
 * AETHER OS // IDENTITY_PROTOCOL_INTERFACE
 * Pfad: src/modules/shop/checkout/CheckoutForm.tsx
 */

'use client'

import { useState } from 'react';
import { finalizeTransactionAction } from "../actions";
import { useCartStore } from "../useCartStore";
import { Terminal, User, Mail, Cpu, Loader2, Zap } from "lucide-react";

export default function CheckoutForm() {
    const [isLoading, setIsLoading] = useState(false);
    const fetchItems = useCartStore((state: any) => state.fetchItems);

    // Wir nutzen deine hinterlegten Daten als Default
    const [formData, setFormData] = useState({
        full_name: '',
        email: 'news24regional@gmail.com' // Dein Standard aus den Saved Infos
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await finalizeTransactionAction(formData);

        if (result.success) {
            await fetchItems(); // Navbar Sync
            // Redirect zum Success-Uplink
            window.location.href = `/shop/success?token=${result.magicToken}`;
        } else {
            setIsLoading(false);
            console.error("KERNEL_FAULT: Uplink rejected");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Full Name Input */}
                <div className="group relative">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block group-focus-within:text-orange-500 transition-colors">
                        Full_Name_Entry
                    </label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={16} />
                        <input
                            type="text"
                            required
                            placeholder="Operator Name"
                            value={formData.full_name}
                            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                            className="w-full bg-zinc-950/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm font-mono text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                        />
                    </div>
                </div>

                {/* Email Input */}
                <div className="group relative">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block group-focus-within:text-orange-500 transition-colors">
                        Uplink_Email_Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={16} />
                        <input
                            type="email"
                            required
                            placeholder="operator@aether.os"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-zinc-950/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm font-mono text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                        />
                    </div>
                </div>

            </div>

            {/* System Info Box */}
            <div className="mt-8 p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-start gap-4">
                <Cpu className="text-orange-500 shrink-0 mt-1" size={18} />
                <div className="text-[10px] leading-relaxed text-zinc-400 font-mono uppercase">
                    <span className="text-orange-500 font-black">Warning:</span> Durch den Klick auf den Button unten wird eine permanente Verbindung zum <span className="text-white">AETHER KERNEL</span> hergestellt. Alle Assets werden deiner Node-ID zugewiesen.
                </div>
            </div>

            {/* Submit Button - Passend zum Main-Button in image_470c3b.jpg */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 relative overflow-hidden group py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="relative z-10 flex items-center justify-center gap-3 font-black italic uppercase tracking-widest text-sm">
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Processing_Uplink...</span>
                        </>
                    ) : (
                        <>
                            <Zap size={20} className="group-hover:scale-125 transition-transform duration-500" />
                            <span>Establish Uplink ↗</span>
                        </>
                    )}
                </div>

                {/* Glow Effekt hinter dem Button */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>

            <div className="flex justify-center items-center gap-2 text-[8px] text-zinc-600 font-black uppercase tracking-[0.4em] mt-4">
                <Terminal size={10} />
                Secure_Terminal_Active
            </div>
        </form>
    );
}