/**
 * AETHER OS // SYSTEM ROOT // CONFIG
 * Pfad: /admin/settings
 */

import { Shield, Mail, Radio, Cpu, Save } from 'lucide-react';

export default function GlobalSettingsPage() {
  return (
      <div className="p-10 space-y-12 animate-in fade-in duration-700 font-mono">

        {/* Header & Sub-Nav */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] mb-2">System Root // Config</p>
            <h1 className="text-5xl font-black italic uppercase text-white tracking-tighter">
              Global <span className="text-blue-500 text-glow-blue">Settings</span>
            </h1>
          </div>

          {/* Save Button */}
          <button className="bg-blue-600 hover:bg-blue-500 text-black px-8 py-4 rounded-xl flex items-center gap-3 transition-all group">
            <Save size={18} className="font-black" />
            <span className="font-black uppercase italic tracking-widest">Commit Changes</span>
          </button>
        </div>

        {/* Section Selector Tabs */}
        <div className="flex gap-4 border-b border-white/5 pb-6">
          <TabButton icon={Shield} label="Core Identity" active />
          <TabButton icon={Mail} label="Communication" />
          <TabButton icon={Radio} label="Intelligence" />
          <TabButton icon={Cpu} label="Developer API" />
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* 01 // BRANDING */}
          <div className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center gap-3 text-blue-500">
              <span className="text-[10px] font-black opacity-50">01 //</span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em]">Branding</h3>
            </div>

            <div className="space-y-6">
              <InputGroup label="Company Entity" placeholder="e.g. PAEFFGEN-IT" value="PAEFFGEN-IT" />
              <InputGroup label="System Designation" placeholder="AETHER OS" value="AETHER OS" />
            </div>
          </div>

          {/* 02 // FISCAL CONFIG */}
          <div className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] space-y-8 shadow-2xl">
            <div className="flex items-center gap-3 text-yellow-500">
              <span className="text-[10px] font-black opacity-50">% 02 //</span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em]">Fiscal Config</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="VAT Standard" type="number" value="19" />
              <InputGroup label="VAT Reduced" type="number" value="7" />
            </div>
          </div>

          {/* 03 // HARDWARE GATEWAY */}
          <div className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] space-y-8 shadow-2xl border-l-blue-500/20">
            <div className="flex items-center gap-3 text-purple-500">
              <span className="text-[10px] font-black opacity-50">03 //</span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em]">Hardware Gateway</h3>
            </div>

            <div className="space-y-6">
              <InputGroup label="POS Terminal IP" placeholder="192.168.x.x" />
              <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl flex items-center justify-between">
                <span className="text-[8px] text-blue-500 uppercase font-black">Hardware Uplink: Active</span>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
              </div>
            </div>
          </div>

        </div>
      </div>
  );
}

// Sub-Komponenten für sauberen Code
function InputGroup({ label, placeholder, type = "text", value }: any) {
  return (
      <div className="space-y-2">
        <label className="text-[8px] text-gray-600 uppercase font-black tracking-widest">{label}</label>
        <input
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
      <button className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all ${
          active
              ? 'bg-blue-600 border-blue-600 text-black shadow-[0_0_20px_rgba(37,99,235,0.3)]'
              : 'bg-transparent border-white/10 text-gray-500 hover:border-white/20'
      }`}>
        <Icon size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </button>
  );
}