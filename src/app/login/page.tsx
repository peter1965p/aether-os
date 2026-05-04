'use client'

import { handleLogin } from "@/modules/auth/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus, AlertTriangle } from "lucide-react";

// Wir definieren den Typ der Antwort, damit TypeScript nicht mehr meckert
interface LoginResponse {
  success: boolean;
  target?: string;
  message?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      // Cast des Ergebnisses auf unser Interface
      const result = await handleLogin(formData) as LoginResponse;

      if (result && result.success && result.target) {
        // AETHER OS erkennt den User und leitet zum richtigen Terminal
        router.push(result.target);
        router.refresh();
      } else {
        // Fehler aus der Action anzeigen
        setError(result?.message || "ACCESS DENIED: Credentials Invalid");
      }
    } catch (err) {
      console.error("Login Failed:", err);
      setError("SYSTEM CRITICAL: Terminal Connection Lost");
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-md space-y-8 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 p-12 rounded-[2.5rem] shadow-2xl text-center relative z-10">

          <div>
            <h2 className="text-orange-600 uppercase tracking-tighter text-xl">
              AETHER <span className="text-blue-900">OS</span>
            </h2>
            <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.4em] mt-2">
              System Access Required
            </p>
          </div>

          {error && (
              <div className="flex items-center gap-2 text-red-500 bg-red-900/10 border border-red-500/20 p-3 rounded-xl animate-pulse text-left">
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
                  className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/30 transition-all placeholder:text-zinc-800 text-center uppercase font-bold tracking-widest text-[11px]"
              />
              <input
                  name="password"
                  type="password"
                  placeholder="SECURITY KEY"
                  required
                  className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/30 transition-all placeholder:text-zinc-800 text-center tracking-widest text-[11px]"
              />
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#1e5d9c] text-white font-black py-5 rounded-2xl hover:bg-blue-500 transition-all uppercase text-[10px] tracking-[0.2em] shadow-[0_10px_20px_rgba(0,0,0,0.4)] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Validating Node...' : 'Execute Login'}
            </button>
          </form>

          {/* ... Navigation Links wie gehabt ... */}
        </div>
      </div>
  );
}