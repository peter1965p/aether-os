"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadAvatar(formData: FormData, userId: string) {
  // Hard-Check der ID
  if (!userId || typeof userId !== 'string') {
    return { success: false, error: "INVALID_PARAM: userId ist kein gültiger String." };
  }

  const numericId = parseInt(userId, 10);
  if (isNaN(numericId)) {
    return { success: false, error: `PARSING_ERROR: '${userId}' ist keine Zahl.` };
  }

  const file = formData.get("avatar") as File;
  if (!file) return { success: false, error: "FILE_MISSING: Keine Datei erhalten." };

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `nodes/avatar-${numericId}-${Date.now()}.${file.name.split('.').pop()}`;

    // 1. S3 Upload
    await s3Client.send(new PutObjectCommand({
      Bucket: "aether-os-assets-190934385265-eu-central-1-an",
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    }));

    const publicUrl = `https://aether-os-assets-190934385265-eu-central-1-an.s3.eu-central-1.amazonaws.com/${fileName}`;

    // 2. Datenbank Upsert (Match auf customer_id)
    const { error } = await db
      .from('profiles')
      .upsert({ 
        customer_id: numericId, 
        avatar_url: publicUrl,
        last_login: new Date().toISOString() 
      }, { 
        onConflict: 'customer_id' 
      });

    if (error) throw error;

    // 3. Cache-Refresh: Erzwingt, dass Next.js das neue Bild sofort anzeigt
    revalidatePath(`/profiles/${userId}`);
    
    return { success: true, url: publicUrl };

  } catch (err: any) {
    console.error("AETHER_UPLINK_CRITICAL:", err.message);
    return { success: false, error: err.message };
  }
}

export async function deleteAvatar(userId: string, avatarUrl: string) {
  try {
    // 1. Key aus der URL extrahieren (alles nach dem Bucket-Namen/Host)
    const urlParts = avatarUrl.split(".com/");
    const fileKey = urlParts[1];

    if (!fileKey) throw new Error("Key_Extraction_Failed");

    // 2. AWS-Execution: Löschen des Objekts
    await s3Client.send(new DeleteObjectCommand({
      Bucket: "aether-os-assets-190934385265-eu-central-1-an",
      Key: fileKey,
    }));

    // 3. Datenbank-Cleanup: URL im Profil auf null setzen
    await db
      .from('profiles')
      .update({ avatar_url: null })
      .eq('customer_id', parseInt(userId, 10));

    revalidatePath(`/profiles/${userId}`);
    return { success: true };
  } catch (err: any) {
    console.error("AWS_CLEANUP_FAILED:", err.message);
    return { success: false, error: err.message };
  }
}