'use server'
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Produkt zum Warenkorb hinzufügen
export async function addToCart(productId: number, sessionId: string) {
  try {
    const existing = db.prepare("SELECT id, menge FROM cart_items WHERE session_id = ? AND produkt_id = ?")
                       .get(sessionId, productId) as { id: number, menge: number } | undefined;

    if (existing) {
      db.prepare("UPDATE cart_items SET menge = menge + 1 WHERE id = ?").run(existing.id);
    } else {
      db.prepare("INSERT INTO cart_items (session_id, produkt_id, menge) VALUES (?, ?, 1)")
        .run(sessionId, productId);
    }
    revalidatePath('/shop');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Warenkorb abrufen
export async function getCart(sessionId: string) {
  try {
    const items = db.prepare(`
      SELECT c.*, p.name, p.preis, p.bild_url 
      FROM cart_items c 
      JOIN produkte p ON c.produkt_id = p.id 
      WHERE c.session_id = ?
    `).all(sessionId);
    return { success: true, data: items };
  } catch (error: any) {
    return { success: false, data: [] };
  }
}