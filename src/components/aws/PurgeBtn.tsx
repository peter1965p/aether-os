"use client";

import { deleteAvatar } from "@/modules/auth/avatar-actions";
import { Trash2, ShieldAlert } from "lucide-react";

export function PurgeBtn({ userId, currentUrl }: { userId: string, currentUrl: string }) {
  const handlePurge = async () => {
    if (!confirm("Soll der Asset-Node physisch vernichtet werden?")) return;
    
    const result = await deleteAvatar(userId, currentUrl);
    if (result.success) {
      alert("Asset_Purged: Speicherplatz freigegeben.");
    }
  };

  if (!currentUrl) return null;

  return (
    <button 
      onClick={handlePurge}
      className="mt-4 flex items-center gap-2 text-[10px] bg-red-950/20 border border-red-900/50 text-red-500 px-3 py-1.5 rounded-full hover:bg-red-900/40 transition-all uppercase font-bold tracking-widest"
    >
      <Trash2 size={12} />
      Purge_S3_Asset
    </button>
  );
}