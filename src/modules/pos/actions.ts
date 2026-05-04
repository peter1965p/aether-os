/**
 * AETHER OS // POS MODULE REFACTOR
 * Ziel: Synchronisation mit dem neuen PostgreSQL-Schema
 * Status: Spaltennamen korrigiert (total_price, stock, min_stock, quantity)
 */

'use server'
import { createClient } from "@/lib/db";
import { revalidatePath } from 'next/cache';

/**
 * POS CORE: Verarbeitet Transaktionen
 */
export async function processPosTransaction(
    cartItems: any[],
    total: number,
    customerId?: number
) {
  const supabase = await createClient();

  // 1. VALIDIERUNG (Early Return statt Throw)
  // Wir prüfen den Zustand, bevor wir in den try-Block gehen.
  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: "Warenkorb ist leer." };
  }

  try {
    // 2. HAUPTPROZESS
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total_price: total,
          customer_id: customerId || null,
          status: 'COMPLETED'
        })
        .select()
        .single();

    if (orderError) throw orderError; // Hier ist 'throw' okay, da es ein DB-Fehler ist!
    const orderId = order.id;

    // 2. Einzelposten verarbeiten
    for (const item of cartItems) {
      const { error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: orderId,
            product_id: item.id, // Korrigiert: product_id
            quantity: item.qty || 1, // Korrigiert: quantity
            price_at_purchase: item.preis // Korrigiert: price_at_purchase
          });

      if (itemError) throw itemError;

      // 3. Lagerbestand aktualisieren (stock statt lagerbestand)
      // Hier nutzen wir den direkten Wert-Abzug
      const { error: stockError } = await supabase.rpc('decrement_stock', {
        product_id: item.id,
        amount: item.qty || 1
      });
    }    
    revalidatePath('/admin/pos');
    return { success: true, orderId: order.id };

  } catch (error: any) {
    // Hier landen nur echte, unvorhergesehene Systemfehler
    console.error("AETHER_SYSTEM_FAULT:", error.message);
    return { success: false, error: "Interner Systemfehler im POS-Kernel." };
  }
}

/**
 * WARENWIRTSCHAFT: Inventar-Abfragen (stock & min_stock)
 */
export async function getLowStockAlerts() {
  const supabase = await createClient();
  try {
    const { data } = await supabase
        .from('products') // Korrigiert: products
        .select('name, stock, min_stock') // Korrigiert: stock, min_stock
        .lte('stock', 'min_stock');
    return data || [];
  } catch (error) {
    return [];
  }
}

/**
 * FINANCIALS: Buchhaltung (total_price statt gesamtpreis)
 */
export async function getAccountingStats() {
  const supabase = await createClient();
  try {
    const { data: orders, error } = await supabase
        .from('orders')
        .select('total_price'); // Korrigiert: total_price

    if (error) throw error;

    const totalBrutto = orders?.reduce((sum: number, order: { total_price: number | null }) => {
      return sum + (order.total_price || 0);
    }, 0) || 0;

    const count = orders?.length || 0;
    const mwst = totalBrutto - (totalBrutto / 1.19);

    return {
      brutto: totalBrutto,
      netto: totalBrutto - mwst,
      mwst,
      count
    };
  } catch (error) {
    return { brutto: 0, netto: 0, mwst: 0, count: 0 };
  }
}

/**
 * Holt alle Kunden-Entitäten aus der Datenbank.
 * Diese Funktion wird im Customer Database Dashboard aufgerufen.
 */
export async function getAllCustomers() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
        .from("customers") // Deine Tabelle in Supabase
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
      console.error("[AETHER KERNEL] Fetch Customers Error:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("[AETHER KERNEL] Critical Exception:", err);
    return [];
  }
}

/**
 * AETHER OS // POS ACTIONS - EXTENSION
 * Holt alle Bestellungen für eine spezifische Kunden-ID.
 */
export async function getCustomerOrders(customerId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
        .from("orders")
        .select(`
        id, 
        total_price, 
        status, 
        order_date,
        order_items (
          quantity,
          products ( name )
        )
      `)
        .eq("customer_id", customerId) // Filter auf den spezifischen Kunden
        .order("order_date", { ascending: false });

    if (error) {
      console.error("[AETHER KERNEL] Fetch Customer Orders Error:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("[AETHER KERNEL] Critical Exception in getCustomerOrders:", err);
    return [];
  }
}

/**
 * Registriert eine neue Kunden-Entität im System.
 * @param formData - Die Objektdaten des neuen Kunden
 */
export async function registerCustomer(formData: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}) {
  const supabase = await createClient();

  try {
    // 1. Einfügen in die Datenbank
    const { data, error } = await supabase
        .from("customers")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

    if (error) {
      console.error("[AETHER KERNEL] Registration Error:", error.message);
      return { success: false, error: error.message };
    }

    // 2. Cache-Invalidation: Das Dashboard muss wissen, dass es neue Daten gibt
    revalidatePath("/admin/customers");

    return { success: true, data };
  } catch (err) {
    console.error("[AETHER KERNEL] Critical Registration Failure:", err);
    return { success: false, error: "Verbindung zum AETHER-Grid fehlgeschlagen." };
  }
}