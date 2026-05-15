'use client';

import { registerCustomer } from '@/modules/auth/customer-actions';
import { useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, UserPlus, AlertTriangle, Fingerprint, Database, Zap, ShieldCheck, ShoppingCart } from 'lucide-react';

type RegisterResponse = {
    error?: string;
    success?: boolean;
    message?: string;
} | null | undefined;

function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        try {
            const result = await registerCustomer(formData) as RegisterResponse;
            
            if (result?.error) {
                setError(result.error);
            } else {
                router.push('/login?status=customer_registered');
            }
        } catch (err) {
            setError("UPLINK_FAILURE: Database connection unstable");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative group">
            {/* Holographic Glow */}
            <div className="absolute -inset-1 rounded-[3rem] blur-2xl opacity-20 transition-all duration-1000 bg-orange-600 group-hover:opacity-30"></div>

            <div className="w-full max-w-md space-y-10 bg-black/70 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.9)] text-center relative z-10">

                {/* Header: Customer Focus */}
                <div className="space-y-2">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 rounded-full border border-orange-500/20 bg-orange-500/5 shadow-[0_0_30px_rgba(234,88,12,0.1)] text-orange-500">
                            <ShoppingCart size={24} />
                        </div>
                    </div>
                    <h2 className="text-4xl font-black tracking-[-0.05em] leading-none uppercase">
                        <span className="text-white">Customer</span>
                        <span className="text-orange-600 italic ml-2">Portal</span>
                    </h2>
                    <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.5em] mt-4 opacity-60">
                        Aether OS // Identity Provisioning
                    </p>
                </div>

                {error && (
                    <div className="flex items-center gap-3 border border-red-500/30 bg-red-900/10 p-4 rounded-2xl animate-pulse text-left text-red-500">
                        <AlertTriangle size={16} className="flex-shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{error}</span>
                    </div>
                )}

                <form action={handleSubmit} className="space-y-5 text-left">
                    <div className="space-y-4">
                        {/* full_name -> Mapping zu public.customers */}
                        <div className="space-y-2">
                            <label className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                                <Database size={10} className="text-orange-500/50" /> Full Legal Name
                            </label>
                            <input
                                name="full_name"
                                type="text"
                                placeholder="VORNAME NACHNAME"
                                required
                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-orange-500/40 focus:bg-black transition-all placeholder:text-zinc-800 text-center uppercase font-black tracking-[0.2em] text-[11px] text-white shadow-inner"
                            />
                        </div>

                        {/* email -> Mapping zu public.customers */}
                        <div className="space-y-2">
                            <label className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                                <Fingerprint size={10} className="text-orange-500/50" /> Secure Email Uplink
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder="UPLINK@DOMAIN.COM"
                                required
                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-orange-500/40 focus:bg-black transition-all placeholder:text-zinc-800 text-center uppercase font-black tracking-[0.2em] text-[11px] text-white shadow-inner"
                            />
                        </div>

                        {/* password -> Wird zu password_hash in der DB */}
                        <div className="space-y-2">
                            <label className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                                <ShieldCheck size={10} className="text-orange-500/50" /> Encryption Key
                            </label>
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••••••"
                                required
                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-orange-500/40 focus:bg-black transition-all placeholder:text-zinc-800 text-center font-black tracking-[0.4em] text-[11px] text-white shadow-inner"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full font-black py-6 rounded-2xl transition-all uppercase text-[11px] tracking-[0.4em] relative overflow-hidden group/btn mt-4 ${
                            loading
                                ? 'opacity-50 cursor-not-allowed bg-zinc-800'
                                : 'bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_50px_rgba(234,88,12,0.4)]'
                        }`}
                    >
                        <span className="relative z-10 flex justify-center items-center gap-2">
                            {loading ? (
                                <>
                                    <Zap size={14} className="animate-pulse" /> 
                                    Authorizing...
                                </>
                            ) : (
                                'Initialize Customer Node'
                            )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                    </button>
                </form>

                <div className="flex flex-col gap-5 pt-6 border-t border-white/5">
                    <Link href="/login" className="text-zinc-500 hover:text-white transition-colors uppercase text-[9px] font-black tracking-[0.3em]">
                        Returning Entity? Execute Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-[#020406] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Image aus deinem AETHER Folder */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/aether-header.png"
                    alt="Aether Universe"
                    fill
                    className="object-cover opacity-30 scale-105 blur-[3px]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020406]/50 via-transparent to-[#020406]" />
            </div>

            {/* Scanline CRT Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10 opacity-50" />

            <Suspense fallback={<div className="text-orange-500 animate-pulse font-black uppercase text-xs tracking-widest">Scanning Sectors...</div>}>
                <RegisterForm />
            </Suspense>

            {/* Branding Footer */}
            <div className="absolute bottom-8 left-0 w-full text-center z-20 opacity-30">
                <p className="text-[9px] font-black uppercase tracking-[1.5em] text-zinc-500">
                    Aether Core // Customer Identification
                </p>
            </div>
        </div>
    );
}