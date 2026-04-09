// src/modules/auth/actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loginUser } from "./lib/auth-service";

/**
 * AETHER OS // AUTH ACTIONS - STABLE [2026-04-08]
 * Optimiert für Next.js 15 & CachyOS Performance
 */

export async function handleLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await loginUser(email, password);

  if (result.error) {
    redirect(`/login?error=${encodeURIComponent(result.error)}`);
  }

  const cookieStore = await cookies();

  // DEIN TIMER-COOKIE
  cookieStore.set("aether_session_start", Date.now().toString(), {
    path: "/",
    httpOnly: false,
  });

  // WICHTIG: Ein "Türsteher-Cookie" für die Middleware
  // Wenn deine Middleware diesen Cookie sieht, lässt sie dich durch.
  cookieStore.set("aether_admin_auth", "true", {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 2, // 2 Stunden
  });

  revalidatePath("/admin"); 
  
  if (result.type === "admin") {
    redirect("/admin");
  } else {
    redirect("/shop/profile");
  }
}

export async function handleLogout() {
  const cookieStore = await cookies();
  
  // Alle relevanten Cookies entfernen
  cookieStore.delete("aether_session_start");
  cookieStore.delete("aether_auth_active");
  
  revalidatePath("/", "layout");
  redirect("/login?status=logged_out");
}