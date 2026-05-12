'use client'

import { handleLogin } from "@/modules/auth/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, UserPlus, AlertTriangle, ShieldCheck, Lock } from "lucide-react";

interface LoginResponse {
    success: boolean;
    target?: string;
    message?: string;
}

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isSystemAccess = searchParams.get('mode') === 'admin';

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        try {
            const result = await handleLogin(formData) as LoginResponse;

            if (result && result.success && result.target) {
                router.push(result.target);
                router.refresh();
            } else {
                setError(result?.message || "ACCESS DENIED: Credentials Invalid");
            }
        } catch (err) {
            console.error("Login Failed:", err);
            setError("SYSTEM CRITICAL: Connection Lost");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative group">
            {/* Holographic Glow behind the form */}
            <div className={`absolute -inset-1 rounded-[3rem] blur-2xl opacity-20 transition-all duration-1000 ${isSystemAccess ? 'bg-red-600' : 'bg-blue-600'}`}></div>

            <div className="w-full max-w-md space-y-10 bg-black/60 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] text-center relative z-10">

                {/* Header Section mit Logo-Style */}
                <div className="space-y-2">
                    <div className="flex justify-center mb-6">
                        <div className={`p-4 rounded-full border border-white/5 bg-white/5 shadow-inner ${isSystemAccess ? 'text-red-500' : 'text-blue-500'}`}>
                            {isSystemAccess ? <Lock size={24} /> : <ShieldCheck size={24} />}
                        </div>
                    </div>
                    <h2 className="text-4xl font-black tracking-[-0.05em] leading-none uppercase">
                        <span className={`${isSystemAccess ? 'text-red-600' : 'text-orange-600'} drop-shadow-[0_0_15px_rgba(234,88,12,0.4)]`}>
                            Aether
                        </span>
                        <span className="text-blue-700 italic ml-2">
                            {isSystemAccess ? 'CORE' : 'OS'}
                        </span>
                    </h2>
                    <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.5em] mt-4 opacity-60">
                        {isSystemAccess ? 'Level 5 Operator Auth Required' : 'Establish Secure Connection'}
                    </p>
                </div>

                {error && (
                    <div className="flex items-center gap-3 border border-red-500/30 bg-red-900/10 p-4 rounded-2xl animate-pulse text-left text-red-500">
                        <AlertTriangle size={16} className="flex-shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{error}</span>
                    </div>
                )}

                <form action={handleSubmit} className="space-y-5">
                    <div className="space-y-3">
                        <div className="relative">
                            <input
                                name="email"
                                type="email"
                                placeholder="IDENTIFIER"
                                required
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-blue-500/40 focus:bg-black transition-all placeholder:text-zinc-800 text-center uppercase font-black tracking-[0.2em] text-[11px] text-white shadow-inner"
                            />
                        </div>
                        <div className="relative">
                            <input
                                name="password"
                                type="password"
                                placeholder="SECURITY KEY"
                                required
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-blue-500/40 focus:bg-black transition-all placeholder:text-zinc-800 text-center font-black tracking-[0.4em] text-[11px] text-white shadow-inner"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full font-black py-6 rounded-2xl transition-all uppercase text-[11px] tracking-[0.4em] relative overflow-hidden group/btn ${
                            loading
                                ? 'opacity-50 cursor-not-allowed bg-zinc-800'
                                : isSystemAccess
                                    ? 'bg-red-700 hover:bg-red-600 text-white shadow-[0_0_40px_rgba(185,28,28,0.3)]'
                                    : 'bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_40px_rgba(234,88,12,0.3)]'
                        }`}
                    >
                        <span className="relative z-10 flex justify-center items-center gap-2">
                            {loading ? 'Validating Kernel...' : isSystemAccess ? 'Authorize Operator' : 'Execute Uplink'}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                    </button>
                </form>

                <div className="flex flex-col gap-5 pt-6 border-t border-white/5">
                    {!isSystemAccess && (
                        <Link href="/register" className="text-zinc-500 hover:text-orange-500 transition-colors uppercase text-[9px] font-black tracking-[0.3em] flex items-center justify-center gap-2">
                            <UserPlus size={12} /> Request New Identity
                        </Link>
                    )}
                    <Link href="/" className="text-zinc-700 hover:text-white transition-colors uppercase text-[9px] font-black tracking-[0.3em] flex items-center justify-center gap-2">
                        <ArrowLeft size={12} /> Abort Connection
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#020406] flex items-center justify-center p-6 relative overflow-hidden">

            {/* --- COSMIC BACKGROUND LAYER (Gleiches Bild wie Startseite) --- */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/aether-header.png"
                    alt="Aether Universe"
                    fill
                    className="object-cover opacity-40 scale-110 blur-[2px]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#020406] via-transparent to-[#020406] opacity-90" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020406_100%)] opacity-80" />
            </div>

            {/* --- SCANLINE EFFECT --- */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10" />

            <Suspense fallback={
                <div className="relative z-20 flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="text-blue-500 font-mono uppercase text-[10px] tracking-[0.5em] animate-pulse">Initialising Uplink...</div>
                </div>
            }>
                <LoginForm />
            </Suspense>

            {/* Footer Branding */}
            <div className="absolute bottom-10 left-0 w-full text-center z-20 opacity-20 hover:opacity-100 transition-opacity">
                <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-500">
                    Aether OS // Secure Terminal
                </p>
            </div>
        </div>
    );
}