"use client";

import React, { useState, useEffect } from "react";
import { 
  Image as ImageIcon, 
  ShoppingBag, 
  BookOpen, 
  Upload, 
  FolderPlus, 
  Trash2,
  LayoutGrid
} from "lucide-react";

// Die Namen müssen exakt mit deinen Dateien in /public/images/... übereinstimmen
const INITIAL_DATA = {
  blog: ["demo-blog.jpg"],
  shop: ["product-01.png"]
};

export default function GalleryMissionControl() {
  const [activeTab, setActiveTab] = useState<"blog" | "shop">("blog");
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(INITIAL_DATA);

  // Hier könnte später eine Server Action die echten Dateinamen aus der DB laden
  const currentImages = images[activeTab];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    
    // Simulierter Upload-Prozess
    // Hier würde im echten Case die Server Action 'uploadImage' aufgerufen werden
    setTimeout(() => {
      setUploading(false);
      console.log("Upload abgeschlossen für Kategorie:", activeTab);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white p-8 md:p-12 font-mono pb-32">
      
      {/* HEADER BEREICH */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/5 pb-8 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <LayoutGrid size={20} className="text-[#b33927]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">AETHER Asset Registry</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
            Media <span className="text-[#b33927]">Vault</span>
          </h1>
        </div>
        
        <label className="cursor-pointer bg-[#b33927] hover:bg-[#912e20] text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(179,57,39,0.3)] hover:scale-105 active:scale-95">
          <Upload size={16} /> 
          {uploading ? "Ingesting..." : `Upload to ${activeTab}`}
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {/* TABS ZUR TRENNUNG (BLOG / SHOP) */}
      <div className="flex gap-4 mb-10">
        <button 
          onClick={() => setActiveTab("blog")}
          className={`px-8 py-4 rounded-[1.5rem] border transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest
          ${activeTab === "blog" 
            ? "bg-white/5 border-[#b33927] text-white shadow-[inset_0_0_20px_rgba(179,57,39,0.1)]" 
            : "border-white/5 text-zinc-600 hover:border-white/20"}`}
        >
          <BookOpen size={16} /> Blog Assets
        </button>
        <button 
          onClick={() => setActiveTab("shop")}
          className={`px-8 py-4 rounded-[1.5rem] border transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest
          ${activeTab === "shop" 
            ? "bg-white/5 border-[#b33927] text-white shadow-[inset_0_0_20px_rgba(179,57,39,0.1)]" 
            : "border-white/5 text-zinc-600 hover:border-white/20"}`}
        >
          <ShoppingBag size={16} /> Shop Products
        </button>
      </div>

      {/* GALLERY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {currentImages.map((img, i) => (
          <div key={i} className="group relative aspect-square bg-zinc-900/50 rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-[#b33927]/40 transition-all duration-500 shadow-2xl">
            
            {/* Bild-Rendering mit Pfad-Logik */}
            <img 
              src={`/images/${activeTab}/${img}`} 
              alt={img}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/400?text=Asset+Not+Found";
              }}
            />

            {/* Icon als Fallback (wird überlagert) */}
            <div className="absolute inset-0 flex items-center justify-center text-zinc-800 -z-10">
              <ImageIcon size={48} />
            </div>
            
            {/* ACTION OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
              <div className="flex justify-end">
                <button className="p-3 bg-[#b33927]/90 hover:bg-[#b33927] text-white rounded-full transition-all hover:rotate-90 shadow-xl">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="space-y-1">
                <p className="text-[8px] text-[#b33927] font-black uppercase tracking-widest">Path: /images/{activeTab}/</p>
                <p className="text-[10px] text-white truncate uppercase font-bold tracking-tighter bg-black/50 backdrop-blur-md px-2 py-1 rounded">
                  {img}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* ADD NEW ASSET SLOT */}
        <label className="aspect-square border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-zinc-700 hover:text-[#b33927] hover:border-[#b33927]/30 transition-all duration-300 cursor-pointer bg-zinc-900/20 group">
          <div className="p-5 rounded-full bg-zinc-900 group-hover:scale-110 transition-transform">
            <FolderPlus size={32} />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Add Asset</span>
            <span className="text-[7px] font-bold text-zinc-800 uppercase">System Ingest</span>
          </div>
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {/* SYSTEM LOG FOOTER */}
      <div className="mt-20 border-t border-white/5 pt-8 flex items-center justify-center gap-8 opacity-30">
        <span className="text-[7px] uppercase font-bold tracking-widest flex items-center gap-2 italic">
          <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /> File_System: Active
        </span>
        <span className="text-[7px] uppercase font-bold tracking-widest flex items-center gap-2 italic">
          <div className="w-1 h-1 bg-[#b33927] rounded-full animate-pulse" /> Storage_Nodes: Synced
        </span>
      </div>
    </div>
  );
}