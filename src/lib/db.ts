import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let supabaseInstance: any = null;

export const createClient = () => {
  // SERVER-CHECK
  if (typeof window === 'undefined') {
    // Auf dem Server erstellen wir IMMER einen frischen Client pro Request.
    // Das verhindert Race Conditions und sorgt dafür, dass Next.js Header/Cookies korrekt mitschreibt.
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
  
  const { data, error } = await supabase.rpc('execute_sql', { query_text: query });

  if (error) {
    console.error("KERNEL_SQL_EXCEPTION:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

// Das ultimative, universelle Proxy-Objekt. 
// Es leitet JEDEN Aufruf (wie .from, .rpc, .auth, .channel) dynamisch 
// an die aktuelle Client-Instanz weiter. Volle Abwärtskompatibilität!
export const db = new Proxy({} as any, {
  get: (target, prop) => {
    const client = createClient();
    const value = client[prop];
    
    // Wenn die Eigenschaft eine Funktion ist (z.B. .from() oder .channel()), 
    // binden wir sie an den Client, damit der Kontext nicht verloren geht.
    if (typeof value === 'function') {
      return value.bind(client);
    }
    
    return value;
  }
});

export default db;