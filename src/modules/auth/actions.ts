'use server'

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loginUser } from "./lib/auth-service";
import {createClient} from "@/lib/db";
import { executeSql } from "@/lib/db"; // Oder dort, wo du deine Raw-SQL Utility geparkt hast

export async function handleLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await loginUser(email, password);

  if (result.success && result.user) {
    const cookieStore = await cookies();

    // Standard Auth-Flags
    cookieStore.set("aether_auth_active", "true", { httpOnly: true, secure: true });
    cookieStore.set("aether_user_name", result.user.name, { httpOnly: true });
    cookieStore.set("aether_session_start", Date.now().toString());

    /** * NEW: CUSTOMER_NODE_UPLINK
     * Wenn der Login-Service eine customerId liefert (für den Client-Bereich),
     * speichern wir diese als Identifikator für das Dashboard.
     */
    if (result.user.customerId) {
      cookieStore.set("aether_customer_id", result.user.customerId.toString(), { 
        httpOnly: true, 
        secure: true 
      });
    }

    revalidatePath("/", "layout");
    return { success: true, target: result.target };
  }

  return { success: false, message: result.error || "ACCESS DENIED" };
}

export async function handleLogout() {
  const cookieStore = await cookies();

  cookieStore.delete("aether_auth_active");
  cookieStore.delete("aether_user_name");
  cookieStore.delete("aether_session_start");
  cookieStore.delete("aether_customer_id"); // Kills the customer link

  revalidatePath("/", "layout");
  redirect("/");
}

export async function resendVerificationEmail(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}

/**
 * AETHER OS // PROFILE_RESOLVER
 * Pfad: src/modules/auth/customer-actions.ts
 */
export async function getProfileData(id: number) {
    try {
        // Wir joinen das Profil direkt mit den Stammdaten des Kunden
        const query = `
            SELECT 
                c.full_name, 
                c.email, 
                p.avatar_url, 
                p.theme_pref, 
                p.language_pref,
                p.phone_number
            FROM public.customers c
            LEFT JOIN public.profiles p ON c.id = p.customer_id
            WHERE c.id = ${id};
        `;
        
        const res = await executeSql(query);
        return res.data?.[0] || null;
    } catch (error) {
        console.error("PROFILE_FETCH_FAILED:", error);
        return null;
    }
}