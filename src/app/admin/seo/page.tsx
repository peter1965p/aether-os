"use client";

import React, { useState, useEffect } from "react";
import { 
  Zap, ShieldCheck, TrendingUp, Cpu, 
  RefreshCcw, Radio, Sparkles, Activity, Layers, Globe, BarChart3,
  MapPin, Gift, Edit3, Save, Search
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { updateSEOKeywords } from "@/modules/seo/seo.actions"; // Pfad ggf. anpassen

export default function MissionControl() {
  const [analyzing, setAnalyzing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [lastEvent, setLastEvent] = useState("Blog Post: 'Cyber-Security 2026'");
  
  // States für die Keyword-Konfiguration
  const [targetKeywords, setTargetKeywords] = useState("IT Infrastructure, Field Operations, Next.js Development, NRW, AETHER OS");

  const triggerManualSync = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 2500);
  };

  const handleSaveKeywords = async () => {
    const kwArray = targetKeywords.split(",").map(k => k.trim());
    const result = await updateSEOKeywords(kwArray);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const trendData = [
    { h: "Mo", v: 30 }, { h: "Di", v: 45 }, { h: "Mi", v: 40 }, 
    { h: "Do", v: 75 }, { h: "Fr", v: 85 }, { h: "Sa", v: 92 }, { h: "So", v: 98 }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white p-4 md:p-12 space-y-10 pb-32">
      
      {/* 1. TOP BAR: SYSTEM STATUS */}
      <div className="flex justify-between items-center bg-zinc-950/50 border border-white/5 p-6 rounded-[2rem] backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-3 h-3 bg-[#b33927] rounded-full animate-ping absolute" />
            <div className="w-3 h-3 bg-[#b33927] rounded-full relative" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">AETHER Intelligence Core Active</span>
            <span className="text-[8px] text-[#b33927] font-bold uppercase tracking-widest mt-1">SEO & GEO Module // Perpetual Free Edition</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-[9px] font-mono text-zinc-600 uppercase">
          <span className="flex items-center gap-2"><MapPin size={10} className="text-[#b33927]"/> Geo-Fence: Active</span>
          <span className="flex items-center gap-2"><Gift size={10} className="text-emerald-500"/> Core Status: Free</span>
        </div>
      </div>

      {/* 2. MAIN INTELLIGENCE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* HERO DISPLAY */}
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/5 p-10 rounded-[3.5rem] relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="bg-[#b33927]/10 text-[#b33927] px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest inline-flex items-center gap-2 border border-[#b33927]/20">
                <Sparkles size={12}/> Auto-Adaptive SEO Enabled
              </div>
              <h1 className="text-4xl md:text-7xl font-black italic uppercase leading-tight tracking-tighter">
                Sichtbarkeit <br />
                <span className="text-[#b33927]">vollautomatisch.</span>
              </h1>
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest flex items-center gap-3">
                <Activity size={14} className="text-[#b33927]" /> Letzter Trigger: {lastEvent}
              </p>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#b33927]/10 blur-[120px] rounded-full -mr-20 -mt-20 group-hover:bg-[#b33927]/20 transition-all duration-700" />
          </div>

          {/* PROJECTED GROWTH CHART */}
          <div className="bg-zinc-950 border border-white/5 p-10 rounded-[3rem] space-y-8 relative overflow-hidden">
            <div className="flex justify-between items-end relative z-10">
              <div className="space-y-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                  <BarChart3 size={14} /> 14-Day Visibility Forecast
                </h3>
              </div>
              <span className="text-3xl font-black italic text-emerald-500">+42.8%</span>
            </div>
            <div className="h-64 w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b33927" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#b33927" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(179,57,39,0.3)', borderRadius: '15px', fontSize: '10px', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="v" stroke="#b33927" strokeWidth={5} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. NEW: KEYWORD CONFIGURATION PANEL (THE MISSING LINK) */}
          <div className="bg-black border border-[#b33927]/30 p-10 rounded-[3rem] relative group">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b33927] flex items-center gap-2">
                  <Search size={14} /> Global Meta Configuration
                </h3>
                <p className="text-[8px] text-zinc-600 font-mono uppercase">Definiere die Keywords für KIs und Suchmaschinen</p>
              </div>
              <button 
                onClick={() => isEditing ? handleSaveKeywords() : setIsEditing(true)}
                className={`text-[9px] font-black uppercase tracking-widest px-6 py-2 rounded-full transition-all flex items-center gap-2
                  ${isEditing ? 'bg-emerald-600 text-white' : 'bg-[#b33927] text-white hover:scale-105'}`}
              >
                {isEditing ? <><Save size={12}/> Sync Metadata</> : <><Edit3 size={12}/> Edit Cluster</>}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <textarea 
                  value={targetKeywords}
                  onChange={(e) => setTargetKeywords(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-2xl p-6 text-[11px] font-mono text-[#b33927] focus:border-[#b33927] outline-none h-32 transition-all"
                  placeholder="IT Infrastructure, Cloud Services, NRW..."
                />
                <p className="text-[7px] text-zinc-700 font-mono italic uppercase text-center">Tippe Keywords getrennt durch Komma ein.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {targetKeywords.split(",").map((k, i) => (
                  <span key={i} className="bg-zinc-900 border border-white/5 px-4 py-2 rounded-xl text-[10px] font-mono text-zinc-400 uppercase">
                    {k.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* LIVE PERFORMANCE LIST */}
          <div className="bg-zinc-950 border border-white/5 p-8 rounded-[3rem] space-y-8">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-sm font-black uppercase italic tracking-widest text-white">Live Keywords</h2>
              <button onClick={triggerManualSync} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
                <RefreshCcw size={16} className={`${analyzing ? 'animate-spin text-[#b33927]' : 'text-zinc-600 group-hover:text-white'}`} />
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { kw: "Managed Services IT", score: 98, trend: "up" },
                { kw: "Cloud Security NRW", score: 94, trend: "up" },
                { kw: "Cyber-Defense KMU", score: 88, trend: "stable" },
                { kw: "IT-Systemhaus Luxemburg", score: 76, trend: "new" }
              ].map((item) => (
                <div key={item.kw} className="bg-white/[0.02] border border-white/5 p-5 rounded-[2rem] flex justify-between items-center group hover:bg-[#b33927]/5 hover:border-[#b33927]/20 transition-all duration-300">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-tighter">{item.kw}</span>
                    <span className="text-[7px] text-zinc-600 font-bold uppercase tracking-widest">{item.trend === 'new' ? 'NEU ENTDECKT' : 'STABILER TREND'}</span>
                  </div>
                  <span className="text-xs font-black text-[#b33927] italic">{item.score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI MARKET INTEL */}
          <div className="bg-[#b33927] p-8 rounded-[3rem] space-y-6 shadow-[0_25px_50px_rgba(179,57,39,0.25)] relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-sm font-black uppercase italic tracking-widest text-white flex items-center gap-2">
                <Radio size={16} className="animate-pulse" /> Market Intel
              </h3>
              <p className="text-[10px] font-mono text-white/90 leading-relaxed uppercase tracking-wider mt-4">
                Hohes Suchvolumen für <span className="text-black bg-white px-1">"Resiliente IT-Infrastruktur"</span> in deiner Region erkannt. 
                Metadaten wurden automatisch für KI-Crawler optimiert.
              </p>
              <div className="pt-6">
                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-3/4 animate-pulse" />
                </div>
              </div>
            </div>
            <Zap className="absolute -bottom-4 -right-4 text-white/10 w-24 h-24 rotate-12" />
          </div>
        </div>
      </div>

      {/* FOOTER LOG */}
      <div className="bg-zinc-950/30 border border-white/5 p-8 rounded-[2.5rem] flex flex-wrap gap-12 items-center justify-center text-[8px] font-mono text-zinc-500 uppercase tracking-[0.2em] backdrop-blur-sm">
        <div className="flex items-center gap-3 hover:text-white transition-colors cursor-default"><Layers size={14} className="text-[#b33927]"/> Sitemap Updated</div>
        <div className="flex items-center gap-3 hover:text-white transition-colors cursor-default"><Globe size={14} className="text-[#b33927]"/> Google Index Ping: OK</div>
        <div className="flex items-center gap-3 hover:text-white transition-colors cursor-default"><ShieldCheck size={14} className="text-[#b33927]"/> JSON-LD Schema: Valid</div>
        <div className="flex items-center gap-3 hover:text-white transition-colors cursor-default"><Cpu size={14} className="text-[#b33927]"/> AI-Parser: Synced</div>
      </div>
    </div>
  );
}