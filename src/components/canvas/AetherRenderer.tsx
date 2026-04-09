'use client';

import React from 'react';
import { THEME_COMPONENTS } from '../layout/shared/theme/registry';

export default function AetherRenderer({ layers }: { layers: any[] }) {
  {/* Page Management Bar */}
<div className="h-12 border-b border-white/5 bg-[#050505] flex items-center px-4 justify-between">
  <div className="flex items-center gap-4">
    <select className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none border border-white/10 px-2 py-1 rounded">
      <option>Frontpage (/) </option>
      <option>About Us (/about)</option>
    </select>
    <button className="text-[10px] text-green-500 hover:text-green-400 font-bold">+ NEUE SEITE</button>
  </div>

  <div className="flex items-center gap-3">
    <button
      onClick={() => { if(confirm("Seite wirklich löschen?")) alert("Gelöscht!"); }}
      className="text-[10px] text-red-500/50 hover:text-red-500 font-bold"
    >
      SEITE LÖSCHEN
    </button>
  </div>
</div>

  if (!layers || !Array.isArray(layers)) return null;

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-950">
      {layers.map((layer) => {
        const Component = THEME_COMPONENTS[layer.component];

        // Komponente nicht in der Registry? Überspringen!
        if (!Component) return null;

        return (
          <section key={layer.id} className="w-full">
            <Component {...layer.data} />
          </section>
        );
      })}
    </div>
  );
}
