"use client";

import dynamic from "next/dynamic";

// Hier ist ssr: false erlaubt, da dies eine Client Component ist
const Globe = dynamic(() => import("@/lib/geo-radar"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-zinc-900/50 animate-pulse rounded-[3rem]">
      <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">
        Initializing Orbital View...
      </span>
    </div>
  )
});

export default function GeoRadarWrapper() {
  return <Globe />;
}