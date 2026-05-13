/**
 * AETHER OS // IDENTITY_INITIALIZATION
 * Perfect Visual Match for image_2ae0be.png & image_2b39f8.jpg
 */

import Link from 'next/link';
import Image from "next/image";
import { UserIcon, UserPlusIcon, ShoppingBagIcon, Shield, ArrowUpRight } from "lucide-react";

export default async function IdentificationPage({
                                                   searchParams
                                                 }: {
  searchParams: Promise<{ orderId: string }>
}) {
  const { orderId } = await searchParams;

  return (
      <div className="relative min-h-screen bg-[#020406] text-white flex flex-col items-center justify-center overflow-hidden font-mono selection:bg-blue-500/30">

        {/* --- ATMOSPHERIC BACKGROUND LAYER (Matching Hero) --- */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
              src="/images/aether-header.png"
              alt="Aether OS Cosmic Interface"
              fill
              priority
              className="object-cover opacity-40 scale-110 blur-sm"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#020406_90%)] opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#020406] via-transparent to-[#020406]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">

          {/* --- STATUS BADGE --- */}
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-orange-500/30 bg-black/60 backdrop-blur-2xl text-orange-500 text-[10px] tracking-[0.5em] uppercase mb-16 animate-pulse shadow-[0_0_40px_rgba(234,88,12,0.1)]">
            <Shield size={14} /> Neural_Link_Established // ORDER_ID: {orderId}
          </div>

          {/* --- MASSIVE HERO TITLE (Chrome/Glow Effect) --- */}
          <div className="text-center mb-24">
            <h1 className="text-[6rem] md:text-[10rem] font-black tracking-[-0.08em] leading-none uppercase">
            <span className="relative bg-gradient-to-b from-zinc-100 via-zinc-400 to-zinc-700 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">
              Ident
            </span>
              <span className="relative italic ml-4 bg-gradient-to-b from-orange-200 via-orange-500 to-orange-950 bg-clip-text text-transparent drop-shadow-[0_0_70px_rgba(234,88,12,0.6)]">
              Required
            </span>
            </h1>
            <p className="mt-8 text-blue-400/40 text-[11px] tracking-[1.5em] uppercase italic opacity-80">
              Initial_Protocol // Identity_Verification
            </p>
          </div>

          {/* --- SELECTION MATRIX (Grid System from Main Page) --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 w-full border border-white/5 bg-white/[0.01] backdrop-blur-3xl">

            {/* LOGIN NODE */}
            <Link href={`/login?orderId=${orderId}`} className="group p-16 border-r border-white/5 last:border-r-0 hover:bg-orange-600/[0.02] transition-all relative overflow-hidden">
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-zinc-500 transition-all duration-700 group-hover:w-full"></div>
              <div className="flex justify-between items-start mb-16">
                <div className="p-4 border border-zinc-500/20 group-hover:border-zinc-500 transition-colors">
                  <UserIcon className="text-zinc-500" size={24} />
                </div>
                <span className="text-[10px] text-zinc-700 italic font-bold">NODE_LOGIN</span>
              </div>
              <h3 className="text-white font-black uppercase tracking-[0.2em] mb-4 italic text-2xl group-hover:text-white transition-colors">Login</h3>
              <p className="text-zinc-500 font-mono text-[10px] uppercase leading-relaxed tracking-widest">Bestandskonto nutzen und Terminal entsperren.</p>
            </Link>

            {/* REGISTER NODE (High-Energy Highlight) */}
            <Link href={`/register?orderId=${orderId}`} className="group p-16 border-r border-white/5 last:border-r-0 bg-orange-600/5 hover:bg-orange-600 transition-all relative overflow-hidden shadow-[inset_0_0_100px_rgba(234,88,12,0.1)] group-hover:shadow-none">
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-700 group-hover:w-full shadow-[0_0_15px_#fff]"></div>
              <div className="flex justify-between items-start mb-16">
                <div className="p-4 border border-orange-500 bg-orange-600 group-hover:bg-black group-hover:border-black transition-colors shadow-[0_0_30px_rgba(234,88,12,0.5)]">
                  <UserPlusIcon className="text-white group-hover:text-orange-500" size={24} />
                </div>
                <span className="text-[10px] text-orange-600 group-hover:text-black italic font-bold tracking-widest uppercase">Core_Init</span>
              </div>
              <h3 className="text-orange-500 group-hover:text-black font-black uppercase tracking-[0.2em] mb-4 italic text-2xl transition-colors">Neu Hier</h3>
              <p className="text-zinc-400 group-hover:text-black/70 font-mono text-[10px] uppercase leading-relaxed tracking-widest font-bold">Konto erstellen, Assets sichern und Operator werden.</p>
              <div className="mt-12 flex items-center gap-3 text-[11px] font-black text-orange-500 group-hover:text-black uppercase tracking-widest transition-colors">
                Establish Uplink <ArrowUpRight size={18} />
              </div>
            </Link>

            {/* GUEST NODE */}
            <Link href={`/checkout/payment?orderId=${orderId}`} className="group p-16 border-r border-white/5 last:border-r-0 hover:bg-blue-600/[0.02] transition-all relative overflow-hidden">
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-700 group-hover:w-full shadow-[0_0_15px_#3b82f6]"></div>
              <div className="flex justify-between items-start mb-16">
                <div className="p-4 border border-blue-500/20 group-hover:border-blue-500 transition-colors">
                  <ShoppingBagIcon className="text-blue-500" size={24} />
                </div>
                <span className="text-[10px] text-zinc-700 italic font-bold">ANON_PAY</span>
              </div>
              <h3 className="text-white font-black uppercase tracking-[0.2em] mb-4 italic text-2xl group-hover:text-blue-500 transition-colors">Gast</h3>
              <p className="text-zinc-500 font-mono text-[10px] uppercase leading-relaxed tracking-widest">Sofortiger Checkout ohne Daten-Synchronisation.</p>
            </Link>

          </div>

          {/* --- DECORATIVE LINE (Neural Circuitry) --- */}
          <div className="mt-24 flex flex-col items-center gap-6">
            <div className="w-[1px] h-32 bg-gradient-to-b from-orange-600 to-transparent"></div>
            <div className="text-[10px] font-black uppercase tracking-[1.2em] text-zinc-800 italic">
              No_Legacy // Only_Results
            </div>
          </div>
        </div>
      </div>
  );
}