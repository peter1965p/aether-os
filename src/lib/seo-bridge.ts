import db from "@/lib/db";

/**
 * AETHER OS // SEO-BRIDGE
 * Holt die globalen Konfigurationen aus dem Intelligence Hub Kernel.
 * Diese Daten steuern das dynamische SEO der Homepage und der Blog-Posts.
 */
export async function getGlobalMeta() {
  try {
    const { data, error } = await db
      .from("intelligence_hub")
      .select("*")
      .eq("id", "global_config")
      .single();

    if (error) {
      // Fallback, falls der Kernel noch leer ist oder die Tabelle gerade migriert wird
      console.warn("AETHER_BRIDGE_WARNING: No global_config found in intelligence_hub.");
      return null;
    }

    return data;
  } catch (err) {
    console.error("AETHER_BRIDGE_CRITICAL_FAILURE:", err);
    return null;
  }
}

/**
 * Hilfsfunktion, um Keywords sauber zu mergen (z.B. Blog-Tags + Globale Keywords)
 */
export function mergeKeywords(localKeywords: string[] = [], globalKeywords: string[] = []) {
  const combined = [...localKeywords, ...globalKeywords];
  // Duplikate entfernen und leere Einträge filtern
  return Array.from(new Set(combined.map(k => k.trim()))).filter(k => k.length > 0);
}