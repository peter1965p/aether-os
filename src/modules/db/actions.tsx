'use server'
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

/**
 * Holt das Datenbank-Schema (PostgreSQL Version)
 */
export async function getDbSchema() {
  try {
    // Nutze den RPC-Call anstatt den direkten Tabellenzugriff
    const { data: tables, error: tableError } = await db.rpc('get_all_tables');

    if (tableError) throw tableError;

    const schemaPromise = tables.map(async (t: { tablename: string }) => {
      const { data: columns, error: colError } = await db.rpc('get_column_info', { 
        t_name: t.tablename 
      });
      
      // Falls der RPC noch nicht da ist, nimm den Fallback
      if (colError || !columns) {
        const { data: sample } = await db.from(t.tablename).select('*').limit(1);
        const cols = sample && sample[0] ? Object.keys(sample[0]).map(k => ({ name: k, type: 'text' })) : [];
        return { table: t.tablename, columns: cols };
      }

      return { table: t.tablename, columns };
    });

    const schema = await Promise.all(schemaPromise);
    return { success: true, schema: schema.filter(Boolean) };
  } catch (error: any) {
    console.error("AETHER_SCHEMA_ERROR:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Führt SQL-Queries aus (PostgreSQL Version)
 */
export async function executeSql(query: string) {
  try {
    const cleanQuery = query.trim();
    
    // Wir schicken ALLES direkt an den RPC 'exec_sql'
    const { data, error } = await db.rpc('exec_sql', { sql_query: cleanQuery });
    
    // Falls der RPC selbst einen Fehler wirft (Verbindung etc.)
    if (error) throw error;

    // Falls die SQL-Funktion intern einen Fehler gefangen hat (Syntax-Fehler im SQL)
    // Wir prüfen hier auf 'data', weil unsere PL/pgSQL Funktion ein Objekt mit {error: ...} zurückgibt
    if (data && data.error) {
      throw new Error(data.error); // Hier war der Fehler: data.error statt err.error
    }

    return { 
      success: true, 
      data: Array.isArray(data) ? data : [data] 
    };
  } catch (error: any) {
    console.error("KERNEL_SQL_CRITICAL:", error);
    return { 
      success: false, 
      error: error.message || "Unknown Database Error", 
      data: [] 
    };
  }
}

/**
 * Zelle direkt aktualisieren
 */
export async function updateTableCell(tableName: string, idColumn: string, idValue: any, column: string, newValue: any) {
  try {
    const { error } = await db
      .from(tableName)
      .update({ [column]: newValue })
      .eq(idColumn, idValue);

    if (error) throw error;
    revalidatePath('/admin/db');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Zeile löschen
 */
export async function deleteTableRow(tableName: string, idColumn: string, idValue: any) {
  try {
    const { error } = await db
      .from(tableName)
      .delete()
      .eq(idColumn, idValue);

    if (error) throw error;
    revalidatePath('/admin/db');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * ER Diagram / Beziehungen (Postgres foreign keys)
 */
export async function getDbRelations() {
  try {
    // Postgres Abfrage für Fremdschlüssel-Beziehungen
    const { data, error } = await db.rpc('get_foreign_key_relations');
    
    if (error) {
      // Einfaches Fallback-Mapping basierend auf Namenskonventionen (ID-Mapping)
      return { success: true, relations: [] };
    }

    return { success: true, relations: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Erzeugt einen SQL-Dump der aktuellen Tabellenstruktur.
 * Wichtig für das AETHER OS Backup-Modul.
 */
export async function generateDbDump() {
  try {
    // Wir fragen Postgres nach allen Tabellen im 'public' Schema
    const query = `
      SELECT 
        'CREATE TABLE ' || table_name || ' (' || 
        string_agg(column_name || ' ' || data_type, ', ') || 
        ');' as table_sql
      FROM information_schema.columns
      WHERE table_schema = 'public'
      GROUP BY table_name;
    `;

    const res = await executeSql(query);

    if (!res.success) {
      throw new Error(res.error);
    }

    // Verbindet die Zeilen zu einem großen SQL-String
    const fullDump = res.data.map((row: any) => row.table_sql).join("\n\n");

    return {
      success: true,
      data: fullDump,
    };
  } catch (error: any) {
    console.error("DUMP_CRITICAL_FAILURE:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}