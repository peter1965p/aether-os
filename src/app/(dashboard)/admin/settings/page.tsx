/**
 * AETHER OS // GLOBAL SETTINGS TERMINAL
 * Pfad: /src/app/admin/settings/page.tsx
 *
 * Diese Komponente dient als zentrale Konfigurationsinstanz.
 * Alle rechtlichen Daten (Inhaber, Anschrift, E-Mail) sind nun im Legal-Tab gebündelt.
 */

"use client";

import { useState, useEffect } from 'react';
import {
    Shield,
    Radio,
    Cpu,
    Save,
    Loader2,
    Scale,
    MapPin,
    Server,
    Mail
} from 'lucide-react';
import { updateGlobalSettings, getGlobalSettings } from '@/lib/actions/settings.actions';

export default function GlobalSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [config, setConfig] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('Legal Identity');

    // Daten-Fetch beim Initialisieren
    useEffect(() => {
        async function load() {
            const data = await getGlobalSettings();
            if (data) setConfig(data);
        }
        load();
    }, []);

    // Speichern der Änderungen via Server Action
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSaving(true);

        const formData = new FormData(event.currentTarget);

        try {
            const result = await updateGlobalSettings(formData);
            if (result.success) {
                console.log("AETHER OS // System Sync: OK");
            }
        } catch (error) {
            console.error("AETHER OS // Sync Error:", error);
        } finally {
            setIsSaving(false);
        }
    }

    if (!config) return (
        <div className="h-screen flex items-center justify-center bg-[#05070a]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">Booting Kernel Settings...</p>
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="p-10 space-y-12 animate-in fade-in duration-700 font-mono bg-[#05070a] min-h-screen text-white">

            {/* HEADER SECTION */}
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] mb-2">System Root // Config</p>
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter">
                        Global <span className="text-blue-500 text-glow-blue">Settings</span>
                    </h1>
                </div>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-500 text-black px-8 py-4 rounded-xl flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-600/20"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    <span className="font-black uppercase italic tracking-widest text-xs">Commit Changes</span>
                </button>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <TabButton
                    icon={Scale}
                    label="Legal Identity"
                    active={activeTab === 'Legal Identity'}
                    onClick={() => setActiveTab('Legal Identity')}
                />
                <TabButton
                    icon={Shield}
                    label="Core Identity"
                    active={activeTab === 'Core Identity'}
                    onClick={() => setActiveTab('Core Identity')}
                />
                <TabButton
                    icon={Radio}
                    label="Intelligence"
                    active={activeTab === 'Intelligence'}
                    onClick={() => setActiveTab('Intelligence')}
                />
                <TabButton
                    icon={Cpu}
                    label="Developer API"
                    active={activeTab === 'Developer API'}
                    onClick={() => setActiveTab('Developer API')}
                />
            </div>

            {/* CONTENT AREA */}
            <div className="animate-in slide-in-from-bottom-2 duration-500">

                {/* TAB: LEGAL IDENTITY (Konsolidiert) */}
                {activeTab === 'Legal Identity' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <SectionCard title="Operator Details" iconColor="text-emerald-500" index="L1">
                            <InputGroup name="owner_name" label="Legal Owner / Inhaber" value={config.owner_name} />
                            <InputGroup name="company_full_name" label="Full Company Name" value={config.company_full_name} />
                            <InputGroup
                                name="support_email"
                                label="Official Contact Email"
                                value={config.support_email}
                                placeholder="mail@company.de"
                                icon={Mail}
                            />
                        </SectionCard>

                        <SectionCard title="Location & Tax" iconColor="text-blue-400" index="L2">
                            <div className="space-y-2">
                                <label className="text-[8px] text-zinc-600 uppercase font-black tracking-widest text-glow-blue">Postal Address (Multiline)</label>
                                <textarea
                                    name="address_full"
                                    defaultValue={config.address_full}
                                    placeholder="Straße 1&#10;12345 Stadt"
                                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-blue-500 outline-none transition-all font-bold resize-none shadow-inner"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <InputGroup name="tax_number" label="Tax Number" value={config.tax_number} />
                                <InputGroup name="vat_id" label="VAT ID (USt-IdNr)" value={config.vat_id} />
                            </div>
                        </SectionCard>
                    </div>
                )}

                {/* TAB: CORE IDENTITY */}
                {activeTab === 'Core Identity' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <SectionCard title="Branding" iconColor="text-blue-500" index="01">
                            <InputGroup name="company_name" label="Company Entity" value={config.company_name} />
                            <InputGroup name="system_designation" label="System Designation" value={config.system_designation} />
                        </SectionCard>

                        <SectionCard title="Fiscal Config" iconColor="text-yellow-500" index="02">
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup name="vat_standard" label="VAT Standard %" type="number" value={config.vat_standard || 19} />
                                <InputGroup name="vat_reduced" label="VAT Reduced %" type="number" value={config.vat_reduced || 7} />
                            </div>
                        </SectionCard>

                        <SectionCard title="Infrastructure" iconColor="text-purple-500" index="03">
                            <InputGroup name="pos_ip" label="POS IP Gateway" placeholder="192.168.x.x" value={config.pos_ip} />
                            <InputGroup name="smtp_host" label="SMTP Server" placeholder="smtps.server.de" value={config.smtp_host} />
                        </SectionCard>
                    </div>
                )}

                {/* TAB: INTELLIGENCE */}
                {activeTab === 'Intelligence' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <SectionCard title="AI Strategy" iconColor="text-orange-500" index="AI">
                            <InputGroup name="strategy_mode" label="Strategy Mode" value={config.intel?.strategy_mode} />
                            <div className="space-y-2">
                                <label className="text-[8px] text-zinc-600 uppercase font-black tracking-widest">Market Pulse Severity</label>
                                <input
                                    type="range"
                                    name="market_pulse"
                                    min="0"
                                    max="100"
                                    defaultValue={config.intel?.market_pulse || 50}
                                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                            </div>
                        </SectionCard>
                        <SectionCard title="Context Briefing" iconColor="text-blue-500" index="AI-C">
                            <textarea
                                name="ai_context_briefing"
                                defaultValue={config.intel?.ai_context_briefing}
                                placeholder="Enter semantic context briefing..."
                                className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-zinc-300 focus:border-blue-500 outline-none transition-all font-mono font-bold resize-none"
                            />
                        </SectionCard>
                    </div>
                )}

                {/* TAB: DEVELOPER API */}
                {activeTab === 'Developer API' && (
                    <div className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] space-y-8 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <Cpu className="text-purple-500" size={16} />
                            <h3 className="text-purple-500 text-xs font-black uppercase tracking-widest">System Access Keys</h3>
                        </div>
                        <InputGroup name="api_key" label="Master API Key" type="password" value="************************" />
                    </div>
                )}
            </div>
        </form>
    );
}

/**
 * HILFS-KOMPONENTEN
 */

function SectionCard({ children, title, iconColor, index }: any) {
    return (
        <div className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] space-y-8 shadow-2xl hover:border-white/10 transition-colors">
            <div className={`flex items-center gap-3 ${iconColor}`}>
                <span className="text-[10px] font-black opacity-50">{index} //</span>
                <h3 className="text-xs font-black uppercase tracking-[0.3em]">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function InputGroup({ label, placeholder, type = "text", value, name, icon: Icon }: any) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                {Icon && <Icon size={10} className="text-zinc-500" />}
                <label className="text-[8px] text-zinc-600 uppercase font-black tracking-widest">{label}</label>
            </div>
            <input
                name={name}
                type={type}
                defaultValue={value}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-blue-500 outline-none transition-all font-bold"
            />
        </div>
    );
}

function TabButton({ icon: Icon, label, active, onClick }: any) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all shrink-0 active:scale-95 ${
                active
                    ? 'bg-blue-600 border-blue-600 text-black shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                    : 'bg-transparent border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300'
            }`}
        >
            <Icon size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </button>
    );
}