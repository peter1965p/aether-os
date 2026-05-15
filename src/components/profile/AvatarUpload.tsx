"use client";

import React from "react";
import { uploadAvatar } from "@/modules/auth/avatar-actions";
import { useRouter } from "next/navigation";

interface AvatarUploadProps {
  userId: string;
  currentUrl?: string | null;
}

export default function AvatarUpload({ userId, currentUrl }: AvatarUploadProps) {
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // DEBUG: Wenn das hier im Browser-Log erscheint, wissen wir, was fehlt!
    console.log("AETHER_TRACE: Client-side userId is:", userId);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const result = await uploadAvatar(formData, userId);

      if (result.success) {
        router.refresh();
      } else {
        console.error("Uplink_Failed:", result.error);
        alert(`Uplink_Failed: ${result.error}`);
      }
    } catch (err: any) {
      console.error("CRITICAL_UPLINK_ERROR:", err);
    }
  };

  return (
    <div className="relative group cursor-pointer">
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
        accept="image/*"
      />
      <div className="w-32 h-32 rounded-full border-2 border-dashed border-zinc-800 flex items-center justify-center overflow-hidden bg-zinc-950 group-hover:border-blue-500 transition-colors">
        {currentUrl ? (
          <img src={currentUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="text-zinc-700 text-xs font-mono uppercase">No_Data</div>
        )}
      </div>
    </div>
  );
}