"use client";

import { useState } from "react";
import { Cpu, Send, Terminal } from "lucide-react";
import { askAetherBrain } from "@/modules/ai/ai.actions"; // Diese Action bauen wir gleich

export default function AetherAssistant() {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAsk = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query) return;

        setLoading(true);
        try {
            // DER FIX: Erst unknown, dann unser Ziel-Typ
            const res = (await askAetherBrain(query)) as unknown as { answer: string };

            setResponse(res.answer);
        } catch (err) {
            console.error("AETHER_UPLINK_FAIL:", err);
            setResponse("NEURAL_LINK_ERROR: STABILITY_CRITICAL.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-sm font-mono mt-12">
            <div className="flex items-center gap-2 mb-4 text-blue-500 text-[10px] uppercase tracking-widest">
                <Cpu size={14} className={loading ? "animate-spin" : ""} />
                AETHER // Neural Interface
            </div>

            {response && (
                <div className="mb-6 p-4 bg-blue-500/5 border-l-2 border-blue-500 text-[12px] text-slate-300 animate-in fade-in slide-in-from-left-2">
                    <span className="text-blue-500 mr-2"> {">"} </span> {response}
                </div>
            )}

            <form onSubmit={handleAsk} className="relative">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ENTER COMMAND OR QUERY..."
                    className="w-full bg-black/50 border border-white/10 p-3 pl-10 text-[11px] text-white focus:border-blue-500 outline-none transition-all uppercase tracking-tighter"
                />
                <Terminal size={14} className="absolute left-3 top-3.5 text-slate-600" />
                <button type="submit" className="absolute right-3 top-2.5 text-blue-500 hover:text-blue-400">
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
}