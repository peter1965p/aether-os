// /lib/actions/gallery.actions.ts
"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { db } from "@/lib/db";

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  const category = formData.get("category") as string; // "blog" | "shop"

  if (!file) return { success: false };

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Pfad-Logik basierend auf deiner Vorgabe
  const relativePath = `/images/${category}`;
  const uploadDir = join(process.cwd(), "public", relativePath);
  const fileName = `${Date.now()}-${file.name}`;
  const fullPath = join(uploadDir, fileName);

  try {
    // Sicherstellen, dass Verzeichnis existiert
    await mkdir(uploadDir, { recursive: true });
    
    // Datei schreiben
    await writeFile(fullPath, buffer);
    
    // Hier könntest du den Pfad in der DB speichern
    // await db.from('gallery').insert({ url: `${relativePath}/${fileName}`, type: category });

    return { success: true, url: `${relativePath}/${fileName}` };
  } catch (error) {
    console.error("Upload Error:", error);
    return { success: false };
  }
}

// Bilder auslesen

export async function getGalleryImages(category: "blog" | "shop") {
  try {
    const { data, error } = await db
      .from("gallery")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Gallery-Fetch failed:", error);
    return [];
  }
}