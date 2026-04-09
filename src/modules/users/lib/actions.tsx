'use server'

import db from '@/lib/db'; // Wir nutzen 'db' als unseren Supabase-Client
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

// 1. TYP-DEFINITION HINZUFÜGEN (Fehler 2304: User nicht gefunden)
export interface User {
  id: string | number;
  username: string;
  email: string;
  role: string;
  created_at?: string;
  status?: string;
}

export async function createUser(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;
  const status = 'active';

  // Passwort hashen
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  try {
    // FIX: Umstellung von .prepare (SQLite) auf Supabase Syntax
    const { error } = await db
      .from('users')
      .insert([
        { 
          username, 
          password_hash: passwordHash, 
          email, 
          role, 
          status 
        }
      ]);

    if (error) throw error;
  } catch (e) {
    console.error("Access Control Breach:", e);
    return { success: false, error: "Identity Creation Failed" };
  }

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function getUserList(): Promise<User[]> {
  try {
    // FIX: Wir nutzen 'db', da dies dein Supabase-Export in AETHER OS ist (Fehler 2304: supabase nicht gefunden)
    const { data, error } = await db
      .from("users")
      .select("id, username, email, role, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("AETHER_FETCH_WARNING: Recovery gestartet...");
      const { data: recoveryData, error: recoveryError } = await db
        .from("users")
        .select("id, username, email, role, created_at") 
        .limit(10);
        
      if (recoveryError) throw recoveryError;
      return (recoveryData as User[]) || [];
    }
    
    return (data as User[]) || [];
  } catch (error: any) {
    console.error("AETHER_USER_GET_ERROR:", error.message || error);
    return [];
  }
}