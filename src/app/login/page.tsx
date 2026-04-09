'use client' // WICHTIG: Wir brauchen Client-Interaktion für den manuellen Redirect

import { handleLogin } from "@/modules/auth/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      // Wir rufen die Action manuell auf
      const result = await handleLogin(formData);
      
      // Wenn die Action kein Error-Objekt zurückgibt, 
      // forcieren wir den Redirect hier nochmal zur Sicherheit
      router.push('/admin');
      router.refresh(); // Aktualisiert die Middleware-Daten (Cookies)
    } catch (error) {
      console.error("Login Failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 bg-[#0a0a0a] border border-[#1a1a1a] p-12 rounded-[2.5rem] shadow-2xl text-center">
        <div>
          <h2 className="text-orange-600 uppercase tracking-tighter text-xl">
            AETHER <span className="text-blue-600">OS</span>
          </h2>
          <p className="text-[#444444] text-[9px] font-black uppercase tracking-[0.4em] mt-2">
            System Access Required
          </p>
        </div>

        {/* Wir nutzen action={handleSubmit} um volle Kontrolle zu haben */}
        <form action={handleSubmit} className="space-y-6">
          <input
            name="email"
            type="email"
            placeholder="IDENTIFIER"
            required
            className="w-full bg-[#050505] border border-[#1a1a1a] rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-[#1a1a1a] text-center uppercase font-bold tracking-widest"
          />
          <input
            name="password"
            type="password"
            placeholder="SECURITY KEY"
            required
            className="w-full bg-[#050505] border border-[#1a1a1a] rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-[#1a1a1a] text-center tracking-widest"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-500 transition-all uppercase text-[10px] tracking-[0.2em] shadow-[0_0_20px_rgba(37,99,235,0.3)] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Validating...' : 'Execute Login'}
          </button>
        </form>
      </div>
    </div>
  );
}