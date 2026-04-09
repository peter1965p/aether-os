'use server'
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

/**
 * POS CORE: Verarbeitet Transaktionen, Lagerbestand und Kunden-Uplink
 *
 */
export async function processPosTransaction(
  cartItems: any[], 
  total: number, 
  customerId?: number, 
  paymentMethod: string = 'POS'
) {
  try {
    const transaction = db.transaction(() => {
      // 1. Validierung: Ist der Warenkorb leer?
      if (!cartItems || cartItems.length === 0) {
        throw new Error("Warenkorb ist leer.");
      }

      // 2. Hauptbestellung in 'orders' anlegen
      const order = db.prepare(`
        INSERT INTO orders (typ, gesamtpreis, status, datum, customer_id) 
        VALUES (?, ?, 'COMPLETED', CURRENT_TIMESTAMP, ?)
      `).run(paymentMethod, total, customerId || null);

      const orderId = order.lastInsertRowid;

      // 3. Einzelposten & Lagerbestand verarbeiten
      const insertItem = db.prepare(`
        INSERT INTO order_items (order_id, produkt_id, menge, einzelpreis) 
        VALUES (?, ?, ?, ?)
      `);
      
      const updateStock = db.prepare(`
        UPDATE produkte 
        SET lagerbestand = lagerbestand - ? 
        WHERE id = ?
      `);

      for (const item of cartItems) {
        // Posten speichern
        insertItem.run(orderId, item.id, item.qty || 1, item.preis);
        
        // Lager abziehen
        updateStock.run(item.qty || 1, item.id);
      }

      // 4. Kunden-Umsatz & Treue-Daten aktualisieren
      if (customerId) {
        db.prepare(`
          UPDATE customers 
          SET umsatz_total = umsatz_total + ?, 
              last_visit = CURRENT_TIMESTAMP 
          WHERE id = ?
        `).run(total, customerId);
      }
      
      return orderId;
    });

    const finalOrderId = transaction();

    // Revalidierung der betroffenen UI-Bereiche
    revalidatePath('/admin/pos');
    revalidatePath('/admin/customers');
    revalidatePath('/admin/inventory');
    revalidatePath('/admin/analytics');

    return { success: true, orderId: finalOrderId };
  } catch (error: any) {
    console.error("CRITICAL_POS_ERROR:", error);
    return { success: false, error: error.message };
  }
}

/**
 * WARENWIRTSCHAFT: Inventar-Abfragen & Alerts
 */
export async function getLowStockAlerts() {
  try {
    return db.prepare(`
      SELECT name, lagerbestand, min_bestand 
      FROM produkte 
      WHERE lagerbestand <= min_bestand
    `).all();
  } catch (error) {
    console.error("Stock Alert Error:", error);
    return [];
  }
}

export async function getPosProducts() {
  try {
    return db.prepare(`
      SELECT id, name, preis, beschreibung, lagerbestand, min_bestand 
      FROM produkte
    `).all();
  } catch (error) {
    console.error("Product Fetch Error:", error);
    return [];
  }
}

/**
 * IDENTITY KERNEL: Kundensuche & Registrierung
 */
export async function getCustomerForPos(query: string) {
  try {
    const customer = db.prepare(`
      SELECT id, full_name, tier, email, kundenkarte_id 
      FROM customers 
      WHERE kundenkarte_id = ? OR full_name LIKE ? OR email LIKE ?
      LIMIT 1
    `).get(query, `%${query}%`, `%${query}%`);
    
    return { success: true, data: customer };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function registerCustomer(formData: FormData) {
  const fullName = formData.get('full_name') as string;
  const email = formData.get('email') as string;
  const tier = (formData.get('tier') as string) || 'Standard';

  // Aether-ID generieren
  const kundenkarteId = `AE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  try {
    db.prepare(`
      INSERT INTO customers (
        full_name, email, tier, password_hash, kundenkarte_id, created_at, umsatz_total
      ) 
      VALUES (?, ?, ?, 'EXTERNAL_POS_USER', ?, CURRENT_TIMESTAMP, 0)
    `).run(fullName, email, tier, kundenkarteId);

    revalidatePath('/admin/customers');
    return { success: true };
  } catch (error: any) {
    console.error("Identity Registration Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getAllCustomers() {
  try {
    return db.prepare(`
      SELECT id, full_name, email, tier, created_at, kundenkarte_id, umsatz_total 
      FROM customers 
      ORDER BY created_at DESC
    `).all();
  } catch (error) {
    return [];
  }
}

export async function getCustomerOrders(customerId: number) {
  try {
    return db.prepare(`
      SELECT id, gesamtpreis, datum, status, typ 
      FROM orders 
      WHERE customer_id = ? 
      ORDER BY datum DESC 
      LIMIT 10
    `).all(customerId);
  } catch (error) {
    return [];
  }
}

/**
 * FINANCIALS: Buchhaltung & Rabatt-Logik
 */
export async function calculateDiscountedPrice(cardId: string, basePrice: number) {
  try {
    const customer = db.prepare(`
      SELECT tier FROM customers WHERE kundenkarte_id = ?
    `).get(cardId) as { tier: string } | undefined;

    if (!customer) return { finalPrice: basePrice, discountPercent: 0 };

    const discounts: Record<string, number> = {
      'Standard': 0.05,   // 5%
      'Premium': 0.15,    // 15%
      'Enterprise': 0.25  // 25%
    };

    const factor = discounts[customer.tier] || 0;
    return {
      finalPrice: basePrice * (1 - factor),
      discountPercent: factor * 100,
      tier: customer.tier
    };
  } catch (error) {
    return { finalPrice: basePrice, discountPercent: 0 };
  }
}

export async function getAccountingStats() {
  try {
    const stats = db.prepare(`
      SELECT 
        SUM(gesamtpreis) as total_brutto, 
        COUNT(id) as count 
      FROM orders
    `).get() as { total_brutto: number, count: number };

    const brutto = stats.total_brutto || 0;
    const mwst = brutto - (brutto / 1.19); // Standard-Satz 19%

    return {
      brutto,
      netto: brutto - mwst,
      mwst,
      count: stats.count || 0
    };
  } catch (error) {
    return { brutto: 0, netto: 0, mwst: 0, count: 0 };
  }
}