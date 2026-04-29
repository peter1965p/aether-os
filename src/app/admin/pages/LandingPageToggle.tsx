"use client";

import { useState, useTransition } from "react";
import { updatePageIsLandingPage } from "./actions"; // Wir erstellen diese Server Action gleich

interface LandingPageToggleProps {
  pageId: number;
  initialIsLandingPage: boolean;
}

export function LandingPageToggle({ pageId, initialIsLandingPage }: LandingPageToggleProps) {
  const [isLandingPage, setIsLandingPage] = useState(initialIsLandingPage);
  const [isPending, startTransition] = useTransition();

  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.checked;
    setIsLandingPage(newStatus); // Optimistisches Update der UI

    startTransition(async () => {
      const { success, error } = await updatePageIsLandingPage(pageId, newStatus);
      if (error) {
        console.error("Fehler beim Aktualisieren des Landing Page Status:", error);
        setIsLandingPage(!newStatus); // Bei Fehler: UI zurücksetzen
        // Optional: Hier könntest du eine Toast-Benachrichtigung anzeigen
      }
    });
  };

  return (
    <div className={`flex items-center gap-2 px-2 py-1 rounded-sm transition-colors ${
        isLandingPage
            ? "border border-orange-500/40 bg-orange-500/10"
            : "border border-zinc-700/40 bg-zinc-800/10"
    }`}>
      <input
        type="checkbox"
        id={`landing-page-toggle-${pageId}`}
        checked={isLandingPage}
        onChange={handleToggle}
        disabled={isPending}
        // Tailwind CSS Klassen für Checkbox-Styling. Benötigt ggf. @tailwindcss/forms Plugin.
        className={`form-checkbox h-3 w-3 rounded border-zinc-600 text-orange-500 focus:ring-orange-500 bg-zinc-900 ${
            isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      />
      <label
        htmlFor={`landing-page-toggle-${pageId}`}
        className={`text-[8px] font-black uppercase tracking-tighter ${
          isLandingPage ? "text-orange-500" : "text-zinc-600"
        } ${isPending ? "opacity-50" : "cursor-pointer"}`}
      >
        {isLandingPage ? "Live_Home" : "Set_Home"}
      </label>
      {isPending && (
        <span className="relative flex h-1.5 w-1.5 ml-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
        </span>
      )}
    </div>
  );
}