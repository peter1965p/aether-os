/**
 * AETHER OS // AUTH // COMPONENT
 * Pfad: src/modules/auth/components/ResendEmailButton.tsx
 */

'use client';

import { useState, useEffect } from 'react';
import { resendVerificationEmail } from '../actions';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

export default function ResendEmailButton({ email }: { email: string }) {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Timer-Logik für den Cooldown (60 Sekunden)
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleResend = async () => {
        setLoading(true);
        const result = await resendVerificationEmail(email);
        setLoading(false);

        if (result.success) {
            setSent(true);
            setCountdown(60); // 60 Sekunden Sperre
            setTimeout(() => setSent(false), 5000); // Erfolgsmeldung nach 5 Sek ausblenden
        }
    };

    return (
        <div className="space-y-4 font-mono">
            <button
                onClick={handleResend}
                disabled={loading || countdown > 0}
                className={`
                    w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-[0.2em] transition-all
                    ${countdown > 0
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                    : 'bg-blue-600 text-black hover:bg-white active:scale-95 border border-transparent'}
                `}
            >
                {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : sent ? (
                    <CheckCircle size={16} />
                ) : (
                    <Mail size={16} />
                )}

                {countdown > 0
                    ? `Retry_in_${countdown}s`
                    : sent
                        ? 'Email_Dispatched'
                        : 'Resend_Verification_Link'}
            </button>

            {sent && (
                <p className="text-[9px] text-green-500 text-center animate-pulse font-black uppercase">
                    Check_your_inbox_and_spam_folder
                </p>
            )}
        </div>
    );
}