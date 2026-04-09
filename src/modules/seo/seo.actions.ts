"use server";

import db, { createClient } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function syncSEOWithLatestContent(blogPostId: string) {
  const supabase = createClient();

  // 1. Hole den neuesten Blog-Eintrag
  const { data: post, error: postError } = await db
    .from("posts")
    .select("title, content, tags")
    .eq("id", blogPostId)
    .single();

  if (postError || !post) return { success: false };

  // 2. Extrahiere Keywords (Simuliert die KI-Logik für deinen IT-Betrieb)
  const newKeywords = [...(post.tags || []), post.title.split(" ")].flat().slice(0, 10);

  // 3. Update der globalen System-Settings [cite: 2026-03-28]
  const { error: updateError } = await supabase
    .from("settings")
    .update({
      seo_title: `${post.title} | AETHER OS IT-Services`,
      seo_description: post.content.substring(0, 160),
      keywords: newKeywords,
      updated_at: new Date().toISOString()
    })
    .eq("id", "global_config"); // Nutzt die ID aus deinem Setup

  if (!updateError) {
    revalidatePath("/"); // Aktualisiert die Homepage sofort
    return { success: true, trendMatch: "High" };
  }
}

export async function updateSEOKeywords(keywords: string[]) {
  const { error } = await db
    .from("site_settings")
    .upsert({ 
      key: "homepage_seo", 
      value: { keywords: keywords } 
    }, { onConflict: 'key' });

  if (!error) revalidatePath("/");
  return { success: !error };
}