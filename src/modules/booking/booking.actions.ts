// src/lib/actions/booking.actions.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function processBooking(data: any) {
  // 1. Logik zum Speichern in der DB (SQLite/SQL)
  
  // 2. Automatisierte Bestätigung rausschicken
  try {
    await resend.emails.send({
      from: 'Paeffgen IT <noreply@paeffgen-it.de>',
      to: data.email,
      subject: 'Einsatz-Protokoll: Hardware-Support initialisiert',
      html: `
        <div style="font-family: monospace; background: #05070a; color: white; padding: 20px;">
          <h1 style="color: #2563eb;">AETHER OS // EINSATZ-BESTÄTIGUNG</h1>
          <p>Hallo ${data.name},</p>
          <p>Ihr Request für den Typ <strong>${data.serviceType}</strong> wurde im System registriert.</p>
          <hr style="border: 1px solid #1e293b;" />
          <p style="font-size: 10px; color: #64748b;">STATUS: QUEUED // ENGINEER: P. PAEFFGEN</p>
        </div>
      `
    });
  } catch (error) {
    console.error("Mail-Deployment failed:", error);
  }
}