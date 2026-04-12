"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/db";

export default function VisitorTracker() {
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const trackVisit = async () => {
      const ua = navigator.userAgent;
      // Bot-Erkennung bleibt aktiv
      const isBot = /bot|crawler|spider|crawling|slurp|duckduckgo|googlebot|bingbot/i.test(ua);

      try {
        // Wir schreiben jetzt in die neue 'visitor_logs' Tabelle aus dem Kernel
        await supabase.from("visitor_logs").insert({
          page_path: pathname,
          user_agent: ua,
          referrer: document.referrer || "direct",
          // Wir markieren Bots intern oder lassen sie später via SQL-View filtern
          session_id: isBot ? "bot-session" : undefined 
        });
        
        // Optional: Ein kleiner Log für den Dev-Modus im Browser
        if (process.env.NODE_ENV === 'development') {
          console.log(`AETHER_TRACKER: ACK -> ${pathname}`);
        }
      } catch (err) {
        console.error("AETHER // Tracking Error:", err);
      }
    };

    // 500ms Delay damit das initiale Rendering nicht blockiert wird
    const timer = setTimeout(trackVisit, 500);
    return () => clearTimeout(timer);
    
  }, [pathname, supabase]); 

  return null; 
}