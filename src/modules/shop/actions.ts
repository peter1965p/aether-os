/**
 * AETHER OS // PRODUCT & TRANSACTION KERNEL
 * Status: Supabase PostgreSQL (Synchronized)
 */

"use server";

import db, {createClient} from "@/lib/db";
import { revalidatePath } from "next/cache";

/* --- HELPER: DATA CLEANING --- */
const parsePrice = (price: any): number => {
  if (typeof price === 'number') return price;
  const cleaned = price.toString().replace("€", "").replace(",", ".").trim();
  return parseFloat(cleaned) || 0;
};

/* --- PRODUCT OPERATIONS --- */

export async function getAllProducts() {
  try {
    const { data: products, error } = await db
        .from("products")
        .select("*")
        .order("id", { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, data: products };
  } catch (error: any) {
    return { success: false, error: "Systemfehler beim Abrufen der Produkte." };
  }
}

export async function saveProductToDB(data: any) {
  // Early Return statt Throw
  if (!data.name || !data.price) return { success: false, error: "Pflichtfelder fehlen." };

  try {
    const categoryMap: Record<string, number> = {
      ACCESSOIRES: 1, HARDWARE: 2, MERCHANDISE: 3, SOFTWARE: 4,
    };
    const categoryId = categoryMap[data.category?.toUpperCase()] || 1;

    const { error } = await db.from("products").insert([
      {
        name: data.name,
        price: parsePrice(data.price),
        description: data.description || "",
        image_url: data.images[0] || "",
        stock: parseInt(data.stock) || 0,
        category_id: categoryId,
        image_url_2: data.images[1] || "",
        image_url_3: data.images[2] || "",
      },
    ]);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/shop");
    revalidatePath("/shop");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: "Kritischer Fehler beim Speichern." };
  }
}

/* --- CART & TRANSACTION OPERATIONS --- */

export async function finalizeTransactionAction() {
  const session_id = "SESSION_01"; // Später durch Auth-ID ersetzen

  try {
    // 1. Warenkorb laden
    const { data: cartItems, error: cartError } = await db
        .from("cart_items")
        .select(`
        id, quantity, product_id,
        products (id, price, stock, name)
      `)
        .eq("session_id", session_id);

    if (cartError || !cartItems || cartItems.length === 0) {
      return { success: false, error: "Warenkorb ist leer oder nicht erreichbar." };
    }

    // 2. Gesamtpreis berechnen
    const total_price = cartItems.reduce((acc: number, item: any) => {
      const price = parsePrice(item.products.price);
      return acc + (price * item.quantity);
    }, 0);

    // 3. Order anlegen (order_date statt created_at nutzen laut Schema)
    const { data: order, error: orderError } = await db
        .from("orders")
        .insert([
          {
            order_date: new Date().toISOString(), // Korrigiert laut Schema
            status: "COMPLETED",
            total_price: total_price,
          },
        ])
        .select()
        .single();

    if (orderError) return { success: false, error: "Bestellung konnte nicht erstellt werden." };

    // 4. Bestands-Update und Order Items
    for (const item of cartItems) {
      const currentStock = item.products.stock || 0;

      if (currentStock < item.quantity) {
        return { success: false, error: `Bestand zu niedrig für: ${item.products.name}` };
      }

      // Order Item verknüpfen
      await db.from("order_items").insert({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: parsePrice(item.products.price),
      });

      // Bestand abziehen
      await db
          .from("products")
          .update({ stock: currentStock - item.quantity })
          .eq("id", item.product_id);
    }

    // 5. Cleanup
    await db.from("cart_items").delete().eq("session_id", session_id);

    revalidatePath("/shop");
    revalidatePath("/admin");

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("AETHER_TRANSACTION_ERROR:", error.message);
    return { success: false, error: "Transaktion im Kernel abgebrochen." };
  }
}

// Definition der Struktur, die wir von Supabase erwarten
interface RawInvoiceData {
  id: number;
  order_date: string;
  total_price: number;
  status: string;
  order_items: {
    quantity: number;
    price_at_purchase: number;
    products: { name: string } | null;
  }[];
}

export async function getCustomerInvoices(clientId: number) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
        .from("orders")
        .select(`
        id,
        order_date,
        total_price,
        status,
        order_items (
          quantity,
          price_at_purchase,
          products ( name )
        )
      `)
        .eq("customer_id", clientId)
        .order("order_date", { ascending: false });

    if (error) {
      console.error("AETHER_DASHBOARD_FETCH_ERROR:", error.message);
      return { success: false, data: [] };
    }

    // Typisierung des 'inv' Parameters zur Behebung von TS7006
    const formattedInvoices = (data as unknown as RawInvoiceData[]).map((inv: RawInvoiceData) => ({
      id: inv.id,
      invoiceNumber: `INV-${inv.id.toString().padStart(6, '0')}`,
      date: new Date(inv.order_date).toLocaleDateString('de-DE'),
      amount: inv.total_price,
      status: inv.status,
      itemCount: inv.order_items?.length || 0
    }));

    return { success: true, data: formattedInvoices };
  } catch (error) {
    console.error("AETHER_CRITICAL_DASHBOARD_FAULT:", error);
    return { success: false, data: [] };
  }
}

/**
 * AETHER OS // FINANCIAL KERNEL
 * Erzeugt strukturierte Rechnungsdaten basierend auf der Order-ID.
 */

export async function generateInvoiceData(orderId: number) {
  const supabase = await createClient();

  try {
    // 1. Datenabfrage über Relationen (Join-Ersatz in Supabase)
    const { data: order, error } = await supabase
        .from("orders")
        .select(`
        id,
        order_date,
        total_price,
        status,
        customers (
          full_name,
          email
        ),
        order_items (
          quantity,
          price_at_purchase,
          products (
            name,
            vat_rate
          )
        )
      `)
        .eq("id", orderId)
        .single();

    if (error || !order) {
      console.error("AETHER_INVOICE_FETCH_ERROR:", error?.message);
      return null;
    }

    // 2. Finanz-Kalkulation
    // Wir nehmen den Steuersatz des ersten Artikels als Basis für die Gesamtrechnung
    const vatRate = order.order_items?.[0]?.products?.vat_rate || 19;
    const grossTotal = Number(order.total_price);

    // Formel: Netto = Brutto / (1 + MwSt/100)
    const netTotal = grossTotal / (1 + vatRate / 100);
    const taxAmount = grossTotal - netTotal;

    // 3. Rückgabe des formatierten Objekts
    return {
      invoiceNumber: `INV-${order.id.toString().padStart(6, '0')}`,
      date: new Date(order.order_date).toLocaleDateString('de-DE'),
      customer: order.customers?.full_name || "Gast-Kunde",
      email: order.customers?.email || "N/A",
      items: order.order_items.map((item: any) => ({
        name: item.products?.name || "System-Produkt",
        qty: item.quantity,
        price: item.price_at_purchase
      })),
      totals: {
        net: netTotal.toFixed(2),
        tax: taxAmount.toFixed(2),
        gross: grossTotal.toFixed(2),
        rate: vatRate
      }
    };
  } catch (error) {
    console.error("CRITICAL_INVOICE_FAULT:", error);
    return null;
  }
}

/**
 * Fügt ein Produkt zum Warenkorb hinzu.
 * @param productId - Die ID des Produkts aus der Datenbank.
 */
export async function addToCartAction(productId: string) {
  const supabase = await createClient();

  try {
    // Hier würde normalerweise die Logik für den Warenkorb stehen (z.B. in Cookies oder DB)
    console.log(`[AETHER SHOP] Produkt hinzugefügt: ${productId}`);

    // Wir simulieren hier eine erfolgreiche Aktion für den Build-Prozess
    // Später binden wir hier deine Warenkorb-Tabelle ein.

    revalidatePath("/shop"); // Aktualisiert die Shop-Ansicht
    return { success: true };

  } catch (error) {
    console.error("[AETHER SHOP] Fehler beim Hinzufügen zum Warenkorb:", error);
    return { success: false, error: "Fehler beim Aktualisieren des Warenkorbs" };
  }
}
/**
 * UPDATER: Hier lag der Fehler (Fehlender Export)
 */
export async function updateProductInDB(id: string, data: any) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
        .from("products") // Stelle sicher, dass die Tabelle in Supabase so heißt
        .update(data)
        .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/shop");
    return { success: true };
  } catch (error: any) {
    console.error("AETHER_SHOP_UPDATE_ERROR:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * DELETER: Ebenfalls wichtig für den ShopClientWrapper
 */
export async function deleteProductFromDB(id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/shop");
    return { success: true };
  } catch (error: any) {
    console.error("AETHER_SHOP_DELETE_ERROR:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Entfernt ein Produkt aus dem Warenkorb.
 * @param productId - Die ID des zu entfernenden Produkts.
 */
export async function removeFromCartAction(productId: string) {
  const supabase = await createClient();

  try {
    console.log(`[AETHER SHOP] Entferne Produkt: ${productId}`);

    // Hier folgt später die Supabase-Logik zum Löschen aus der 'cart'-Tabelle
    // const { error } = await supabase.from('cart').delete().eq('product_id', productId);

    revalidatePath("/"); // Aktualisiert die Homepage/Shop-Ansicht
    return { success: true };
  } catch (error: any) {
    console.error("AETHER_CART_REMOVE_ERROR:", error.message);
    return { success: false, error: error.message };
  }
}

