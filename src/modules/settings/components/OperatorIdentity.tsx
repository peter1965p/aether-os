/**
 * AETHER OS // MODULE: SETTINGS
 * Komponente für die Anzeige der Betreiberdaten (Impressum)
 */

import { getSettings } from '@/modules/inventory/actions';

export default async function OperatorIdentity() {
    const settings = await getSettings();

    return (
        <div className="space-y-6 font-mono">
            <div>
                <h4 className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-1">
                    Verantwortlich nach § 5 TMG
                </h4>
                <p className="text-xl font-black italic uppercase text-white tracking-tighter">
                    {settings?.owner_name || "INHABER FESTLEGEN"}
                </p>
                <p className="text-lg font-bold uppercase text-white/90">
                    {settings?.company_full_name || "FIRMENNAME FESTLEGEN"}
                </p>
            </div>

            <div>
                <h4 className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-1">
                    Postalische Anschrift
                </h4>
                <p className="text-white whitespace-pre-line leading-tight">
                    {settings?.address_full || "STRASSE & HAUSNUMMER\nPLZ & ORT // GERMANY"}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                    <p className="text-[8px] text-gray-500 uppercase font-black">Steuernummer</p>
                    <p className="text-xs text-white">{settings?.tax_number || "FEHLT"}</p>
                </div>
                <div>
                    <p className="text-[8px] text-gray-500 uppercase font-black">USt-IdNr.</p>
                    <p className="text-xs text-white">{settings?.vat_id || "FEHLT"}</p>
                </div>
            </div>
        </div>
    );
}