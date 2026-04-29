"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
// WICHTIG: Importiere deine Logout-Action, um die Cookies WIRKLICH zu löschen
import { handleLogout } from "@/modules/auth/actions";

// Konstanten außerhalb der Komponente definieren, um Re-Creations zu vermeiden
const LOGOUT_TIME = 15 * 60 * 1000; 
const WARNING_TIME = 30;
const THROTTLE_TIME = 2000;

export default function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_TIME);
  const router = useRouter();
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const showWarningRef = useRef(false);

  // Die Session-Beendigung jetzt sauber entkoppelt
  const logout = useCallback(async () => {
    console.log("AETHER_OS: Security Protocol - Automatic Node Termination");
    // Nicht nur router.push, sondern die Cookies im Kernel rasieren!
    await handleLogout();
  }, []);

  const resetTimer = useCallback(() => {
    setShowWarning(false);
    setCountdown(WARNING_TIME);
  }, []);

  // Sync die Ref mit dem State
  useEffect(() => {
    showWarningRef.current = showWarning;
  }, [showWarning]);

  useEffect(() => {
    const handleActivity = () => {
      const now = Date.now();
      
      // Falls die Warnung schon da ist: Sofort zurücksetzen
      if (showWarningRef.current) {
        resetTimer();
        lastActivityRef.current = now;
      }

      // Throttle: Den Timer nur alle 2 Sekunden neu setzen, 
      // außer die Warnung ist gerade aktiv. Das spart CPU-Zyklen.
      if (now - lastActivityRef.current < THROTTLE_TIME && !showWarningRef.current) {
        return;
      }
      lastActivityRef.current = now;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowWarning(true);
      }, LOGOUT_TIME);
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
    events.forEach((e) => window.addEventListener(e, handleActivity));

    timeoutRef.current = setTimeout(() => setShowWarning(true), LOGOUT_TIME);

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // showWarning wurde aus den Dependencies entfernt, da wir showWarningRef nutzen
  }, [resetTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (showWarning && countdown > 0) {
      interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (showWarning && countdown === 0) {
      // FIX: Wir nutzen einen Timeout von 0, um den Render-Zyklus zu verlassen
      // Das verhindert den "Cannot update a component while rendering" Fehler!
      const trigger = setTimeout(() => {
        logout();
      }, 0);
      return () => clearTimeout(trigger);
    }

    return () => clearInterval(interval);
  }, [showWarning, countdown, logout]);

  if (!showWarning) return null;

  return (
      <div className="fixed inset-0 bg-[#000]/95 backdrop-blur-2xl flex items-center justify-center z-[9999] p-6 animate-in fade-in duration-500">
        <div className="bg-[#0d0d0d] border border-blue-700/30 p-10 rounded-[2.5rem] max-w-lg w-full text-center shadow-[0_0_100px_rgba(29,78,216,0.1)]">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-500/10 rounded-2xl animate-pulse">
              <AlertTriangle className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <h2 className="text-[14px] font-black uppercase tracking-[0.4em] text-white mb-2 italic">
            Security Alert
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-8">
            Inactivity detected. Terminating Node in{" "}
            <span className="text-blue-500 font-black text-lg ml-2">
            {countdown}s
          </span>
          </p>
          <button
              onClick={resetTimer}
              className="w-full bg-blue-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-white hover:text-black transition-all duration-300 text-[10px] active:scale-95"
          >
            Resume Connection
          </button>
        </div>
      </div>
  );
}