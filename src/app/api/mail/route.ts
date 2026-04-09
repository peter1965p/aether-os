import { ImapFlow } from 'imapflow';
import { NextResponse } from 'next/server';
import { simpleParser } from 'mailparser';
import { db } from '@/lib/db'; // Dein Supabase Client

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  
  // 1. Hol die Config aus der DB
  // In einer echten App würden wir hier die ID des Nutzers aus der Session ziehen
  const { data: config, error } = await db
    .from('mail_configs')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error || !config) {
    return NextResponse.json({ error: "MAIL_CONFIG_NOT_FOUND" }, { status: 404 });
  }

  // 2. Dynamische Config erstellen
  const dynamicConfig = {
    host: config.imap_host,
    port: config.imap_port,
    secure: true,
    auth: { 
      user: config.imap_user, 
      pass: config.imap_pass 
    },
    logger: false as const,
    greetingTimeout: 15000 
  };

  const client: any = new ImapFlow(dynamicConfig);

  try {
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');

    try {
      if (uid) {
        // EINZELNE MAIL LADEN (Inhalt)
        const gen = client.fetch(uid, { source: true }, { uid: true });
        let rawSource = null;
        for await (let msg of gen) { rawSource = msg.source; }
        if (!rawSource) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

        const parsed = await simpleParser(rawSource);
        return NextResponse.json({ 
          content: parsed.html || parsed.textAsHtml || parsed.text 
        });
      }

      // LISTE LADEN (Outlook Style Feed)
      const list = await client.fetch('1:*', { envelope: true }, { uid: true });
      const messages = [];
      for await (let msg of list) {
        messages.push({
          id: msg.uid.toString(),
          subject: msg.envelope.subject || '(Kein Betreff)',
          from: msg.envelope.from ? msg.envelope.from[0].address : 'Unbekannt',
          date: msg.envelope.date,
          excerpt: "" // Hier könnte man optional einen Preview-Text laden
        });
      }

      return NextResponse.json(
        messages.sort((a: any, b: any) => Number(b.id) - Number(a.id)).slice(0, 50)
      );

    } finally {
      lock.release();
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    try { await client.logout(); } catch (e) {}
  }
}