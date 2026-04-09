"use client";

import React, { useState } from "react";
import { ProductTable } from "./ProductTable";
import ProductModal from "./ProductModal";
import {
  saveProductToDB,
  updateProductInDB,
  deleteProductFromDB,
} from "@/modules/shop/actions";

export default function ShopClientWrapper({
  initialProducts,
  initialCategories,
}: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleSave = async (formData: any) => {
    try {
      if (editingProduct) {
        // Update bestehender Node
        await updateProductInDB(editingProduct.id, formData);
      } else {
        // Initialisierung neuer Asset
        await saveProductToDB(formData);
      }

      setIsModalOpen(false);
      setEditingProduct(null);

      // Erzwingt Refresh der Server Component Daten
      window.location.reload();
    } catch (error) {
      console.error("AETHER_SYNC_CRITICAL:", error);
      alert("System Sync Failed. Check Database Connection.");
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      confirm("DANGER: Confirm System Deletion? This action is irreversible.")
    ) {
      const success = await deleteProductFromDB(id);
      if (success) {
        window.location.reload();
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
            System <span className="text-amber-500">Inventory</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-2">
            AETHER OS // Database Live-Injection Active
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="px-8 py-4 bg-white text-black font-black uppercase italic rounded-2xl hover:bg-amber-500 transition-all active:scale-95 shadow-xl shadow-white/5"
        >
          + Add Asset
        </button>
      </div>

      {/* Die Tabelle empfängt die Props mit den neuen Namen */}
      <ProductTable
        products={initialProducts}
        onDeleteAction={handleDelete}
        onEditAction={handleEdit}
      />

      {/* Das Modal entscheidet anhand von initialData über den Modus */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        categories={initialCategories}
        onSave={handleSave}
        initialData={editingProduct}
      />
    </div>
  );
}
