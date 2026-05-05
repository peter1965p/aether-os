/**
 * AETHER OS // GLOBAL SYSTEM SETTINGS (Legal)
 * Stammdaten für Impressum, Shop und System-Branding.
 */

export default function SystemSettingsPage() {
    return (
        <div className="max-w-5xl mx-auto py-10 space-y-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tighter text-white italic">SYSTEM_ROOT // LEGAL</h1>
                <p className="text-red-600/50 text-[10px] font-black uppercase tracking-[0.3em]">Globale Identität & Rechtliches</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Company Card */}
                <div className="bg-[#050505] border border-red-600/10 rounded-[2.5rem] p-8 space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-4">Firmendaten</h3>
                    <div className="space-y-4">
                        <input placeholder="Firmenname" className="w-full bg-black border border-white/5 rounded-xl p-3 text-xs uppercase" />
                        <input placeholder="Inhaber / GF" className="w-full bg-black border border-white/5 rounded-xl p-3 text-xs" />
                        <textarea placeholder="Anschrift (Vollständig)" className="w-full bg-black border border-white/5 rounded-xl p-3 text-xs h-24" />
                    </div>
                </div>

                {/* Tax Card */}
                <div className="bg-[#050505] border border-red-600/10 rounded-[2.5rem] p-8 space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-4">Steuer & Recht</h3>
                    <div className="space-y-4">
                        <input placeholder="Steuernummer" className="w-full bg-black border border-white/5 rounded-xl p-3 text-xs" />
                        <input placeholder="USt-IdNr (VAT)" className="w-full bg-black border border-white/5 rounded-xl p-3 text-xs" />
                        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                            <p className="text-[8px] text-red-500/60 leading-relaxed uppercase font-bold">
                                Achtung: Diese Daten werden automatisch in das Impressum der Hauptseite und alle PDF-Rechnungen übernommen.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}