"use server";

import db, { createClient } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- TYPEN ---
type OrderResult =
  | { success: true; orderId: number | string; status: "PENDING" | "COMPLETED" }
  | { success: false; error: string; status?: never };

// --- PRODUKT & INVENTAR LOGIK ---

export async function getInventoryData() {
  try {
    const { data, error } = await db.from("produkte").select(`
        id, name, preis, category_id,
        lagerbestand,
        min_bestand
      `);

    if (error) throw error;

    // FIX: Typ 'any' oder Interface für das Produkt 'p' hinzugefügt
    return data.map((p: any) => ({
      ...p,
      bestand: p.lagerbestand || 0,
      min_bestand: p.min_bestand || 5,
    }));
  } catch (error) {
    console.error("AETHER_INVENTORY_ERROR:", error);
    return [];
  }
}

export async function createFullProduct(data: {
  name: string;
  preis: number;
  ek_preis: number;
  ust_satz: number;
  category_id: number;
  supplier_id: number;
}) {
  try {
    const { data: newProduct, error } = await db
      .from("produkte")
      .insert([
        {
          name: data.name,
          preis: data.preis,
          ek_preis: data.ek_preis,
          ust_satz: data.ust_satz,
          category_id: data.category_id,
          supplier_id: data.supplier_id,
          lagerbestand: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
    return { success: true, id: newProduct.id };
  } catch (error) {
    console.error("AETHER_PRODUCT_CREATE_ERROR:", error);
    return { success: false };
  }
}

// --- BESTELL-LOGIK (ORDERS) ---

export async function getPendingOrders() {
  try {
    const { data, error } = await db
      .from("orders")
      .select(
        `
        id, datum, status,
        order_items (
          menge,
          produkte ( name )
        )
      `,
      )
      .eq("status", "PENDING")
      .order("datum", { ascending: false });

    if (error) throw error;

    return data.map((o: any) => ({
      id: o.id,
      datum: o.datum,
      produkt_name: o.order_items?.[0]?.produkte?.name || "Unbekannt",
      menge: o.order_items?.[0]?.menge || 0,
      status: o.status,
    }));
  } catch (error) {
    console.error("AETHER_ORDERS_ERROR:", error);
    return [];
  }
}

export async function createOrder(
  productId: number,
  quantity: number,
): Promise<OrderResult> {
  try {
    const { data: produkt } = await db
      .from("produkte")
      .select("preis")
      .eq("id", productId)
      .single();

    if (!produkt) throw new Error("Produkt nicht gefunden");

    const { data: order, error: oError } = await db
      .from("orders")
      .insert([
        {
          typ: "POS",
          status: "PENDING",
          gesamtpreis: produkt.preis * quantity,
          datum: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (oError) throw oError;

    await db.from("order_items").insert([
      {
        order_id: order.id,
        produkt_id: productId,
        menge: quantity,
        einzelpreis: produkt.preis,
      },
    ]);

    revalidatePath("/admin/inventory");
    return { success: true, orderId: order.id, status: "PENDING" };
  } catch (error) {
    console.error("AETHER_ORDER_CREATE_ERROR:", error);
    return { success: false, error: "System-Fehler bei Order-Erstellung" };
  }
}

// --- KATEGORIEN & LIEFERANTEN ---

export async function createCategory(name: string, type: string) {
  try {
    await db.from("categories").insert([{ name, type }]);
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("AETHER_CAT_CREATE_ERROR:", error);
    return { success: false };
  }
}

export async function deleteCategory(id: number) {
  try {
    const { error } = await db.from("categories").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("AETHER_CAT_DELETE_ERROR:", error);
    return { success: false };
  }
}

// --- ACCOUNTING & STATS ---

export async function getAccountingStats() {
  try {
    const { data: prodData } = await db
      .from("produkte")
      .select("lagerbestand, ek_preis, preis, min_bestand");

    let invEK = 0;
    let invVK = 0;
    let lowStock = 0;

    // FIX: Parameter 'p' typisiert
    prodData?.forEach((p: any) => {
      const stock = p.lagerbestand || 0;
      invEK += stock * (p.ek_preis || 0);
      invVK += stock * (p.preis || 0);
      if (stock < (p.min_bestand || 5)) lowStock++;
    });

    const { data: salesData } = await db
      .from("orders")
      .select("gesamtpreis")
      .eq("status", "COMPLETED");

    // FIX: Parameter 'sum' und 'o' typisiert
    const totalSales =
      salesData?.reduce((sum: number, o: any) => sum + (o.gesamtpreis || 0), 0) || 0;

    return {
      inventoryValueEK: invEK,
      inventoryValueVK: invVK,
      lowStock: lowStock,
      totalSales: totalSales,
    };
  } catch (error) {
    return {
      inventoryValueEK: 0,
      inventoryValueVK: 0,
      lowStock: 0,
      totalSales: 0,
    };
  }
}

export async function getSettings() {
  try {
    const { data, error } = await db
      .from("settings")
      .select("setting_key, setting_value");
    if (error) throw error;

    return data.reduce((acc: any, row: any) => {
      acc[row.setting_key] = row.setting_value;
      return acc;
    }, {});
  } catch (error) {
    console.error("AETHER_SETTINGS_ERROR", error);
    return {};
  }
}

/**
 * IDENTITY & ACCESS MANAGEMENT
 */
export async function getCustomerDatabase() {
  try {
    const { data, error } = await db
      .from("customers")
      .select(`id, name, email, status, created_at`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("AETHER_CUSTOMER_DB_ERROR:", error);
    return [];
  }
}

/**
 * AETHER OS: FINANCE & ANALYTICS ENGINE
 */
export async function getProfitLossData() {
  try {
    const { data: completedOrders, error } = await db
      .from("orders")
      .select(`
        id,
        gesamtpreis,
        datum,
        order_items (
          menge,
          einzelpreis,
          produkte ( ek_preis )
        )
      `)
      .eq("status", "COMPLETED")
      .order("datum", { ascending: true });

    if (error) throw error;

    let totalProfit = 0;
    let totalRevenue = 0;

    const chartData = completedOrders?.map((order: any) => {
      let orderCost = 0;
      
      order.order_items?.forEach((item: any) => {
        const ek = item.produkte?.ek_preis || 0;
        orderCost += item.menge * ek;
      });

      const revenue = order.gesamtpreis || 0;
      const profit = revenue - orderCost;

      totalProfit += profit;
      totalRevenue += revenue;

      return {
        name: new Date(order.datum).toLocaleDateString("de-DE", { month: "short", day: "2-digit" }),
        revenue: revenue,
        profit: profit,
      };
    }) || [];

    return {
      success: true,
      totalProfit,
      totalRevenue,
      chartData,
    };
  } catch (error) {
    console.error("AETHER_FINANCE_ERROR:", error);
    return {
      success: false,
      totalProfit: 0,
      totalRevenue: 0,
      chartData: [],
    };
  }
}

export async function getCategories() {
  try {
    const { data, error } = await db
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("AETHER_GET_CATS_ERROR:", error);
    return [];
  }
}

// --- INTELLIGENCE HUB ---

export async function getIntelligenceConfig() {
  try {
    const { data, error } = await db
      .from("intelligence_hub")
      .select("*")
      .eq("id", "global_config")
      .single();

    if (error) {
      return {
        strategy_mode: "IT-Services",
        ai_optimization: true,
        ai_context_briefing: "System Initialized",
        keyword_cloud: [],
        market_pulse: 50
      };
    }
    return data;
  } catch (error) {
    console.error("AETHER_INTEL_GET_ERROR:", error);
    return null;
  }
}

export async function updateIntelligenceHub(data: {
  strategy_mode?: string;
  ai_context_briefing?: string;
  keyword_cloud?: string[];
  market_pulse?: number;
  seo_title_dynamic?: string;
}) {
  try {
    const { error } = await db.from("intelligence_hub").upsert({
      id: "global_config",
      ...data,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    revalidatePath("/admin");
    revalidatePath("/"); 
    
    return { success: true };
  } catch (error) {
    console.error("AETHER_INTEL_UPDATE_ERROR:", error);
    return { success: false, error };
  }
}

export async function getGeoContextForFrontend() {
  const config = await getIntelligenceConfig();
  if (!config) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AETHER // COMPANY",
    "description": config.ai_context_briefing,
    "keywords": config.keyword_cloud?.join(", "),
    "alternateName": config.seo_title_dynamic
  };
}

export async function completeOrder(orderId: number) {
  try {
    const { error } = await db
      .from("orders")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (error) throw error;

    revalidatePath("/admin/inventory");
    return { success: true };
  } catch (error) {
    console.error("AETHER_INVENTORY_ERROR (completeOrder):", error);
    return { success: false, error };
  }
}

/**
 * AETHER OS: SUPPLY CHAIN MANAGEMENT
 * Holt alle registrierten Lieferanten aus der Datenbank
 */
export async function getSuppliers() {
  try {
    const { data, error } = await db
      .from("suppliers") // Falls deine Tabelle 'lieferanten' heißt, hier anpassen
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("AETHER_GET_SUPPLIERS_ERROR:", error);
    return [];
  }
}

/**
 * AETHER OS: IDENTITY & ACCESS MANAGEMENT
 * Aktualisiert die Rolle eines Mitarbeiters (Staff)
 */
export async function updateStaffRole(staffId: number | string, newRole: string) {
  try {
    const { error } = await db
      .from("staff") // Prüfe in Supabase, ob die Tabelle 'staff' oder 'mitarbeiter' heißt
      .update({ 
        role: newRole, 
        updated_at: new Date().toISOString() 
      })
      .eq("id", staffId);

    if (error) throw error;

    // Wir revalidieren die Admin-Benutzerseite, damit die Änderung sofort sichtbar ist
    revalidatePath("/admin/users");
    
    return { success: true };
  } catch (error) {
    console.error("AETHER_STAFF_ROLE_UPDATE_ERROR:", error);
    return { success: false, error: "Rollen-Update fehlgeschlagen." };
  }
}

/**
 * --- AETHER OS INTELLIGENCE ACTIONS ---
 * Zentrale Logik für das interne Mailsystem auf paeffgen-it.de [cite: 2026-02-20, 2026-03-08]
 */

// 1. Nachricht senden (Broadcast) [cite: 2026-03-08]
export async function sendInternalMessage(formData: FormData) {
  const receiver_id = formData.get("receiver_id") as string;
  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;
  
  // Deine Admin-ID aus dem users-Cluster (image_72811d.png) [cite: 2026-03-08]
  const sender_id = "ab67ef59-2070-4f90-b0d5-742d2bf92911"; 

  try {
    const { error } = await db
      .from("messages")
      .insert([
        { 
          sender_id, 
          receiver_id, 
          subject, 
          content,
          is_read: false,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;

    // Cache leeren, damit die Inbox sofort aktualisiert wird [cite: 2026-03-08]
    revalidatePath("/admin/intelligence");
    return { success: true };
  } catch (error: any) {
    console.error("AETHER_MAIL_SEND_ERROR:", error.message);
    return { success: false, error: error.message };
  }
}

// 2. Posteingang abrufen (Inbox) [cite: 2026-03-08]
export async function getInboxMessages(userId: string) {
  try {
    const { data, error } = await db
      .from("messages")
      .select(`
        id,
        subject,
        content,
        created_at,
        is_read,
        sender:users!messages_sender_id_fkey (
          username,
          email
        )
      `)
      .eq("receiver_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error: any) {
    console.error("AETHER_INBOX_FETCH_ERROR:", error.message);
    return [];
  }
}

// 3. Nachricht als gelesen markieren [cite: 2026-03-08]
export async function markMessageAsRead(messageId: string) {
  try {
    const { error } = await db
      .from("messages")
      .update({ is_read: true })
      .eq("id", messageId);

    if (error) throw error;

    revalidatePath("/admin/intelligence");
    return { success: true };
  } catch (error: any) {
    console.error("AETHER_MAIL_UPDATE_ERROR:", error.message);
    return { success: false };
  }
}

export async function markAsRead(id: string) {
  await db.from("messages").update({ is_read: true }).eq("id", id);
  revalidatePath("/admin/intelligence");
}

// FIX: Diese Funktion hat gefehlt!
export async function updateSettings(formData: any) {
  try {
    const { error } = await db
      .from('settings')
      .update({
        // Hier die Felder eintragen, die du in deinem Settings-Formular hast
        system_name: formData.system_name,
        security_level: formData.security_level,
        maintenance_mode: formData.maintenance_mode,
        // ... weitere Felder
      })
      .eq('id', 1); // Meistens gibt es nur eine Settings-Zeile mit ID 1

    if (error) throw error;

    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error) {
    console.error("AETHER_SETTINGS_UPDATE_ERROR:", error);
    return { success: false };
  }
}

export async function getProjects() {
  // Hier deine Supabase Logik
  return []; 
}

export async function getTickets() {
  return [];
}

// Ändere die Funktion in deiner actions.ts zu dieser Version:

export async function getProjectTasks(projectId?: string) {
  if (!projectId) {
    console.warn("AETHER OS // getProjectTasks: No projectId provided.");
    return [];
  }

  const db = await createClient();
  const { data, error } = await db
    .from('project_tasks')
    .select('*')
    .eq('project_id', projectId);

  if (error) return [];
  return data;
}

// DAS IST DIE FEHLENDE FUNKTION AUS DEINEM ERROR
export async function createNewProject(data: any) {
  console.log("AETHER OS // Creating Project", data);
  return { success: true };
}

/**
 * AETHER OS // PROJECT TASK ACTIONS
 * Diese Funktionen werden vom AetherPlanner benötigt
 */

// TASK ERSTELLEN
export async function createProjectTask(taskData: any) {
  try {
    // Hier kommt später deine Supabase-Logik rein
    // const { data, error } = await supabase.from('project_tasks').insert([taskData]);
    console.log("AETHER OS // Task created:", taskData);
    return { success: true, data: taskData };
  } catch (error) {
    return { success: false, error: "Task creation failed" };
  }
}

// TASK LÖSCHEN
export async function deleteProjectTask(taskId: string) {
  try {
    // Hier kommt später deine Supabase-Logik rein
    // const { error } = await supabase.from('project_tasks').delete().eq('id', taskId);
    console.log("AETHER OS // Task deleted:", taskId);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Task deletion failed" };
  }
}

// Falls dein Planner auch Updates braucht (vorsorglich):
export async function updateProjectTask(taskId: string, updateData: any) {
  console.log("AETHER OS // Task updated:", taskId, updateData);
  return { success: true };
}

/**
 * AETHER OS // ACCOUNTING & INVENTORY CORE
 */

export async function getGrowthStats() {
  try {
    const { data, error } = await db
      .from("orders")
      .select("total_price, order_date")
      .limit(10);

    if (error) throw error;

    return {
      labels: (data || []).map((d: { order_date: string }) => new Date(d.order_date).getMonth()),
      datasets: [
        {
          label: 'Revenue Growth',
          data: (data || []).map((d: { total_price: number }) => d.total_price),
        }
      ]
    };
  } catch (error) {
    console.error("Accounting Error [Growth]:", error);
    return { labels: [], datasets: [] };
  }
}

/**
 * AETHER OS // AI STRATEGY ENGINE
 * Analysiert den Lagerbestand und generiert Handlungsempfehlungen
 */
export async function getAIInventoryStrategy() {
  try {
    // 1. Daten holen (Produkte inkl. Lieferanten-Verknüpfung)
    const { data: products, error } = await db
      .from("produkte")
      .select(`
        name, 
        lagerbestand, 
        min_bestand, 
        suppliers ( name, kontakt_email )
      `);

    if (error) throw error;

    // 2. Kritische Produkte filtern
    const lowStockItems = products?.filter(
      (p: any) => (p.lagerbestand || 0) < (p.min_bestand || 5)
    ) || [];

    if (lowStockItems.length === 0) {
      return {
        status: "OPTIMAL",
        message: "Alle Systeme im grünen Bereich. Aktuell keine Nachbestellungen erforderlich.",
        recommendations: []
      };
    }

    // 3. Empfehlungen generieren
    const recommendations = lowStockItems.map((p: any) => ({
      product: p.name,
      current: p.lagerbestand,
      min: p.min_bestand,
      action: `Nachbestellung einleiten bei ${p.suppliers?.name || "Standard-Lieferant"}`,
      priority: (p.lagerbestand === 0) ? "CRITICAL" : "HIGH"
    }));

    return {
      status: "ACTION_REQUIRED",
      message: `KI-Analyse: ${lowStockItems.length} Produkte unterschreiten den Mindestbestand.`,
      recommendations
    };
  } catch (error) {
    console.error("AETHER_STRATEGY_ERROR:", error);
    return { status: "ERROR", message: "Strategie-Engine offline.", recommendations: [] };
  }
}



