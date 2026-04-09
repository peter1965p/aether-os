"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

/* --- AETHER OS: PRODUCT CORE OPERATIONS (CLOUD READY) --- */

export async function getAllProducts() {
  try {
    // Umstellung auf 'products'
    const { data: products, error } = await db
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;
    return { success: true, data: products };
  } catch (error: any) {
    console.error("AETHER_FETCH_ERROR:", error.message);
    return { success: false, error: error.message };
  }
}

export async function saveProductToDB(data: any) {
  try {
    const categoryMap: Record<string, number> = {
      ACCESSOIRES: 1,
      HARDWARE: 2,
      MERCHANDISE: 3,
      SOFTWARE: 4,
    };
    const categoryId = categoryMap[data.category?.toUpperCase()] || 1;

    // Wir speichern nur die Zahl, das "€" kommt übers Frontend/Formatierung
    const rawPrice = data.price.toString().replace("€", "").replace(",", ".").trim();

    const { error } = await db.from("products").insert([
      {
        name: data.name,
        price: parseFloat(rawPrice) || 0, // Umstellung auf 'price' (number)
        description: data.description || "",
        image_url: data.images[0] || "", // Umstellung auf 'image_url'
        stock: parseInt(data.stock) || 0, // Umstellung auf 'stock'
        category_id: categoryId,
        image_url_2: data.images[1] || "",
        image_url_3: data.images[2] || "",
      },
    ]);

    if (error) throw error;

    revalidatePath("/admin/shop");
    revalidatePath("/shop");
    return { success: true };
  } catch (e: any) {
    console.error("AETHER_SAVE_ERROR:", e.message);
    return { success: false, error: e.message };
  }
}

export async function updateProductInDB(id: string | number, data: any) {
  try {
    const categoryMap: Record<string, number> = {
      ACCESSOIRES: 1,
      HARDWARE: 2,
      MERCHANDISE: 3,
      SOFTWARE: 4,
    };
    const categoryId = categoryMap[data.category?.toUpperCase()] || 1;
    const rawPrice = data.price.toString().replace("€", "").replace(",", ".").trim();

    const { error } = await db
      .from("products")
      .update({
        name: data.name,
        price: parseFloat(rawPrice) || 0,
        description: data.description || "",
        image_url: data.images[0] || "",
        stock: parseInt(data.stock) || 0,
        category_id: categoryId,
        image_url_2: data.images[1] || "",
        image_url_3: data.images[2] || "",
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/shop");
    revalidatePath("/shop");
    return { success: true };
  } catch (error: any) {
    console.error("AETHER_UPDATE_ERROR:", error.message);
    return { success: false, error: error.message };
  }
}

export async function deleteProductFromDB(id: string | number) {
  try {
    const { error } = await db.from("products").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/shop");
    revalidatePath("/shop");
    return { success: true };
  } catch (e: any) {
    console.error("AETHER_DELETE_ERROR:", e.message);
    return { success: false };
  }
}

/* --- AETHER OS: CART & TRANSACTION OPERATIONS --- */

export async function addToCartAction(productId: number) {
  const tempSession = "SESSION_01";
  try {
    const { data: existing } = await db
      .from("cart_items")
      .select("id, quantity")
      .eq("session_id", tempSession)
      .eq("product_id", productId)
      .maybeSingle();

    if (existing) {
      await db
        .from("cart_items")
        .update({ quantity: existing.quantity + 1 })
        .eq("id", existing.id);
    } else {
      await db
        .from("cart_items")
        .insert([{ session_id: tempSession, product_id: productId, quantity: 1 }]);
    }

    revalidatePath("/shop");
    return { success: true };
  } catch (error: any) {
    console.error("AETHER_CART_ADD_ERROR:", error.message);
    return { success: false };
  }
}

export async function removeFromCartAction(cartItemId: number) {
  try {
    const { error } = await db.from("cart_items").delete().eq("id", cartItemId);
    if (error) throw error;
    revalidatePath("/shop");
    return { success: true };
  } catch (error: any) {
    console.error("AETHER_CART_REMOVE_ERROR:", error.message);
    return { success: false };
  }
}

export async function finalizeTransactionAction() {
  const session_id = "SESSION_01";

  try {
    const { data: cartItems, error: cartError } = await db
      .from("cart_items")
      .select(`
        id, quantity, product_id,
        products (id, price, stock, name)
      `)
      .eq("session_id", session_id);

    if (cartError || !cartItems || cartItems.length === 0)
      throw new Error("Warenkorb ist leer.");

    // FIX FÜR DEN "acc" TYPE ERROR:
    const total_price = cartItems.reduce((acc: number, item: any) => {
      const price = typeof item.products.price === 'string' 
        ? parseFloat(item.products.price.replace("€", "").replace(",", ".")) 
        : item.products.price;
      return acc + (price * item.quantity);
    }, 0);

    const { data: order, error: orderError } = await db
      .from("orders")
      .insert([
        {
          created_at: new Date().toISOString(),
          type: "ONLINE",
          status: "COMPLETED",
          total_price: total_price,
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // Bestands-Update und Order Items
    for (const item of cartItems as any[]) {
      const currentStock = item.products.stock || 0;
      if (currentStock < item.quantity) {
        throw new Error(`Bestand zu niedrig für: ${item.products.name}`);
      }

      await db.from("order_items").insert([
        {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: item.products.price,
        },
      ]);

      await db
        .from("products")
        .update({ stock: currentStock - item.quantity })
        .eq("id", item.product_id);
    }

    await db.from("cart_items").delete().eq("session_id", session_id);

    revalidatePath("/shop");
    revalidatePath("/admin");
    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("AETHER_TRANSACTION_ERROR:", error.message);
    return { success: false, error: error.message };
  }
}