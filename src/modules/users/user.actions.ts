/**
 * AETHER OS // USER & SYSTEM ACTIONS
 * Pfad: src/modules/users/libb/user.actions.ts
 * Diese Datei verwaltet die globalen Identitäts- und System-Updates.
 */

"use server";

import { revalidatePath } from "next/cache";

/**
 * Definition des Status-Typs für den Hook (useActionState)
 * Dies ermöglicht sauberes Feedback im Frontend.
 */
export type ActionState = {
    success: boolean;
    message?: string;
    error?: string;
} | null;

/**
 * 1. CLIENT ACTION: Persönliches Profil aktualisieren
 * Wird von der Client-Profilseite aufgerufen.
 * Akzeptiert prevState für die Kompatibilität mit React Hooks.
 */
export async function updateClientProfileAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const userName = formData.get("userName") as string;
    const userEmail = "news24regional@gmail.com"; // Deine feste Admin-Referenz

    try {
        // HIER DB-LOGIK EINBAUEN (z.B. Prisma)
        // Da RLS nicht aktiv ist, erfolgt der Zugriff direkt über die Email.
        /*
        await db.user.update({
          where: { email: userEmail },
          data: { name: userName },
        });
        */

        console.log(`[AETHER OS] Profil-Update für ${userEmail}: Neuer Name ist ${userName}`);

        // Aktualisiert die Topbar und die Profilseite sofort systemweit
        revalidatePath("/", "layout");

        return {
            success: true,
            message: "Identität erfolgreich synchronisiert."
        };
    } catch (error) {
        console.error("Update fehlgeschlagen:", error);
        return {
            success: false,
            error: "Kritischer Systemfehler beim Datenbank-Schreibzugriff."
        };
    }
}

/**
 * 2. ADMIN ACTION: Globale System/Company Daten
 * Aktualisiert Stammdaten für das Impressum und den Shop.
 */
export async function updateSystemLegalAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const companyName = formData.get("companyName") as string;
    const owner = formData.get("owner") as string;
    const taxId = formData.get("taxId") as string;
    const vatId = formData.get("vatId") as string;

    try {
        // Logik für globales Update der "Company" Tabelle
        /*
        await db.systemSettings.update({
          where: { id: "global_config" },
          data: { companyName, owner, taxId, vatId },
        });
        */

        console.log("Globale AETHER OS Systemdaten aktualisiert.");

        // Revalidiert die Hauptseite für Impressum & Shop
        revalidatePath("/");

        return {
            success: true,
            message: "Systemdaten erfolgreich aktualisiert."
        };
    } catch (error) {
        return {
            success: false,
            error: "System-Update fehlgeschlagen."
        };
    }
}

