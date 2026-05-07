/**
 * AETHER OS // CORE ACTIONS // SETTINGS
 * Pfad: /lib/actions/settings.actions.ts
 */
"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateGlobalSettings(formData: FormData) {
    // Extraktion der Daten aus dem Form-Objekt
    const company = formData.get("company") as string;
    const designation = formData.get("designation") as string;
    const primaryColor = formData.get("primary_color") as string;
    const secondaryColor = formData.get("secondary_color") as string;
    const vatStandard = formData.get("vat_standard") as string;
    const vatReduced = formData.get("vat_reduced") as string;

    try {
        const { error } = await db
            .from("settings")
            .update({
                company_name: company,
                system_designation: designation,
                primary_color: primaryColor,
                secondary_color: secondaryColor,
                vat_standard: parseFloat(vatStandard),
                vat_reduced: parseFloat(vatReduced)
            })
            .eq("id", 1); // Wir setzen voraus, dass der globale Record die ID 1 hat

        if (error) throw error;

        // Zwingt Next.js, alle betroffenen Seiten (inkl. NavBar) neu zu rendern
        revalidatePath("/");
        revalidatePath("/admin/settings");

        return { success: true, message: "CORE_DATA_SYNC_COMPLETE" };
    } catch (err) {
        console.error("OS_SYNC_FAULT:", err);
        return { success: false, message: "SYNC_ERROR_DETECTED" };
    }
}

/**
 * Holt die aktuellen Einstellungen für die Initialisierung der Seite.
 */
export async function getGlobalSettings() {
    const { data, error } = await db
        .from("settings")
        .select("*")
        .single();

    if (error) return null;
    return data;
}