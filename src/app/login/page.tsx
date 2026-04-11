'use client'

import { handleLogin } from "@/modules/auth/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await handleLogin(formData);
      router.push('/admin');
      router.refresh(); 
    } catch (error) {
      console.error("Login Failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Hintergrund-Glow für Tiefe */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 p-12 rounded-[2.5rem] shadow-2xl text-center relative z-10">
        
        {/* HEADER */}
        <div>
          <h2 className="text-orange-600 uppercase tracking-tighter text-sm font-black">
            AETHER <span className="text-[#1e5d9c]">OS</span>
          </h2>
          <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.4em] mt-2">
            System Access Required
          </p>
        </div>

        {/* LOGIN FORM */}
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="IDENTIFIER"
              required
              className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/30 transition-all placeholder:text-zinc-800 text-center uppercase font-bold tracking-widest text-[11px]"
            />
            <input
              name="password"
              type="password"
              placeholder="SECURITY KEY"
              required
              className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/30 transition-all placeholder:text-zinc-800 text-center tracking-widest text-[11px]"
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

        {/* NAVIGATION LINKS */}
        <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
          <Link 
            href="/register" 
            className="flex items-center justify-center gap-2 text-zinc-500 hover:text-white transition-colors group"
          >
            <UserPlus size={14} className="group-hover:text-blue-500 transition-colors" />
            <span className="text-[9px] font-black uppercase tracking-widest">Request New Identity</span>
          </Link>

          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 text-zinc-700 hover:text-orange-500 transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[9px] font-black uppercase tracking-widest">Return to Main Terminal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}