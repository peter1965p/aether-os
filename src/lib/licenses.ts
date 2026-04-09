import { db } from '@/lib/db';

// WICHTIG: Das Wort 'export' muss hier stehen!
export async function checkKeyInDatabase(productKey: string, moduleId: string): Promise<boolean> {
  const { data, error } = await db
    .from('license_keys')
    .select('*')
    .eq('key_value', productKey)
    .eq('module_id', moduleId)
    .eq('is_used', false)
    .single();

  if (error || !data) {
    console.error("❌ Validierung fehlgeschlagen:", error?.message);
    return false;
  }

  // Key entwerten
  await db
    .from('license_keys')
    .update({ is_used: true })
    .eq('id', data.id);

  return true;
}