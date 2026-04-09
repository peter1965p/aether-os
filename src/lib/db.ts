import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let supabaseInstance: any = null;

export const createClient = () => {
  // SERVER-CHECK
  if (typeof window === 'undefined') {
    // Auf dem Server erstellen wir einen frischen Client.
    // Next.js 15 leitet die Cookies im Header automatisch weiter, 
    // wenn createClient() innerhalb einer Server Component (wie layout.tsx)
    // gerufen wird, die "cookies()" importiert hat.
    return createSupabaseClient(supabaseUrl, supabaseAnonKey);
  }

  // CLIENT-CHECK (Browser)
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  
  return supabaseInstance;
}

export const db = createClient();
export default db;