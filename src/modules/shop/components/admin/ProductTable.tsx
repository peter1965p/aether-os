"use client";

import React from "react";
import { Trash2, Edit3, Package } from "lucide-react";

interface ProductTableProps {
  products: any[];
  onDeleteAction: (id: string) => void;
  onEditAction: (product: any) => void;
}

export function ProductTable({
  products,
  onDeleteAction,
  onEditAction,
}: ProductTableProps) {
  // Optimiert für dein Schema: Nimmt primär 'bild_url' (Spalte 1)
  const getThumbnail = (product: any) => {
    return product.bild_url || product.image_url || null;
  };

  return (
    <div className="w-full overflow-hidden border border-white/5 rounded-[32px] bg-white/[0.01] backdrop-blur-xl mt-6">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-center w-24">
              Asset
            </th>
            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Entity Name
            </th>
            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Category
            </th>
            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-right">
              Operations
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05]">
          {products.map((product) => {
            const thumb = getThumbnail(product);
            return (
              <tr
                key={product.id}
                className="group hover:bg-white/[0.02] transition-colors"
              >
                <td className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                    {thumb ? (
                      <img
                        src={thumb}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        alt=""
                      />
                    ) : (
                      <Package className="text-white/10" size={16} />
                    )}
                  </div>
                </td>
                <td className="p-6">
                  <div className="text-sm font-black text-white uppercase italic tracking-tighter">
                    {product.name}
                  </div>
                  <div className="text-[9px] text-white/20 font-mono italic">
                    NODE_ID: {product.id}
                  </div>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1 rounded-full border border-white/5 bg-white/[0.03] text-[9px] font-black uppercase text-white/30 group-hover:text-amber-500 group-hover:border-amber-500/30 transition-all">
                    {/* Zeigt category_name aus dem JOIN oder die ID an */}
                    {product.category_name || `CAT_ID: ${product.category_id}`}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEditAction(product)}
                      className="p-3 text-white/10 hover:text-amber-500 hover:bg-amber-500/10 rounded-2xl transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => onDeleteAction(product.id.toString())}
                      className="p-3 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
