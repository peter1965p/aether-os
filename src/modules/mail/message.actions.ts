'use server';

import { createClient } from "@/lib/db"; // Oder dein DB-Import
import { revalidatePath } from "next/cache";

export async function sendInternalMessage({ sender_id, receiver_id, content }: { sender_id: string, receiver_id: string, content: string }) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('internal_messages')
    .insert([
      { sender_id, receiver_id, content, type: 'CHAT' }
    ]);

  if (error) {
    console.error("Message Error:", error);
    return { success: false };
  }

  revalidatePath('/admin/message');
  return { success: true };
}