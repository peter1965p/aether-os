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
  const id = params.id;
  const db = createClient(); // Proxy/Instanz-kompatibel holen

  // Daten abrufen inklusive der neuen sectors-Relation!
  const { data: page, error } = await db
    .from('pages')
    .select('*, sectors(*)')
    .eq('id', id)
    .single();

  if (error || !page) return notFound();

  return <DSPArchitect initialPage={page} />;
}