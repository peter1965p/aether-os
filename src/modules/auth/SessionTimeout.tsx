"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const router = useRouter();

  // 15 Minuten Inaktivität bis zur Warnung
  const LOGOUT_TIME = 15 * 60 * 1000;
  const WARNING_TIME = 30;

  const logout = useCallback(() => {
    console.log("AETHER_OS: Security Protocol - Automatic Node Termination");
    router.push("/login");
  }, [router]);

  const resetTimer = useCallback(() => {
    setShowWarning(false);
    setCountdown(WARNING_TIME);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleActivity = () => {
      resetTimer();
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setShowWarning(true), LOGOUT_TIME);
    };

    const events = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "mousemove",
    ];
    events.forEach((e) => window.addEventListener(e, handleActivity));

    // Initialer Start des Timers
    timeoutId = setTimeout(() => setShowWarning(true), LOGOUT_TIME);

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      clearTimeout(timeoutId);
    };
  }, [resetTimer, LOGOUT_TIME]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showWarning && countdown > 0) {
      interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (showWarning && countdown === 0) {
      logout();
    }
    return () => clearInterval(interval);
  }, [showWarning, countdown, logout]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-[#000]/95 backdrop-blur-2xl flex items-center justify-center z-[9999] p-6 animate-in fade-in duration-500">
      <div className="bg-[#0d0d0d] border border-blue-700 p-10 rounded-[2.5rem] max-w-lg w-full text-center shadow-[0_0_100px_rgba(239,68,68,0.15)]">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-500/10 rounded-2xl animate-pulse">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <h2 className="text-[14px] font-black uppercase tracking-[0.4em] text-white mb-2 italic">
          Security Alert
        </h2>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-8">
          Inactivity detected. Terminating Node in{" "}
          <span className="text-blue-700 font-black text-lg ml-2">
            {countdown}s
          </span>
        </p>
        <button
          onClick={resetTimer}
          className="w-full bg-orange-600 text-black font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-green-500 hover:text-black transition-all duration-300 text-[10px] active:scale-95"
        >
          Resume Connection
        </button>
      </div>
    </div>
  );
}
