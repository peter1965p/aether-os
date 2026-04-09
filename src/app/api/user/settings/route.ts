import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) return NextResponse.json({ error: 'No email provided' }, { status: 400 });

  try {
    const { data, error } = await db
      .from('users')
      .select('id, settings')
      .eq('email', email)
      .single();

    if (error) throw error;
    return NextResponse.json(data || { id: null, settings: { active_modules: [] } });
  } catch (err: any) {
    // Falls der User nicht existiert, senden wir ein leeres Standard-Objekt
    return NextResponse.json({ id: null, settings: { active_modules: [] } });
  }
}