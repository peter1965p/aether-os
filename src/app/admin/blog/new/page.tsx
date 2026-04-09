'use client';

import { createPost } from '@/modules/blog/actions';
import { useState } from 'react';
import { Upload, X, Terminal } from 'lucide-react';

export default function NewPostPage() {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* WICHTIG: enctype hinzugefügt für Datei-Upload */}    
      <form action={createPost} encType="multipart/form-data" className="grid grid-cols-12 gap-8">

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-[2rem]">
            <h2 className="text-[#ff4d00] text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <Terminal size={14} /> System Config
            </h2>

            <div className="relative aspect-video bg-[#050505] border-2 border-dashed border-[#222] rounded-2xl overflow-hidden mb-6 group">
              {preview ? (
                <>
                  <img src={preview} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setPreview(null)} className="absolute top-2 right-2 p-1 bg-black/80 rounded-full text-white hover:bg-[#ff4d00]"><X size={12}/></button>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-[#080808]">
                  <Upload className="text-[#333] mb-2" />
                  <span className="text-[10px] font-bold text-[#444] uppercase">Main Image</span>
                  {/* WICHTIG: name="image" passend zur Action */}
                  <input type="file" name="image" className="hidden" onChange={(e) => setPreview(URL.createObjectURL(e.target.files![0]))} />
                </label>
              )}
            </div>

            <div className="space-y-4">
              <input name="title" placeholder="Article Title..." className="w-full bg-[#050505] border border-[#222] rounded-xl px-4 py-3 text-white text-sm focus:border-[#ff4d00] outline-none" required />
              <textarea name="excerpt" placeholder="Short teaser..." rows={3} className="w-full bg-[#050505] border border-[#222] rounded-xl px-4 py-3 text-white text-sm focus:border-[#ff4d00] outline-none resize-none" required />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[2rem] overflow-hidden flex flex-col h-[600px]">
            <div className="bg-[#050505] px-6 py-4 border-b border-[#1a1a1a] flex justify-between items-center">
              <span className="text-[10px] font-black text-[#444] uppercase">AETHER_CONTENT_STREAM</span>
              <button type="submit" className="bg-[#ff4d00] text-white px-8 py-2 rounded-xl text-[10px] font-black uppercase hover:scale-105 transition-transform">
                Deploy to Kernel
              </button>
            </div>
            <textarea name="content" className="flex-1 w-full bg-transparent p-8 text-slate-300 font-mono text-sm leading-relaxed outline-none resize-none" placeholder="// Start writing..." required />
          </div>
        </div>
      </form>
    </div>
  );
}
