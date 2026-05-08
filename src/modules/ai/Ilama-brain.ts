"use server";

import { VectorStoreIndex, Document, storageContextFromDefaults, Settings } from "llamaindex";
import { HuggingFaceEmbedding } from "@llamaindex/huggingface";
import { getInventoryData, getProjects } from "@/modules/inventory/actions";
import { getSystemIdentity } from "@/lib/identity";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import os from "os";

// --- Global Settings ---
Settings.embedModel = new HuggingFaceEmbedding({
    modelType: "BAAI/bge-small-en-v1.5",
});

const PERSIST_DIR = path.join(os.tmpdir(), "aether_ai_brain");

export const syncAetherBrain = async () => {
    try {
        console.log("AETHER OS // AI: Data Refinement started...");

        if (!fs.existsSync(PERSIST_DIR)) {
            fs.mkdirSync(PERSIST_DIR, { recursive: true });
        }

        // 1. Alle Datenquellen anzapfen
        const [inventory, projects, identity] = await Promise.all([
            getInventoryData(),
            getProjects(),
            getSystemIdentity()
        ]);

        // 2. Dokumente-Array initialisieren (JETZT ist docs definiert!)
        const docs: Document[] = [
            ...inventory.map((p: any) => new Document({
                text: `Product: ${p.name}, Stock: ${p.bestand}, Price: ${p.preis}€`,
                metadata: { id: p.id, type: "inventory" }
            })),
            ...projects.map((p: any) => new Document({
                text: `Project: ${p.project_name}, Status: ${p.status}`,
                metadata: { id: p.id, type: "project" }
            })),
            new Document({
                text: `SYSTEM_IDENTITY: Inhaber: ${identity.owner_name}, Firma: ${identity.company_name}, Adresse: ${identity.address_street}, ${identity.address_zip} ${identity.address_city}.`,
                metadata: { type: "identity" }
            })
        ];

        // 3. LEGAL TEMPLATES SCAN (Innerhalb der Funktion)
        const legalTemplatesDir = path.join(
            process.cwd(),
            "src", "modules", "admin", "compliance", "legal_templates"
        );

        if (fs.existsSync(legalTemplatesDir)) {
            console.log("AETHER OS // AI: Scanning Legal Templates...");
            const templateFiles = fs.readdirSync(legalTemplatesDir);

            for (const file of templateFiles) {
                const filePath = path.join(legalTemplatesDir, file);
                const content = fs.readFileSync(filePath, "utf-8");

                docs.push(new Document({
                    text: `LEGAL_RULE_BOOK (${file}): ${content}`,
                    metadata: {
                        type: "legal_template",
                        source: file,
                        context: "german_law_tmg_dsgvo"
                    }
                }));
            }
        }

        // 4. Index erstellen und lokal speichern
        const storageContext = await storageContextFromDefaults({ persistDir: PERSIST_DIR });
        await VectorStoreIndex.fromDocuments(docs, { storageContext });

        console.log("AETHER OS // AI: Brain Sync complete.");
        return { success: true, count: docs.length };
    } catch (error: any) {
        console.error("AI_SYNC_ERROR:", error.message);
        return { success: false, error: error.message };
    }
};

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