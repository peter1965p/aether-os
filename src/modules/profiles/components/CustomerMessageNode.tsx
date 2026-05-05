/**
 * AETHER OS // MODULE: PROFILES
 * Zweck: Kunden-Kommunikation basierend auf dem Intelligence-Layout.
 * Nutzt die 'public.messages' Tabelle.
 */

import { createClient } from '@/lib/db';
import InboxClient from "@/components/mail.sys/InboxClient";

interface CustomerMessageNodeProps {
    customerId: number; // Die Integer ID aus public.customers
}

export default async function CustomerMessageNode({ customerId }: CustomerMessageNodeProps) {
    const supabase = await createClient();

    // 1. Datenabfrage: Nur Nachrichten für diesen speziellen Kunden-Datensatz
    const { data: rawMessages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("AETHER_UPLINK_ERROR // Messages could not be fetched", error);
    }

    // 2. AETHER_SECURE_FILTER (Dein Spam-Schutz aus der IntelligencePage)
    const messages = (rawMessages || []).filter((msg: any) => {
        const subject = (msg.subject || "").toLowerCase();
        const isSpam = subject.includes("sex") || subject.includes("märchen");
        return !isSpam;
    });

    return (
        <div className="flex flex-col space-y-4 animate-in fade-in duration-1000">

            {/* Mini-Terminal Header */}
            <div className="flex justify-between items-end px-4">
                <div>
                    <h3 className="text-xl font-black uppercase text-white tracking-tighter italic">
                        Message <span className="text-blue-500">Uplink</span>
                    </h3>
                    <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                        Node_Status: {messages.length > 0 ? "Active_Stream" : "Idle_Waiting"}
                    </p>
                </div>
                <div className="text-[10px] font-mono text-blue-500/50">
                    SECURE_ID: {customerId}
                </div>
            </div>

            {/* Das Inbox-Interface im schwarzen Glaskasten-Look */}
            <div className="h-[450px] bg-black/40 rounded-[2rem] border border-white/5 p-2 shadow-inner overflow-hidden backdrop-blur-xl">
                <InboxClient
                    initialMessages={messages}
                    users={[]} // Kunden sehen keine globale Userliste
                    mailConfig={null} // Keine IMAP-Konfiguration für Endkunden
                />
            </div>

            {/* Status Bar */}
            <div className="flex justify-between items-center px-6 text-[7px] font-mono text-slate-800 uppercase">
                <span>AETHER OS v3.0 // Intelligence Sector // Customer_View</span>
                <span className="flex items-center gap-1">
          <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
          Uplink Encrypted
        </span>
            </div>
        </div>
    );
}