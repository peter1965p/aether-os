'use server'

import { createClient } from '@/lib/db'; // Dein Supabase-Server-Client

/**
 * Holt die neuesten Aktivitäten/Bestellungen für den eingeloggten User.
 * @param userId Die ID des aktuell authentifizierten Users.
 */
export async function getRecentActivities(userId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('orders') // Oder 'activities', je nach DB-Struktur
        .select('*')
        .eq('user_id', userId) // Wichtig: Filter auf den User!
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("AETHER // DB_FETCH_ERROR:", error.message);
        return [];
    }

    return data;
}