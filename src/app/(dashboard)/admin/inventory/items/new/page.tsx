'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  createFullProduct, 
  getCategories, 
  getSuppliers 
} from '@/modules/inventory/actions';
import { 
  Save, 
  Euro, 
  Percent, 
  Truck, 
  Tag, 
  ArrowLeft,
  Zap,
  Package
} from 'lucide-react';
import Link from 'next/link';

export default function NewItemPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Kaufmännische States
  const [form, setForm] = useState({
    name: '',
    preis: 0,      // Brutto Verkauf
    ek_preis: 0,   // Netto Einkauf
    ust_satz: 19,
    category_id: '',
    supplier_id: ''
  });

  // Daten für Dropdowns laden
  useEffect(() => {
    async function load() {
      const [c, s] = await Promise.all([getCategories(), getSuppliers()]);
      setCategories(c);
      setSuppliers(s);
    }
    load();
  }, []);

  // Berechnung der Marge & Steuer
  const nettoVerkauf = form.preis / (1 + form.ust_satz / 100);
  const marge = nettoVerkauf - form.ek_preis;
  const margeProzent = form.ek_preis > 0 ? (marge / nettoVerkauf) * 100 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await createFullProduct({
      name: form.name,
      preis: form.preis,
      ek_preis: form.ek_preis,
      ust_satz: form.ust_satz,
      category_id: parseInt(form.category_id),
      supplier_id: parseInt(form.supplier_id)
    });

    if (result.success) {
      router.push('/admin/inventory');
      router.refresh();
    } else {
      alert("Error saving product.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <Link href="/admin/inventory" className="text-blue-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors">
            <ArrowLeft size={12} /> Back to Inventory
          </Link>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic text-white">
            NEW <span className="text-blue-500">ARTICLE</span>
          </h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LINKS: Stammdaten & Preise */}
        <div className="lg:col-span-2 space-y-6 bg-[#050505] border border-white/5 p-10 rounded-[3rem] shadow-2xl">
          
          {/* ARTIKEL NAME */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-600 ml-4 tracking-widest">Artikel Bezeichnung</label>
            <input 
              required
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white text-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white/10" 
              placeholder="z.B. Coca Cola 0,5l"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* EK PREIS */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-600 ml-4 tracking-widest flex items-center gap-2">
                <Euro size={12} className="text-blue-500"/> EK-Preis (Netto)
              </label>
              <input 
                type="number" step="0.01" required
                onChange={e => setForm({...form, ek_preis: parseFloat(e.target.value) || 0})}
                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 transition-all" 
              />
            </div>
            {/* VK PREIS */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-600 ml-4 tracking-widest flex items-center gap-2">
                <Euro size={12} className="text-green-500"/> VK-Preis (Brutto)
              </label>
              <input 
                type="number" step="0.01" required
                onChange={e => setForm({...form, preis: parseFloat(e.target.value) || 0})}
                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 transition-all" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* UST-SATZ */}
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-600 ml-4 tracking-widest flex items-center gap-2">
                  <Percent size={12} className="text-purple-500"/> USt-Satz
                </label>
                <select 
                  value={form.ust_satz}
                  onChange={e => setForm({...form, ust_satz: parseInt(e.target.value)})}
                  className="w-full bg-[#0a0a0a] border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="19">19% (Standard / Getränke)</option>
                  <option value="7">7% (Lebensmittel)</option>
                  <option value="0">0% (Steuerfrei)</option>
                </select>
             </div>

             {/* KATEGORIE */}
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-600 ml-4 tracking-widest flex items-center gap-2">
                  <Tag size={12} className="text-orange-500"/> Kategorie
                </label>
                <select 
                  required
                  value={form.category_id}
                  onChange={e => setForm({...form, category_id: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Wählen...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} {cat.type === 'DIGITAL' ? '(⚡)' : '(📦)'}
                    </option>
                  ))}
                </select>
             </div>
          </div>

          {/* LIEFERANT */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-600 ml-4 tracking-widest flex items-center gap-2">
              <Truck size={12} className="text-blue-400"/> Lieferant
            </label>
            <select 
              required
              value={form.supplier_id}
              onChange={e => setForm({...form, supplier_id: e.target.value})}
              className="w-full bg-[#0a0a0a] border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">Wählen...</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* RECHTS: PROFIT ANALYSIS & ACTION */}
        <div className="space-y-6">
          <div className="bg-blue-600/5 border border-blue-500/20 p-10 rounded-[3rem] space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
               <Zap size={80} strokeWidth={3} />
            </div>

            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 relative z-10">Profit_Analysis</h3>
            
            <div className="space-y-1 relative z-10">
              <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Gewinn pro Einheit</p>
              <p className="text-6xl font-black text-white italic tracking-tighter">
                {marge.toFixed(2)}<span className="text-xl ml-1">€</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5 relative z-10">
               <div>
                 <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1">Marge</p>
                 <p className={`text-2xl font-black ${margeProzent > 30 ? 'text-green-500' : 'text-blue-400'}`}>
                   {margeProzent.toFixed(1)}%
                 </p>
               </div>
               <div>
                 <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1">Netto-VK</p>
                 <p className="text-2xl font-black text-white italic">
                   {nettoVerkauf.toFixed(2)}€
                 </p>
               </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-blue-600 text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : <><Save size={20} /> Article_Save</>}
            </button>
          </div>

          <div className="p-8 border border-white/5 rounded-[2.5rem] bg-black/40">
            <p className="text-[9px] text-gray-600 font-bold leading-relaxed uppercase tracking-wider">
              Note: Alle Preise sind Brutto-Endpreise für das POS-Terminal. Die Umsatzsteuer wird automatisch für die Analytics separiert.
            </p>
          </div>
        </div>

      </form>
    </div>
  );
}