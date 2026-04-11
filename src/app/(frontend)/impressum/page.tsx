import { createClient } from "@/lib/db";
import { Send, Terminal, Cpu, MapPin, Calendar, AlertTriangle, Scale, ShieldCheck, User, FileText } from "lucide-react";
import FormRenderer from "@/components/forms/FormRenderer";

export default async function ImpressumContactPage() {
  const db = await createClient();
  
  // Der Formularbuilder spendiert hier das Formular basierend auf dem Slug
  const { data: form } = await db
    .from("forms")
    .select("*")
    .eq("slug", "service-request")
    .single();

  return (
    <div className="min-h-screen bg-[#05070a] text-white pt-32 pb-20 px-6 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <Scale size={16} className="text-blue-500" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-slate-500">
              Legal & Service Interface // V3.0.4
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            LEGAL <span className="text-blue-600">NOTICE.</span>
          </h1>
          <p className="mt-6 text-slate-400 font-mono text-xs uppercase tracking-widest max-w-2xl leading-relaxed">
            Anbieterkennzeichnung gemäß § 5 TMG sowie verschlüsseltes Interface für Service-Initialisierungen nach DSGVO-Standard.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* LEFT: SERVICE REQUEST (Powered by Formular Center) */}
          <div className="lg:col-span-7">
            <div className="mb-8">
                <h2 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
                    <Send size={20} className="text-blue-500" /> Service Request
                </h2>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Dynamisches Formular Center Modul</p>
            </div>

            {form ? (
              <div className="bg-zinc-900/10 border border-white/5 p-8 md:p-12 rounded-sm backdrop-blur-md shadow-2xl shadow-blue-900/5">
                {/* Hier wird das Formular vom Builder generiert */}
                <FormRenderer 
                  formId={form.id} 
                  formName={form.name} 
                  fields={form.fields} 
                />
                <p className="mt-6 text-[9px] font-mono text-slate-600 uppercase tracking-tighter">
                    Hinweis: Durch Absenden des Formulars willigen Sie in die Verarbeitung Ihrer Daten zum Zweck der Kontaktaufnahme ein (Art. 6 Abs. 1 lit. a DSGVO).
                </p>
              </div>
            ) : (
              <div className="p-12 border border-red-500/20 bg-red-500/5 rounded-sm text-center">
                <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
                <h3 className="text-lg font-bold uppercase italic mb-2">Form-Engine Offline</h3>
                <p className="text-[10px] font-mono uppercase text-slate-500 tracking-widest">Initialisiere "service-request" im Admin-Panel.</p>
              </div>
            )}
          </div>

          {/* RIGHT: LEGAL & IDENTITY */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Operator Identity (TMG relevant) */}
            <div className="p-10 border border-white/5 rounded-sm bg-zinc-900/20 backdrop-blur-sm relative overflow-hidden">
              <h3 className="text-xs font-mono font-bold uppercase text-blue-500 mb-10 flex items-center gap-3 tracking-[0.3em]">
                <User size={16} /> Operator Identity
              </h3>
              
              <div className="space-y-8">
                <div>
                    <p className="text-[10px] font-mono uppercase text-slate-500 tracking-widest mb-2">Verantwortlich nach § 5 TMG</p>
                    <p className="text-lg text-white font-black italic uppercase tracking-tighter leading-tight">
                        Peter Päffgen<br />
                        Paeffgen IT Services
                    </p>
                </div>

                <div className="flex items-start gap-6 font-mono">
                  <MapPin size={18} className="text-blue-500 mt-1" />
                  <div>
                    <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-1">Postalische Anschrift</p>
                    <p className="text-sm text-white font-bold italic uppercase">
                        Lindenhof 1<br />
                        54531 Manderscheid // Germany
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 font-mono">
                  <ShieldCheck size={18} className="text-blue-500 mt-1" />
                  <div>
                    <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-1">Direct Contact</p>
                    <p className="text-sm text-white font-bold italic uppercase">
                        M: 015569 448813<br />
                        E: news24regional@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* DSGVO / Privacy Card */}
            <div className="p-10 border border-blue-500/10 rounded-sm bg-blue-500/[0.02] backdrop-blur-sm">
              <h3 className="text-xs font-mono font-bold uppercase text-blue-400 mb-6 flex items-center gap-3 tracking-[0.3em]">
                <FileText size={16} /> Data Governance
              </h3>
              <div className="space-y-4 text-[10px] font-mono text-slate-500 uppercase leading-relaxed">
                <p>
                  <strong className="text-white tracking-widest">DSGVO Compliance:</strong> Alle Anfragen über das AETHER Interface werden verschlüsselt an die Datenbank übertragen. Eine Weitergabe an Dritte erfolgt nicht ohne explizite Zustimmung.
                </p>
                <p>
                  Sie haben jederzeit das Recht auf Auskunft, Korrektur oder Löschung Ihrer gespeicherten "Service-Nodes" (Daten).
                </p>
              </div>
            </div>

            {/* System Parameters (Einsatzgebiet etc.) */}
            <div className="p-8 border border-white/5 rounded-sm bg-black/40">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-mono font-bold uppercase text-zinc-500 tracking-[0.2em]">System Status</h3>
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-[8px] font-mono uppercase text-slate-600 mb-1">Region</p>
                    <p className="text-[10px] text-white font-bold italic uppercase">RLP // NRW // HES</p>
                </div>
                <div>
                    <p className="text-[8px] font-mono uppercase text-slate-600 mb-1">Availability</p>
                    <p className="text-[10px] text-white font-bold italic uppercase">Q2 // 2026 Ready</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}