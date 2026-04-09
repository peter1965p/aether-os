'use client';

import { useState } from 'react';
import { Plus, X, Zap } from 'lucide-react';
import { createCategory } from "@/modules/inventory/actions";

export default function AddCategoryModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-500 transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)] flex items-center gap-2"
      >
        <Plus size={16} strokeWidth={3} /> New Category
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[48px] p-10 shadow-2xl">
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-10">
              <p className="text-amber-500 text-[10px] font-black tracking-[0.4em] uppercase mb-2 italic">Injection Mode</p>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
                Add <span className="text-white/40">Category</span>
              </h2>
            </div>

            <form 
              action={async (formData: FormData) => {
                const name = formData.get('name') as string;
                const type = formData.get('type') as string;
                await createCategory(name, type); //
                setIsOpen(false);
              }} 
              className="space-y-6"
            >
              {/* Name */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 ml-2">
                  Category Label
                </label>
                <input 
                  name="name"
                  type="text" 
                  required
                  placeholder="e.g. HARDWARE"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white font-bold focus:border-amber-500/50 outline-none transition-all"
                />
              </div>

              {/* System Deployment (Zusammengefasst) */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 ml-2">
                  System Deployment & Type
                </label>
                <select 
                  name="type"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white font-bold focus:border-amber-500/50 outline-none transition-all appearance-none"
                >
                  <optgroup label="Shop / Inventory" className="bg-[#0a0a0a] text-white/40">
                    <option value="PHYSICAL" className="bg-[#0a0a0a]">SHOP | Physical Item</option>
                    <option value="DIGITAL" className="bg-[#0a0a0a]">SHOP | Digital Item</option>
                  </optgroup>
                  <optgroup label="System Wide" className="bg-[#0a0a0a] text-white/40">
                    <option value="BLOG" className="bg-[#0a0a0a]">BLOG | Editorial</option>
                    <option value="SITE" className="bg-[#0a0a0a]">SITE | Frontend</option>
                    <option value="GLOBAL" className="bg-[#0a0a0a]">GLOBAL | Universal</option>
                  </optgroup>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full py-6 bg-amber-500 text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all flex items-center justify-center gap-3 mt-4"
              >
                <Zap size={18} fill="currentColor" /> Initialize Data
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}