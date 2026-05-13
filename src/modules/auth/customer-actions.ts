'use server'

/**
 * AETHER OS // CORE_SYSTEM_UPLINK
 * Path: /modules/auth/customer.actions.ts
 */

import { executeSql } from "@/modules/db/actions";
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function registerCustomer(formData: FormData): Promise<void> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const orderId = formData.get('orderId') as string; // Die Brücke von der Success-Page

  // 1. AETHER SECURITY: Passwort hashen
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);

  let newCustomerId: string | null = null;

  try {
    // 2. IDENTITY CREATION: Neuen Operator in DB anlegen
    const query = `
      INSERT INTO public.customers (email, full_name, password_hash)
      VALUES ('${email}', '${name}', '${hash}')
        RETURNING id;
    `;

    const res = await executeSql(query);

    if (!res || !res.success || !res.data?.[0]?.id) {
      throw new Error(res?.error || "Unknown Kernel Error during identity initialization");
    }

    newCustomerId = res.data[0].id;
    console.log(`[AETHER_KERNEL]: Identity Created // ${email} // ID: ${newCustomerId}`);

    // 3. NEURAL LINK: Bestehende Bestellung dem neuen Operator zuweisen
    if (orderId && newCustomerId) {
      const linkQuery = `
        UPDATE public.orders 
        SET customer_id = '${newCustomerId}',
            status = 'PROVISIONED',
            updated_at = NOW()
        WHERE id = ${parseInt(orderId)};
      `;

      const linkRes = await executeSql(linkQuery);

      if (linkRes.success) {
        console.log(`[AETHER_KERNEL]: Order #${orderId} successfully linked to Node ${newCustomerId}`);
      }
    }

  } catch (error: any) {
    console.error("[AETHER_CRITICAL]: Auth Breach / Database Error:", error);

    // Fehler-Handling: OrderID in der URL behalten
    const errorSuffix = orderId ? `&orderId=${orderId}` : '';

    if (error.message?.includes('unique constraint') || error.message?.includes('exists')) {
      redirect(`/register?error=exists${errorSuffix}`);
    }
    redirect(`/register?error=unknown${errorSuffix}`);
  }

  // Admin-Dashboard revalidieren, damit der neue User sofort erscheint
  revalidatePath('/admin');

  // Erfolgreicher Uplink -> Weiterleitung zum Login
  const successSuffix = orderId ? `&orderId=${orderId}` : '';
  redirect(`/login?status=registered${successSuffix}`);
}