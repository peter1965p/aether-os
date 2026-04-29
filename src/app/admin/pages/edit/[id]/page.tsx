import { createClient } from "@/lib/db";
import { notFound } from "next/navigation";
import { DSPArchitect } from "./DSPArchitect";

export const dynamic = 'force-dynamic';

export default async function EditPage({ 
  params: paramsPromise 
}: { 
  params: Promise<{ id: string }> 
}) {
  const params = await paramsPromise;
  const id  = params.id;
  const db = await createClient();

  // Daten abrufen inklusive Sektionen & Landingpage-Status
  const { data: page } = await db
    .from('pages')
    .select('*, page_sections(*)')
    .eq('id', id)
    .single();

  if (!page) return notFound();

  return <DSPArchitect initialPage={page} />;
}