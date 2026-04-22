"use server";

import {
    VectorStoreIndex,
    Document,
    storageContextFromDefaults
} from "llamaindex";
import { getInventoryData, getProjects } from "@/modules/inventory/actions";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

// 1. AWS S3 Client Konfiguration
const s3Client = new S3Client({
    region: "eu-central-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

/**
 * AETHER OS // AI BRAIN SYNC
 * Phase 1: Daten aus Supabase ziehen und Vektoren erstellen
 */
export const syncAetherBrain = async () => {
    try {
        console.log("AETHER OS // AI: Starte Daten-Veredelung...");

        const inventory = await getInventoryData();
        const projects = await getProjects();

        const inventoryDocs = inventory.map((p: any) => new Document({
            text: `Produkt: ${p.name}, Bestand: ${p.bestand}, Preis: ${p.preis}€, EK: ${p.ek_preis}€.`,
            metadata: { id: p.id, type: "inventory" }
        }));

        const projectDocs = projects.map((p: any) => new Document({
            text: `Projekt: ${p.project_name}, Status: ${p.status}, Deadline: ${p.deadline}.`,
            metadata: { id: p.id, type: "project" }
        }));

        const storageContext = await storageContextFromDefaults({
            persistDir: "./aether_ai_brain"
        });

        await VectorStoreIndex.fromDocuments(
            [...inventoryDocs, ...projectDocs],
            { storageContext }
        );

        console.log("AETHER OS // AI: Brain lokal synchronisiert.");
        return { success: true };
    } catch (error: any) {
        console.error("AI_SYNC_ERROR:", error.message);
        return { success: false, error: error.message };
    }
};

/**
 * AETHER OS // S3 BRAIN PUSH
 * Phase 2: Den Index in den AWS S3 Bucket spiegeln (Skalierbarkeit)
 */
export async function uploadBrainToS3() {
    const bucketName = "aether-os-data-peter-198934383265-eu-central-1-aa";
    const directoryPath = path.join(process.cwd(), "aether_ai_brain");

    try {
        if (!fs.existsSync(directoryPath)) throw new Error("Lokaler Index nicht gefunden.");

        const files = fs.readdirSync(directoryPath);

        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const fileContent = fs.readFileSync(filePath);

            await s3Client.send(new PutObjectCommand({
                Bucket: bucketName,
                Key: `ai-brain/${file}`,
                Body: fileContent,
                ContentType: "application/json",
            }));
            console.log(`AETHER OS // Cloud-Sync: ${file} übertragen.`);
        }

        return { success: true, message: "Brain erfolgreich in S3 gesichert!" };
    } catch (error: any) {
        console.error("S3_UPLOAD_ERROR:", error.message);
        return { success: false, error: error.message };
    }
}

/**
 * AETHER OS // QUERY ENGINE
 * Die Schnittstelle für die Homepage
 */
export const askAetherBrain = async (query: string) => {
    try {
        const storageContext = await storageContextFromDefaults({
            persistDir: "./aether_ai_brain"
        });
        const index = await VectorStoreIndex.init({ storageContext });
        const queryEngine = index.asQueryEngine();

        const response = await queryEngine.query({ query });
        return response.toString();
    } catch (error) {
        console.error("AI_QUERY_ERROR:", error);
        return "KI-Brain offline. Bitte System-Synchronisation prüfen.";
    }
};