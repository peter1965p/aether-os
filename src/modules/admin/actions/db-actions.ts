'use server';
import db from '@/lib/db';

export async function executeSqlQuery(query: string) {
  try {
    // Nur SELECT-Statements erlauben (Sicherheits-Check für den Anfang)
    const isSelect = query.trim().toUpperCase().startsWith('SELECT');
    
    if (!isSelect) {
      return { error: 'Aether Kernel: Only SELECT queries are allowed in Explorer mode.' };
    }

    const rows = db.prepare(query).all();
    return { success: true, data: rows };
  } catch (error: any) {
    return { error: `SQL Error: ${error.message}` };
  }  
}
export async function getTables() {
  try {
    // Fragt die SQLite Master-Tabelle nach allen User-Tabellen ab
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").all();
    return { success: true, data: tables.map((t: any) => t.name) };
  } catch (error: any) {
    return { error: error.message };
  }
}