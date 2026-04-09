"use client";

import { useState } from "react";
import { 
  Mail, MessageSquare, Send, User, 
  Search, MoreVertical, Paperclip, Smile,
  RadioTower, Wifi // Korrigierte Icons
} from "lucide-react";
import { sendInternalMessage } from "@/modules/mail/message.actions";

export default function InboxClient({ initialMessages, users, currentUserId }: any) {
  const [activeMode, setActiveMode] = useState<'mail' | 'chat'>('mail');
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [chatInput, setChatInput] = useState("");

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedEntity) return;

    const res = await sendInternalMessage({
      sender_id: currentUserId,
      receiver_id: selectedEntity.id,
      content: chatInput
    });

    if (res.success) setChatInput("");
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-black/20 rounded-[2.5rem] border border-white/5">
      {/* LEFT NAVIGATION */}
      <div className="w-80 border-r border-white/5 flex flex-col">
        <div className="p-4 flex gap-2 border-b border-white/5 bg-white/5">
          <button 
            onClick={() => { setActiveMode('mail'); setSelectedEntity(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
              activeMode === 'mail' ? 'bg-blue-600 text-black shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'
            }`}
          >
            <Mail size={14}/> Mailing
          </button>
          <button 
            onClick={() => { setActiveMode('chat'); setSelectedEntity(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
              activeMode === 'chat' ? 'bg-green-600 text-black shadow-lg shadow-green-500/20' : 'text-slate-500 hover:text-white'
            }`}
          >
            <MessageSquare size={14}/> AETHER Chat
          </button>
        </div>

        {/* LIST AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeMode === 'mail' ? (
            initialMessages.map((msg: any) => (
              <div key={msg.id} onClick={() => setSelectedEntity(msg)} className={`p-5 border-b border-white/5 cursor-pointer hover:bg-white/5 ${selectedEntity?.id === msg.id ? 'bg-white/5 border-l-4 border-l-blue-500' : ''}`}>
                <p className="text-[10px] font-black text-blue-500 uppercase">{msg.from.split('@')[0]}</p>
                <p className="text-xs text-white font-bold truncate uppercase italic">{msg.subject}</p>
              </div>
            ))
          ) : (
            users?.map((user: any) => (
              <div key={user.id} onClick={() => setSelectedEntity(user)} className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 border-b border-white/5 ${selectedEntity?.id === user.id ? 'bg-green-500/10' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white text-xs font-black uppercase">{user.name?.substring(0, 2)}</div>
                <h4 className="text-xs font-black text-white uppercase tracking-tighter">{user.name}</h4>
              </div>
            ))
          )}
        </div>
      </div>

      {/* VIEWPORT */}
      <div className="flex-1 flex flex-col bg-[#050505]">
        {selectedEntity ? (
          <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-white/5 bg-black/40 flex justify-between items-center">
              <h2 className="text-lg font-black italic uppercase text-white tracking-tighter">
                {activeMode === 'mail' ? selectedEntity.subject : selectedEntity.name}
              </h2>
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
              {/* Hier kommen die Nachrichten / Mail-Inhalte rein */}
            </div>
            {activeMode === 'chat' && (
              <div className="p-6 border-t border-white/5 bg-black/40 flex items-center gap-4">
                <input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm text-white outline-none focus:border-green-500"
                />
                <button onClick={handleSendMessage} className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-black shadow-lg shadow-green-500/20 hover:scale-105 transition-transform">
                  <Send size={20} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-800 animate-pulse">
            <RadioTower size={80} className="opacity-10 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Awaiting Selection</p>
          </div>
        )}
      </div>
    </div>
  );
}