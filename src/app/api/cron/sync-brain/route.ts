import { syncAetherBrain, uploadBrainToS3 } from "@/modules/ai/ai.actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // Sicherheitscheck: Nur autorisierte Crons dürfen das!
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        console.log("CRON: Starting Automated Neural Sync...");
        await syncAetherBrain();
        await uploadBrainToS3();

        return NextResponse.json({ success: true, message: "AETHER BRAIN UPDATED" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}