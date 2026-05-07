/**
 * AETHER OS // NAV-FETCH-KERNEL
 * Pfad: /lib/actions/nav.actions.ts
 */
"use server";

import db from "@/lib/db";

// Interface für die Datenbank-Struktur
interface PageRow {
    id: string;
    title: string;
    slug: string;
    nav_order: number;
}

export async function getNavLinks() {
    try {
        const { data, error } = await db
            .from("pages")
            .select("id, title, slug, nav_order")
            .eq("show_in_nav", true)
            .order("nav_order", { ascending: true });

        if (error) {
            console.error("DB_NAV_FETCH_ERROR:", error.message);
            return [];
        }

        // Hier wird 'page' explizit als PageRow typisiert
        return (data as PageRow[]).map((page: PageRow) => ({
            name: page.title,
            href: page.slug === "home" ? "/" : `/${page.slug}`,
        }));
    } catch (err) {
        console.error("SYSTEM_NAV_FAULT:", err);
        return [];
    }
}