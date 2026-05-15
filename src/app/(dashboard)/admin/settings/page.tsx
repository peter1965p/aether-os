"use client";

import { useState, useEffect } from 'react';
import {
    Shield, Radio, Cpu, Save, Loader2, Scale, Server, Mail, Database,
    Globe, Key, Activity, Send, CreditCard, Zap, Link, Binary, Fingerprint,
    Target, Brain, Landmark, Box, Cloud
} from 'lucide-react';
import { updateGlobalSettings, getGlobalSettings } from '@/lib/actions/settings.actions';

export default function GlobalSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [config, setConfig] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('Financial Gate');

    useEffect(() => {
        async function load() {
            const data = await getGlobalSettings();
            if (data) setConfig(data);
        }
        load();
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSaving(true);
        const formData = new FormData(event.currentTarget);
        try {
            const result = await updateGlobalSettings(formData);
            if (result.success) console.log("AETHER_OS // CORE_SYNC_OK");
        } catch (error) {
            console.error("AETHER_OS // SYNC_FAULT");
        } finally {
            setIsSaving(false);
        }
    }

    if (!config) return (
        <div className="h-screen flex items-center justify-center bg-[#020406]">
            <Loader2 className="animate-spin text-blue-500" size={50} strokeWidth={1} />
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="p-8 space-y-10 font-mono bg-[#020406] min-h-screen text-white relative overflow-hidden">
            
            {/* GRID & GLOW BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,102,255,0.05),transparent_70%)]" />
            </div>

            {/* HEADER */}
            <div className="relative flex justify-between items-end border-b border-white/5 pb-10 z-20">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="h-[2px] w-16 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)]" />
                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.6em]">System // Root // Configuration</p>
                    </div>
                    <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">
                        Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-orange-600 to-blue-600 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">Terminal</span>
                    </h1>
                </div>
                
                <button type="submit" disabled={isSaving} className="relative group px-12 py-5 bg-slate-800 text-blue-900 border-orange-600 rounded-[5px] font-black uppercase italic tracking-widest text-sm overflow-hidden transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <div className="flex items-center gap-4 relative z-10">
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="fill-current" />}
                        Commit System Sync
                    </div>
                    <div className="absolute inset-0 bg-blue-500 translate-x-full group-hover:translate-x-[92%] transition-transform duration-300" />
                </button>
            </div>

            {/* NAVIGATION */}
            <div className="relative z-20 flex gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-white/5">
                <TabButton icon={CreditCard} label="Financial Gate" active={activeTab === 'Financial Gate'} onClick={() => setActiveTab('Financial Gate')} />
                <TabButton icon={Cloud} label="Infrastructure" active={activeTab === 'Infrastructure'} onClick={() => setActiveTab('Infrastructure')} />
                <TabButton icon={Landmark} label="Legal Identity" active={activeTab === 'Legal Identity'} onClick={() => setActiveTab('Legal Identity')} />
                <TabButton icon={Brain} label="Intelligence" active={activeTab === 'Intelligence'} onClick={() => setActiveTab('Intelligence')} />
            </div>

            {/* SECTIONS */}
            <div className="relative z-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* --- 1. FINANCIAL GATE --- */}
                {activeTab === 'Financial Gate' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-5">
                            <TerminalCard title="Protocol Selection" status="READY" color="border-orange-500/40">
                                <div className="space-y-6">
                                    <div className="p-6 bg-white/[0.03] border border-white/5 rounded-sm">
                                        <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-4 block underline decoration-orange-500/30">Active_Gateway</label>
                                        <select name="active_payment_gateway" defaultValue={config.active_payment_gateway || 'stripe'} className="w-full bg-transparent border-b border-orange-500/50 py-2 text-2xl font-black text-orange-500 outline-none uppercase italic cursor-pointer">
                                            <option value="stripe">Stripe_Global</option>
                                            <option value="mollie">Mollie_Legacy</option>
                                        </select>
                                    </div>
                                    <p className="text-[9px] text-zinc-600 font-bold uppercase italic tracking-tighter leading-relaxed">
                                        // Der Kernel schaltet die gesamte Checkout-Logik basierend auf dieser Auswahl um.
                                    </p>
                                </div>
                            </TerminalCard>
                        </div>
                        <div className="lg:col-span-7">
                            <TerminalCard title="Gateway Credentials" status="ENCRYPTED" color="border-blue-500/40">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <p className="text-[10px] text-blue-400 font-black border-b border-blue-500/20 pb-2 uppercase tracking-widest">Stripe_Uplink</p>
                                        <InputGroup name="stripe_public_key" label="Publishable_Key" type="password" value={config.stripe_public_key} icon={Key} />
                                        <InputGroup name="stripe_secret_key" label="Secret_Key" type="password" value={config.stripe_secret_key} icon={Shield} />
                                    </div>
                                    <div className="space-y-6 opacity-40 hover:opacity-100 transition-opacity">
                                        <p className="text-[10px] text-zinc-400 font-black border-b border-white/10 pb-2 uppercase tracking-widest">Mollie_Uplink</p>
                                        <InputGroup name="mollie_live_key" label="Live_Key" type="password" value={config.mollie_live_key} />
                                        <InputGroup name="mollie_test_key" label="Test_Key" type="password" value={config.mollie_test_key} />
                                    </div>
                                </div>
                            </TerminalCard>
                        </div>
                    </div>
                )}

                {/* --- 2. INFRASTRUCTURE (AWS, SUPABASE, RESEND) --- */}
                {activeTab === 'Infrastructure' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-6">
                            <TerminalCard title="Orbital Storage (AWS S3)" status="LINKED" color="border-orange-500/40">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup name="aws_access_key" label="Access_ID" type="password" value={config.aws_access_key} icon={Key} />
                                    <InputGroup name="aws_secret_key" label="Secret_Access" type="password" value={config.aws_secret_key} icon={Shield} />
                                    <InputGroup name="aws_region" label="Region" value={config.aws_region || "eu-central-1"} icon={Globe} />
                                    <InputGroup name="aws_default_bucket" label="Target_Bucket" value={config.aws_default_bucket} icon={Box} />
                                </div>
                            </TerminalCard>
                        </div>
                        <div className="lg:col-span-6 space-y-10">
                            <TerminalCard title="Neural DB (Supabase)" status="CORE_ACTIVE" color="border-emerald-500/40">
                                <div className="space-y-6">
                                    <InputGroup name="supabase_url" label="Endpoint_URL" value={config.supabase_url} icon={Link} />
                                    <InputGroup name="supabase_anon_key" label="Public_Anon_Key" type="password" value={config.supabase_anon_key} />
                                </div>
                            </TerminalCard>
                            <TerminalCard title="Com Uplink (Resend)" status="MAIL_AUTH" color="border-pink-500/40">
                                <InputGroup name="resend_api_key" label="Resend_API_Key" type="password" value={config.resend_api_key} icon={Send} placeholder="re_..." />
                            </TerminalCard>
                        </div>
                    </div>
                )}

                {/* --- 3. LEGAL IDENTITY --- */}
                {activeTab === 'Legal Identity' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-4">
                            <TerminalCard title="Operator Core" status="VERIFIED" color="border-emerald-500/40">
                                <div className="space-y-6">
                                    <InputGroup name="owner_name" label="Legal_Owner" value={config.owner_name} icon={Fingerprint} />
                                    <InputGroup name="company_full_name" label="Entity_Name" value={config.company_full_name} />
                                    <InputGroup name="support_email" label="Contact_Uplink" value={config.support_email} icon={Mail} />
                                </div>
                            </TerminalCard>
                        </div>
                        <div className="lg:col-span-8">
                            <TerminalCard title="Fiscal Configuration" status="COMPLIANT" color="border-blue-500/40">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest block">Physical_Address_Block</label>
                                        <textarea name="address_full" defaultValue={config.address_full} className="w-full h-40 bg-black/50 border border-white/5 p-6 text-xs font-bold text-white outline-none focus:border-blue-500/40 transition-all resize-none" />
                                    </div>
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 gap-6">
                                            <InputGroup name="tax_number" label="Tax_Number" value={config.tax_number} />
                                            <InputGroup name="vat_id" label="VAT_ID" value={config.vat_id} />
                                        </div>
                                        <div className="p-6 bg-blue-500/5 border border-blue-500/20">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase mb-2 text-zinc-500">
                                                <span>Standard_VAT_Threshold</span>
                                                <span className="text-blue-500">{config.vat_standard || 19}%</span>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600 w-[19%]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TerminalCard>
                        </div>
                    </div>
                )}

                {/* --- 4. INTELLIGENCE --- */}
                {activeTab === 'Intelligence' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-5">
                            <TerminalCard title="AI Strategic Matrix" status="ANALYSING" color="border-purple-500/40">
                                <div className="space-y-8">
                                    <InputGroup name="strategy_mode" label="Deployment_Mode" value={config.intel?.strategy_mode} icon={Target} />
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-[9px] font-black uppercase">
                                            <span className="text-zinc-600 tracking-widest">Market_Pulse_Severity</span>
                                            <span className="text-purple-500">{config.intel?.market_pulse || 50}%</span>
                                        </div>
                                        <input type="range" name="market_pulse" min="0" max="100" defaultValue={config.intel?.market_pulse || 50} className="w-full h-1 bg-white/5 appearance-none cursor-pointer accent-purple-500" />
                                    </div>
                                </div>
                            </TerminalCard>
                        </div>
                        <div className="lg:col-span-7">
                            <TerminalCard title="Neural Knowledge Base" status="SYNCED" color="border-cyan-500/40">
                                <textarea name="ai_context_briefing" defaultValue={config.intel?.ai_context_briefing} className="w-full h-[320px] bg-black border border-white/5 p-8 text-[11px] leading-relaxed font-bold text-cyan-500/70 outline-none focus:border-cyan-500/40 transition-all font-mono scrollbar-hide" placeholder="// Enter global system context..." />
                            </TerminalCard>
                        </div>
                    </div>
                )}

            </div>
        </form>
    );
}

// STYLED TERMINAL HELPERS
function TerminalCard({ children, title, status, color }: any) {
    return (
        <div className={`relative bg-[#040608] border border-white/5 border-l-2 ${color} p-10 shadow-2xl overflow-hidden group`}>
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.02),transparent)] pointer-events-none" />
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] italic text-zinc-500">{title}</h3>
                    <div className="flex items-center gap-3">
                        <div className="h-1 w-1 bg-blue-500 rounded-full animate-ping" />
                        <span className="text-[9px] font-black tracking-widest text-blue-500">{status}</span>
                    </div>
                </div>
                {children}
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-[7px] text-white/5 font-black uppercase tracking-[0.5em]">Aether_Core_v4.5 // Encrypted_Terminal_Session</div>
        </div>
    );
}

function InputGroup({ label, type = "text", value, name, icon: Icon, placeholder }: any) {
    return (
        <div className="group space-y-2">
            <div className="flex items-center gap-2 px-1">
                {Icon && <Icon size={10} className="text-zinc-600 group-focus-within:text-blue-500 transition-colors" />}
                <label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest group-focus-within:text-blue-500 transition-colors italic">{label}</label>
            </div>
            <input 
                name={name} 
                type={type} 
                defaultValue={value} 
                placeholder={placeholder}
                className="w-full bg-white/[0.02] border border-white/5 p-4 text-xs font-bold text-white outline-none focus:border-blue-500/30 focus:bg-blue-500/[0.02] transition-all rounded-sm placeholder:text-zinc-800" 
            />
        </div>
    );
}

function TabButton({ icon: Icon, label, active, onClick }: any) {
    return (
        <button type="button" onClick={onClick} className={`group flex items-center gap-4 px-10 py-6 transition-all relative shrink-0 ${active ? 'text-white bg-white/5' : 'text-zinc-600 hover:text-zinc-300'}`}>
            <Icon size={16} className={active ? 'text-blue-500' : 'text-zinc-600'} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">{label}</span>
            {active && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,1)]" />}
        </button>
    );
}