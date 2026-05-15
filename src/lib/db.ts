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

export async function executeSql(query: string) {
  const supabase = createClient();
  
  // Wir nutzen PostgREST's rpc call, um SQL auszuführen.
  // WICHTIG: Du musst in Supabase eine Function namens 'execute_sql' haben,
  // damit das hier funktioniert!
  const { data, error } = await supabase.rpc('execute_sql', { query_text: query });

  if (error) {
    console.error("KERNEL_SQL_EXCEPTION:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export const db = createClient();
export default db;