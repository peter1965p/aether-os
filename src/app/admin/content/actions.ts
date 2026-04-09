"use server";

import db from "@/lib/db"; // Das ist jetzt dein Supabase Client
import { revalidatePath } from "next/cache";

export async function createNewSection(
  pageId: string,
  type: string,
  orderIndex: number,
) {
  try {
    const pid = parseInt(pageId);

    // Supabase Insert: Wir lassen die ID weg, die DB generiert sie selbst!
    const { data, error } = await db
      .from("page_sections")
      .insert([
        {
          page_id: pid,
          section_type: type,
          title: "Neuer Block",
          content: "Inhalt hier...",
          order_index: orderIndex,
        },
      ])
      .select() // Gibt uns die neu erstellte Zeile zurück
      .single();

    if (error) throw error;

    revalidatePath(`/admin/content/edit/${pageId}`);
    return { success: true, newSection: data };
  } catch (error: any) {
    console.error("SUPABASE ERROR:", error.message);
    return { success: false, error: error.message };
  }
}

export async function savePageSections(pageId: string, sections: any[]) {
  try {
    // In Supabase machen wir einen "Upsert" (Update oder Insert)
    // Wir mappen die Sektionen so, dass sie exakt den Spalten entsprechen
    const updates = sections.map((s) => ({
      id: s.id,
      page_id: parseInt(pageId),
      title: s.title,
      content: s.content,
      section_type: s.section_type || "block",
    }));

    const { error } = await db
      .from("page_sections")
      .upsert(updates, { onConflict: "id" });

    if (error) throw error;

    revalidatePath(`/admin/content/edit/${pageId}`);
    return { success: true };
  } catch (error: any) {
    console.error("SAVE ERROR:", error.message);
    return { success: false, error: error.message };
  }
}

export async function deleteSectionAction(sectionId: any) {
  try {
    const { error } = await db
      .from("page_sections")
      .delete()
      .eq("id", sectionId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("DELETE ERROR:", error.message);
    return { success: false, error: error.message };
  }
}
