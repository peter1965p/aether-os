/**
 * AETHER OS // SEARCH CONTENT
 * Pfad: src/app/(dashboard)/admin/search/SearchContent.tsx
 */
"use client";

import { useSearchParams } from "next/navigation";
// Importiere hier deine Suchlogik/Ergebnisliste

export default function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || ""; // 'q' ist dein Suchbegriff in der URL

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Suchergebnisse für: {query}</h1>
            {/* Hier kommen deine Suchergebnisse rein */}
            <p className="text-white/50 italic">Ergebnisse für "{query}" werden geladen...</p>
        </div>
    );
}