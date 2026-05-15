"use server";

import { S3Client, ListObjectsV2Command, CreateBucketCommand, ListBucketsCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

// Den Client hier initialisieren (oder aus einer zentralen Config importieren)
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getBucketOverview() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: "aether-os-assets-190934385265-eu-central-1-an",
      Prefix: "nodes/", 
    });

    const response = await s3Client.send(command);
    
    // Typisierung für "file" hinzugefügt, um Fehler 7006 zu killen
    return {
      success: true,
      files: response.Contents?.map((file: any) => ({
        key: file.Key,
        size: file.Size ? (file.Size / 1024).toFixed(2) + " KB" : "0 KB",
        lastModified: file.LastModified,
      })) || []
    };
  } catch (err: any) {
    console.error("AETHER_S3_SCAN_ERROR:", err.message);
    return { success: false, error: err.message, files: [] };
  }
}

export async function createNewBucket(formData: FormData) {
  "use server";
  const bucketName = formData.get("bucketName") as string;

  if (!bucketName) return { error: "NAME_REQUIRED" };

  try {
    const command = new CreateBucketCommand({
      Bucket: bucketName.toLowerCase(),
      // In eu-central-1 muss die LocationConstraint explizit gesetzt werden
      CreateBucketConfiguration: {
        LocationConstraint: "eu-central-1",
      },
    });

    await s3Client.send(command);
    revalidatePath("/admin/aws");
    return { success: true };
  } catch (err: any) {
    console.error("CREATE_BUCKET_FAILED:", err.message);
    return { error: err.message };
  }
}

export async function getAllBuckets() {
  try {
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    
    return {
      success: true,
      buckets: response.Buckets?.map(b => ({
        name: b.Name,
        creationDate: b.CreationDate
      })) || []
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}