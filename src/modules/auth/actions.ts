// src/modules/auth/actions.ts
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { loginUser } from "./lib/auth-service";
import {redirect} from "next/navigation";

/**
 * AETHER OS // AUTH ACTIONS - HYBRID GATEKEEPER [2026-05-03]
 * Zentrale Weichenstellung für Admins und Clients.
 */
export async function handleLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. KERNEL-AUTH: Ruft deinen optimierten Auth-Service auf
  const result = await loginUser(email, password);

  // 2. ERROR-HANDLING: Falls die Validierung fehlschlägt
  if (result.error || !result.success) {
    return {
      success: false,
      message: result.error || "ACCESS DENIED: Credentials Invalid"
    };
  }

  // 3. SESSION-MANAGEMENT: Cookies für Sicherheit und Timer setzen
  const cookieStore = await cookies();

  // Session-Start für deinen 5-Minuten-Inaktivitäts-Timer
  cookieStore.set("aether_session_start", Date.now().toString(), {
    path: "/",
    httpOnly: false // Muss für Client-seitiges JS lesbar sein
  });

  // Master-Auth-Token für die Middleware-Sperre
  cookieStore.set("aether_auth_active", "true", {
    path: "/",
    httpOnly: true, // Schutz gegen XSS
    maxAge: 60 * 60 * 2 // 2 Stunden Gültigkeit
  });

  // Cache-Validierung für das gesamte Layout
  revalidatePath("/", "layout");

  // 4. ROUTING-LOGIK: Rückgabe des Zielpfads an das Frontend
  // Wir nutzen hier das 'target' aus dem auth-service (z.B. /admin oder /client)
  return {
    success: true,
    target: result.target,
    type: result.type,      // 'admin', 'client' oder 'dual'
    message: "CONNECTION ESTABLISHED"
  };
}

/**
 * Logout-Logik: Beendet den Cloud-Uplink und löscht alle Session-Daten.
 */
export async function handleLogout() {
  const cookieStore = await cookies();

  // Cookie löschen
  cookieStore.delete('aether_session_start');

  console.log("🔒 [AETHER] Session terminated via handleLogout");

  // Hartes Redirect, um die Client-Session zu beenden
  redirect("/login");
}