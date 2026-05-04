/**
 * AETHER OS - Search Page Entry
 * Pfad: src/app/(dashboard)/admin/search/page.tsx
 *
 * Diese Komponente ist die Server-seitige Hülle. Sie nutzt Suspense,
 * um das Prerendering von useSearchParams während des Builds zu ermöglichen.
 */

import { Suspense } from "react";
import SearchResultsContent from "./SearchResultsContent";

export default function SearchPage() {
    return (
        <section className="min-h-screen bg-black">
            <Suspense
                fallback={
                    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 animate-pulse">
                            Synchronizing AETHER_NODES...
                        </p>
                    </div>
                }
            >
                <SearchResultsContent />
            </Suspense>
        </section>
    );
}