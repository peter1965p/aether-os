"use server";

import { createClient } from "@/lib/db";
import { revalidatePath } from "next/cache";

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

        // Cache für die Startseite und das Admin-Panel leeren
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