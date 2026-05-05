/**
 * AETHER OS // CORE AUTH SERVICE
 * Fokus: Hybride Identität (Admin-Staff & Customer-Base)
 */
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function loginUser(email: string, password_input: string) {
  console.log("🚀 AETHER SYSTEM LOGIN ATTEMPT:", email);

  try {
    // 1. Supabase Auth Challenge
    const { data, error } = await db.auth.signInWithPassword({
      email: email,
      password: password_input,
    });

    if (error || !data.user) {
      console.error("❌ AUTH FAILURE:", error?.message);
      return { success: false, error: 'Identifikationsschlüssel ungültig.' };
    }

    const userId = data.user.id;
    const userEmail = data.user.email!;

    // 2. HYBRIDE ROLLENERKENNUNG (Zwei-Tabellen-Check)
    // Wir fragen parallel die 'users' (Admins) und 'customers' (Kunden) ab
    const [adminRes, customerRes] = await Promise.all([
      db.from('users').select('role, username').eq('id', userId).maybeSingle(),
      db.from('customers').select('id, full_name').eq('email', userEmail).maybeSingle()
    ]);

    const adminData = adminRes.data;
    const customerData = customerRes.data;

    // 3. LOGIK-GATEKEEPER
    let targetPath = '/';
    let userType: 'admin' | 'client' | 'dual' = 'client';
    let displayName = adminData?.username || customerData?.full_name || userEmail.split('@')[0];

    const isAdmin = adminData?.role === 'admin' || adminData?.role === 'user'; // 'user' ist laut Schema Default
    const isCustomer = !!customerData;

    if (isAdmin && isCustomer) {
      userType = 'dual';
      targetPath = '/admin'; // Standard für Hybrid-User ist das Admin-Terminal
    } else if (isAdmin) {
      userType = 'admin';
      targetPath = '/admin';
    } else if (isCustomer) {
      userType = 'client';
      targetPath = '/client';
    } else {
      // --- NOTFALL-LOGIN FÜR DICH ---
      // Wenn der User in Supabase existiert, aber (noch) in keiner Tabelle steht,
      // lassen wir ihn als Admin rein, damit er das System konfigurieren kann.
      console.warn("⚠️ IDENTITY SYNC MISSING: Defaulting to Emergency Admin");
      userType = 'admin';
      targetPath = '/admin';
    }

    // 4. SESSION-COOKIES FÜR FRONTEND-TIMER & NAVBAR
    const cookieStore = await cookies();
    cookieStore.set('aether_session_start', Date.now().toString(), { path: '/' });
    cookieStore.set('aether_user_name', displayName, { path: '/' });

    console.log(`✅ ACCESS GRANTED // ROLE: ${userType} // NAME: ${displayName}`);

    return {
      success: true,
      type: userType,
      target: targetPath,
      userId: userId,
      user: {
        name: displayName,
        email: userEmail
      }
    };

  } catch (err: any) {
    console.error("☢️ KERNEL CRITICAL ERROR:", err);
    return { success: false, error: 'Systemfehler: Verbindung zum Cloud-Uplink unterbrochen.' };
  }
}

/**
 * IDENTITY RESOLVER
 * Hilft dem System zu wissen, welche Kunden-ID zu welcher Session gehört.
 */
export async function getActiveClientId() {
  const { data: { user } } = await db.auth.getUser();
  if (!user) return null;

  const { data } = await db
      .from('customers')
      .select('id')
      .eq('email', user.email)
      .maybeSingle();

  return data?.id || null;
}