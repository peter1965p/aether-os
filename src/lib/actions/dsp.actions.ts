/**
 * /lib/actions/dsp.actions.ts
 * Dokumentation: Holt dynamische Seiten-Nodes aus der Tabelle 'pages'.
 */

"use server";

import db from "@/lib/db";

export async function getActiveDspNodes() {
    try {
        const { data, error } = await db
            .from("pages") // Laut Schema heißt deine Tabelle 'pages'
            .select("id, title, slug, show_in_nav, nav_order")
            .eq("show_in_nav", true) // Laut Schema ist das die korrekte Spalte
            .order("nav_order", { ascending: true }); // Sortierung nach deiner Spalte

        if (error) {
            console.error("DSP Abfragefehler:", error.message);
            return [];
        }

        // Wir mappen 'slug' auf 'virtual_path' und 'title' auf 'name' für die Navbar
        return data.map((page: { id: any; title: any; slug: string; }) => ({
            id: page.id,
            name: page.title,
            virtual_path: page.slug.startsWith('/') ? page.slug : `/${page.slug}`
        })) || [];
    } catch (err) {
        console.error("Unerwarteter DSP Fehler:", err);
        return [];
    }
}