"use server";

import { db } from "@/lib/db";
import { Resend } from 'resend';
import { revalidatePath } from "next/cache";

export async function executeAutomatedOrder(formData: FormData) {
  const supplierId = formData.get("supplierId") as string;
  const orderAmount = parseInt(formData.get("amount") as string);
  const supplierEmail = formData.get("email") as string;
  const supplierName = formData.get("name") as string;

  // 1. Richtige Tabelle abfragen: public.settings
  // Wir holen uns den ersten Datensatz (da es deine globalen Settings sind)
  const { data: config, error: configError } = await db
    .from('settings')
    .select('resend_api_key, aws_access_key') // Wir laden nur was wir brauchen
    .limit(1)
    .single();

  if (configError || !config?.resend_api_key) {
    console.error("AETHER_CORE // UPLINK_CRITICAL:", configError);
    throw new Error("RESEND_UPLINK_OFFLINE // CHECK_SETTINGS_TABLE");
  }

  const resend = new Resend(config.resend_api_key);

  try {
    // 2. Datenbank-Update via RPC (bleibt gleich, sofern die Funktion existiert)
    const { error: dbError } = await db.rpc('execute_supply_restock', {
      p_supplier_id: supplierId,
      p_amount: orderAmount
    });

    if (dbError) throw dbError;

    // 3. E-Mail Versand via Resend
    const { error: mailError } = await resend.emails.send({
      from: 'AETHER OS <system@paeffgen-it.de>',
      to: supplierEmail,
      subject: `[AETHER-OS] AUTOMATED_SUPPLY_REQUEST // NODE_${String(supplierId).slice(0,8)}`,
      html: `
        <div style="font-family: monospace; background: #020406; color: white; padding: 40px; border: 1px solid #f97316;">
          <h1 style="color: #f97316;">AETHER OS // PROCUREMENT_UPLINK</h1>
          <p>Knotenpunkt: <strong>${supplierName}</strong></p>
          <hr style="border: 0.5px solid #1f2937;" />
          <p>MENGE: <strong>${orderAmount} Einheiten</strong></p>
          <p style="font-size: 10px; color: #4b5563;">STATUS: AUTHENTICATED_BY_MASTER_KERNEL</p>
        </div>
      `
    });

    if (mailError) throw mailError;

    revalidatePath('/admin/suppliers');
    return { success: true };
  } catch (err) {
    console.error("PROCUREMENT_CRITICAL_FAILURE:", err);
    return { success: false, message: "SYSTEM_FAULT" };
  }
}