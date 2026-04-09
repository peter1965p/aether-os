'use server'

import { executeSql } from "@/modules/db/actions";
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function registerCustomer(formData: FormData): Promise<void> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  // Passwort hashen
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);

  try {
    // SQL-Query ohne Cite-Tags
    const query = `
      INSERT INTO public.customers (email, full_name, password_hash) 
      VALUES ('${email}', '${name}', '${hash}')
      RETURNING id;
    `;

    const res = await executeSql(query);

    if (!res || !res.success) {
      throw new Error(res?.error || "Unknown Kernel Error");
    }
    
    console.log("AETHER Identity Created: " + email);
  } catch (error: any) {
    console.error("Auth Breach / Database Error:", error);
    
    if (error.message?.includes('unique constraint') || error.message?.includes('exists')) {
        redirect('/register?error=exists');
    }
    redirect('/register?error=unknown');
  }

  revalidatePath('/admin');
  redirect('/login?status=registered');
}