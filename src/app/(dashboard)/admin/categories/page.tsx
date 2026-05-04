import { getCategories, deleteCategory } from "@/modules/inventory/actions";
import AddCategoryModal from "@/components/layout/backend/categories/AddCategoryModal";
import { Layers, Trash2, Tag } from 'lucide-react';

// Das hat TypeScript vermisst: Die Definition des Typs
interface Category {
  id: number;
  name: string;
  type: string;
}

export default async function CategoriesPage() {
  const categories = await getCategories() as Category[];

  return (
    <div className="min-h-screen bg-[#030303] text-white p-8 space-y-12 animate-in fade-in duration-700">
      
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <p className="text-[#555] text-[10px] font-black tracking-[0.5em] uppercase mb-2">
            AETHER OS // System Taxonomy
          </p>
          <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">
            Category <span className="text-amber-500">Manager</span>
          </h1>
        </div>
        
        {/* Die verknüpfte Client-Komponente für neue Daten */}
        <AddCategoryModal />
      </header>

      <section className="bg-white/[0.01] border border-white/5 rounded-[48px] overflow-hidden backdrop-blur-3xl">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <h2 className="text-sm font-black uppercase text-white/40 tracking-[0.4em] flex items-center gap-3">
            <Layers size={18} className="text-amber-500" /> DB-CMS2026 // Categories
          </h2>
          <span className="text-[10px] font-black text-green-500 uppercase tracking-widest animate-pulse">
            ● SQL Stream Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black uppercase text-white/20 tracking-widest border-b border-white/5">
                <th className="p-8">UID</th>
                <th className="p-8">Label</th>
                <th className="p-8">System Type</th>
                <th className="p-8 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {categories.map((cat) => (
                <tr key={cat.id} className="group hover:bg-white/[0.01] transition-all">
                  <td className="p-8 text-white/10 font-mono text-xs italic">#{cat.id}</td>
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <Tag size={16} className="text-amber-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                      <span className="font-black uppercase text-sm tracking-tight italic group-hover:text-amber-500 transition-colors">
                        {cat.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-white/40 group-hover:text-white transition-colors">
                      {cat.type}
                    </span>
                  </td>
                  <td className="p-8 text-right">
                    {/* Inline-Action für den Mülleimer */}
                    <form action={async () => {
                      'use server';
                      await deleteCategory(cat.id);
                    }}>
                      <button type="submit" className="p-3 hover:bg-red-500/10 rounded-xl text-white/10 hover:text-red-500 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}