import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { askAetherBrain } from "@/modules/ai/Ilama-brain"; // Kleines 'l' bei llama!

const s3Client = new S3Client({
    region: "eu-central-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(req: Request) {
    try {
        const { page, sections, identity } = await req.json();

        // 1. Die Anfrage an dein lokales Aether Brain
        const query = `
            COMPLIANCE_CHECK_REQUEST:
            TITLE: ${page.title}
            SLUG: ${page.slug}
            IDENTITY: ${identity.company_name}, ${identity.address_city}
            CONTENT_NODES: ${sections.length} Sektoren aktiv.
            
            Prüfe auf deutsche Rechtssicherheit (TMG/DSGVO). 
            Antworte im AETHER_STYLE. Wenn ein Fehler vorliegt, nutze das Wort 'VERSTOẞ'.
        `;

        const feedback = await askAetherBrain(query);

        // 2. Status ermitteln
        const isLegalError = feedback.includes("VERSTOẞ") ||
            (page.title.toLowerCase().includes("contact") && !page.title.toLowerCase().includes("impressum"));

        // 3. S3 LOG (Damit Manderscheid auch einen Beweis hat)
        const BUCKET_NAME = "aether-os-data-peter-190934385265-eu-central-1-an";
        const snapshotKey = `compliance/logs/${page.slug || 'unknown'}_${Date.now()}.json`;

        try {
            await s3Client.send(new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: snapshotKey,
                Body: JSON.stringify({
                    timestamp: new Date().toISOString(),
                    page: page.title,
                    feedback: feedback,
                    status: isLegalError ? "REJECTED" : "CLEAN"
                }),
                ContentType: "application/json",
            }));
        } catch (s3Err) {
            console.error("S3_LOGGING_FAILED:", s3Err);
            // Wir machen trotzdem weiter, die UI ist wichtiger
        }

        return NextResponse.json({
            status: isLegalError ? 'error' : 'success',
            feedback
        });

    } catch (error: any) {
        console.error("API_ROUTE_ERROR:", error);
        return NextResponse.json({ error: "Brain Offline oder Pfad-Fehler" }, { status: 500 });
    }
}