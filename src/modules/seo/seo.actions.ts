"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Der Geo-Ingest: Schreibt Besucherdaten in den Kernel
 * Wird vom Frontend aufgerufen, sobald jemand die Seite lädt.
 */
export async function trackVisitor(payload: {
  path: string;
  referrer: string;
  ip?: string;
}) {
  try {
    // Hier könnten wir später eine Geo-API (z.B. ip-api.com) zwischenschalten
    // Für den Start loggen wir den Basis-Stream
    const { error } = await db.from("visitor_logs").insert({
      page_path: payload.path,
      referrer: payload.referrer,
      ip_address: payload.ip || "unknown",
      // Dummy-Daten für den Start, damit auf der Map was passiert
      city: "Region: NRW", 
      latitude: 51.1657, 
      longitude: 10.4515
    });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("TRACKER_CRITICAL_ERROR", err);
    return { success: false };
  }
}

/**
 * Intelligence Hub Update: Der SEO-Kernel [cite: 2026-03-28]
 */
export async function updateSEOKeywords(keywords: string[]) {
  try {
    const { error } = await db
      .from("intelligence_hub")
      .upsert({ 
        id: "global_config", 
        keyword_cloud: keywords,
        last_event_trigger: "Manual SEO Sync executed",
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) throw error;
    
    revalidatePath("/admin/seo");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Automatischer Sync basierend auf Blog-Content
 */
export async function syncSEOWithLatestContent(blogPostId: string) {
  try {
    const { data: post, error: postError } = await db
      .from("blog_posts") // Passend zu deiner Kernel-Struktur von vorhin
      .select("title, content, tags")
      .eq("id", blogPostId)
      .single();

    if (postError || !post) throw postError;

    const { error: updateError } = await db
      .from("intelligence_hub")
      .update({
        seo_title_dynamic: `${post.title} | AETHER OS`,
        seo_desc_dynamic: post.content?.substring(0, 160),
        keyword_cloud: post.tags || [],
        last_event_trigger: `Auto-Sync: ${post.title}`,
        updated_at: new Date().toISOString()
      })
      .eq("id", "global_config");

    if (updateError) throw updateError;

    revalidatePath("/");
    return { success: true, trendMatch: "High" };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}