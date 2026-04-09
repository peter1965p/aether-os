import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface SearchResult {
  id: string | number;
  label: string;
  type: 'Kunde' | 'Mitarbeiter' | 'Produkt' | 'Lieferant' | 'Formular';
  url: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const searchTerm = `%${query}%`;

    // Parallele Abfragen basierend auf deinem echten Schema
    const [resCustomers, resUsers, resProducts, resSuppliers, resForms] = await Promise.all([
      // Tabelle: public.customers (Feld: full_name)
      db.from('customers').select('id, full_name').ilike('full_name', searchTerm).limit(5),
      
      // Tabelle: public.users (Felder: username, email)
      db.from('users').select('id, username, email').or(`username.ilike.${searchTerm},email.ilike.${searchTerm}`).limit(5),
      
      // Tabelle: public.products (Feld: name)
      db.from('products').select('id, name').ilike('name', searchTerm).limit(5),
      
      // Tabelle: public.suppliers (Feld: name)
      db.from('suppliers').select('id, name').ilike('name', searchTerm).limit(5),
      
      // Tabelle: public.forms (Feld: name)
      db.from('forms').select('id, name').ilike('name', searchTerm).limit(5),
    ]);

    const results: SearchResult[] = [
      // KUNDEN (full_name)
      ...(resCustomers.data?.map((i: any) => ({
        id: i.id,
        label: i.full_name,
        type: 'Kunde' as const,
        url: `/admin/kunden/${i.id}`,
      })) || []),

      // MITARBEITER (username oder email)
      ...(resUsers.data?.map((i: any) => ({
        id: i.id,
        label: i.username || i.email,
        type: 'Mitarbeiter' as const,
        url: `/admin/mitarbeiter/${i.id}`,
      })) || []),

      // PRODUKTE
      ...(resProducts.data?.map((i: any) => ({
        id: i.id,
        label: i.name,
        type: 'Produkt' as const,
        url: `/admin/inventory/${i.id}`,
      })) || []),

      // LIEFERANTEN
      ...(resSuppliers.data?.map((i: any) => ({
        id: i.id,
        label: i.name,
        type: 'Lieferant' as const,
        url: `/admin/lieferanten/${i.id}`,
      })) || []),

      // FORMULARE (Neu aus deinem Schema)
      ...(resForms.data?.map((i: any) => ({
        id: i.id,
        label: i.name,
        type: 'Formular' as const,
        url: `/admin/forms/${i.id}`,
      })) || []),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error("☢️ SCHEMA_SEARCH_ERROR:", error);
    return NextResponse.json({ results: [], error: "Kernel Scan Failed" }, { status: 500 });
  }
}