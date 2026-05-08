/**
 * AETHER OS // LEGAL NOTICE & SERVICE INTERFACE
 * Pfad: /src/app/(frontend)/impressum/page.tsx
 */

import { createClient } from "@/lib/db";
import { Send, Scale, ShieldCheck, User, FileText, MapPin } from "lucide-react";
import FormRenderer from "@/components/forms/FormRenderer";

export default async function ImpressumContactPage() {
  const db = await createClient();

  // 1. Fetch: Formular für den Service Request
  const { data: form } = await db
      .from("forms")
      .select("*")
      .eq("slug", "service-request")
      .single();

  // 2. Fetch: AETHER OS Stammdaten (Korrektur auf Tabelle 'settings')
  // Wir nehmen den ersten Datensatz (.limit(1)), da dies die globalen Einstellungen sind.
  const { data: company } = await db
      .from("settings")
      .select("*")
      .limit(1)
      .maybeSingle();

  /**
   * Daten-Mapping & Fallbacks
   * Basierend auf deinem SQL-Schema vom 08.05.26
   */
  const legalData = {
    name: company?.owner_name || "Inhaber nicht konfiguriert",
    companyFull: company?.company_full_name || company?.company_name || "Firma nicht konfiguriert",
    address: company?.address_full || "Anschrift fehlt im System",
    phone: company?.support_email ? "E-Mail vorhanden" : "Keine Kontaktdaten", // In deinem Schema gibt es support_email, aber kein support_phone
    email: company?.support_email || "Keine E-Mail hinterlegt",
    taxId: company?.tax_number || "Steuernummer fehlt",
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
                Legal & Service Interface // {company?.system_designation || "AETHER OS"}
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
              LEGAL <span className="text-blue-600">NOTICE.</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-12 gap-16">
            {/* LEFT SIDE: SERVICE REQUEST */}
            <div className="lg:col-span-7">
              <div className="mb-8">
                <h2 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
                  <Send size={20} className="text-blue-500" /> Service Request
                </h2>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                  Dynamisches Formular Center Modul
                </p>
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
                    <p className="text-[10px] font-mono uppercase text-red-500 tracking-widest italic">
                      Form-Engine Offline // Missing "service-request" slug
                    </p>
                  </div>
              )}
            </div>

            {/* RIGHT SIDE: OPERATOR IDENTITY */}
            <div className="lg:col-span-5 space-y-8">
              <div className="p-10 border border-white/5 rounded-sm bg-zinc-900/20 backdrop-blur-sm relative overflow-hidden">
                <h3 className="text-xs font-mono font-bold uppercase text-blue-500 mb-10 flex items-center gap-3 tracking-[0.3em]">
                  <User size={16} /> Operator Identity
                </h3>

                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-mono uppercase text-slate-500 tracking-widest mb-2 italic">
                      Verantwortlich nach § 5 TMG
                    </p>
                    <p className="text-lg text-white font-black italic uppercase tracking-tighter leading-tight">
                      {legalData.name}<br />
                      <span className="text-blue-500/80">{legalData.companyFull}</span>
                    </p>
                  </div>

                  <div className="flex items-start gap-6 font-mono">
                    <MapPin size={18} className="text-blue-500 mt-1" />
                    <div>
                      <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-1">Postalische Anschrift</p>
                      <p className="text-sm text-white font-bold italic uppercase whitespace-pre-line leading-relaxed">
                        {legalData.address}
                      </p>
                      <p className="text-[10px] text-blue-500/40 mt-1 uppercase tracking-widest">Region: Germany // EU</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 font-mono">
                    <ShieldCheck size={18} className="text-blue-500 mt-1" />
                    <div>
                      <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-1">Direct Contact Gateway</p>
                      <p className="text-sm text-white font-bold italic uppercase leading-relaxed">
                        E: {legalData.email}
                      </p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[8px] font-mono uppercase text-slate-600 mb-1 tracking-tighter">Steuernummer</p>
                      <p className="text-[10px] text-zinc-400 font-mono uppercase font-bold">{legalData.taxId}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-mono uppercase text-slate-600 mb-1 tracking-tighter">USt-IdNr. (VAT)</p>
                      <p className="text-[10px] text-zinc-400 font-mono uppercase font-bold">{legalData.vatId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Governance Hinweis */}
              <div className="p-10 border border-blue-500/10 rounded-sm bg-blue-500/[0.02] backdrop-blur-sm shadow-inner">
                <div className="flex items-center gap-3 mb-6">
                  <FileText size={16} className="text-blue-400" />
                  <h3 className="text-xs font-mono font-bold uppercase text-blue-400 tracking-[0.3em]">
                    Data Governance
                  </h3>
                </div>
                <div className="space-y-4 text-[9px] font-mono text-slate-500 uppercase leading-relaxed tracking-tight">
                  <p>
                    Sämtliche Anfragen über das <span className="text-blue-500">AETHER Interface</span> werden
                    end-zu-end verschlüsselt an die zuständigen System-Knotenpunkte übertragen.
                  </p>
                  <p>
                    Speicherung erfolgt gemäß DSGVO Richtlinien auf EU-basierten Instanzen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}