"use server";
import db from "@/lib/db";

export async function getNavLinks() {
    try {
        const { data, error } = await db
            .from("pages")
            .select("title, slug")
            .eq("show_in_nav", true)
            .order("nav_order", { ascending: true });

        if (error) return [];
        return data.map((page: { title: any; slug: string; }) => ({
            name: page.title,
            href: page.slug === "home" ? "/" : `/${page.slug}`,
        }));
    } catch {
        return [];
    }
}