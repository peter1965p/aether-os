'use client';

import React from 'react';
import { X, Zap } from 'lucide-react';

export default function NewTicketModal({ projects = [] }: { projects: any[] }) {
  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[100px]" />
      
      <div className="relative z-10 space-y-6">
        <header>
          <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase flex items-center gap-3">
            <Zap className="text-amber-500" size={24} fill="currentColor" />
            Initialize Task
          </h3>
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">AETHER OS // Project Engine</p>
        </header>

        <div className="space-y-4">
          <input 
            name="subject"
            placeholder="Task Subject..." 
            className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-amber-500/50 transition-all font-medium"
          />

          {/* Hier war der Fehler: Jetzt nutzen wir project_name aus der DB */}
          <select 
            name="project_id" 
            className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-white outline-none appearance-none cursor-pointer focus:border-amber-500/50"
          >
            <option value="" className="bg-[#0A0A0A]">Assign to Project...</option>
            {projects.map((proj: any) => (
              <option key={proj.id} value={proj.id} className="bg-[#0A0A0A]">
                {proj.project_name} {/* Korrektes Feld laut Diagramm */}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <select name="priority" className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-white outline-none">
              <option value="NORMAL" className="bg-[#0A0A0A]">Normal</option>
              <option value="CRITICAL" className="bg-[#0A0A0A]">Critical</option>
            </select>
            <button className="bg-amber-500 text-black font-black py-4 rounded-2xl hover:bg-amber-400 transition-all uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}