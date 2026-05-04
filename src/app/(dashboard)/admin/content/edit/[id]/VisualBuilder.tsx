"use client";
import { useState } from "react";
import { Layout, Plus, GripVertical, Trash2, Settings2, Zap, Save } from "lucide-react";

export default function VisualBuilder({ content, onUpdate }: any) {
  const [modules, setModules] = useState(content?.modules || []);

  const addModule = (type: string) => {
    const newModule = {
      id: Date.now(),
      type,
      props: { title: "NEW SYSTEM NODE", size: "text-4xl" },
    };
    const updated = [...modules, newModule];
    setModules(updated);
    onUpdate({ ...content, modules: updated });
  };

  const removeModule = (id: number) => {
    const updated = modules.filter((m: any) => m.id !== id);
    setModules(updated);
    onUpdate({ ...content, modules: updated });
  };

  return (
    <div className="flex h-[calc(100vh-200px)] gap-6 text-white p-2">
      {/* MODULE KERNEL DRAWER */}
      <div className="w-80 bg-[#080808] border border-white/5 rounded-[2.5rem] p-8 flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-2 h-2 rounded-full bg-[#ff4d00] shadow-[0_0_10px_#ff4d00]" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff4d00]">
            System_Modules
          </h3>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {[
            { id: "hero", label: "Aether Hero", icon: <Layout size={14} /> },
            { id: "content", label: "Data Block", icon: <Plus size={14} /> },
            { id: "grid", label: "Service Grid", icon: <GripVertical size={14} /> },
          ].map((mod) => (
            <button
              key={mod.id}
              onClick={() => addModule(mod.id)}
              className="w-full flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#ff4d00]/40 hover:bg-[#ff4d00]/5 transition-all group"
            >
              <span className="text-[11px] font-bold uppercase tracking-tight text-white/40 group-hover:text-white transition-colors">
                {mod.label}
              </span>
              <div className="p-2 bg-black rounded-lg text-white/10 group-hover:text-[#ff4d00] transition-colors border border-white/5">
                {mod.icon}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CORE CANVAS */}
      <div className="flex-1 bg-[#020202] border border-white/5 rounded-[3.5rem] p-12 overflow-y-auto relative">
        <div className="max-w-3xl mx-auto space-y-8">
          {modules.length === 0 ? (
            <div className="border-2 border-dashed border-white/5 rounded-[3rem] h-96 flex flex-col items-center justify-center group">
               <p className="text-[9px] font-mono uppercase tracking-[0.6em] text-white/10 group-hover:text-[#ff4d00]/40 transition-colors">
                Waiting for Node Initialization...
              </p>
            </div>
          ) : (
            modules.map((mod: any) => (
              <div
                key={mod.id}
                className="group relative bg-[#080808] border border-white/5 p-12 rounded-[3rem] hover:border-[#ff4d00]/20 transition-all"
              >
                {/* Precision Controls */}
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <button className="p-3 bg-[#ff4d00] text-white rounded-2xl shadow-[0_0_20px_rgba(255,77,0,0.3)] hover:scale-110 active:scale-95 transition-all">
                    <GripVertical size={16} />
                  </button>
                  <button 
                    onClick={() => removeModule(mod.id)}
                    className="p-3 bg-black border border-red-500/30 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex justify-between items-center mb-8 opacity-40 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] font-black text-[#ff4d00] uppercase tracking-widest">
                    ID::{mod.id.toString().slice(-4)} // TYPE::{mod.type}
                  </span>
                  <Settings2 size={14} className="text-white/20 hover:text-white cursor-pointer" />
                </div>

                <h2 className={`font-black uppercase tracking-tighter italic ${mod.props.size} text-white`}>
                  {mod.props.title}
                </h2>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}