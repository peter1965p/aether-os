"use server";

import { createClient } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- TYPES FOR SECTOR MANAGEMENT ---
interface SaveSectorParams {
  id?: number;
  page_id: number;
  section_type: string;
  title: string;
  subtitle: string;
  content: string;
  image_url?: string;
  button_text?: string;
  order_index?: number;
}

/**
 * AETHER OS // SECTOR ENGINE
 * Schaltet eine spezifische Seite als globale Landingpage scharf.
 */
export async function updateLandingpage(pageId: string) {
  try {
    const supabase = await createClient();

    // Aufruf der Postgres-Funktion für exklusive Aktivierung
    const { error } = await supabase.rpc('set_exclusive_landingpage', {
      target_page_id: pageId
    });

    if (error) {
      console.error("RPC Error:", error);
      throw new Error("Uplink to Database Failed");
    }

    revalidatePath("/");
    revalidatePath("/admin/pages");

    return {
      success: true,
      message: "SYSTEM_SUCCESS: Node Synchronized as Root"
    };
  } catch (error: any) {
    return {
      success: false,
      message: `CRITICAL_ERROR: ${error.message}`
    };
  }
}

/**
 * Erstellt oder aktualisiert einen Sektor direkt in der public.sectors Tabelle.
 */
export async function savePageSection(params: SaveSectorParams) {
  try {
    const supabase = await createClient();
    const { 
      id, 
      page_id, 
      section_type, 
      title, 
      subtitle, 
      content, 
      image_url = "", 
      button_text = "", 
      order_index = 0 
    } = params;

    if (id) {
      const { data, error } = await supabase
        .from("sectors")
        .update({
          section_type,
          title,
          subtitle,
          content,
          image_url,
          button_text,
          order_index
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      
      revalidatePath("/(frontend)/[slug]", "page");
      return { success: true, data };
    } else {
      const { data, error } = await supabase
        .from("sectors")
        .insert([
          {
            page_id,
            section_type,
            title,
            subtitle,
            content,
            image_url,
            button_text,
            order_index
          }
        ])
        .select()
        .single();

      if (error) throw error;

      revalidatePath("/(frontend)/[slug]", "page");
      return { success: true, data };
    }
  } catch (err: any) {
    console.error("❌ AETHER_SECTOR_ACTION_EXCEPTION:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * --- AWS S3 UPLINK FÜR SEKTOREN ---
 * Verarbeitet das FormData, lädt das Bild direkt in den verifizierten
 * aether-os-assets-190934385265-eu-central-1-an Bucket hoch.
 */
export async function uploadSectorImage(formData: FormData, sectionId: string | number) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "Missing_File_Payload" };
    }

    console.log("AETHER_TRACE: Server-side handling file for sectorId:", sectionId);

    // Datei in Buffer umwandeln
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // S3-Client initialisieren
    const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
    
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || "eu-central-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });

    // Sauberen Dateinamen bauen
    const fileExt = file.name.split('.').pop() || "jpg";
    const fileName = `sector_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    
    // Virtueller Pfad – S3 generiert 'nodes' und 'sector.pic' autonom!
    const key = `nodes/sector.pic/${fileName}`;
    
    // EXAKTER FIX: Der reale Bucket-Name direkt als String verdrahtet!
    const bucketName = "aether-os-assets-190934385265-eu-central-1-an";

    // Befehl an AWS abfeuern
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // Generierung der finalen, öffentlichen Object-URL
    const awsUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || "eu-central-1"}.amazonaws.com/${key}`;

    return { 
      success: true, 
      url: awsUrl 
    };

  } catch (err: any) {
    console.error("❌ CRITICAL_SECTOR_S3_UPLINK_ERROR:", err);
    return { 
      success: false, 
      error: err.message || "Unknown_Storage_Error" 
    };
  }
}