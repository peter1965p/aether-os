import { ImapFlow } from 'imapflow';
import { NextResponse } from 'next/server';
import { simpleParser } from 'mailparser';

/**
 * AETHER OS // MAIL GATEWAY - STABLE VERSION [cite: 2026-03-08]
 * CachyOS Optimized // IMAP Sync Engine
 */

// FIX: Wir sagen TypeScript explizit 'as const', damit 'false' auch wirklich 'false' bleibt
const clientConfig = {
  host: 'imaps.udag.de',
  port: 993,
  secure: true,
  auth: { user: 'paeffgen-it-de-0001', pass: 'Eifel-2026!!' },
  logger: false as const, // Hier lag der Hund begraben!
  greetingTimeout: 15000 
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  
  // Hier nutzen wir die Config
  const client: any = new ImapFlow(clientConfig);

  try {
    await client.connect();
    // Sperre für die Inbox holen, um Konflikte zu vermeiden
    const lock = await client.getMailboxLock('INBOX');

    try {
      // EINZELNE MAIL LADEN
      if (uid) {
        const gen = client.fetch(uid, { source: true }, { uid: true });
        let rawSource = null;
        
        for await (let msg of gen) {
          rawSource = msg.source;
        }

        if (!rawSource) {
          return NextResponse.json({ error: "MAIL_NOT_FOUND" }, { status: 404 });
        }

        const parsed = await simpleParser(rawSource);
        return NextResponse.json({ 
          content: parsed.html || parsed.textAsHtml || parsed.text 
        });
      }

      // LISTE LADEN (FEED)
      const list = await client.fetch('1:*', { envelope: true }, { uid: true });
      const messages = [];
      
      for await (let msg of list) {
        messages.push({
          id: msg.uid.toString(),
          subject: msg.envelope.subject || '(Kein Betreff)',
          from: msg.envelope.from ? msg.envelope.from[0].address : 'Unbekannt',
          date: msg.envelope.date
        });
      }

      // Neueste Mails nach oben
      return NextResponse.json(
        messages.sort((a: any, b: any) => Number(b.id) - Number(a.id)).slice(0, 25)
      );

    } finally {
      // WICHTIG: Das Lock immer freigeben, bevor wir uns ausloggen!
      lock.release();
    }
    
  } catch (err: any) {
    console.error("GATEWAY_SYNC_ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    // Sicherstellen, dass die Verbindung immer gekappt wird
    try { await client.logout(); } catch (e) {}
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  if (!uid) return NextResponse.json({ error: "UID_REQUIRED" }, { status: 400 });

  const client: any = new ImapFlow(clientConfig);

  try {
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');
    
    try {
      // Markieren und Löschen
      await client.messageFlagsAdd({ uid: uid }, ['\\Deleted']);
      // Expurge führt das eigentliche Löschen aus
      await client.mailboxClose(); 
    } finally {
      lock.release();
    }
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    try { await client.logout(); } catch (e) {}
  }
}