"use client";

import React from "react";
import { Globe } from "lucide-react";

export default function LiveGlobeIngest() {
  return (
    <div className="bg-zinc-950 border border-white/5 p-8 rounded-[3rem] space-y-6">
      
      {/* HEADER BEREICH (wie gehabt) */}
      <div className="flex justify-between items-center px-2">
        <h2 className="text-[10px] font-black uppercase text-white tracking-widest flex items-center gap-2">
          <Globe size={14} className="text-[#b33927]" /> Live Geo Ingest
        </h2>
        <span className="text-[9px] bg-white/5 px-2 py-1 rounded text-zinc-500 uppercase font-bold">Node: 1</span>
      </div>
      
      {/* DER NEUE VISUELLE BEREICH MIT DEM LOOP */}
      <div className="h-40 bg-zinc-900/50 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
        
        {/* Die Video-Weltkugel (image_5.png Vibe) */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-auto h-full object-contain mix-blend-lighten opacity-80"
        >
          <source src="/assets/globe_loop.mp4" type="video/mp4" />
          {/* Fallback, falls Video nicht geht (dein alter Pin) */}
          <div className="text-center space-y-2">
             <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
               <Globe size={32} className="text-[#b33927] animate-pulse" />
             </div>
          </div>
        </video>
        
        {/* Optional: Text-Overlay (image_3.png Vibe) */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
           <p className="text-[8px] uppercase tracking-tighter text-zinc-500 font-bold">
             Region: NRW / Germany detected
           </p>
        </div>

        {/* Die "Digital Finish" Scan-Linie */}
        <div className="absolute inset-x-0 h-px bg-[#b33927]/30 shadow-[0_0_15px_rgba(179,57,39,0.5)] animate-scan" />
      </div>

    </div>
  );
}