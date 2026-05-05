/**
 * AETHER OS // LEGAL NOTICE & SERVICE INTERFACE
 * Dynamisierte Version: Zieht Stammdaten aus der DB.
 */

import { createClient } from "@/lib/db";
import { Send, Scale, ShieldCheck, User, FileText, MapPin } from "lucide-react";
import FormRenderer from "@/components/forms/FormRenderer";

export default async function ImpressumContactPage() {
  const db = await createClient();

  // 1. Fetch: Formular für den Service Request (Bleibt wie gewünscht)
  const { data: form } = await db
      .from("forms")
      .select("*")
      .eq("slug", "service-request")
      .single();

  // 2. Fetch: Globale System/Firmendaten (AETHER OS Stammdaten)
  // Wir nehmen an, die Tabelle heißt 'company_settings'
  const { data: company } = await db
      .from("company_settings")
      .select("*")
      .single(); // Holt den (hoffentlich einzigen) globalen Datensatz

  // Fallback-Werte, falls die DB noch leer ist
  const legalData = {
    name: company?.owner || "Inhaber festlegen",
    companyName: company?.name || "Firmenname festlegen",
    street: company?.address || "Straße & Hausnummer",
    zipCity: company?.zip_city || "PLZ & Ort",
    phone: company?.phone || "Telefonnummer",
    email: company?.email || "E-Mail Adresse",
    taxId: company?.tax_id || "Steuernummer fehlt",
    vatId: company?.vat_id || "USt-IdNr fehlt"
  };

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
          </div>

          <div className="grid lg:grid-cols-12 gap-16">

            {/* LEFT: SERVICE REQUEST (Bleibt unangetastet) */}
            <div className="lg:col-span-7">
              <div className="mb-8">
                <h2 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
                  <Send size={20} className="text-blue-500" /> Service Request
                </h2>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Dynamisches Formular Center Modul</p>
              </div>

              {form ? (
                  <div className="bg-zinc-900/10 border border-white/5 p-8 md:p-12 rounded-sm backdrop-blur-md shadow-2xl shadow-blue-900/5">
                    <FormRenderer
                        formId={form.id}
                        formName={form.name}
                        fields={form.fields}
                    />
                  </div>
              ) : (
                  <div className="p-12 border border-red-500/20 bg-red-500/5 rounded-sm text-center">
                    <p className="text-[10px] font-mono uppercase text-slate-500 tracking-widest italic text-red-500">Form-Engine Offline</p>
                  </div>
              )}
            </div>

            {/* RIGHT: LEGAL & IDENTITY (Jetzt dynamisch!) */}
            <div className="lg:col-span-5 space-y-8">

              <div className="p-10 border border-white/5 rounded-sm bg-zinc-900/20 backdrop-blur-sm relative overflow-hidden">
                <h3 className="text-xs font-mono font-bold uppercase text-blue-500 mb-10 flex items-center gap-3 tracking-[0.3em]">
                  <User size={16} /> Operator Identity
                </h3>

                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-mono uppercase text-slate-500 tracking-widest mb-2">Verantwortlich nach § 5 TMG</p>
                    <p className="text-lg text-white font-black italic uppercase tracking-tighter leading-tight">
                      {legalData.name}<br />
                      {legalData.companyName}
                    </p>
                  </div>

                  <div className="flex items-start gap-6 font-mono">
                    <MapPin size={18} className="text-blue-500 mt-1" />
                    <div>
                      <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-1">Postalische Anschrift</p>
                      <p className="text-sm text-white font-bold italic uppercase">
                        {legalData.street}<br />
                        {legalData.zipCity} // Germany
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 font-mono">
                    <ShieldCheck size={18} className="text-blue-500 mt-1" />
                    <div>
                      <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-1">Direct Contact</p>
                      <p className="text-sm text-white font-bold italic uppercase">
                        M: {legalData.phone}<br />
                        E: {legalData.email}
                      </p>
                    </div>
                  </div>

                  {/* Neu hinzugefügt: Steuernummern (Pflicht im Impressum) */}
                  <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[8px] font-mono uppercase text-slate-600 mb-1">Steuernummer</p>
                      <p className="text-[10px] text-zinc-400 font-mono uppercase">{legalData.taxId}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-mono uppercase text-slate-600 mb-1">USt-IdNr.</p>
                      <p className="text-[10px] text-zinc-400 font-mono uppercase">{legalData.vatId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DSGVO / Privacy Card (Unverändert) */}
              <div className="p-10 border border-blue-500/10 rounded-sm bg-blue-500/[0.02] backdrop-blur-sm">
                <h3 className="text-xs font-mono font-bold uppercase text-blue-400 mb-6 flex items-center gap-3 tracking-[0.3em]">
                  <FileText size={16} /> Data Governance
                </h3>
                <div className="space-y-4 text-[10px] font-mono text-slate-500 uppercase leading-relaxed text-[8px]">
                  <p>Anfragen über das AETHER Interface werden verschlüsselt an die Knotenpunkte übertragen.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
  );
}