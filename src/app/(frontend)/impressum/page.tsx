import { createClient, db } from "@/lib/db";
import { Send, Terminal, Cpu, MapPin, Calendar, AlertTriangle, ArrowRight } from "lucide-react";
import FormRenderer from "@/components/forms/FormRenderer";

export default async function ContactPage() {
  const db = await createClient();
  
  // Wir suchen nach dem Formular. 
  // TIPP: Geh in dein Admin-Panel und benenne das Formular in "Service Request" um.
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
            <Terminal size={16} className="text-blue-500" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-slate-500">
              Request Interface // V3.0.4
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            SERVICE <span className="text-blue-600">REQUEST.</span>
          </h1>
          <p className="mt-6 text-slate-400 font-mono text-xs uppercase tracking-widest max-w-2xl leading-relaxed">
            Initialisieren Sie einen Hardware-Einsatz, fordern Sie eine Fehleranalyse an oder besprechen Sie Ihr nächstes Infrastruktur-Projekt.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* FORM SIDE (LEFT) */}
          <div className="lg:col-span-7">
            {form ? (
              <div className="bg-zinc-900/10 border border-white/5 p-8 md:p-12 rounded-sm backdrop-blur-md shadow-2xl shadow-blue-900/5">
                <FormRenderer 
                  formId={form.id} 
                  formName={form.name} 
                  fields={form.fields} 
                />
              </div>
            ) : (
              <div className="p-12 border border-red-500/20 bg-red-500/5 rounded-sm text-center group">
                <div className="relative inline-block mb-6">
                  <AlertTriangle className="text-red-500 animate-pulse" size={48} />
                  <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20"></div>
                </div>
                <h3 className="text-lg font-bold uppercase italic mb-2">System Error: Form Not Found</h3>
                <p className="text-[10px] font-mono uppercase text-slate-500 mb-8 tracking-tighter">
                  Status Code: 404 // Target Slug: service-request
                </p>
                
                <div className="text-left bg-black/40 p-6 border-l-2 border-red-500 font-mono text-[11px] text-slate-400 space-y-4">
                  <p className="text-white font-bold tracking-widest uppercase underline decoration-red-500">Lösungsschritte:</p>
                  <p>1. Navigieren Sie zum <span className="text-blue-400 italic">AETHER OS Admin-Bereich</span>.</p>
                  <p>2. Öffnen Sie das <span className="text-blue-400 italic">Formular-Modul</span>.</p>
                  <p>3. Benennen Sie Ihr Formular exakt in <span className="text-white bg-zinc-800 px-2">Service Request</span> um.</p>
                  <p>4. Der Slug wird automatisch auf <span className="text-white italic">service-request</span> gesetzt.</p>
                </div>
              </div>
            )}
          </div>

          {/* PARAMETERS SIDE (RIGHT) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-10 border border-white/5 rounded-sm bg-zinc-900/20 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors"></div>
              
              <h3 className="text-xs font-mono font-bold uppercase text-blue-500 mb-10 flex items-center gap-3 tracking-[0.3em]">
                <Cpu size={16} /> System Parameters
              </h3>
              
              <div className="space-y-10">
                <div className="flex items-start gap-6">
                  <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-sm">
                    <MapPin size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase text-slate-500 tracking-widest mb-1">Einsatzgebiet</p>
                    <p className="text-sm text-white font-bold italic uppercase tracking-tighter">RLP // Saarland // Hessen // BaWü // NRW</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-sm">
                    <Calendar size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase text-slate-500 tracking-widest mb-1">Verfügbarkeit</p>
                    <p className="text-sm text-white font-bold italic uppercase tracking-tighter">Ab 01.05.2026 für neue Projekte</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border border-blue-600/30 rounded-sm bg-blue-600/[0.03] relative">
               <div className="absolute top-4 left-4 font-mono text-[8px] text-blue-500/50 uppercase tracking-[0.5em]">SLA Guarantee</div>
               <p className="text-xs font-mono text-blue-400 uppercase leading-relaxed italic mt-4">
                "Alle Anfragen werden innerhalb der Standard-SLA von 24 Stunden gesichtet, technisch bewertet und priorisiert."
              </p>
            </div>
            
            <div className="pt-8 border-t border-white/5">
                <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest leading-loose">
                    Security Note: Alle übermittelten Daten werden verschlüsselt in der AETHER OS Cloud Instanz gespeichert und unterliegen strengsten RLS-Richtlinien.
                </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}