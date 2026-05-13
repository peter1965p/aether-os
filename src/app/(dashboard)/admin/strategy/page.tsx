import React from 'react';
import { 
  getIntelligenceConfig, 
  getAccountingStats 
} from "@/modules/inventory/actions";
import { 
  Cpu, 
  Zap, 
  Target, 
  Activity, 
  Fingerprint, 
  Network,
  ChevronRight,
  BrainCircuit
} from "lucide-react";

export default async function StrategyPage() {
  const [config, stats] = await Promise.all([
    getIntelligenceConfig(),
    getAccountingStats()
  ]);

  // Fallback-Werte aus deinem SQL Schema
  const hub = (config as any) || {
    strategy_mode: 'IT-Services',
    market_pulse: 50,
    ai_context_briefing: 'System Initialized. Awaiting semantic input...',
    last_event_trigger: 'Neural Link Established'
  };

  return (
    <div className="p-8 bg-[#020202] min-h-screen text-white font-mono selection:bg-green-500/30">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-12 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
            <p className="text-green-500 text-[10px] tracking-[0.4em] uppercase font-black">
              Aether_OS // Neural_Strategy_Hub_v4.0
            </p>
          </div>
          <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">
            Strategy <span className="text-zinc-800">Control</span>
          </h1>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-1">Current_Mode</p>
          <div className="px-6 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 font-black italic uppercase tracking-tighter">
            {hub.strategy_mode}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: SEMANTIC FINGERPRINT & CONTEXT */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-zinc-900/20 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <BrainCircuit size={180} />
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <Fingerprint className="text-green-500" />
              <h2 className="text-xl font-black uppercase italic tracking-tighter">Semantic_Context_Briefing</h2>
            </div>
            
            <div className="bg-black/40 border border-white/5 p-8 rounded-3xl font-mono text-sm leading-relaxed text-zinc-400 italic">
              <span className="text-green-500 mr-2"> {">"} </span>
              {hub.ai_context_briefing}
              <div className="mt-4 pt-4 border-t border-white/5 flex gap-6 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                <span>Last_Sync: {new Date().toLocaleTimeString()}</span>
                <span>Confidence: High</span>
                <span>Source: LlamaIndex_V1</span>
              </div>
            </div>
          </div>

          {/* MARKET PULSE VISUALIZER */}
          <div className="bg-zinc-900/20 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10">
            <div className="flex justify-between items-center mb-10">
               <div className="flex items-center gap-4">
                  <Activity size={24} className="text-green-500" />
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em]">Market_Pulse_Index</p>
               </div>
               <span className="text-4xl font-black italic text-green-500">{hub.market_pulse}%</span>
            </div>
            
            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-green-600 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(34,197,94,0.4)]" 
                  style={{ width: `${hub.market_pulse}%` }} 
                />
            </div>
            <div className="flex justify-between mt-4 text-[8px] font-black text-zinc-700 uppercase tracking-widest">
                <span>Low_Activity</span>
                <span>Optimal_Target_Range</span>
                <span>Saturation_Point</span>
            </div>
          </div>
        </div>

        {/* RIGHT: SYSTEM OPERATIONS & TARGETS */}
        <div className="space-y-8">
          
          {/* STRATEGY MODES SELECTION */}
          <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex items-center gap-3 mb-8 text-zinc-500">
               <Target size={18} />
               <p className="text-[10px] font-black uppercase tracking-[0.3em]">Active_Strategy_Nodes</p>
            </div>
            
            <div className="space-y-3">
              {['IT-Services', 'Cloud-Management', 'Retail-Optimization', 'Personal-Workflow'].map((mode) => (
                <button 
                  key={mode}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group ${
                    hub.strategy_mode === mode 
                    ? 'bg-green-500/10 border-green-500/30 text-green-500 shadow-lg shadow-green-500/5' 
                    : 'bg-black/20 border-white/5 text-zinc-600 hover:border-white/10'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-tighter italic">{mode}</span>
                  <ChevronRight size={14} className={`group-hover:translate-x-1 transition-transform ${hub.strategy_mode === mode ? 'opacity-100' : 'opacity-20'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* LIVE TELEMETRY LOG */}
          <div className="bg-black border border-white/5 rounded-[2.5rem] p-8 flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-6 text-zinc-700">
               <Network size={18} />
               <p className="text-[10px] font-black uppercase tracking-[0.3em]">Neural_Log</p>
            </div>
            <div className="flex-1 font-mono text-[9px] text-zinc-600 space-y-2 italic">
               <p className="flex justify-between border-b border-white/5 pb-1">
                  <span>SYSTEM_INIT</span>
                  <span className="text-green-800">READY</span>
               </p>
               <p className="flex justify-between border-b border-white/5 pb-1">
                  <span>SYNC_NeonDB</span>
                  <span className="text-green-800">OK</span>
               </p>
               <p className="flex justify-between border-b border-white/5 pb-1">
                  <span>LAST_EVENT</span>
                  <span className="text-zinc-400 truncate ml-4 uppercase">{hub.last_event_trigger}</span>
               </p>
               <div className="mt-6 p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={10} className="text-green-500" />
                    <span className="text-green-500 font-black uppercase">Auto_Optimization</span>
                  </div>
                  <p className="text-[8px] leading-relaxed">
                    Der Kernel hat eine Effizienz-Lücke im Inventar-Modul erkannt. Strategie-Empfehlung: Re-Stock Sektor B.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}