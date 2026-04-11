"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/db"; // Wichtig: Browser-Client nutzen

export default function Tracker() {
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const trackVisit = async () => {
      const ua = navigator.userAgent;
      // Bot-Erkennung: Filtert Google, Bing, Crawler etc.
      const isBot = /bot|crawler|spider|crawling|slurp|duckduckgo|googlebot|bingbot/i.test(ua);

      try {
        await supabase.from("system_traffic").insert({
          path: pathname,
          is_bot: isBot,
          user_agent: ua,
          referer: document.referrer || "direct",
        });
      } catch (err) {
        console.error("AETHER // Tracking Error:", err);
      }
    };

    trackVisit();
  }, [pathname, supabase]); // Triggert bei jedem URL-Wechsel

  return null; // Komponente rendert nichts Sichtbares
}