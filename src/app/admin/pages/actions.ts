"use server";

import { createClient } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updatePageIsLandingPage(pageId: number, isLandingPage: boolean) {
  const supabase = await createClient();

  try {
    // Wenn diese Seite zur Landing Page gemacht werden soll,
    // müssen zuerst alle anderen Seiten als NICHT-Landing Page markiert werden.
    if (isLandingPage) {
      const { error: resetError } = await supabase
        .from('pages')
        .update({ is_landingpage: false })
        .eq('is_landingpage', true); // Nur die aktualisieren, die aktuell true sind

      if (resetError) {
        console.error("Fehler beim Zurücksetzen anderer Landing Pages:", resetError);
        return { success: false, error: resetError.message };
      }
    }

    // Dann die spezifische Seite aktualisieren
    const { data, error } = await supabase
      .from('pages')
      .update({ is_landingpage: isLandingPage })
      .eq('id', pageId);

    if (error) {
      console.error("Fehler beim Aktualisieren des Landing Page Status:", error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/pages'); // Revalidiert die Admin-Seite, um die Änderungen anzuzeigen
    revalidatePath('/'); // Wichtig: Revalidiert auch die Frontend-Landing Page, falls sie sich geändert hat
    return { success: true, data };
  } catch (e: any) {
    console.error("Unerwarteter Fehler in updatePageIsLandingPage:", e);
    return { success: false, error: e.message || "Ein unerwarteter Fehler ist aufgetreten." };
  }
}