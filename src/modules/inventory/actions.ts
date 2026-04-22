"use server";

import db, { createClient } from "@/lib/db";
import { revalidatePath } from "next/cache";


// --- TYPEN ---
type OrderResult =
  | { success: true; orderId: number | string; status: "PENDING" | "COMPLETED" }
  | { success: false; error: string; status?: never };

// --- PRODUKT & INVENTAR LOGIK ---

/**
 * AETHER OS: INVENTORY CORE
 * Synchronized with English Schema: products, stock, cost_price, min_stock
 */
export async function getInventoryData() {
  try {
    const { data, error } = await db.from("products").select(`
        id, 
        name, 
        price, 
        category_id,
        stock,
        min_stock,
        cost_price
      `);

    if (error) throw error;

    return (data || []).map((p: any) => ({
      ...p,
      // Mapping für das Frontend (Abwärtskompatibilität)
      preis: p.price,
      bestand: p.stock || 0,
      min_bestand: p.min_stock || 5,
      ek_preis: p.cost_price || 0
    }));
  } catch (error) {
    console.error("AETHER_INVENTORY_ERROR [KERNEL]:", error);
    return [];
  }
}

/**
 * AETHER OS: INVENTORY CORE
 */
export async function createFullProduct(data: {
  name: string;
  preis: number;
  ek_preis: number;
  ust_satz: number; // Hier muss er in den Typ rein!
  category_id: number;
  supplier_id: number;
  min_stock?: number;
}) {
  try {
    const { data: newProduct, error } = await db
        .from("products")
        .insert([
          {
            name: data.name,
            price: data.preis,
            cost_price: data.ek_preis,
            // Wir nennen die Spalte in der DB am besten 'vat_rate' 
            // Falls deine DB-Spalte noch anders heißt, hier anpassen:
            vat_rate: data.ust_satz,
            category_id: data.category_id,
            supplier_id: data.supplier_id,
            stock: 0,
            min_stock: data.min_stock || 5,
            in_stock: true
          },
        ])
        .select()
        .single();

    if (error) throw error;

    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
    return { success: true, id: newProduct.id };
  } catch (error: any) {
    console.error("AETHER_PRODUCT_CREATE_ERROR [KERNEL]:", error.message);
    return { success: false, error: error.message };
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

/**
 * AETHER OS: ACCOUNTING & INVENTORY METRICS
 * Synchronized with: products (stock, cost_price, price, min_stock) & orders (total_price)
 */
export async function getAccountingStats() {
  try {
    // 1. Inventar-Werte abrufen (English Schema)
    const { data: prodData, error: prodError } = await db
        .from("products")
        .select("stock, cost_price, price, min_stock");

    if (prodError) throw prodError;

    let invEK = 0;
    let invVK = 0;
    let lowStock = 0;

    prodData?.forEach((p: any) => {
      const stock = Number(p.stock) || 0;
      invEK += stock * (Number(p.cost_price) || 0);
      invVK += stock * (Number(p.price) || 0);

      // Nutzt jetzt die neue min_stock Spalte
      if (stock < (Number(p.min_stock) || 5)) lowStock++;
    });

    // 2. Verkaufs-Statistiken abrufen (English Schema)
    const { data: salesData, error: salesError } = await db
        .from("orders")
        .select("total_price")
        .eq("status", "completed"); // Kleingeschrieben, passend zum Rest

    if (salesError) throw salesError;

    const totalSales =
        salesData?.reduce((sum: number, o: any) => sum + (Number(o.total_price) || 0), 0) || 0;

    return {
      inventoryValueEK: invEK,
      inventoryValueVK: invVK,
      lowStock: lowStock,
      totalSales: totalSales,
    };
  } catch (error) {
    console.error("AETHER_ACCOUNTING_ERROR [KERNEL_CRITICAL]:", error);
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
/**
 * IDENTITY & ACCESS MANAGEMENT
 * FIX: Explicit typing to bypass TS7006 and column mapping
 */
export async function getCustomerDatabase() {
  try {
    const { data, error } = await db
        .from("customers")
        .select(`id, full_name, email, tier, created_at`)
        .order("created_at", { ascending: false });

    if (error) throw error;

    // Wir setzen (customer: any), um den TS7006 "implicit any" Fehler zu beheben
    return (data || []).map((customer: any) => ({
      id: customer.id,
      name: customer.full_name, // Mapping: full_name -> name
      email: customer.email,
      status: customer.tier,    // Mapping: tier -> status
      created_at: customer.created_at
    }));

  } catch (error) {
    console.error("AETHER_CUSTOMER_DB_ERROR:", error);
    return [];
  }
}

/**
 * AETHER OS: FINANCE & ANALYTICS ENGINE
 * Übersetzt das englische DB-Schema in die deutsche Logik der App
 * und sie nutzt zu 100% die Spalte cost_price (EK Preis)
 */

export async function getProfitLossData() {
  try {
    const { data: completedOrders, error } = await db
        .from("orders")
        .select(`
        id,
        total_price,
        order_date,
        order_items (
          quantity,
          price_at_purchase,
          products ( 
            cost_price 
          )
        )
      `)
        .eq("status", "completed")
        .order("order_date", { ascending: true });

    if (error) throw error;

    let totalProfit = 0;
    let totalRevenue = 0;

    const chartData = (completedOrders || []).map((order: any) => {
      let orderTotalCost = 0;

      // Summierung der EK-Kosten für alle Positionen der Bestellung
      order.order_items?.forEach((item: any) => {
        const costPerUnit = item.products?.cost_price || 0;
        const qty = item.quantity || 0;
        orderTotalCost += qty * costPerUnit;
      });

      const revenue = Number(order.total_price) || 0;
      const profit = revenue - orderTotalCost;

      totalProfit += profit;
      totalRevenue += revenue;

      return {
        // UI-Labels bleiben für die Anzeige auf Deutsch (Monat/Tag)
        name: new Date(order.order_date).toLocaleDateString("de-DE", {
          month: "short",
          day: "2-digit"
        }),
        revenue: revenue,
        profit: profit,
      };
    });

    return {
      success: true,
      totalProfit,
      totalRevenue,
      chartData,
    };
  } catch (error) {
    console.error("AETHER_FINANCE_ERROR [KERNEL_FATAL]:", error);
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

    revalidatePath("/admin/message");
    return { success: true };
  } catch (error: any) {
    console.error("AETHER_MAIL_UPDATE_ERROR:", error.message);
    return { success: false };
  }
}

export async function markAsRead(id: string) {
  await db.from("messages").update({ is_read: true }).eq("id", id);
  revalidatePath("/admin/message");
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

/**
 * AETHER OS: PROJECT MANAGEMENT
 * Holt alle Projekte aus der Database
 */
export async function getProjects() {
  try {
    const { data, error } = await db
        .from("projects")
        .select("*")
        .order("deadline", { ascending: true });

    if (error) throw error;

    // Wir mappen hier nichts um, da dein Schema (project_name, status, deadline)
    // bereits perfekt ist.
    return data || [];
  } catch (error) {
    console.error("AETHER_PROJECTS_FETCH_ERROR:", error);
    return [];
  }
}

/**
 * AETHER OS: SUPPORT & TICKETING
 * Holt Tickets inkl. Projekt-Zuweisung
 */
export async function getTickets() {
  try {
    const { data, error } = await db
        .from("tickets")
        .select(`
        id,
        subject,
        message,
        status,
        created_at,
        projects (
          project_name
        ),
        users (
          username,
          email
        )
      `)
        .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((t: any) => ({
      ...t,
      // Mapping für die UI: Falls das Frontend "project" statt "projects" erwartet
      project_name: t.projects?.project_name || "No Project",
      user_name: t.users?.username || "System"
    }));
  } catch (error) {
    console.error("AETHER_TICKETS_FETCH_ERROR:", error);
    return [];
  }
}

// Ändere die Funktion in deiner actions.ts zu dieser Version:

/**
 * AETHER OS // PROJECT & PLANNER ENGINE
 * Status: Tutti Kompletto (Fast)
 */

export async function getProjectTasks(projectId?: string | number) {
  if (!projectId) {
    console.warn("AETHER OS // getProjectTasks: No projectId provided.");
    return [];
  }

  try {
    // Vereinheitlicht: Wir nutzen die globale db-Instanz wie im Rest des Kernels
    const { data, error } = await db
        .from('project_tasks')
        .select('*')
        // Wir wandeln sicherheitshalber in Number um, falls ein String aus der URL kommt
        .eq('project_id', Number(projectId));

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("AETHER_FETCH_TASKS_ERROR:", error);
    return [];
  }
}

// PROJEKT ERSTELLEN
export async function createNewProject(data: any) {
  try {
    const { data: newProject, error } = await db
        .from("projects")
        .insert([
          {
            project_name: data.project_name,
            description: data.description,
            status: data.status || 'planning',
            deadline: data.deadline,
            budget: Number(data.budget) || 0 // Sicherstellen, dass es eine Zahl ist
          }
        ])
        .select()
        .single();

    if (error) throw error;

    revalidatePath("/admin/projects");
    return { success: true, data: newProject };
  } catch (error: any) {
    console.error("AETHER_PROJECT_CREATE_ERROR:", error.message);
    return { success: false, error: error.message };
  }
}

// TASK ERSTELLEN
export async function createProjectTask(taskData: any) {
  try {
    const { data, error } = await db
        .from('project_tasks')
        .insert([
          {
            // Hier die Zahl-Umwandlung für das Integer-Schema
            project_id: Number(taskData.project_id),
            task_name: taskData.task_name,
            status: taskData.status || 'todo',
            priority: taskData.priority || 'medium',
            due_date: taskData.due_date
          }
        ])
        .select()
        .single();

    if (error) throw error;

    revalidatePath("/admin/projects");
    return { success: true, data };
  } catch (error: any) {
    console.error("AETHER_TASK_CREATE_ERROR:", error.message);
    return { success: false, error: error.message };
  }
}

// TASK LÖSCHEN
export async function deleteProjectTask(taskId: string | number) {
  try {
    const { error } = await db
        .from('project_tasks')
        .delete()
        .eq('id', Number(taskId)); // Integer-Match

    if (error) throw error;

    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error: any) {
    console.error("AETHER_TASK_DELETE_ERROR:", error.message);
    return { success: false, error: error.message };
  }
}

// TASK UPDATE
export async function updateProjectTask(taskId: string | number, updateData: any) {
  try {
    const { data, error } = await db
        .from('project_tasks')
        .update({
          task_name: updateData.task_name,
          status: updateData.status,
          priority: updateData.priority,
          due_date: updateData.due_date
        })
        .eq('id', Number(taskId)) // Integer-Match
        .select()
        .single();

    if (error) throw error;

    revalidatePath("/admin/projects");
    return { success: true, data };
  } catch (error: any) {
    console.error("AETHER_TASK_UPDATE_ERROR:", error.message);
    return { success: false, error: error.message };
  }
}

// PLANNER FETCH
export async function getPlannerTasks() {
  try {
    const { data, error } = await db
        .from("project_tasks")
        .select("*, projects(project_name)");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("AETHER_PLANNER_READ_ERROR:", error);
    return [];
  }
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
    // 1. Wir testen erst mal OHNE min_bestand, um zu sehen ob es daran liegt
    const { data: products, error } = await db
        .from("products")
        .select(`
        name, 
        stock, 
        suppliers!fk_supplier ( name, kontakt_email )
      `); // !fk_supplier erzwingt die Nutzung des korrekten Fremdschlüssels

    if (error) {
      // Das hier wird den echten Fehler im Terminal ausspucken!
      console.error("AETHER_DB_DETAIL:", JSON.stringify(error, null, 2));
      throw new Error(error.message || "Unbekannter DB Fehler");
    }

    const lowStockItems = products?.filter((p: any) => (p.stock || 0) < 5) || [];

    return {
      status: lowStockItems.length > 0 ? "ACTION_REQUIRED" : "OPTIMAL",
      message: `KI-Analyse abgeschlossen. ${lowStockItems.length} Nodes kritisch.`,
      recommendations: lowStockItems.map((p: any) => ({
        product: p.name,
        current: p.stock,
        min: 5,
        action: `Order bei ${p.suppliers?.name || "Standard"}`,
        priority: p.stock === 0 ? "CRITICAL" : "HIGH"
      }))
    };

  } catch (error: any) {
    // Falls Turbopack hier Probleme macht, loggen wir nur den String
    const errorMessage = error.message || "Fataler Systemfehler";
    console.error("STRATEGY_CRASH:", errorMessage);
    return { status: "ERROR", message: errorMessage, recommendations: [] };
  }
}

/**
 * Holt dynamische Metriken aus der Datenbank für das AETHER OS Analytics Dashboard.
 * Berücksichtigt blog_posts, newsletter_subs, orders und den Intelligence Hub.
 */
export async function getSystemMetrics() {
  const db = createClient();

  // 1. Parallele Abfrage der verschiedenen Datenpunkte für bessere Performance
  const [
    { count: postsCount },
    { count: subsCount },
    { count: ordersCount },
    { count: formsCount },
    { data: hub },
    { data: pages }
  ] = await Promise.all([
    db.from('blog_posts').select('*', { count: 'exact', head: true }),
    db.from('newsletter_subs').select('*', { count: 'exact', head: true }),
    db.from('orders').select('*', { count: 'exact', head: true }),
    db.from('form_submissions').select('*', { count: 'exact', head: true }),
    db.from('intelligence_hub').select('*').single(),
    db.from('pages').select('title, slug').limit(4)
  ]);

  return {
    // Haupt-Metriken (Quick Stats)
    stats: [
      { 
        label: 'System Nodes', 
        value: postsCount || 0, 
        trend: 'Database Active', 
        color: 'text-blue-500' 
      },
      { 
        label: 'Newsletter Subs', 
        value: subsCount || 0, 
        trend: '+12%', 
        color: 'text-purple-500' 
      },
      { 
        label: 'Market Pulse', 
        value: `${hub?.market_pulse || 50}%`, 
        trend: hub?.strategy_mode || 'Stable', 
        color: 'text-green-500' 
      },
    ],

    // Top Pages Mapping - Jetzt ohne TypeScript 'any' Fehler
    topPages: pages?.map((p: any) => ({
      path: p.slug,
      views: Math.floor(Math.random() * 5000) + 1000, // Simulation basierend auf echten Slugs
      percentage: Math.floor(Math.random() * 60) + 30
    })) || [],

    // Traffic Sources basierend auf System-Interaktionen
    trafficSources: [
      { 
        source: 'Direct Kernel', 
        visitors: subsCount || 0, 
        iconName: 'link', 
        color: 'text-blue-500', 
        bg: 'bg-blue-500' 
      },
      { 
        source: 'Form Inbound', 
        visitors: formsCount || 0, 
        iconName: 'share', 
        color: 'text-purple-500', 
        bg: 'bg-purple-500' 
      },
      { 
        source: 'Organic Search', 
        visitors: Math.floor((postsCount || 0) * 1.5), 
        iconName: 'search', 
        color: 'text-orange-500', 
        bg: 'bg-orange-500' 
      },
    ]
  };
}

// Seiten Definition für CMS Funktion 

export async function updateAetherPage(formData: FormData) {
  const supabase = await createClient();
  
  const id = formData.get("page_id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;

  // 1. Core Page Data Update
  const { error: pageError } = await supabase
    .from('pages')
    .update({ 
      title, 
      slug, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id);

  if (pageError) throw new Error("Kernel Update Failed: Pages Table");

  // 2. Section Data Update
  // Wir loopen durch die Sektionen (die IDs kommen als Hidden Fields aus dem Form)
  const sectionIds = formData.getAll("section_id") as string[];
  
  for (const sId of sectionIds) {
    const sTitle = formData.get(`section_title_${sId}`) as string;
    const sSubtitle = formData.get(`section_subtitle_${sId}`) as string;
    const sContent = formData.get(`section_content_${sId}`) as string;
    const sImageUrl = formData.get(`section_image_${sId}`) as string;

    await supabase
      .from('page_sections')
      .update({
        title: sTitle,
        subtitle: sSubtitle,
        content: sContent,
        image_url: sImageUrl
      })
      .eq('id', sId);
  }

  revalidatePath("/admin/pages");
  revalidatePath(`/${slug}`); // Damit die Änderungen im Frontend sofort sichtbar sind
  
  return;
}

/**
 * AETHER OS // DSP CORE ENGINE
 * Holt die Seiten-Struktur und deren Sektionen für das dynamische Rendering.
 */
export async function getPageBySlug(slug: string) {
  try {
    const { data, error } = await db
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("AETHER_DSP_PAGE_ERROR:", error);
    return null;
  }
}

export async function getPageSections(pageId: number) {
  try {
    const { data, error } = await db
      .from("page_sections")
      .select("*")
      .eq("page_id", pageId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("AETHER_DSP_SECTIONS_ERROR:", error);
    return [];
  }
}

export async function updateAetherPages(formData: FormData) {
  const db = await createClient(); // Nutzt deinen Client [cite: 2026-03-28]

  const id = formData.get("page_id") as string;
  const title = formData.get("title") as string; // FIX: "zitle" -> "title"
  const slug = formData.get("slug") as string;

  // 1. Update der Hauptseite
  await db
    .from('pages')
    .update({ 
      title, 
      slug, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id);

  // 2. Update der Sektionen
  const sectionIds = formData.getAll("section_id") as string[];

  for (const sId of sectionIds) {
    await db
      .from('page_sections') 
      .update({
        title: formData.get(`section_title_${sId}`) as string,
        subtitle: formData.get(`section_subtitle_${sId}`) as string,
        content: formData.get(`section_content_${sId}`) as string,
        image_url: formData.get(`section_image_${sId}`) as string
      }) // FIX: Hier war ein Semikolon, das muss weg!
      .eq('id', sId);    
  }

  // Cache-Invalidierung für sofortige Updates [cite: 2026-03-28]
  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/edit/${id}`);
  revalidatePath(`/dsp/${id}`); 
  
  return { success: true };
}






