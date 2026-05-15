'use client';

import { useState, Suspense } from 'react'; // Suspense importiert
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyCustomerCode } from '@/modules/auth/customer-actions';
import { ShieldAlert, Zap, Loader2 } from 'lucide-react';

// 1. Die eigentliche Logik in eine Unterkomponente auslagern
function VerifyIdentityContent() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const router = useRouter();
    const searchParams = useSearchParams(); // Das hier braucht Suspense
    const email = searchParams.get('email') || '';

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await verifyCustomerCode(email, code);

        if (result.success) {
            router.push('/login?status=activated');
        } else {
            setError(result.error || "UPLINK_DENIED");
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md bg-black/80 border border-orange-500/30 rounded-3xl p-8 relative z-10 shadow-[0_0_50px_rgba(234,88,12,0.1)]">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
                    <ShieldAlert className="text-orange-500" size={32} />
                </div>
                <h1 className="text-2xl font-black uppercase italic tracking-tighter">
                    Verify <span className="text-orange-600">Identity</span>
                </h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mt-2">
                    Waiting for Encryption Key...
                </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold text-zinc-500 ml-2 tracking-widest">
                        6-Digit Uplink Code
                    </label>
                    <input
                        type="text"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="000000"
                        className="w-full bg-zinc-900/50 border border-white/10 p-5 rounded-2xl text-center text-3xl font-mono tracking-[0.5em] text-orange-500 focus:border-orange-500/50 outline-none transition-all"
                        required
                    />
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-[10px] text-red-500 text-center uppercase font-bold tracking-widest">
                        {error}
                    </div>
                )}

                <button
                    disabled={loading || code.length < 6}
                    className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(234,88,12,0.2)] uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
                    {loading ? 'Verifying...' : 'Authorize Uplink'}
                </button>
            </form>

            <p className="text-center text-[9px] text-zinc-600 mt-8 uppercase tracking-widest">
                Code sent to: <span className="text-zinc-400">{email}</span>
            </p>
        </div>
    );
}

// 2. Die Hauptkomponente als Wrapper mit Suspense
export default function VerifyIdentityPage() {
    return (
        <div className="min-h-screen bg-[#020406] text-white flex items-center justify-center p-4 font-sans relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-20" />
            
            <Suspense fallback={
                <div className="flex items-center gap-4 text-orange-500 font-mono text-xs uppercase tracking-widest animate-pulse">
                    <Loader2 className="animate-spin" size={16} />
                    Initializing AETHER_AUTH Session...
                </div>
            }>
                <VerifyIdentityContent />
            </Suspense>
        </div>
    );
}