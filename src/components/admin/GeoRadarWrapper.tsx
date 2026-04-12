"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const Globe = dynamic(() => import("@/lib/geo-radar"), { 
  ssr: false,
  loading: () => (
    /* Hier bauen wir exakt den Look aus deinem 3. Bild nach (Placeholder) */
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0c10] rounded-[3rem] border border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 to-transparent opacity-50" />
      
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 animate-pulse">
          <MapPin size={24} className="text-red-500" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.3em]">Region: NRW / Germany detected</span>
          <div className="h-px w-12 bg-zinc-800" />
        </div>
      </div>

      {/* Die Scan-Linie die durchs Bild läuft */}
      <div className="absolute inset-x-0 h-px bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-scan" />
    </div>
  )
});

export default function GeoRadarWrapper() {
  return <Globe />;
}