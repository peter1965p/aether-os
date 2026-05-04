import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { executeSql } from "@/modules/db/actions"; // Kernel-Uplink [cite: 2026-03-28]
import EditorClient from "../EditorClient";

export default async function PageEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Daten über den Kernel holen
  let page = null;
  try {
    // Wir holen die Seite aus dem AETHER OS Kernel [cite: 2026-02-20]
    const response = await executeSql(`SELECT * FROM pages WHERE id = ${id} LIMIT 1`);
    if (response?.success && response.data.length > 0) {
      page = response.data[0];
    }
  } catch (error) {
    console.error("Kernel-Fehler beim Laden:", error);
  }

  if (!page) redirect("/admin/content");

  // SERVER ACTIONS (Falls du sie im EditorClient brauchst, 
  // müssten sie dort als Props definiert sein. Da sie laut Fehler 
  // dort aber nicht existieren, lassen wir sie hier erst mal weg 
  // oder binden sie später ein.)

  // Wir parsen den Content, falls er als String in der DB liegt
  const sections = page.content_json ? JSON.parse(page.content_json) : [];

  return (
    <EditorClient
      pageId={id}
      initialSections={sections}
    />
  );
}