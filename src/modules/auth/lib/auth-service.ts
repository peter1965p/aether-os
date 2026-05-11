/**
 * AETHER OS // AUTH-SERVICE LOGIC
 * Pfad: src/modules/auth/lib/auth-service.ts
 */
import { createClient } from "@/lib/db";

export async function loginUser(email: string, password_input: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: password_input,
  });

  if (error || !data.user) {
    return { success: false, error: error?.message };
  }

  // 1. Hybride Rollen-Abfrage: Wer ist dieser User?
  const [adminRes, customerRes] = await Promise.all([
    supabase.from('users').select('role, username').eq('id', data.user.id).maybeSingle(),
    supabase.from('customers').select('id, full_name').eq('email', email).maybeSingle()
  ]);

  const displayName = adminRes.data?.username || customerRes.data?.full_name || email.split('@')[0];

  // 2. Weichenstellung vorbereiten
  let userType: 'admin' | 'client' | 'dual' = 'client';
  let targetPath = '/client'; // Default Fallback

  // 3. DIE LOGIK-WEICHE (Korrigiert auf deine reale Struktur)
  if (adminRes.data && customerRes.data) {
    userType = 'dual';
    // WICHTIG: Kein "/auth/", da (auth) eine Route-Group ist!
    targetPath = '/select';
  } else if (adminRes.data) {
    userType = 'admin';
    targetPath = '/admin';
  } else if (customerRes.data) {
    userType = 'client';
    targetPath = '/client';
  }

  return {
    success: true,
    type: userType,
    target: targetPath,
    user: {
      name: displayName,
      email,
      isAdmin: !!adminRes.data,
      isCustomer: !!customerRes.data
    }
  };
}

/**
 * IDENTITY_RESOLVER
 */
export async function getActiveClientId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
      .from('customers')
      .select('id')
      .eq('email', user.email)
      .maybeSingle();

  return data?.id || null;
}