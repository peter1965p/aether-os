'use client';

import React from 'react';

interface PropertyPanelProps {
  selectedLayer: any;
  onUpdate: (updatedLayer: any) => void;
  onDelete: () => void; // NEU: Die Leitung zum Löschen
}

export function PropertyPanel({ selectedLayer, onUpdate, onDelete }: PropertyPanelProps) {
  if (!selectedLayer) return (
    <div className="w-80 border-l border-white/5 bg-[#050505] p-8 flex items-center justify-center text-center">
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">Select a layer to edit</p>
    </div>
  );

  const handleChange = (path: string, value: any) => {
    const newLayer = { ...selectedLayer };
    if (path.includes('.')) {
      const [key, subKey] = path.split('.');
      newLayer[key] = { ...newLayer[key], [subKey]: value };
    } else {
      newLayer[path] = value;
    }
    onUpdate(newLayer);
  };

  return (
    <div className="w-80 border-l border-white/5 bg-[#050505] flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 bg-[#0a0a0a]">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
          Properties // {selectedLayer.type}
        </span>
      </div>

      <div className="p-6 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
        {/* Transform & Appearance (Deine bisherigen Felder) */}
        <section className="space-y-4">
          <h3 className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Position</h3>
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="number" 
              value={selectedLayer.position.x}
              onChange={(e) => handleChange('position.x', parseInt(e.target.value))}
              className="bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
            />
            <input 
              type="number" 
              value={selectedLayer.position.y}
              onChange={(e) => handleChange('position.y', parseInt(e.target.value))}
              className="bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </section>
        {/* Appearance Section */}
<section className="space-y-4">
  <h3 className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Appearance</h3>
  
  <div className="space-y-2">
    <label className="text-[8px] text-white/30 uppercase tracking-tighter">
      {selectedLayer.type === 'text' ? 'Text Color' : 'Background Color'}
    </label>
    
    <div className="flex items-center gap-3 p-2 bg-black/40 border border-white/5 rounded-xl">
      {/* Der visuelle Picker */}
      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 shadow-inner">
        <input 
          type="color" 
          value={selectedLayer.style.backgroundColor || selectedLayer.style.color || '#ffffff'}
          onChange={(e) => handleChange(selectedLayer.type === 'text' ? 'style.color' : 'style.backgroundColor', e.target.value)}
          className="absolute -inset-2 w-[150%] h-[150%] cursor-pointer bg-transparent"
        />
      </div>
      
      {/* Hex-Code Anzeige */}
      <div className="flex-1">
        <input 
          type="text" 
          value={selectedLayer.style.backgroundColor || selectedLayer.style.color || '#ffffff'}
          onChange={(e) => handleChange(selectedLayer.type === 'text' ? 'style.color' : 'style.backgroundColor', e.target.value)}
          className="w-full bg-transparent text-xs text-white font-mono outline-none focus:text-blue-400 transition-colors"
          placeholder="#000000"
        />
      </div>
    </div>
  </div>
</section>

        {selectedLayer.type === 'text' && (
          <section className="space-y-2">
            <h3 className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Content</h3>
            <textarea 
              value={selectedLayer.content}
              onChange={(e) => handleChange('content', e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white min-h-[60px]"
            />
          </section>
        )}
      </div>

      {/* DANGER ZONE: Der Lösch-Button */}
      <div className="p-6 border-t border-white/5 bg-[#080808]">
        <button 
          onClick={onDelete}
          className="w-full py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500/20 hover:border-red-500/50 transition-all"
        >
          Delete Layer
        </button>
      </div>
    </div>
  );
}