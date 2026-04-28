"use client";

import { executeNeuralFix } from "@/modules/inventory/actions";
import { useState } from "react";
import { Zap, Loader2, Target } from "lucide-react"; // Target für das "Erschlagen"-Feeling

export function ExecuteButton({ ticketId }: { ticketId: number }) {
    const [isExecuting, setIsExecuting] = useState(false);

    const handleExecution = async () => {
        setIsExecuting(true);

        // Kleiner Delay für das "Hacking-Feeling" (optional, aber cool für die UI)
        const result = await executeNeuralFix(ticketId);

        if (!result.success) {
            console.error("EXECUTION_FAILED // NODE_" + ticketId);
        }

        setIsExecuting(false);
    };

    return (
        <button
            onClick={handleExecution}
            disabled={isExecuting}
            className={`
        flex-1 flex items-center justify-center gap-2 
        font-black text-[10px] py-3 uppercase tracking-widest transition-all
        ${isExecuting
                ? "bg-blue-900/20 text-blue-500 cursor-wait border border-blue-500/50"
                : "bg-white text-black hover:bg-blue-600 hover:text-white active:scale-95"
            }
      `}
        >
            {isExecuting ? (
                <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Executing...</span>
                </>
            ) : (
                <>
                    <Target className="w-3 h-3" />
                    <span>Execute Command</span>
                </>
            )}
        </button>
    );
}