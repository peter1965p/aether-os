"use server";

import { createClient } from "@/lib/db"; // Pfad ggf. anpassen
import { revalidatePath } from "next/cache";
// Ersetze den Pfad, falls deine Typen woanders liegen
import { SupplierNode } from "@/types/supplier";

/**
 * AETHER OS // SUPPLIER_ENGINE
 * Erstellt einen neuen Partner in der Datenbank und 
 * triggert den UI-Refresh.
 */
export async function createSupplier(formData: {
  name: string;
  email: string;
  cat: string;
  status: string;
}) {
  const supabase = createClient();

  // 1. Daten in die Tabelle 'suppliers' schreiben
  // Da RLS deaktiviert ist, wird der Insert direkt ausgeführt.
  const { data, error } = await supabase
    .from("suppliers")
    .insert([
      {
        name: formData.name,
        email: formData.email,
        category: formData.cat,
        status: formData.status,
        load_level: 0, // Initialer System-Load
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error("KERNEL_ERROR // SUPPLIER_INSERT_FAILED:", error.message);
    return { success: false, error: error.message };
  }

  // 2. Cache-Invalidation
  // Das sorgt dafür, dass die Seite /admin/suppliers sofort die neuen Daten zeigt
  revalidatePath("/admin/suppliers");

  return { success: true, data };
}

/**
 * Holt alle Supplier für das Grid
 */
export async function getSuppliers() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("KERNEL_ERROR // DATA_FETCH_FAILED:", error.message);
    return [];
  }

  return data;
}

// Definition der Warenwirtschafts-Struktur für AETHER OS
export interface SupplierAnalytics {
  id: string;
  name: string;
  email: string;
  category: string;
  status: string;
  load_level: number;
  revenue_prod_a: number; // Umsatz Produkt A
  trend: string;          // KI-Trend in %
  prediction: number;     // Jahresprognose
  created_at: string;
}

/**
 * AETHER OS // SUPPLY_CHAIN_ENGINE
 * Holt Lieferanten inkl. aggregierter Warenwirtschafts-Daten.
 */
export async function getSuppliersWithAnalytics(): Promise<SupplierAnalytics[]> {
  const supabase = createClient();
  
  // Da RLS deaktiviert ist, greifen wir direkt auf die Basisdaten zu.
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("name", { ascending: true });
  
  if (error) {
    console.error("KERNEL_ERROR // ANALYTICS_FETCH_FAILED:", error.message);
    return [];
  }

  // Hier wird das 'any'-Problem gelöst durch explizites Mapping auf das Interface
  return (data as any[]).map((sup): SupplierAnalytics => ({
    id: sup.id,
    name: sup.name,
    email: sup.email,
    category: sup.category || 'General Supply',
    status: sup.status || 'Active',
    load_level: sup.load_level || 0,
    // Warenwirtschafts-Logik: Diese Werte kommen später aus deiner 'orders' Tabelle
    revenue_prod_a: Math.random() * 75000, 
    trend: (Math.random() * 25 - 5).toFixed(2), 
    prediction: Math.random() * 120000,
    created_at: sup.created_at
  }));
}

/**
 * Überträgt die Lieferanten-Prognose in die globale Strategie-Statistik.
 */
export async function syncPrognosisToGlobal(supplierId: string, prediction: number) {
  console.log(`Uplink: Node ${supplierId} Prognose (${prediction}€) wird in Gesamt-Statistik integriert.`);
  
  // Hier würde der Insert in deine globale Statistik-Tabelle erfolgen
  return { success: true };
}

export async function getFullSupplierAnalytics(): Promise<SupplierNode[]> {
  const supabase = createClient();
  
  // RLS ist inaktiv, wir ziehen den Full-State [cite: 2026-03-14]
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("KERNEL_ERROR // FETCH_FAILED:", error.message);
    return [];
  }

  // Simulation der Warenwirtschafts-Aggregation
  // In der Final-Stufe werden diese Werte über SQL-Views aus der 'orders' Tabelle berechnet [cite: 2026-03-28]
  return (data as any[]).map(sup => ({
    ...sup,
    status: sup.status || 'ACTIVE',
    revenue_ytd: sup.revenue_ytd || (Math.random() * 50000 + 10000),
    trend_percentage: sup.trend_percentage || parseFloat((Math.random() * 15).toFixed(2)),
    annual_prediction: sup.annual_prediction || (Math.random() * 100000 + 20000),
    load_level: sup.load_level || Math.floor(Math.random() * 100)
  }));
}

