/**
 * AETHER OS // CART ACTIONS
 * Migration: SQLite -> Supabase PostgreSQL
 * Fokus: Warenkorb-Logik mit dem neuen Schema
 */

'use server'
import { createClient } from '@/lib/db';
import { revalidatePath } from 'next/cache';

/**
 * Fügt ein Produkt zum Warenkorb hinzu oder erhöht die Menge.
 * @param productId - Die ID des Produkts aus der Tabelle 'products'
 * @param sessionId - Die eindeutige Session- oder User-ID
 */
export async function addToCart(productId: number, sessionId: string) {
  const supabase = await createClient();

  try {
    // 1. Prüfen, ob das Produkt bereits im Warenkorb dieser Session liegt
    const { data: existing, error: fetchError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('session_id', sessionId)
        .eq('product_id', productId)
        .maybeSingle();

    if (fetchError) return { success: false, error: fetchError.message };

    if (existing) {
      // 2. Falls vorhanden: Menge inkrementieren (quantity statt menge)
      const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: (existing.quantity || 0) + 1 })
          .eq('id', existing.id);

      if (updateError) return { success: false, error: updateError.message };
    } else {
      // 3. Falls neu: Datensatz anlegen (product_id statt produkt_id)
      const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            session_id: sessionId,
            product_id: productId,
            quantity: 1
          });

      if (insertError) return { success: false, error: insertError.message };
    }

    revalidatePath('/shop');
    return { success: true };
  } catch (error: any) {
    console.error("AETHER_CART_ERROR:", error.message);
    return { success: false, error: "Interner Fehler im Warenkorb-Kernel." };
  }
}

/**
 * Ruft alle Artikel im Warenkorb inklusive Produktdetails ab.
 * Nutzt PostgreSQL Joins über Supabase Selects.
 */
export async function getCart(sessionId: string) {
  const supabase = await createClient();

  try {
    const { data: items, error } = await supabase
        .from('cart_items')
        .select(`
        id,
        quantity,
        product_id,
        products (
          name,
          price,
          image_url
        )
      `)
        .eq('session_id', sessionId);

    if (error) throw error;

    return { success: true, data: items || [] };
  } catch (error: any) {
    console.error("AETHER_CART_FETCH_ERROR:", error.message);
    return { success: false, data: [] };
  }
}