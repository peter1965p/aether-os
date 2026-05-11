"use server";

import db from "@/lib/db";
import { Resend } from "resend";

// Wir nutzen den API-Key aus deiner .env
const resend = new Resend(process.env.RESEND_API_KEY);

interface NotifyProps {
    userId: string;
    email: string;
    type: 'INVOICE' | 'SHIPPING' | 'SYSTEM' | 'ORDER';
    subject: string;
    message: string;
}

export async function triggerSentinelNotification({
                                                      userId,
                                                      email,
                                                      type,
                                                      subject,
                                                      message
                                                  }: NotifyProps) {

    console.log(`AETHER // SENTINEL: Triggering ${type} for ${email}`);

    try {
        // 1. DATABASE UPLINK (Für die Glocke im Dashboard)
        const { error: dbError } = await db
            .from('notifications')
            .insert({
                user_id: userId,
                source: 'CLIENT',
                type: type,
                msg: message,
                created_at: new Date().toISOString()
            });

        if (dbError) throw new Error(`DB_UPLINK_FAILED: ${dbError.message}`);

        // 2. RESEND EMAIL UPLINK (Rekursiver Versand)
        const { data, error: mailError } = await resend.emails.send({
            from: 'Aether OS <system@dein-terminal.de>', // Deine verifizierte Domain
            to: email,
            subject: `AETHER // ${subject}`,
            html: `
                <div style="background-color: #050505; color: #ffffff; padding: 40px; font-family: 'Courier New', Courier, monospace; border: 1px solid #1d4ed8;">
                    <h2 style="color: #3b82f6; text-transform: uppercase; letter-spacing: 4px;">> AETHER_SENTINEL_DECRYPTED</h2>
                    <p style="border-left: 3px solid #3b82f6; padding-left: 15px; margin: 20px 0; font-size: 16px; line-height: 1.6;">
                        ${message}
                    </p>
                    <div style="margin-top: 40px; border-top: 1px solid #111; padding-top: 10px;">
                        <p style="font-size: 9px; color: #444; text-transform: uppercase; letter-spacing: 2px;">
                            Origin: Manderscheid_Node_01 // Status: Encrypted_Mail_Sent
                        </p>
                    </div>
                </div>
            `,
        });

        if (mailError) throw new Error(`RESEND_UPLINK_FAILED: ${mailError.message}`);

        return { success: true, id: data?.id };

    } catch (error) {
        console.error("AETHER // SENTINEL_CRITICAL_FAILURE:", error);
        return { success: false, error };
    }
}