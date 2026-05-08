/**
 * AETHER OS // CORE ACTIONS // SETTINGS & INTELLIGENCE
 */
"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Holt die System-Daten.
 */
export async function getGlobalSettings() {
    try {
        const { data: settings, error: settingsError } = await db
            .from("settings")
            .select("*")
            .limit(1)
            .maybeSingle(); // Sicherer als .single()

        const { data: intel } = await db
            .from("intelligence_hub")
            .select("*")
            .eq("id", "global_config")
            .maybeSingle();

        if (settingsError) throw settingsError;

        return {
            ...settings,
            intel: intel || null
        };
    } catch (err) {
        console.error("OS_DATA_FETCH_FAULT:", err);
        return null;
    }
}

/**
 * Synchronisiert das Branding und die Intelligence.
 */
/**
 * AETHER OS // CORE SETTINGS SYNC
 * Aktualisierte Version inklusive Legal Identity & Operator Details.
 */
export async function updateGlobalSettings(formData: FormData) {
    // 1. EXTRAKTION DER FORMULARDATEN
    // Die Namen in den Anführungszeichen müssen exakt mit dem 'name'-Attribut deiner HTML-Inputs übereinstimmen.
    const company = formData.get("company") as string;
    const designation = formData.get("designation") as string;
    const primaryColor = formData.get("primary_color") as string;
    const secondaryColor = formData.get("secondary_color") as string;
    const vatStandard = formData.get("vat_standard") as string;
    const vatReduced = formData.get("vat_reduced") as string;
    const supportEmail = formData.get("support_email") as string;
    const supportPhone = formData.get("support_phone") as string;

    // Legal Identity & Operator Details
    const ownerName = formData.get("owner_name") as string;
    const companyFullName = formData.get("company_full_name") as string;
    const addressFull = formData.get("address_full") as string;
    const taxNumber = formData.get("tax_number") as string;
    const vatId = formData.get("vat_id") as string;

    // Intelligence Hub Daten
    const strategyMode = formData.get("strategy_mode") as string;
    const marketPulse = formData.get("market_pulse") as string;
    const aiContext = formData.get("ai_context_briefing") as string;

    try {
        // SCHRITT 1: Settings Update in der Tabelle 'public.settings'
        // Wir suchen den ersten Eintrag, um die ID für das Update zu erhalten
        const { data: current } = await db.from("settings").select("id").limit(1).maybeSingle();

        const settingsPayload = {
            company_name: company,
            system_designation: designation,
            primary_color: primaryColor,
            secondary_color: secondaryColor,
            vat_standard: vatStandard ? parseFloat(vatStandard) : 19.0,
            vat_reduced: vatReduced ? parseFloat(vatReduced) : 7.0,
            support_email: supportEmail,
            support_phone: supportPhone,

            // Zuordnung zu den neuen Spalten deiner DB
            owner_name: ownerName,
            company_full_name: companyFullName,
            address_full: addressFull,
            tax_number: taxNumber,
            vat_id: vatId,

            updated_at: new Date().toISOString()
        };

        if (current?.id) {
            // Update des bestehenden Datensatzes
            const { error: updateError } = await db.from("settings").update(settingsPayload).eq("id", current.id);
            if (updateError) throw updateError;
        } else {
            // Erstellung des initialen Datensatzes
            const { error: insertError } = await db.from("settings").insert([settingsPayload]);
            if (insertError) throw insertError;
        }

        // SCHRITT 2: Intelligence Hub Update (Separates Modul)
        const { error: intelError } = await db
            .from("intelligence_hub")
            .upsert({
                id: "global_config",
                strategy_mode: strategyMode,
                market_pulse: marketPulse ? parseInt(marketPulse) : 50,
                ai_context_briefing: aiContext,
                updated_at: new Date().toISOString()
            });

        if (intelError) throw intelError;

        // SCHRITT 3: REVALIDIERUNG (Cache-Management)
        // Erzwingt das Neuladen der Daten auf allen wichtigen Seiten
        revalidatePath("/", "layout");
        revalidatePath("/impressum");
        revalidatePath("/admin/settings");

        return { success: true, message: "AETHER_CORE_SYNC_COMPLETE" };
    } catch (err: any) {
        console.error("OS_SYNC_FAULT:", err.message);
        return { success: false, message: "DATABASE_WRITE_ERROR" };
    }
}