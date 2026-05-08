/**
 * /lib/actions/pages.actions.ts
 */
"use server";

import { createClient } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deletePage(id: number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("pages")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Delete Error:", error.message);
        return { success: false, error: error.message };
    }

    // Cache aktualisieren, damit die Seite sofort verschwindet
    revalidatePath("/admin/pages");
    return { success: true };
}