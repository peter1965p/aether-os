// src/modules/auth/lib/auth-service.ts
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function loginUser(email: string, password_input: string) {
  console.log("🚀 AETHER SYSTEM LOGIN ATTEMPT:", email);

  try {
    // 1. Supabase Auth Challenge (Der Schlüssel zum System)
    const { data, error } = await db.auth.signInWithPassword({
      email: email,
      password: password_input,
    });

    if (error) {
      console.error("❌ AUTH FAILURE:", error.message);
      return { error: 'Zugriff verweigert: Identifikationsschlüssel ungültig.' };
    }

    if (data.user) {
      const userId = data.user.id;
      console.log("🔓 AUTHENTICATED // UID:", userId);

      // 2. INTELLIGENTE ROLLENERKENNUNG
      // Wir starten zwei parallele Abfragen für maximale Geschwindigkeit
      const [adminProfile, clientProfile] = await Promise.all([
        db.from('users').select('role').eq('id', userId).single(),
        db.from('customers').select('id').eq('email', email).single()
      ]);

      const isAdmin = adminProfile.data?.role === 'admin';
      const isClient = !!clientProfile.data;

      console.log(`📊 PERMISSIONS // ADMIN: ${isAdmin}, CLIENT: ${isClient}`);

      // 3. REDIRECT-STRATEGIE (Die "AI" Logik)
      let targetPath = '/';
      let userType: 'admin' | 'client' | 'dual' = 'client';

      if (isAdmin && isClient) {
        // Fall: Darf beides. Wir leiten standardmäßig zum Admin-Terminal,
        // geben dem Frontend aber bescheid, dass es ein Dual-User ist.
        targetPath = '/admin';
        userType = 'dual';
      } else if (isAdmin) {
        targetPath = '/admin';
        userType = 'admin';
      } else if (isClient) {
        targetPath = '/client';
        userType = 'client';
      } else {
        // Fallback für registrierte User ohne Rollenzuweisung
        return { error: 'System-Fehler: Keine gültige Terminal-Berechtigung gefunden.' };
      }

      // Session-Start Zeit für deinen Inaktivitäts-Timer setzen
      (await cookies()).set('aether_session_start', Date.now().toString());

      return {
        success: true,
        type: userType,
        target: targetPath,
        userId: userId
      };
    }

    return { error: 'Unbekannter Systemfehler im Auth-Kernel.' };
  } catch (err: any) {
    console.error("☢️ KERNEL CRITICAL ERROR:", err);
    return { error: 'Systemfehler: Verbindung zum Cloud-Uplink unterbrochen.' };
  }
}

/**
 * Logout-Logik für den Cloud-Uplink
 */
export async function logoutUser() {
  const { error } = await db.auth.signOut();
  if (error) console.error("Logout Error:", error.message);

  // Löschen des Session-Timers
  const cookieStore = await cookies();
  cookieStore.delete('aether_session_start');
}

/**
 * AETHER OS // IDENTITY RESOLVER
 * Ermittelt die interne Customer-ID des aktuell angemeldeten Benutzers.
 */
export async function getActiveClientId() {
  const { data: { user } } = await db.auth.getUser();

  if (!user) return null;

  // Wir suchen in der customers Tabelle nach der E-Mail des Auth-Users
  const { data, error } = await db
      .from('customers')
      .select('id')
      .eq('email', user.email)
      .single();

  if (error || !data) {
    console.error("IDENTITY_SYNC_ERROR: No customer record found for auth user.");
    return null;
  }

  return data.id; // Gibt die Integer-ID zurück
}