"use client";

import React, { useState, useEffect } from "react";
import { 
  Image as ImageIcon, 
  ShoppingBag, 
  BookOpen, 
  Upload, 
  FolderPlus, 
  Trash2,
  LayoutGrid,
  RefreshCcw,
  AlertCircle
} from "lucide-react";
import { getGalleryImages, uploadImage } from "@/modules/gallery/gallery.actions";

export default function GalleryMissionControl() {
  const [activeTab, setActiveTab] = useState<"blog" | "shop">("blog");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<any[]>([]);

  // Holt die Daten basierend auf dem aktiven Tab (Sektor)
  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await getGalleryImages(activeTab);
      setImages(data || []);
    } catch (error) {
      console.error("Registry Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reagiert auf Tab-Wechsel
  useEffect(() => {
    loadImages();
  }, [activeTab]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("category", activeTab);

    try {
      const result = await uploadImage(formData);
      if (result.success) {
        await loadImages(); // Refresh nach Upload
      }
    } catch (error) {
      console.error("Ingest Failed:", error);
    } finally {
      setUploading(false);
      e.target.value = ""; 
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white p-8 md:p-12 font-mono pb-32">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/5 pb-8 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <LayoutGrid size={20} className="text-[#b33927]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Asset Registry</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
            Media <span className="text-[#b33927]">Vault</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={loadImages} 
            className="p-4 rounded-full border border-white/5 hover:bg-white/5 transition-all group"
            title="Refresh Registry"
          >
            <RefreshCcw size={16} className={`${loading ? "animate-spin text-[#b33927]" : "text-zinc-500 group-hover:text-white"}`} />
          </button>
          
          <label className="cursor-pointer bg-[#b33927] hover:bg-[#912e20] text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(179,57,39,0.3)] hover:scale-105 active:scale-95">
            <Upload size={16} /> 
            {uploading ? "Ingesting..." : `Upload to ${activeTab}`}
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* SECTOR TABS */}
      <div className="flex gap-4 mb-10">
        <button 
          onClick={() => setActiveTab("blog")}
          className={`px-8 py-4 rounded-[1.5rem] border transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest
          ${activeTab === "blog" 
            ? "bg-white/5 border-[#b33927] text-white shadow-[inset_0_0_20px_rgba(179,57,39,0.1)]" 
            : "border-white/5 text-zinc-600 hover:border-white/20"}`}
        >
          <BookOpen size={16} /> Blog Registry
        </button>
        <button 
          onClick={() => setActiveTab("shop")}
          className={`px-8 py-4 rounded-[1.5rem] border transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest
          ${activeTab === "shop" 
            ? "bg-white/5 border-[#b33927] text-white shadow-[inset_0_0_20px_rgba(179,57,39,0.1)]" 
            : "border-white/5 text-zinc-600 hover:border-white/20"}`}
        >
          <ShoppingBag size={16} /> Product Assets
        </button>
      </div>

      {/* ASSET GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        
        {/* ADD NEW ASSET SLOT */}
        <label className="aspect-square border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-zinc-700 hover:text-[#b33927] hover:border-[#b33927]/30 transition-all duration-300 cursor-pointer bg-zinc-900/20 group">
          <div className="p-5 rounded-full bg-zinc-900 group-hover:scale-110 transition-transform shadow-xl">
            <FolderPlus size={32} />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Add Asset</span>
            <span className="text-[7px] font-bold text-zinc-800 uppercase tracking-tighter italic">System Ingest</span>
          </div>
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>

        {/* MAPPED ASSETS */}
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square bg-zinc-900/50 rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-[#b33927]/40 transition-all duration-500 shadow-2xl">
            
            <img 
              src={img.url} 
              alt={img.file_name}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const p = (e.target as HTMLImageElement).parentElement;
                p?.querySelector(".error-ui")?.classList.remove("hidden");
                p?.querySelector(".error-ui")?.classList.add("flex");
              }}
            />
            
            {/* ERROR UI */}
            <div className="error-ui hidden absolute inset-0 flex-col items-center justify-center bg-zinc-900 p-6 text-center">
              <AlertCircle size={24} className="text-[#b33927] mb-2" />
              <p className="text-[8px] text-zinc-500 uppercase font-black break-all tracking-widest leading-relaxed">
                Source Link Broken<br/>
                <span className="text-zinc-700">{img.url}</span>
              </p>
            </div>

            {/* OVERLAY INFO & ACTIONS */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col justify-between">
              <div className="flex justify-end">
                <button className="p-3 bg-[#b33927]/90 hover:bg-[#b33927] text-white rounded-full transition-all hover:scale-110 shadow-lg">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-white truncate font-bold uppercase tracking-wider">{img.file_name}</p>
                    <p className="text-[7px] text-[#b33927] font-black uppercase tracking-[0.2em]">Node: {img.id.slice(0,8)}</p>
                  </div>
                  {activeTab === "shop" ? <ShoppingBag size={12} className="text-zinc-600" /> : <BookOpen size={12} className="text-zinc-600" />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SYSTEM STATUS FOOTER */}
      <div className="mt-20 border-t border-white/5 pt-8 flex items-center justify-center gap-8 opacity-30">
        <span className="text-[7px] uppercase font-bold tracking-widest flex items-center gap-2 italic">
          <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /> FS_STATUS: MOUNTED
        </span>
        <span className="text-[7px] uppercase font-bold tracking-widest flex items-center gap-2 italic">
          <div className="w-1 h-1 bg-[#b33927] rounded-full animate-pulse" /> DB_LINK: {images.length} NODES SYNCED
        </span>
      </div>
    </div>
  );
}