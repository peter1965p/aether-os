'use client'

import { handleLogin } from "@/modules/auth/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus, AlertTriangle } from "lucide-react";

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
                // WICHTIG: Das Target kommt vom Service und leitet nach /select, /admin oder /client
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
        <div className="w-full max-w-md space-y-8 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 p-12 rounded-[2.5rem] shadow-2xl text-center relative z-10">
            <div>
                <h2 className={`uppercase tracking-tighter text-xl transition-colors duration-500 ${isSystemAccess ? 'text-red-600' : 'text-orange-600'}`}>
                    AETHER <span className="text-blue-900">{isSystemAccess ? 'CORE' : 'OS'}</span>
                </h2>
                <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.4em] mt-2">
                    {isSystemAccess ? 'System Operator Authorization' : 'System Access Required'}
                </p>
            </div>

            {error && (
                <div className="flex items-center gap-2 border border-red-500/20 bg-red-900/10 p-3 rounded-xl animate-pulse text-left text-red-500">
                    <AlertTriangle size={14} className="flex-shrink-0" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">{error}</span>
                </div>
            )}

            <form action={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <input
                        name="email"
                        type="email"
                        placeholder="IDENTIFIER"
                        required
                        className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/30 transition-all placeholder:text-zinc-800 text-center uppercase font-bold tracking-widest text-[11px] text-white"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="SECURITY KEY"
                        required
                        className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/30 transition-all placeholder:text-zinc-800 text-center tracking-widest text-[11px] text-white"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full font-black py-5 rounded-2xl transition-all uppercase text-[10px] tracking-[0.2em] shadow-2xl ${
                        loading
                            ? 'opacity-50 cursor-not-allowed bg-zinc-800'
                            : isSystemAccess ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-[#1e5d9c] hover:bg-blue-500 text-white'
                    }`}
                >
                    {loading ? 'Validating...' : isSystemAccess ? 'Authorize Operator' : 'Execute Login'}
                </button>
            </form>

            <div className="flex flex-col gap-4 pt-4">
                {!isSystemAccess && (
                    <Link href="/register" className="text-zinc-600 hover:text-white transition-colors uppercase text-[8px] tracking-[0.3em] flex items-center justify-center gap-2">
                        <UserPlus size={10} /> Request New Identity
                    </Link>
                )}
                <Link href="/" className="text-zinc-800 hover:text-zinc-500 transition-colors uppercase text-[8px] tracking-[0.3em] flex items-center justify-center gap-2">
                    <ArrowLeft size={10} /> Abort Connection
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)] pointer-events-none" />
            <Suspense fallback={<div className="text-zinc-500 uppercase text-[10px] tracking-widest">Initialising Terminal...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}