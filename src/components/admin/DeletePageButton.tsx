/**
 * components/admin/DeletePageButton.tsx
 */
"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deletePage } from "@/lib/actions/pages.actions";

export function DeletePageButton({ pageId, title }: { pageId: number, title: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`NODE [${title}] wirklich terminieren?`)) return;

        setIsDeleting(true);
        const result = await deletePage(pageId);

        if (!result.success) {
            alert("Fehler beim Löschen des Nodes.");
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-10 h-10 bg-zinc-950 hover:bg-red-950/40 text-zinc-800 hover:text-red-500 transition-all border border-white/5 flex items-center justify-center disabled:opacity-50"
        >
            {isDeleting ? (
                <Loader2 size={14} className="animate-spin text-red-500" />
            ) : (
                <Trash2 size={14} />
            )}
        </button>
    );
}