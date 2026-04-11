import { createClient } from "@/lib/db";
import Link from "next/link";
import { 
  FileText, 
  Edit3, 
  Trash2, 
  Plus,
  ExternalLink 
} from "lucide-react";

interface PageEntry {
  id: string;
  title: string;
  slug: string;
  nav_order: number;
  show_in_nav: boolean;
  is_published: boolean;
}

export default async function PagesManagement() {
  const supabase = await createClient();
  
  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .order('nav_order', { ascending: true }) as { data: PageEntry[] | null };

  return (
    <div className="p-8 font-sans max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Seitenverwaltung
          </h1>
          <p className="text-zinc-500 text-[10px] mt-1 uppercase tracking-[0.3em] font-bold">
            Structure & Core Nodes // AETHER OS
          </p>
        </div>
        {/* Link zur Erstellung (muss noch gebaut werden) */}
        <button className="bg-[#1e5d9c] hover:bg-blue-500 text-white font-black py-4 px-8 rounded-2xl flex items-center gap-3 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.3)] uppercase text-[10px] tracking-widest">
          <Plus size={18} /> Neue Seite initialisieren
        </button>
      </div>

      <div className="bg-zinc-950/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="divide-y divide-white/5">
          {pages?.map((page) => (
            <div key={page.id} className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-all group">
              
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-600 group-hover:text-blue-500 transition-colors border border-white/5">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-wider">{page.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono text-zinc-600 uppercase italic">Path:</span>
                    <span className="text-[9px] font-mono text-blue-500/80">/{page.slug}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {page.show_in_nav && (
                  <span className="px-3 py-1 bg-blue-500/5 border border-blue-500/10 text-blue-500 text-[8px] font-black uppercase rounded-md tracking-tighter">
                    Main Navigation
                  </span>
                )}
                <span className={`px-3 py-1 border text-[8px] font-black uppercase rounded-md tracking-tighter ${
                  page.is_published 
                  ? "bg-green-500/5 border-green-500/10 text-green-500" 
                  : "bg-zinc-900 border-zinc-800 text-zinc-700"
                }`}>
                  {page.is_published ? "Live" : "Draft"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Direkt-Link zur Live-Ansicht */}
                <Link 
                  href={`/${page.slug}`} 
                  target="_blank"
                  className="p-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 rounded-xl transition-all border border-white/5"
                  title="Vorschau"
                >
                  <ExternalLink size={14} />
                </Link>

                <Link 
                  href={`/admin/pages/edit/${page.id}`}
                  className="h-12 px-6 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
                >
                  <Edit3 size={14} className="text-orange-500" /> Bearbeiten
                </Link>
                
                <button className="w-12 h-12 bg-zinc-900 hover:bg-red-950/30 text-zinc-700 hover:text-red-500 rounded-xl flex items-center justify-center transition-all border border-white/5">
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}

          {(!pages || pages.length === 0) && (
            <div className="p-20 text-center">
              <p className="text-zinc-600 uppercase tracking-[0.3em] text-[10px] font-black italic">No Nodes Detected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}