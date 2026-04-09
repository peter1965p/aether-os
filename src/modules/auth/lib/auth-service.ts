// src/modules/auth/lib/auth-service.ts
import { db } from '@/lib/db'; // Dein neuer Supabase Client
import { cookies } from 'next/headers';

export async function loginUser(email: string, password_input: string) {
  console.log("🚀 AETHER AUTH ATTEMPT:", email);

  try {
    // 1. Supabase Auth Challenge
    const { data, error } = await db.auth.signInWithPassword({
      email: email,
      password: password_input,
    });

    if (error) {
      console.error("❌ AUTH FAILURE:", error.message);
      return { error: 'Zugriff verweigert: ' + error.message };
    }

    if (data.user) {
      console.log("🔓 ACCESS GRANTED: SESSION ESTABLISHED");

      // 2. Rollen-Check (optional, falls du Admin-Bereiche schützen willst)
      // Wir schauen kurz in unsere public.users Tabelle nach der Rolle
      const { data: profile } = await db
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      const userRole = profile?.role || 'user';

      // Supabase setzt die Session-Cookies im Browser automatisch, 
      // wenn der Client (db) richtig konfiguriert ist. 
      // Wir geben den Typ für deinen Redirect zurück.
      return { 
        success: true, 
        type: userRole === 'admin' ? 'admin' : 'user',
        userId: data.user.id 
      };
    }

    return { error: 'Unbekannter Systemfehler im Auth-Kernel.' };
  } catch (err: any) {
    console.error("☢️ KERNEL CRITICAL ERROR:", err);
    return { error: 'Systemfehler: Verbindung zur Cloud unterbrochen.' };
  }
}

/**
 * Logout-Logik für den Cloud-Uplink
 */
export async function logoutUser() {
  const { error } = await db.auth.signOut();
  if (error) console.error("Logout Error:", error.message);
  
  // Wir löschen zusätzlich deinen manuellen Timer-Cookie
  (await cookies()).delete('aether_session_start');
}