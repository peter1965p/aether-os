"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Layers,
  Package,
  Zap,
  Coffee,
  Shirt,
  Disc,
  ImageIcon,
  AlignLeft,
  Box,
} from "lucide-react";

const getDynamicIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("hard")) return <Zap size={14} />;
  if (n.includes("soft")) return <Disc size={14} />;
  if (n.includes("getränk") || n.includes("drink") || n.includes("coffee"))
    return <Coffee size={14} />;
  if (n.includes("merch") || n.includes("shirt") || n.includes("accessoires"))
    return <Shirt size={14} />;
  if (n.includes("digi") || n.includes("layer") || n.includes("app"))
    return <Layers size={14} />;
  return <Box size={14} />;
};

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
  onSave: (p: {
    name: string;
    price: string;
    stock: string;
    category: string;
    description: string;
    images: string[];
  }) => void;
}

export default function NewProductModal({
  isOpen,
  onClose,
  categories,
  onSave,
}: NewProductModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");

  useEffect(() => {
    if (categories && categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  // DER HELPER INNERHALB DER KOMPONENTE
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name || !price) return;
    onSave({
      name,
      price: price + "€",
      stock: stock || "0",
      category,
      description,
      images: [img1, img2, img3].filter((url) => url !== ""),
    });
    setName("");
    setPrice("");
    setStock("");
    setDescription("");
    setImg1("");
    setImg2("");
    setImg3("");
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md text-white overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-[40px] my-8 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">
              New <span className="text-amber-500">Product</span>
            </h2>
            <p className="text-[10px] text-white/20 font-black tracking-[0.3em] mt-1 uppercase">
              Aether OS // Entry Terminal
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8 h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3 block">
                Product Name
              </label>
              <div className="relative">
                <Package
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10"
                  size={18}
                />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 pl-12 text-white outline-none focus:border-amber-500/50"
                  placeholder="e.g. Aether Core Processor"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3 block">
                Price (€)
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="text"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white font-mono"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3 block">
                Stock Amount
              </label>
              <input
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                type="number"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white font-mono"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3 block">
              System Description
            </label>
            <div className="relative">
              <AlignLeft
                className="absolute left-4 top-5 text-white/10"
                size={18}
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 pl-12 text-white min-h-[100px]"
                placeholder="Technical specifications..."
              />
            </div>
          </div>

          {/* DYNAMISCHER BILD-UPLOAD BEREICH */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block italic">
              Visual_Asset_Registry // Image Nodes
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Primary", val: img1, set: setImg1 },
                { label: "Secondary", val: img2, set: setImg2 },
                { label: "Detail", val: img3, set: setImg3 },
              ].map((img, idx) => (
                <div key={idx} className="space-y-2 group">
                  <div className="h-24 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center transition-all relative overflow-hidden group-hover:border-amber-500/30">
                    {img.val ? (
                      <img
                        src={img.val}
                        className="h-full w-full object-cover rounded-2xl opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                    ) : (
                      <ImageIcon size={20} className="text-white/10" />
                    )}
                    <label className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, img.set)}
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest bg-white text-black px-3 py-1 rounded-full">
                        Upload ...
                      </span>
                    </label>
                  </div>
                  <input
                    value={img.val}
                    onChange={(e) => img.set(e.target.value)}
                    type="text"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-2 text-[8px] font-mono outline-none focus:border-white/20"
                    placeholder={`${img.label} URL`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4 block">
              Select Category // Real_Time_Sync
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id || cat.uid}
                  onClick={() => setCategory(cat.name)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border text-[9px] font-black uppercase tracking-widest transition-all ${category === cat.name ? "bg-amber-500/10 border-amber-500 text-amber-500" : "bg-white/[0.02] border-white/5 text-white/30 hover:border-white/20"}`}
                >
                  {getDynamicIcon(cat.name)} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 flex justify-end gap-4 bg-white/[0.01]">
          <button
            onClick={onClose}
            className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
          >
            Abort
          </button>
          <button
            onClick={handleSave}
            className="px-10 py-4 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-3 shadow-[0_10px_30px_rgba(245,158,11,0.2)]"
          >
            <Save size={16} /> Finalize Product
          </button>
        </div>
      </div>
    </div>
  );
}
