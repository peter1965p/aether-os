// src/modules/market/market.actions.ts
import db from "@/lib/db";

export async function getLatestMarketIntel() {
  const { data, error } = await db
    .from("market_intel")
    .select("keyword, insight")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data;
}