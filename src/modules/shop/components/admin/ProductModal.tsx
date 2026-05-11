"use client";

import React, { useState, useEffect } from "react";
import { X, Save, ImageIcon, Package } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
  onSave: (data: any) => void;
  initialData?: any;
}

export default function ProductModal({
  isOpen,
  onClose,
  categories,
  onSave,
  initialData,
}: ProductModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>(["", "", ""]);

  useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.name || "");
      // Preis-Formatierung für das Feld (ohne € für die Eingabe)
      setPrice(initialData.preis?.toString().replace("€", "") || "");
      setStock(initialData.lagerbestand?.toString() || "");

      // Mapping der Kategorie (ID zu Name für die UI)
      const catName =
        categories.find((c) => c.id === initialData.category_id)?.name || "";
      setCategory(catName);

      setDescription(initialData.beschreibung || ""); // Nutzt 'beschreibung' aus DB

      // Nutzt die drei Bild-Spalten aus deinem Schema
      setImages([
        initialData.bild_url || "",
        initialData.bild_url_2 || "",
        initialData.bild_url_3 || "",
      ]);
    } else if (isOpen) {
      setName("");
      setPrice("");
      setStock("");
      setCategory("");
      setDescription("");
      setImages(["", "", ""]);
    }
  }, [initialData, isOpen, categories]);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImgs = [...images];
        newImgs[index] = reader.result as string;
        setImages(newImgs);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
              {initialData ? "Edit" : "New"}{" "}
              <span className="text-amber-500">Asset</span>
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

        {/* Body */}
        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar text-white">
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
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 pl-12 outline-none focus:border-amber-500/50"
                  placeholder="e.g. Aether Core"
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
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 font-mono outline-none focus:border-amber-500/50"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3 block">
                Stock
              </label>
              <input
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                type="number"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 font-mono outline-none focus:border-amber-500/50"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3 block">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 min-h-[100px] outline-none focus:border-amber-500/50"
              placeholder="Technical specifications..."
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3 block">
              Visual Assets (Slots 1-3)
            </label>
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="group relative h-24 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center overflow-hidden hover:border-amber-500/30 transition-all"
                >
                  {img ? (
                    <img
                      src={img}
                      className="w-full h-full object-cover opacity-60"
                      alt="Preview"
                    />
                  ) : (
                    <ImageIcon size={20} className="text-white/10" />
                  )}
                  <label className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 backdrop-blur-sm transition-opacity">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, i)}
                    />
                    <span className="text-[9px] font-black uppercase bg-white text-black px-3 py-1 rounded-full">
                      Upload
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4 block">
              Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`p-4 rounded-2xl border text-[9px] font-black uppercase tracking-widest transition-all ${category === cat.name ? "bg-amber-500/10 border-amber-500 text-amber-500" : "bg-white/[0.02] border-white/5 text-white/30 hover:border-white/20"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 flex justify-end gap-4 bg-white/[0.01]">
          <button
            onClick={onClose}
            className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
          >
            Abort
          </button>
          <button
            onClick={() =>
              onSave({ name, price, stock, category, description, images })
            }
            className="px-10 py-4 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-3 shadow-lg shadow-amber-500/20"
          >
            <Save size={16} /> Finalize
          </button>
        </div>
      </div>
    </div>
  );
}
