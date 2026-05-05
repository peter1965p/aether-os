// src/modules/auth/actions.ts
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { loginUser } from "./lib/auth-service";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/db";
import { VerificationEmail } from './templates/VerificationEmail';
import {Resend} from "resend";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function handleLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await loginUser(email, password);

  if (result.error || !result.success) {
    return {
      success: false,
      message: result.error || "ACCESS DENIED: Credentials Invalid"
    };
  }

  const cookieStore = await cookies();

  // --- NEU: USER-DATEN AUS DB IN COOKIES SPEICHERN ---
  // Wir speichern den Namen und die E-Mail, damit die NavBar sie auslesen kann
  cookieStore.set("aether_user_name", result.user?.name || "Unknown User", { path: "/" });
  cookieStore.set("aether_user_email", email, { path: "/" });

  cookieStore.set("aether_session_start", Date.now().toString(), {
    path: "/",
    httpOnly: false
  });

  cookieStore.set("aether_auth_active", "true", {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 2
  });

  revalidatePath("/", "layout");

  return {
    success: true,
    target: result.target,
    type: result.type,
    message: "CONNECTION ESTABLISHED"
  };
}

export async function handleLogout() {
  const cookieStore = await cookies();

  // Alle Cookies löschen
  cookieStore.delete('aether_session_start');
  cookieStore.delete('aether_auth_active');
  cookieStore.delete('aether_user_name');
  cookieStore.delete('aether_user_email');

  redirect("/login");
}

export async function resendVerificationEmail(email: string) {
  const supabase = await createClient();

  // Supabase Auth bietet eine direkte Methode zum erneuten Senden
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
    },
  });

  if (error) {
    console.error("RESEND_ERROR:", error.message);
    return { success: false, message: error.message };
  }

  return { success: true };
}