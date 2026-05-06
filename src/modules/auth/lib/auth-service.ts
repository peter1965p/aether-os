/**
 * AETHER OS // AUTH-SERVICE LOGIC
 * Pfad: src/modules/auth/lib/auth-service.ts
 */
import { createClient } from "@/lib/db"; // Nutze den Server-Client für RSC

/**
 * LOGIN_LOGIC
 * Kern-Validierung für den System-Zugang
 */
export async function loginUser(email: string, password_input: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: password_input,
  });

  if (error || !data.user) {
    return { success: false, error: error?.message };
  }

  // Hybride Rollen-Abfrage
  const [adminRes, customerRes] = await Promise.all([
    supabase.from('users').select('role, username').eq('id', data.user.id).maybeSingle(),
    supabase.from('customers').select('id, full_name').eq('email', email).maybeSingle()
  ]);

  const displayName = adminRes.data?.username || customerRes.data?.full_name || email.split('@')[0];

  let userType: 'admin' | 'client' | 'dual' = 'client';
  let targetPath = '/';

  if (adminRes.data && customerRes.data) {
    userType = 'dual';
    targetPath = '/admin';
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
    user: { name: displayName, email }
  };
}

/**
 * IDENTITY_RESOLVER
 * Fix für den Build-Fehler: Stellt die Kunden-ID für Orders bereit
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