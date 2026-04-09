'use client';

import { useState } from 'react';
import { Truck, Mail, Phone, Plus, ShieldCheck, MoreVertical } from 'lucide-react';

export default function SupplierManagement() {
  const [suppliers] = useState([
    { id: 1, name: 'NEURAL DYNAMICS', contact: 'Dr. Aris Thorne', email: 'orders@neural.dyn', cat: 'Processors', status: 'Top Tier' },
    { id: 2, name: 'AETHER APPAREL', contact: 'Sarah Jenkins', email: 'supply@aether-wear.com', cat: 'Clothing', status: 'Active' },
  ]);

  return (
    <div className="max-w-7xl space-y-12 animate-in fade-in duration-1000">
      <header className="flex justify-between items-end">
        <div>
          <p className="text-[#444] text-[9px] font-black tracking-[0.5em] uppercase mb-2">Partner // Supply_Chain</p>
          <h1 className="text-6xl font-black uppercase tracking-tighter italic text-white leading-none">
            SUPPLIER <span className="text-blue-500">DATABASE</span>
          </h1>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all flex items-center gap-2">
          <Plus size={14} /> Add_New_Provider
        </button>
      </header>

      {/* SUPPLIER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suppliers.map((sup) => (
          <div key={sup.id} className="bg-[#080808] border border-white/5 rounded-[2.5rem] p-8 group hover:border-blue-500/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Truck size={60} />
            </div>
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={12} className="text-blue-500" />
                  <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest">{sup.status}</span>
                </div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{sup.name}</h3>
                <p className="text-[9px] text-gray-600 font-bold uppercase mt-1 tracking-widest">{sup.cat}</p>
              </div>
              <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <MoreVertical size={16} className="text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-500 group-hover:text-white/60 transition-colors">
                  <Mail size={14} />
                  <span className="text-[10px] font-bold uppercase">{sup.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500 group-hover:text-white/60 transition-colors">
                  <Phone size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Secured Line</span>
                </div>
              </div>
              
              <div className="flex flex-col justify-end items-end">
                <button className="text-[9px] font-black text-white/20 uppercase hover:text-blue-500 tracking-[0.2em] transition-colors">
                  View_Full_Contract →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}