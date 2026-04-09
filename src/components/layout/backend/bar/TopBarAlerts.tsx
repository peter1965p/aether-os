'use client';

import { useState, useEffect } from 'react';
import { getLowStockAlerts } from '@/modules/pos/actions';
import { Bell, AlertTriangle, Package } from 'lucide-react';

export default function TopBarAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Initialer Check und Intervall alle 30 Sekunden
    const checkStock = async () => {
      const data = await getLowStockAlerts();
      setAlerts(data);
    };
    
    checkStock();
    const interval = setInterval(checkStock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative font-mono">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all ${
          alerts.length > 0 ? 'bg-orange-500/10 text-orange-500 animate-pulse' : 'text-gray-500 hover:text-white'
        }`}
      >
        <Bell size={18} />
        {alerts.length > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full border-2 border-black" />
        )}
      </button>

      {isOpen && alerts.length > 0 && (
        <div className="absolute right-0 mt-4 w-72 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl p-4 z-[999]">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
            <AlertTriangle size={12} /> System_Warnings
          </div>
          
          <div className="space-y-3">
            {alerts.map((item, i) => (
              <div key={i} className="flex flex-col border-b border-white/5 pb-2">
                <div className="flex justify-between items-center text-[11px] font-bold italic uppercase">
                  <span>{item.name}</span>
                  <span className="text-orange-500">{item.lagerbestand} left</span>
                </div>
                <div className="w-full bg-white/5 h-1 mt-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full" 
                    style={{ width: `${(item.lagerbestand / item.min_bestand) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 text-[9px] uppercase font-black tracking-tighter rounded-lg transition-all">
            Open Inventory Module
          </button>
        </div>
      )}
    </div>
  );
}