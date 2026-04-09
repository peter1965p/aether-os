import { getInboxMessages } from "@/modules/inventory/actions";
import { getUserList } from "@/modules/users/lib/actions";
import { db } from "@/lib/db"; // Dein Supabase Client
import InboxClient from "@/components/mail.sys/InboxClient";

export const dynamic = 'force-dynamic';
export default async function IntelligencePage() {
  // 1. Aktive Mail-Konfiguration aus der DB laden (statt Hardcoded)
  const { data: mailConfig } = await db
    .from('mail_configs')
    .select('*')
    .eq('is_active', true)
    .single();

  // 2. Rohdaten abrufen - falls keine Config da ist, leeres Array
  const [rawMessages, users] = await Promise.all([
    mailConfig ? getInboxMessages(mailConfig.id) : [],
    getUserList()
  ]);

  // 3. Dein bewährter AETHER_SECURE_FILTER
  const messages = rawMessages.filter((msg: any) => {
    const subject = (msg.subject || "").toLowerCase();
    const isSpam = subject.includes("sex") || subject.includes("märchen");
    return !isSpam;
  });

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header bleibt im AETHER Style */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter">
            Message & Mailing <span className="text-blue-500 text-glow-blue">Center</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="h-[2px] w-8 bg-blue-500"></span>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em]">
              Node: {mailConfig?.imap_host || "Offline"} // {mailConfig ? "Secure Uplink Active" : "No Configuration Found"}
            </p>
          </div>
        </div>
        
        <div className="flex gap-8 font-mono text-[10px] text-slate-400 uppercase tracking-widest">
          <div>Traffic: <span className="text-blue-500">{messages.length} Units</span></div>
          <div>System: <span className="text-white">Encrypted</span></div>
        </div>
      </div>

      {/* Das 3-Spalten Interface */}
      <div className="flex-1 min-h-0 bg-black/40 rounded-[3rem] border border-white/5 p-2 shadow-2xl overflow-hidden backdrop-blur-xl">
        <InboxClient 
          initialMessages={messages} 
          users={users} 
          mailConfig={mailConfig} // Reichen wir für Aktionen (Löschen/Antworten) durch
        />
      </div>

      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 text-[9px] font-mono text-slate-700 uppercase tracking-[0.2em]">
        <span>AETHER OS v3.0 // Intelligence Sector</span>
        <span className="flex items-center gap-2 text-green-500">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Data Stream Stable
        </span>
      </div>
    </div>
  );
}