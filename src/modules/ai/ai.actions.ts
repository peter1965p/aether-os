"use server";

import { VectorStoreIndex, Document, storageContextFromDefaults, Settings } from "llamaindex";
import { HuggingFaceEmbedding } from "@llamaindex/huggingface";
import { getInventoryData, getProjects } from "@/modules/inventory/actions";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import os from "os";

const s3Client = new S3Client({
    region: "eu-central-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});
// --- Global Settings ---
// Das sorgt dafür, dass LlamaIndex weiß, wie es die Vectoren berechnet
Settings.embedModel = new HuggingFaceEmbedding({
    modelType: "BAAI/bge-small-en-v1.5", // Ein sehr effizientes Modell | kein Key benötigt !!!
});


// CLOUD-SAFE PATH (Vercel Fix)
const PERSIST_DIR = path.join(os.tmpdir(), "aether_ai_brain");

export const syncAetherBrain = async () => {
    try {
        console.log("AETHER OS // AI: Data Refinement started...");

        // --- DER FIX: ORDNER ERSTELLEN ---
        if (!fs.existsSync(PERSIST_DIR)) {
            console.log(`DEBUG: Creating missing directory: ${PERSIST_DIR}`);
            fs.mkdirSync(PERSIST_DIR, { recursive: true });
        }

        const [inventory, projects] = await Promise.all([
            getInventoryData(),
            getProjects()
        ]);

        const docs = [
            ...inventory.map((p: any) => new Document({
                text: `Product: ${p.name}, Stock: ${p.bestand}, Price: ${p.preis}€`,
                metadata: { id: p.id, type: "inventory" }
            })),
            ...projects.map((p: any) => new Document({
                text: `Project: ${p.project_name}, Status: ${p.status}`,
                metadata: { id: p.id, type: "project" }
            }))
        ];

        // Hier wird jetzt garantiert ein existierender Pfad gefunden
        const storageContext = await storageContextFromDefaults({ persistDir: PERSIST_DIR });
        await VectorStoreIndex.fromDocuments(docs, { storageContext });

        console.log("AETHER OS // AI: Local Brain ready for S3 Uplink.");
        return { success: true, count: docs.length };
    } catch (error: any) {
        console.error("AI_SYNC_ERROR:", error.message);
        return { success: false, error: error.message };
    }
};

export async function uploadBrainToS3() {
    // Die exakte Bucket-ID aus deinem Screenshot
    const BUCKET_NAME = "aether-os-data-peter-190934385265-eu-central-1-an";
    // Der exakte Ordner-Pfad (Präfix)
    const S3_FOLDER = "aether_ai_brain";

    try {
        console.log(`AETHER OS // S3: Starting Uplink to ${BUCKET_NAME}...`);

        if (!fs.existsSync(PERSIST_DIR)) {
            throw new Error("Neural Cache empty. Run Sync first.");
        }

        const files = fs.readdirSync(PERSIST_DIR);

        for (const file of files) {
            const filePath = path.join(PERSIST_DIR, file);
            const fileContent = fs.readFileSync(filePath);

            await s3Client.send(new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: `${S3_FOLDER}/${file}`, // Hier wird die Datei direkt in den Ordner geschoben
                Body: fileContent,
                ContentType: "application/json",
            }));

            console.log(`✅ UPLOADED: ${file} -> S3://${BUCKET_NAME}/${S3_FOLDER}/`);
        }

        return { success: true, message: "AETHER BRAIN SYNCED TO CLOUD" };
    } catch (error: any) {
        console.error("S3_UPLINK_ERROR:", error.message);
        return { success: false, error: error.message };
    }
}

export const askAetherBrain = async (query: string) => {
    try {
        const storageContext = await storageContextFromDefaults({ persistDir: PERSIST_DIR });
        const index = await VectorStoreIndex.init({ storageContext });
        const response = await index.asQueryEngine().query({ query });
        return response.toString();
    } catch (error) {
        return "AETHER AI Offline. System Sync required.";
    }
};