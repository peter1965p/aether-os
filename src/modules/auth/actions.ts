'use server'

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loginUser } from "./lib/auth-service";
import {createClient} from "@/lib/db";

export async function handleLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await loginUser(email, password);

  if (result.success && result.user) {
    const cookieStore = await cookies();

    // Auth-Flags setzen (HttpOnly für Security)
    cookieStore.set("aether_auth_active", "true", { httpOnly: true, secure: true });
    cookieStore.set("aether_user_name", result.user.name, { httpOnly: true });
    cookieStore.set("aether_session_start", Date.now().toString());

    // Cache leeren, damit die Middleware sofort greift
    revalidatePath("/", "layout");

    return { success: true, target: result.target };
  }

  return { success: false, message: result.error || "ACCESS DENIED" };
}

export async function handleLogout() {
  const cookieStore = await cookies();

  // Alle relevanten Cookies killen
  cookieStore.delete("aether_auth_active");
  cookieStore.delete("aether_user_name");
  cookieStore.delete("aether_session_start");

  revalidatePath("/", "layout");
  redirect("/login");
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