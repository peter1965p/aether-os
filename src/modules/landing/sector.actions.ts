"use server";

import { createClient } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Schaltet den Landingpage-Status einer Seite um.
 * Da ein UNIQUE INDEX auf der DB liegt, müssen wir 
 * sicherstellen, dass nur ein Eintrag 'true' ist.
 */
export async function toggleLandingpageStatus(id: number, currentStatus: boolean) {
  const db = await createClient();

  try {
    if (!currentStatus) {
      // 1. SCHRITT: Alle anderen Seiten auf 'false' setzen
      // Dies verhindert Konflikte mit dem UNIQUE INDEX
      await db
        .from("pages")
        .update({ is_landingpage: false })
        .neq("id", id);

      // 2. SCHRITT: Die gewählte Seite als Landingpage markieren
      const { error } = await db
        .from("pages")
        .update({ is_landingpage: true })
        .eq("id", id);

      if (error) throw error;
    } else {
      // Status einfach nur entfernen
      const { error } = await db
        .from("pages")
        .update({ is_landingpage: false })
        .eq("id", id);

      if (error) throw error;
    }

    // 3. SCHRITT: Cache-Invalidierung für AETHER OS
    // Damit die Startseite und die Admin-Listen sofort aktuell sind
    revalidatePath("/");
    revalidatePath("/admin/pages");
    revalidatePath(`/admin/pages/edit/${id}`);

    return { success: true };
  } catch (error) {
    console.error("AETHER_KERNEL_ERROR // Toggle_Landingpage:", error);
    return { success: false, error: "Status konnte nicht aktualisiert werden." };
  }
}

/**
 * Standard Update-Logik für die Sektoren (falls du diese in derselben Datei vorhältst)
 */
export async function updateSectorContent(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("page_id");

  // Deine bestehende Logik zum Speichern der Titel, Subtitles etc.
  // ...

  revalidatePath(`/admin/pages/edit/${id}`);
  revalidatePath(`/dsp/${id}`);
}