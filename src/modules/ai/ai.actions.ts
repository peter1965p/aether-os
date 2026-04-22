"use server";

import { VectorStoreIndex, Document, storageContextFromDefaults } from "llamaindex";
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

// CLOUD-SAFE PATH (Vercel Fix)
const PERSIST_DIR = path.join(os.tmpdir(), "aether_ai_brain");

export const syncAetherBrain = async () => {
    try {
        console.log("AETHER OS // AI: Data Refinement started...");
        const [inventory, projects] = await Promise.all([getInventoryData(), getProjects()]);

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

        const storageContext = await storageContextFromDefaults({ persistDir: PERSIST_DIR });
        await VectorStoreIndex.fromDocuments(docs, { storageContext });

        return { success: true, count: docs.length };
    } catch (error: any) {
        console.error("AI_SYNC_ERROR:", error.message);
        return { success: false, error: error.message };
    }
};

export async function uploadBrainToS3() {
    const bucket = "aether-os-data-peter-198934383265-eu-central-1-aa";
    try {
        if (!fs.existsSync(PERSIST_DIR)) throw new Error("Neural Cache missing.");
        const files = fs.readdirSync(PERSIST_DIR);

        for (const file of files) {
            const fileContent = fs.readFileSync(path.join(PERSIST_DIR, file));
            await s3Client.send(new PutObjectCommand({
                Bucket: bucket,
                Key: `ai-brain/${file}`,
                Body: fileContent,
                ContentType: "application/json",
            }));
        }
        return { success: true, message: "Cloud Sync Complete" };
    } catch (error: any) {
        console.error("S3_UPLOAD_ERROR:", error.message);
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