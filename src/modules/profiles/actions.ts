/**
 * AETHER OS // PROFILES // ACTIONS
 * Pfad: src/modules/profiles/actions.ts
 */

'use server';

import { createClient } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateCustomerAddress(customerId: string, formData: {
    address_street: string;
    address_city: string;
    address_zip: string;
}) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('customers')
        .update({
            address_street: formData.address_street,
            address_city: formData.address_city,
            address_zip: formData.address_zip,
        })
        .eq('customer_number', customerId);

    if (error) {
        console.error("DB_UPDATE_ERROR:", error.message);
        return { success: false, message: error.message };
    }

    // Aktualisiert den Cache für die Profilseite
    revalidatePath(`/profiles/${customerId}`);
    return { success: true };
}