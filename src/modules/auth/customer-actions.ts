'use server'

/**
 * AETHER OS // CORE_SYSTEM_UPLINK // CUSTOMER_PROVISIONING
 * Path: /modules/auth/customer.actions.ts
 */

import { executeSql } from "@/modules/db/actions";
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import VerificationEmail from './templates/VerificationEmail'; 


const resend = new Resend(process.env.RESEND_API_KEY);

export async function registerCustomer(formData: FormData): Promise<void> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('full_name') as string; 
  const orderId = formData.get('orderId') as string;

  // LOGISTIK DATEN (Anschrift für Versand & Rechnung)
  const street = formData.get('street') as string;
  const zip = formData.get('zip') as string;
  const city = formData.get('city') as string;

  // 1. AETHER SECURITY: Passwort & Encryption Token
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  let newCustomerId: string | null = null;

  try {
    // 2. IDENTITY CREATION: Inklusive Anschrift und Verification Token
    const query = `
      INSERT INTO public.customers (
        email, 
        full_name, 
        password_hash, 
        street, 
        zip_code, 
        city, 
        verification_token, 
        tier
      )
      VALUES (
        '${email}', 
        '${name}', 
        '${hash}', 
        '${street}', 
        '${zip}', 
        '${city}', 
        '${verificationCode}', 
        'standard'
      )
      RETURNING id;
    `;

    const res = await executeSql(query);

    if (!res || !res.success || !res.data?.[0]?.id) {
      throw new Error(res?.error || "Unknown Kernel Error during identity initialization");
    }

    newCustomerId = res.data[0].id;
    console.log(`[AETHER_KERNEL]: Identity Created // ${email} // Code: ${verificationCode}`);

    // 3. MAIL UPLINK: Versand via Resend & Dein Template
    if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
            from: 'AETHER OS <system@news24regional.de>', // Deine bestätigte Domain
            to: email,
            subject: `[AETHER_CORE] INITIAL_UPLINK_CODE: ${verificationCode}`,
            react: VerificationEmail({ 
    customerName: name, // Geändert von userName zu customerName
    customerNumber: newCustomerId || "0", 
    verificationCode: verificationCode,
    confirmLink: `https://www.paeffgen-it.de/verify?code=${verificationCode}&email=${email}`
}),
        });
    }

    // 4. NEURAL LINK: Bestehende Bestellung dem neuen Operator zuweisen
    if (orderId && newCustomerId) {
      const linkQuery = `
        UPDATE public.orders 
        SET customer_id = '${newCustomerId}',
            status = 'PROVISIONED',
            updated_at = NOW()
        WHERE id = ${parseInt(orderId)};
      `;
      await executeSql(linkQuery);
    }

  } catch (error: any) {
    console.error("[AETHER_CRITICAL]: Auth Breach / Database Error:", error);
    const errorSuffix = orderId ? `&orderId=${orderId}` : '';
    if (error.message?.includes('unique constraint')) {
      redirect(`/register?error=exists${errorSuffix}`);
    }
    redirect(`/register?error=unknown${errorSuffix}`);
  }

  revalidatePath('/admin');
  
  // Erfolgreicher Uplink -> Weiterleitung zur Code-Eingabe
  const successSuffix = orderId ? `&orderId=${orderId}` : '';
  redirect(`/verify-identity?email=${email}${successSuffix}`);
}

/**
 * AETHER OS // INITIALIZATION_KERNEL
 * Aktiviert den Kunden-Node und provisioniert das Profil sowie Assets.
 */
export async function verifyCustomerCode(email: string, code: string) {
    try {
        // 1. Validierung des Uplink-Codes
        const checkQuery = `SELECT id FROM public.customers WHERE email = '${email}' AND verification_token = '${code}';`;
        const checkRes = await executeSql(checkQuery);

        if (!checkRes.success || !checkRes.data?.[0]) {
            return { error: "INVALID_UPLINK_CODE" };
        }

        const customerId = checkRes.data[0].id; // Unser Integer-Key

        /**
         * TRANSACTIONAL INITIALIZATION
         * Wir nutzen ein kombiniertes SQL-Statement für maximale Konsistenz.
         */
        const initKernelQuery = `
            -- A: Status-Update auf ACTIVE
            UPDATE public.customers 
            SET status = 'ACTIVE', verification_token = NULL 
            WHERE id = ${customerId};

            -- B: Profil-Node Creation
            INSERT INTO public.profiles (customer_id, language_pref, theme_pref)
            VALUES (${customerId}, 'de', 'aether_blue')
            ON CONFLICT (customer_id) DO NOTHING;

            -- C: Asset-Sync (Bestellungen umschreiben)
            UPDATE public.orders 
            SET customer_id = ${customerId}
            WHERE customer_id IS NULL AND status = 'pending';
        `;

        const initRes = await executeSql(initKernelQuery);

        if (initRes.success) {
            console.log(`[AETHER_SYSTEM]: Node ${customerId} fully provisioned and linked.`);
            return { success: true };
        }

        return { error: "PROVISIONING_FAILED" };
    } catch (error) {
        console.error("CRITICAL_KERNEL_ERROR:", error);
        return { error: "SYSTEM_FAILURE" };
    }
}

/**
 * AETHER OS // PROFILE_RESOLVER
 * Lädt die kombinierten Daten aus Customers und Profiles.
 */
export async function getProfileData(id: number) {
    try {
        // Wir nutzen die neue executeSql Bridge für einen sauberen Join
        const query = `
            SELECT 
                c.full_name, 
                c.email, 
                p.avatar_url, 
                p.theme_pref, 
                p.language_pref,
                p.phone_number
            FROM public.customers c
            LEFT JOIN public.profiles p ON c.id = p.customer_id
            WHERE c.id = ${id};
        `;
        
        const res = await executeSql(query);
        
        if (res.success && res.data && res.data.length > 0) {
            return res.data[0];
        }
        return null;
    } catch (error) {
        console.error("CRITICAL_PROFILE_FETCH_ERROR:", error);
        return null;
    }
}

/**
 * AETHER OS // PROFILE_UPDATER
 * Aktualisiert oder erstellt Profil-Metadaten.
 */
export async function updateProfile(id: number, data: { phone?: string, theme?: string }) {
    try {
        const query = `
            INSERT INTO public.profiles (customer_id, phone_number, theme_pref)
            VALUES (${id}, '${data.phone || ''}', '${data.theme || 'aether_blue'}')
            ON CONFLICT (customer_id) 
            DO UPDATE SET 
                phone_number = EXCLUDED.phone_number,
                theme_pref = EXCLUDED.theme_pref,
                last_login = NOW();
        `;
        
        return await executeSql(query);
    } catch (error) {
        return { success: false, error };
    }
}