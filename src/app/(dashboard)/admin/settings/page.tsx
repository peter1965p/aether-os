'use client';

import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/modules/inventory/actions';
import { 
  Shield, Mail, RadioTower, Server, Save, CheckCircle, 
  Plus, Trash2, Smartphone, Percent, Lock, Terminal,
  Cpu, Activity
} from 'lucide-react';

export default function GlobalSettingsPage() {
  const [activeTab, setActiveTab] = useState('core');
  const [saved, setSaved] = useState(false);
  
  // State für die globalen Einstellungen
  const [settings, setSettings] = useState({
    company_name: '',
    system_name: 'AETHER OS',
    vat_standard: '19',
    vat_reduced: '7',
    terminal_ip: '',
    feed_provider: 'AETHER NETWORK',
    sync_interval: '15',
    api_uplink_active: true
  });

  // Mock-Daten für Mail-Accounts und API-Keys
  const [mailAccounts] = useState([
    { id: '1', name: 'Main Relay', user: 'news24regional@gmail.com', type: 'SYSTEM', status: 'active' }
  ]);

  const [apiKeys] = useState([
    { id: '1', name: 'MOBILE_APP_NODE', key: 'ae_live_8829...41x', status: 'active' }
  ]);

  useEffect(() => {
    getSettings().then(data => {
      if (data) setSettings(prev => ({ ...prev, ...data }));
    });
  }, []);

  const handleSave = async () => {
    const res = await updateSettings(settings);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 bg-black min-h-screen text-white">
      {/* HEADER SECTION */}
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <p className="text-[#444444] text-[10px] font-black tracking-[0.4em] uppercase mb-2">System Root // Config</p>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">
            GLOBAL <span className="text-blue-500 text-glow-blue">SETTINGS</span>
          </h1>
        </div>

        {/* GLAS-MORPHISM TAB NAV */}
        <div className="flex bg-[#0a0a0a] border border-white/5 p-1.5 rounded-2xl gap-2 shadow-2xl">
          {[
            { id: 'core', label: 'Core Identity', icon: Shield },
            { id: 'comm', label: 'Communication', icon: Mail },
            { id: 'intel', label: 'Intelligence', icon: RadioTower },
            { id: 'dev', label: 'Developer API', icon: Server }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-blue-600 text-black shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={14}/> {tab.label}
            </button>
          ))}
        </div>

        <button 
          onClick={handleSave}
          className="px-8 py-4 bg-blue-600 text-black font-black uppercase rounded-xl hover:bg-white transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
        >
          {saved ? <><CheckCircle size={18}/> SYNC COMPLETE</> : <><Save size={18}/> COMMIT CHANGES</>}
        </button>
      </header>

      {/* DYNAMIC CONTENT AREA */}
      <div className="space-y-12">
        
        {/* TAB 1: CORE IDENTITY */}
        {activeTab === 'core' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-6 backdrop-blur-xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
                <Shield size={14}/> 01 // Branding
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-600 uppercase ml-1">Company Entity</label>
                  <input value={settings.company_name} onChange={e => setSettings({...settings, company_name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-blue-500" placeholder="e.g. PAEFFGEN-IT" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-600 uppercase ml-1">System Designation</label>
                  <input value={settings.system_name} onChange={e => setSettings({...settings, system_name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white font-mono outline-none focus:border-blue-500" />
                </div>
              </div>
            </section>

            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-6 backdrop-blur-xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
                <Percent size={14}/> 02 // Fiscal Config
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-600 uppercase ml-1">VAT Standard</label>
                  <input type="number" value={settings.vat_standard} onChange={e => setSettings({...settings, vat_standard: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white font-black text-xl outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-600 uppercase ml-1">VAT Reduced</label>
                  <input type="number" value={settings.vat_reduced} onChange={e => setSettings({...settings, vat_reduced: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white font-black text-xl outline-none" />
                </div>
              </div>
            </section>

            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-6 backdrop-blur-xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-purple-500 flex items-center gap-2">
                <Smartphone size={14}/> 03 // Hardware Gateway
              </h3>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-600 uppercase ml-1">POS Terminal IP</label>
                <input value={settings.terminal_ip} onChange={e => setSettings({...settings, terminal_ip: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white font-mono outline-none focus:border-purple-500" placeholder="192.168.x.x" />
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl">
                <Activity size={14} className="text-purple-500 animate-pulse" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Hardware Uplink: Active</span>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: COMMUNICATION */}
        {activeTab === 'comm' && (
          <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-green-500 flex items-center gap-2"><Mail size={14}/> External SMTP Relay</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs col-span-2 outline-none" placeholder="SMTP Host (e.g. mail.aether-os.de)" />
                  <input className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs outline-none" placeholder="Port (587)" />
                  <input className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs outline-none" placeholder="User" />
                </div>
              </section>
              <section className="bg-green-500/5 border border-green-500/10 p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center">
                <Lock size={32} className="text-green-500 mb-4 opacity-50" />
                <h4 className="text-white font-black uppercase italic">Secured Transmission</h4>
                <p className="text-[9px] text-gray-500 uppercase mt-2">AETHER OS uses end-to-end encryption for all external mailing nodes.</p>
              </section>
            </div>

            <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Active Mail Identities</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-black text-[9px] font-black rounded-lg uppercase transition-all hover:bg-white"><Plus size={14}/> Add Account</button>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black text-[9px] font-black text-gray-600 uppercase tracking-widest"><th className="p-6">Type</th><th className="p-6">Identity</th><th className="p-6">Uplink</th><th className="p-6 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5 italic">
                  {mailAccounts.map(acc => (
                    <tr key={acc.id} className="hover:bg-white/[0.02] transition-colors"><td className="p-6"><span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-[8px] font-black rounded uppercase">{acc.type}</span></td><td className="p-6 text-sm font-bold">{acc.user}</td><td className="p-6 text-green-500 text-[9px] font-black uppercase tracking-widest animate-pulse">● Stable</td><td className="p-6 text-right"><button className="text-gray-600 hover:text-red-500"><Trash2 size={16}/></button></td></tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* TAB 3: INTELLIGENCE */}
        {activeTab === 'intel' && (
          <section className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] animate-in fade-in duration-500">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 flex items-center gap-3 mb-8"><RadioTower size={16}/> Intelligence Feed Control</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-600 uppercase ml-1">Feed Source Provider</label>
                <input value={settings.feed_provider} onChange={e => setSettings({...settings, feed_provider: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-600 uppercase ml-1">Sync Cycle (Minutes)</label>
                <input type="number" value={settings.sync_interval} onChange={e => setSettings({...settings, sync_interval: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none" />
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: DEVELOPER API */}
        {activeTab === 'dev' && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem]">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2"><Server size={14}/> API Uplink Control</h3>
                  <p className="text-[9px] text-gray-500 uppercase mt-2 italic">Secure access for external AETHER modules.</p>
                </div>
                <button className="px-6 py-3 bg-blue-600 text-black text-[10px] font-black rounded-xl uppercase hover:bg-white transition-all shadow-lg shadow-blue-500/20">Generate Master Key</button>
              </div>
              <div className="overflow-hidden border border-white/5 rounded-2xl bg-black/40">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[9px] font-black text-gray-600 uppercase tracking-widest">
                    <tr><th className="p-4">Reference</th><th className="p-4">Key Token</th><th className="p-4">Scope</th><th className="p-4 text-right">Status</th></tr>
                  </thead>
                  <tbody>
                    {apiKeys.map(key => (
                      <tr key={key.id} className="text-xs border-t border-white/5 group">
                        <td className="p-4 font-bold text-white uppercase tracking-tighter">{key.name}</td>
                        <td className="p-4 font-mono text-gray-500 group-hover:text-blue-400 transition-colors">{key.key}</td>
                        <td className="p-4"><span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[8px] font-black uppercase tracking-widest">Full_Access</span></td>
                        <td className="p-4 text-right text-green-500 font-black text-[9px] uppercase tracking-widest">Authorized</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* QUICK API DOCS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-[2.5rem] space-y-4">
                <h4 className="text-white font-black uppercase italic tracking-tighter flex items-center gap-2"><Terminal size={16}/> API Reference</h4>
                <div className="space-y-2">
                  <div className="flex gap-4 p-3 bg-black/40 rounded-lg border border-white/5 text-[10px] font-mono group hover:border-blue-500/50 transition-colors cursor-pointer">
                    <span className="text-green-500 font-black">GET</span>
                    <span className="text-gray-300">/api/v1/inventory</span>
                    <span className="ml-auto text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">Copy Endpoint</span>
                  </div>
                  <div className="flex gap-4 p-3 bg-black/40 rounded-lg border border-white/5 text-[10px] font-mono group hover:border-blue-500/50 transition-colors cursor-pointer">
                    <span className="text-orange-500 font-black">POST</span>
                    <span className="text-gray-300">/api/v1/messages/send</span>
                    <span className="ml-auto text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">Copy Endpoint</span>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] flex flex-col justify-center items-center text-center">
                <Cpu size={32} className="text-gray-600 mb-4" />
                <p className="text-[10px] text-gray-500 uppercase font-black leading-relaxed tracking-widest">
                  System Version: AETHER OS v4.3 PLATINIUM <br /> 
                  Kernel Build: 2026.04.08.REL
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}