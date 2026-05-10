"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCw, ShieldCheck } from "lucide-react";

export function ComplianceGuard({ page, sections, identity }: any) {
    const [feedback, setFeedback] = useState("");
    const [isError, setIsError] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    // Echtzeit-Check: Triggert bei jeder Änderung an Title oder Slug
    useEffect(() => {
        const timer = setTimeout(() => {
            runCheck();
        }, 800); // Kleiner Delay, um die API nicht bei jedem Tastendruck zu sprengen

        return () => clearTimeout(timer);
    }, [page.title, page.slug]);

    const runCheck = async () => {
        setIsChecking(true);
        try {
            const res = await fetch("/api/compliance/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ page, sections, identity })
            });
            const data = await res.json();

            setFeedback(data.feedback);
            setIsError(data.status === "error");
        } catch (e) {
            setFeedback("System-Link zum Brain unterbrochen.");
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <motion.section
            // Das Panel schüttelt sich bei Fehlern kurz heftig (Shake)
            animate={isError ? {
                x: [0, -2, 2, -2, 2, 0],
                borderColor: ["rgba(239, 68, 68, 0.2)", "rgba(239, 68, 68, 0.8)", "rgba(239, 68, 68, 0.2)"],
                backgroundColor: ["rgba(0,0,0,0)", "rgba(239, 68, 68, 0.08)", "rgba(0,0,0,0)"]
            } : {}}
            transition={isError ? {
                x: { duration: 0.4 },
                borderColor: { repeat: Infinity, duration: 1.5 }
            } : {}}
            className={`bg-zinc-900/20 border ${isError ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-white/5'} p-8 mb-12 rounded-3xl backdrop-blur-sm relative overflow-hidden transition-all duration-500`}
        >
            {/* Rote Warn-Linie (Glitch) */}
            {isError && (
                <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-100"
                />
            )}

            <div className="flex justify-between items-center mb-8">
                <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${isError ? 'text-red-500' : 'text-zinc-500'}`}>
                    {isError ? (
                        <AlertTriangle size={14} className="animate-bounce" />
                    ) : (
                        <ShieldCheck size={14} className="text-blue-500" />
                    )}
                    AETHER_AI // LEGAL_GUARD_{isError ? "CRITICAL" : "STABLE"}
                </h2>

                <button
                    onClick={runCheck}
                    disabled={isChecking}
                    className="flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-lg text-[9px] uppercase font-black text-blue-500 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                >
                    <RefreshCw size={12} className={isChecking ? "animate-spin" : ""} />
                    {isChecking ? "Scanning..." : "Force_Deep_Check"}
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={feedback}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className={`p-6 rounded-2xl font-mono text-[11px] leading-relaxed border shadow-inner ${
                        isError
                            ? 'bg-red-500/5 border-red-500/20 text-red-400 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]'
                            : 'bg-black/40 border-white/5 text-zinc-400'
                    }`}
                >
                    <div className="flex gap-4">
                        <span className={`font-black ${isError ? 'text-red-500' : 'text-blue-500'}`}>
                            [{isError ? "!" : "i"}]
                        </span>
                        <p>{feedback || "Initialisiere Neural-Link... Warte auf Systemdaten."}</p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Kleiner technischer Status-Text unten rechts */}
            <div className="absolute bottom-2 right-6 text-[7px] text-zinc-700 uppercase tracking-widest font-mono">
                S3_Log_Active // Manderscheid_Registry_v1
            </div>
        </motion.section>
    );
}