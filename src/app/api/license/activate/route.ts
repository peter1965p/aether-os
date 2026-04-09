// src/app/api/license/activate/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { moduleId, productKey, userId } = await req.json();

  // 1. Key in der Datenbank suchen
  const { data: keyData, error: keyError } = await db
    .from('license_keys')
    .select('*')
    .eq('key_value', productKey)
    .eq('module_id', moduleId)
    .eq('is_used', false)
    .single();

  if (keyError || !keyData) {
    return NextResponse.json({ success: false, error: 'Ungültiger oder bereits verwendeter Key' });
  }

  // 2. Modul beim User aktivieren (Array ergänzen)
  const { data: userData } = await db
    .from('users')
    .select('settings')
    .eq('id', userId)
    .single();

  const currentModules = userData?.settings?.active_modules || [];
  if (!currentModules.includes(moduleId)) {
    currentModules.push(moduleId);
  }

  await db.from('users')
    .update({ settings: { ...userData?.settings, active_modules: currentModules } })
    .eq('id', userId);

  // 3. Key als "benutzt" markieren
  await db.from('license_keys').update({ is_used: true }).eq('id', keyData.id);

  return NextResponse.json({ success: true });
}