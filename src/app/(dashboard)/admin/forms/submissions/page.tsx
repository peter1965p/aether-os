import { createClient } from "@/lib/db";
import { 
  Inbox, 
  Calendar, 
  User, 
  Mail, 
  ChevronRight, 
  Database,
  Trash2,
  Clock
} from "lucide-react";

export default async function FormSubmissionsPage() {
  const supabase = await createClient();

  // Wir holen die Einsendungen und verknüpfen sie direkt mit dem Formular-Namen
  const { data: submissions, error } = await supabase
    .from("form_submissions")
    .select(`
      *,
      forms (
        name
      )
    `)
    .order("submitted_at", { ascending: false });

  if (error) return <div className="p-8 text-red-500 font-mono">Error_Loading_Submissions: {error.message}</div>;

  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2 text-blue-500">
            <Inbox size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Incoming_Data // Feed</span>
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Posteingang</h1>
          <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-[0.2em] font-bold">
            Verwaltung aller Formular-Einsendungen
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono text-slate-600 uppercase">System_Time</p>
          <p className="text-xs font-black text-white italic">{new Date().toLocaleTimeString('de-DE')}</p>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-6">
        {submissions && submissions.length > 0 ? (
          submissions.map((sub: any) => (
            <div 
              key={sub.id} 
              className="bg-zinc-950 border border-white/5 rounded-[2rem] overflow-hidden group hover:border-blue-500/30 transition-all shadow-2xl"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                    <Database size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Quelle: {sub.forms?.name || "Unbekannt"}</p>
                    <p className="text-[11px] font-black text-white uppercase italic tracking-tight">Eingang: {new Date(sub.submitted_at).toLocaleString('de-DE')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-3 text-slate-600 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                  <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-[9px] font-black text-green-500 uppercase tracking-tighter">
                    Status: Neu
                  </div>
                </div>
              </div>

              {/* Card Content - Hier mappen wir dynamisch alle JSON-Daten */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(sub.data).map(([key, value]: [string, any]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                       {key}
                    </p>
                    <p className="text-sm text-slate-200 font-medium leading-relaxed">
                      {typeof value === "boolean" ? (value ? "Ja" : "Nein") : value.toString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick Actions Footer */}
              <div className="px-8 py-4 bg-zinc-900/10 flex justify-end gap-4">
                 <button className="text-[10px] font-black uppercase text-blue-500 hover:text-white transition-colors flex items-center gap-2 italic">
                   Details anzeigen <ChevronRight size={14} />
                 </button>
              </div>
            </div>
          ))
        ) : (
          <div className="h-64 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center space-y-4 opacity-30">
            <Clock size={40} />
            <p className="text-[10px] font-black uppercase tracking-widest italic">Warten auf neue Einsendungen...</p>
          </div>
        )}
      </div>
    </div>
  );
}