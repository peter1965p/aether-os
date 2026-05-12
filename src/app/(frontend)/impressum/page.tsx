/**
 * AETHER OS // LEGAL NOTICE & SERVICE INTERFACE
 * Pfad: /src/app/(frontend)/impressum/page.tsx
 */

import { createClient } from "@/lib/db";
import { Send, Scale, ShieldCheck, User, FileText, MapPin, Zap } from "lucide-react";
import FormRenderer from "@/components/forms/FormRenderer";
import Image from "next/image";

export default async function ImpressumContactPage() {
  const db = await createClient();

  const { data: form } = await db
      .from("forms")
      .select("*")
      .eq("slug", "service-request")
      .single();

  const { data: company } = await db
      .from("settings")
      .select("*")
      .limit(1)
      .maybeSingle();

  const legalData = {
    name: company?.owner_name || "Inhaber nicht konfiguriert",
    companyFull: company?.company_full_name || company?.company_name || "Firma nicht konfiguriert",
    address: company?.address_full || "Anschrift fehlt im System",
    email: company?.support_email || "Keine E-Mail hinterlegt",
    taxId: company?.tax_number || "Steuernummer fehlt",
    vatId: company?.vat_id || "USt-IdNr fehlt"
  };

  return (
      <div className="min-h-screen bg-[#020406] text-white pt-40 pb-32 px-6 font-mono selection:bg-blue-500/30 overflow-hidden relative">

        {/* --- COSMIC BACKGROUND LAYER (Unified Look) --- */}
        <div className="absolute inset-0 z-0">
          <Image
              src="/images/aether-header.png"
              alt="Aether Universe"
              fill
              className="object-cover opacity-20 scale-110 blur-[4px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020406] via-transparent to-[#020406]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020406_100%)] opacity-90" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">

          {/* --- HEADER SECTION: MASSIVE AETHER STYLE --- */}
          <div className="mb-24 border-b border-white/5 pb-16 relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Scale size={20} className="text-blue-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-500">
                Legal_Framework // {company?.system_designation || "AETHER_OS"} // V16.1.6
              </span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none select-none">
              Legal <span className="bg-gradient-to-b from-blue-400 via-blue-600 to-blue-900 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(30,58,138,0.5)]">Notice.</span>
            </h1>
            <div className="absolute -bottom-1 left-0 w-32 h-[2px] bg-blue-600 shadow-[0_0_15px_#2563eb]"></div>
          </div>

          <div className="grid lg:grid-cols-12 gap-20">

            {/* LEFT SIDE: SERVICE REQUEST (The Terminal) */}
            <div className="lg:col-span-7 space-y-12">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-4 text-white">
                    <Send size={24} className="text-orange-600" /> Service_Request_Uplink
                  </h2>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-2">
                    Direct_Channel // Encrypted_Transmission
                  </p>
                </div>
              </div>

              {form ? (
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-blue-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative bg-black/40 backdrop-blur-3xl border border-white/10 p-10 md:p-16 rounded-[2rem] shadow-2xl overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Zap size={100} className="text-blue-500" />
                      </div>
                      <FormRenderer
                          formId={form.id}
                          formName={form.name}
                          fields={form.fields}
                      />
                    </div>
                  </div>
              ) : (
                  <div className="p-16 border border-red-500/20 bg-red-500/5 rounded-[2rem] text-center backdrop-blur-md">
                    <p className="text-[11px] font-black uppercase text-red-500 tracking-[0.4em] italic animate-pulse">
                      Critical_Error: Form-Engine_Offline
                    </p>
                  </div>
              )}
            </div>

            {/* RIGHT SIDE: OPERATOR IDENTITY (The Data Sheet) */}
            <div className="lg:col-span-5 space-y-10">

              <div className="p-12 border border-white/5 rounded-[2.5rem] bg-black/40 backdrop-blur-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] pointer-events-none"></div>

                <h3 className="text-[10px] font-black uppercase text-blue-500 mb-12 flex items-center gap-4 tracking-[0.5em]">
                  <User size={18} /> Operator_Identity_Module
                </h3>

                <div className="space-y-12">
                  <div className="relative">
                    <p className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.3em] mb-3 italic">
                      Responsible_Entity_§5_TMG
                    </p>
                    <p className="text-2xl text-white font-black italic uppercase tracking-tighter leading-tight">
                      {legalData.name}
                    </p>
                    <p className="text-lg text-blue-500/80 font-black italic uppercase tracking-tighter">
                      {legalData.companyFull}
                    </p>
                  </div>

                  <div className="flex items-start gap-8">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <MapPin size={22} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.3em] mb-2">Postal_Location</p>
                      <p className="text-sm text-zinc-300 font-bold italic uppercase whitespace-pre-line leading-relaxed tracking-widest">
                        {legalData.address}
                      </p>
                      <p className="text-[9px] text-blue-500/50 mt-3 uppercase tracking-[0.4em] font-black">Region: GER // EU_Node_01</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-8">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <ShieldCheck size={22} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.3em] mb-2">Secure_Contact_Gateway</p>
                      <p className="text-sm text-white font-black italic uppercase leading-relaxed tracking-widest hover:text-blue-400 transition-colors cursor-pointer">
                        {legalData.email}
                      </p>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-white/5 grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[8px] font-black uppercase text-zinc-700 mb-2 tracking-widest">Tax_Identifier</p>
                      <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-tighter font-mono">{legalData.taxId}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-zinc-700 mb-2 tracking-widest">VAT_ID_(EU)</p>
                      <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-tighter font-mono">{legalData.vatId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Governance Warning Card */}
              <div className="p-10 border border-blue-500/20 rounded-[2rem] bg-blue-500/5 backdrop-blur-md relative group overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_5s_infinite_linear]"></div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <FileText size={20} className="text-blue-400" />
                  <h3 className="text-[10px] font-black uppercase text-blue-400 tracking-[0.4em]">
                    Governance_Protocols
                  </h3>
                </div>
                <div className="space-y-4 text-[10px] font-bold text-zinc-500 uppercase leading-relaxed tracking-widest relative z-10 italic">
                  <p>
                    Sämtliche Anfragen über das <span className="text-blue-500 font-black">AETHER_Interface</span> unterliegen der Echtzeit-Verschlüsselung.
                  </p>
                  <p>
                    Data_Storage_Protocol: <span className="text-zinc-300">GDPR_Compliant</span> // Node: Germany.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Decorative Background Label */}
        <div className="absolute bottom-10 left-10 text-[100px] font-black uppercase tracking-tighter text-white/[0.02] select-none pointer-events-none">
          AETHER_LEGAL
        </div>
      </div>
  );
}