/**
 * AETHER OS // SYSTEM ROOT // CONFIG
 * Pfad: /admin/settings/page.tsx
 */
"use client";

import { useState, useEffect } from 'react';
import { Shield, Mail, Radio, Cpu, Save, Palette, Loader2 } from 'lucide-react';
import { updateGlobalSettings, getGlobalSettings } from '@/lib/actions/settings.actions';

export default function GlobalSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<any>(null);

  // Initiales Laden der System-Konfiguration
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
    const result = await updateGlobalSettings(formData);

    if (result.success) {
      // Optional: Ein Sound-Effekt oder Toast-Nachricht für AETHER OS Feeling
      console.log(result.message);
    }
    setIsSaving(false);
  }

  if (!config) return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
  );

  return (
      <form onSubmit={handleSubmit} className="p-10 space-y-12 animate-in fade-in duration-700 font-mono">

        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] mb-2">System Root // Config</p>
            <h1 className="text-5xl font-black italic uppercase text-white tracking-tighter">
              Global <span className="text-blue-500 text-glow-blue">Settings</span>
            </h1>
          </div>

          <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-black px-8 py-4 rounded-xl flex items-center gap-3 transition-all group"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span className="font-black uppercase italic tracking-widest">
              {isSaving ? "Syncing..." : "Commit Changes"}
            </span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-white/5 pb-6">
          <TabButton icon={Shield} label="Core Identity" active />
          <TabButton icon={Mail} label="Communication" />
          <TabButton icon={Radio} label="Intelligence" />
          <TabButton icon={Cpu} label="Developer API" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* 01 // BRANDING & COLORS */}
          <div className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center gap-3 text-blue-500">
              <span className="text-[10px] font-black opacity-50">01 //</span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em]">Branding</h3>
            </div>

            <div className="space-y-6">
              <InputGroup name="company" label="Company Entity" value={config.company_name} />
              <InputGroup name="designation" label="System Designation" value={config.system_designation} />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[8px] text-zinc-600 uppercase font-black tracking-widest flex items-center gap-2">
                    <Palette size={10} /> Primary
                  </label>
                  <input name="primary_color" type="color" defaultValue={config.primary_color} className="w-full h-12 bg-transparent border border-white/10 rounded-xl cursor-pointer" />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] text-zinc-600 uppercase font-black tracking-widest flex items-center gap-2">
                    <Palette size={10} /> Secondary
                  </label>
                  <input name="secondary_color" type="color" defaultValue={config.secondary_color} className="w-full h-12 bg-transparent border border-white/10 rounded-xl cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          {/* 02 // FISCAL CONFIG */}
          <div className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] space-y-8 shadow-2xl">
            <div className="flex items-center gap-3 text-yellow-500">
              <span className="text-[10px] font-black opacity-50">% 02 //</span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em]">Fiscal Config</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup name="vat_standard" label="VAT Standard" type="number" value={config.vat_standard} />
              <InputGroup name="vat_reduced" label="VAT Reduced" type="number" value={config.vat_reduced} />
            </div>
          </div>

          {/* 03 // HARDWARE GATEWAY */}
          <div className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] space-y-8 shadow-2xl">
            <div className="flex items-center gap-3 text-purple-500">
              <span className="text-[10px] font-black opacity-50">03 //</span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em]">Hardware Gateway</h3>
            </div>

            <div className="space-y-6">
              <InputGroup name="pos_ip" label="POS Terminal IP" placeholder="192.168.x.x" />
              <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl flex items-center justify-between">
                <span className="text-[8px] text-blue-500 uppercase font-black">Uplink: {config.primary_color ? 'Active' : 'Offline'}</span>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
              </div>
            </div>
          </div>

        </div>
      </form>
  );
}

// Hilfs-Komponenten
function InputGroup({ label, placeholder, type = "text", value, name }: any) {
  return (
      <div className="space-y-2">
        <label className="text-[8px] text-zinc-600 uppercase font-black tracking-widest">{label}</label>
        <input
            name={name}
            type={type}
            defaultValue={value}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
        />
      </div>
  );
}

function TabButton({ icon: Icon, label, active }: any) {
  return (
      <button type="button" className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all ${
          active
              ? 'bg-blue-600 border-blue-600 text-black shadow-[0_0_20px_rgba(37,99,235,0.3)]'
              : 'bg-transparent border-white/10 text-zinc-500 hover:border-white/20'
      }`}>
        <Icon size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </button>
  );
}