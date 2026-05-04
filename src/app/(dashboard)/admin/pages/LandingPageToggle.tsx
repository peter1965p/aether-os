"use client";

import { useState } from "react";
import { Power, Loader2 } from "lucide-react";
import { updateLandingpage } from "@/lib/actions/sector.actions"; // Import der Action
import { useRouter } from "next/navigation";

interface ToggleProps {
  pageId: number | string;
  initialIsLandingPage: boolean;
}

export function LandingPageToggle({ pageId, initialIsLandingPage }: ToggleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    if (initialIsLandingPage) return; // Schon aktiv, nichts zu tun

    setIsLoading(true);
    try {
      const result = await updateLandingpage(String(pageId));
      if (result.success) {
        // Refresh sorgt dafür, dass die Server Component die Daten neu lädt
        router.refresh();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Toggle Failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <button
          onClick={handleToggle}
          disabled={isLoading || initialIsLandingPage}
          className={`
      group flex items-center gap-2 px-3 py-1.5 border rounded-sm transition-all 
      text-[8px] font-black uppercase tracking-widest
      ${isLoading ? "opacity-50" : "opacity-100"}
      ${initialIsLandingPage
              ? "border-orange-500 bg-orange-500 text-white cursor-default"
              : "border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-blue-500/50 hover:text-blue-400"
          }
    `.replace(/\s+/g, ' ').trim()}
      >
        {isLoading ? (
            <Loader2 size={10} className="animate-spin" />
        ) : (
            <Power
                size={10}
                className={initialIsLandingPage ? "text-white" : "text-zinc-700 group-hover:text-blue-500"}
            />
        )}
        <span>
      {initialIsLandingPage ? "Active_Root" : "Set_Landing"}
    </span>
      </button>
  );
}