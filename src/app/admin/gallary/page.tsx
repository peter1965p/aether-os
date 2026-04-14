"use client";

import React, { useState } from "react";
import { Image as ImageIcon, ShoppingBag, BookOpen, Upload, FolderPlus, Trash2 } from "lucide-react";

export default function GalleryMissionControl() {
  const [activeTab, setActiveTab] = useState<"blog" | "shop">("blog");
  const [uploading, setUploading] = useState(false);

  // Beispiel-Daten (Sollten später via Server Action aus der DB kommen)
  const images = {
    blog: ["img1.jpg", "img2.jpg"],
    shop: ["product1.png", "product2.png"]
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("category", activeTab); // 'blog' oder 'shop'

    // Hier rufen wir gleich die Server Action auf
    // const result = await uploadImage(formData);
    
    setTimeout(() => setUploading(false), 1500); // Demo-Delay
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white p-8 md:p-12 font-mono">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Asset <span className="text-[#b33927]">Registry</span></h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-2">AETHER OS // Media Management Hub</p>
        </div>
        
        <label className="cursor-pointer bg-[#b33927] hover:bg-[#912e20] text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all">
          <Upload size={14} /> {uploading ? "Uploading..." : `Upload to ${activeTab}`}
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {/* TABS CONTROL */}
      <div className="flex gap-4 mb-10">
        <button 
          onClick={() => setActiveTab("blog")}
          className={`px-8 py-4 rounded-2xl border transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest
          ${activeTab === "blog" ? "bg-white/10 border-[#b33927] text-white" : "border-white/5 text-zinc-600 hover:border-white/20"}`}
        >
          <BookOpen size={16} /> Blog Assets
        </button>
        <button 
          onClick={() => setActiveTab("shop")}
          className={`px-8 py-4 rounded-2xl border transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest
          ${activeTab === "shop" ? "bg-white/10 border-[#b33927] text-white" : "border-white/5 text-zinc-600 hover:border-white/20"}`}
        >
          <ShoppingBag size={16} /> Shop Products
        </button>
      </div>

      {/* GALLERY GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {images[activeTab].map((img, i) => (
          <div key={i} className="group relative aspect-square bg-zinc-900 rounded-[2rem] border border-white/5 overflow-hidden hover:border-[#b33927]/50 transition-all">
            <div className="absolute inset-0 flex items-center justify-center text-zinc-800">
              <ImageIcon size={40} />
            </div>
            
            {/* OVERLAY ACTIONS */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button className="p-3 bg-[#b33927] rounded-full hover:scale-110 transition-transform">
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-[7px] text-zinc-500 truncate uppercase font-bold">{img}</p>
            </div>
          </div>
        ))}

        {/* EMPTY STATE / ADD SLOT */}
        <label className="aspect-square border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-zinc-700 hover:text-[#b33927] hover:border-[#b33927]/20 transition-all cursor-pointer">
          <FolderPlus size={32} />
          <span className="text-[8px] font-black uppercase">Add Image</span>
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      </div>
    </div>
  );
}