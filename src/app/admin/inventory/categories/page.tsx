'use client';

import { useState, useEffect } from 'react';
import { getCategories, createCategory } from '@/modules/inventory/actions';
import { Layers, Plus, HardDrive, MousePointer2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'DIGITAL' | 'PHYSICAL'>('PHYSICAL');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      const res = await createCategory(newName, newType);
      if (res.success) {
        setNewName('');
        await loadData();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl p-8 space-y-12 min-h-screen bg-black text-white">
      <header className="flex justify-between items-center">
        <div>
          <Link href="/admin/inventory" className="flex items-center gap-2 text-orange-500 text-[10px] font-black uppercase tracking-widest mb-4 hover:text-white transition-colors">
            <ArrowLeft size={12} /> Back to Inventory
          </Link>
          <h1 className="text-4xl font-black italic uppercase">
            Category <span className="text-orange-500">Manager</span>
          </h1>
        </div>
      </header>

      {/* NEUE KATEGORIE ANLEGEN */}
      <section className="bg-[#050505] border border-white/5 p-8 rounded-[2rem] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black uppercase text-gray-500 ml-2">Category Name</label>
            <input 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. SOFTWARE"
              className="bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black uppercase text-gray-500 ml-2">Inventory Type</label>
            <select 
              value={newType}
              onChange={(e) => setNewType(e.target.value as 'DIGITAL' | 'PHYSICAL')}
              className="bg-[#0a0a0a] border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500"
            >
              <option value="PHYSICAL">Physical (📦 Lagerware (mit Wareneingang))</option>
              <option value="DIGITAL">Digital (⚡ Sofort-Service (Direktbuchung))</option>
            </select>
          </div>
        </div>
        <button 
          onClick={handleAdd}
          disabled={loading}
          className="w-full py-4 bg-orange-600 text-black font-black uppercase rounded-xl hover:bg-white disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Processing...' : <><Plus size={16} /> Create Category</>}
        </button>
      </section>

      {/* LISTE DER KATEGORIEN */}
      <section className="grid gap-4">
        <h2 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] mb-2">Active Categories</h2>
        {categories.length === 0 ? (
          <p className="text-gray-600 italic text-sm">No categories defined yet.</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="bg-[#080808] border border-white/5 p-6 rounded-2xl flex justify-between items-center hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-lg text-orange-500">
                  {cat.type === 'DIGITAL' ? <MousePointer2 size={20} /> : <HardDrive size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">{cat.name}</h3>
                  <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase">{cat.type}</p>
                </div>
              </div>
              <div className="px-4 py-1 border border-white/10 rounded-full text-[8px] font-black text-gray-500 uppercase">
                ID: {cat.id}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}