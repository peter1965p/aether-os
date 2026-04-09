// src/modules/builder/actions.ts
'use server';
import { db } from "@/lib/db"; // Dein Zugang zur db-cms2026.sqlite

export async function deployAetherLayout(pageSlug: string, fullJson: string) {
  try {
    // Wir nutzen das content_json Feld aus deinem ER-Diagramm
    await db.prepare(`
      UPDATE pages
      SET content_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `).run(fullJson, pageSlug);

    return { success: true, timestamp: new Date().toISOString() };
  } catch (error) {
    console.error("KERNEL_ERROR // Sync failed", error);
    return { success: false };
  }
}
