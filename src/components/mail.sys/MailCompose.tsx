"use client";

import { sendInternalMessage } from "@/modules/inventory/actions";
import { Send, Mail, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
}

export default function MailCompose({ users }: { users: User[] }) {
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setIsSending(true);
    const formData = new FormData(e.currentTarget);
    
    const result = await sendInternalMessage(formData);
    
    if (result.success) {
      (e.target as HTMLFormElement).reset();
      // Optional: Hier könnte man eine Erfolgsmeldung triggern [cite: 2026-03-08]
    }
    setIsSending(false);
  }

  return (
    <div className="bg-[#0d111c] border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
      {/* Hintergrund-Effekt für den Cyber-Look [cite: 2026-03-08] */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Mail size={120} />
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Send className="text-blue-500" size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">
            Internal <span className="text-blue-500">Comms</span>
          </h2>
          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em]">
            Secure Node-to-Node Transmission [cite: 2026-02-20]
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Empfänger Auswahl [cite: 2026-03-08] */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
              <ShieldCheck size={10} /> Target Entity
            </label>
            <select 
              name="receiver_id" 
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:bg-black/60"
            >
              <option value="" disabled selected className="bg-[#0d111c]">Select Operator...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id} className="bg-[#0d111c]">
                  {u.username.toUpperCase()} ({u.email})
                </option>
              ))}
            </select>
          </div>

          {/* Betreff [cite: 2026-03-08] */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
              <Zap size={10} /> Priority Subject
            </label>
            <input 
              name="subject" 
              required 
              placeholder="SYSTEM_ALERT_01..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-blue-500 outline-none transition-all placeholder:opacity-20" 
            />
          </div>
        </div>

        {/* Nachrichtentext [cite: 2026-03-08] */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-1">Message Payload</label>
          <textarea 
            name="content" 
            rows={5} 
            required 
            placeholder="Enter encrypted data stream..."
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-blue-500 outline-none transition-all resize-none placeholder:opacity-20" 
          />
        </div>

        <button 
          disabled={isSending}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-4 rounded-xl font-black italic uppercase text-xs flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/10 active:scale-[0.98]"
        >
          {isSending ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Encrypting...
            </span>
          ) : (
            <>
              <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Broadcast to Cluster
            </>
          )}
        </button>
      </form>
    </div>
  );
}