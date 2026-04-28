"use client";

import { terminateTicket } from "@/modules/inventory/actions";
import { useState } from "react";
import { Trash2, Loader2, Skull } from "lucide-react";

export function TerminateButton({ ticketId }: { ticketId: number }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("NODE TERMINATION: Bist du sicher?")) return;

        setIsDeleting(true);
        await terminateTicket(ticketId);
        // Kein setIsDeleting(false) nötig, da die Page neu lädt und die Card verschwindet
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 bg-[#111] border border-gray-800 text-gray-500 hover:text-red-500 hover:border-red-500/50 transition-all flex items-center justify-center min-w-[50px]"
        >
            {isDeleting ? (
                <Loader2 className="w-3 h-3 animate-spin text-red-500" />
            ) : (
                <Skull className="w-4 h-4 text-gray-600 group-hover:text-red-500 transition-colors"/>
            )}
        </button>
    );
}