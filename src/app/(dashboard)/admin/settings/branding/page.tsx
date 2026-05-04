'use client';

import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/modules/inventory/actions';
import { Save, Shield, Cpu, Activity, CheckCircle } from 'lucide-react';

export default function BrandingSettings() {
  const [settings, setSettings] = useState({
    company_name: '',
    system_name: 'AETHER OS',
    status_line: ''
  });
  const [saved, setSaved] = useState(false);

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
    <div className="max-w-4xl p-8 space-y-10 animate-in fade-in duration-700">
      <header>
        <p className="text-[#444444] text-[10px] font-black tracking-[0.4em] uppercase mb-2">OS_CONFIG // IDENTITY MANAGER</p>
        <h1 className="text-5xl font-black uppercase tracking-tighter italic text-white">
          SYSTEM <span className="text-blue-500">IDENTITY</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-2 flex items-center gap-2">
              <Shield size={12}/> Company Name
            </label>
            <input 
              value={settings.company_name}
              onChange={e => setSettings({...settings, company_name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500 transition-all font-bold"
              placeholder="AETHER COMPANY"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-2 flex items-center gap-2">
              <Cpu size={12}/> OS Designation
            </label>
            <input 
              value={settings.system_name}
              onChange={e => setSettings({...settings, system_name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500 transition-all font-bold"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-2 flex items-center gap-2">
              <Activity size={12}/> Status Stream Text
            </label>
            <input 
              value={settings.status_line}
              onChange={e => setSettings({...settings, status_line: e.target.value})}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500 transition-all text-xs font-mono"
            />
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-4 bg-blue-600 text-black font-black uppercase rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2"
          >
            {saved ? <><CheckCircle size={18}/> IDENTITY_SYNCED</> : <><Save size={18}/> UPDATE_CORE</>}
          </button>
        </div>

        {/* Live Preview im Corporate Design */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-4">Terminal_Output_Preview</h3>
          
          <div className="bg-black border border-white/10 p-10 rounded-[3rem] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Cpu size={60} />
             </div>
             <p className="text-blue-500 text-[8px] font-bold uppercase tracking-[0.4em] mb-2 animate-pulse">
               {settings.status_line || 'SECURE_STREAM // ACTIVE'}
             </p>
             <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-1">
               {settings.company_name || 'AETHER COMPANY'}
             </h2>
             <p className="text-gray-600 text-[10px] font-black tracking-widest uppercase">
               Powered by <span className="text-white">{settings.system_name}</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}