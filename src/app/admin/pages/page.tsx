import { createClient } from "@/lib/db";
import Link from "next/link";
import { 
  FileText, 
  Edit3, 
  Trash2, 
  Plus,
  ExternalLink,
  Settings2,
  Activity
} from "lucide-react";

interface PageEntry {
  id: number; // In deiner DB ist es ein Integer
  title: string;
  slug: string;
  nav_order: number;
  show_in_nav: boolean;
  is_published: boolean;
}

export default async function PagesManagement() {
  const supabase = await createClient();
  
  // Daten aus dem Kernel laden
  const { data: pages, error } = await supabase
    .from('pages')
    .select('*')
    .order('id', { ascending: true }) as { data: PageEntry[] | null, error: any };

  return (
    <div className="p-8 font-mono max-w-7xl mx-auto min-h-screen bg-[#05070a] text-white">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Activity size={14} className="text-blue-500 animate-pulse" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-bold">
              AETHER OS // CMS MODULE
            </span>
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            DSP <span className="text-blue-600">Nodes</span>
          </h1>
          <p className="text-zinc-600 text-[10px] mt-2 uppercase tracking-widest">
            Verwaltung der dynamischen Seiten-Architektur
          </p>
        </div>

        <button className="group relative overflow-hidden bg-white text-black font-black py-4 px-8 rounded-sm flex items-center gap-3 transition-all hover:pr-12 uppercase text-[10px] tracking-widest">
          <Plus size={16} /> 
          <span>Initialise New Node</span>
          <div className="absolute right-4 translate-x-10 group-hover:translate-x-0 transition-transform">
            <Settings2 size={16} />
          </div>
        </button>
      </div>

      {/* NODES LIST */}
      <div className="bg-zinc-900/10 border border-white/5 rounded-sm overflow-hidden backdrop-blur-sm shadow-2xl">
        
        {/* TABLE HEADER */}
        <div className="grid grid-cols-12 p-4 bg-white/[0.02] border-b border-white/5 text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold">
          <div className="col-span-6 lg:col-span-5 px-4">Entity / Identifier</div>
          <div className="hidden lg:grid col-span-3 text-center">Status / Meta</div>
          <div className="col-span-6 lg:col-span-4 text-right px-4">Actions</div>
        </div>

        <div className="divide-y divide-white/5">
          {pages?.map((page) => (
            <div key={page.id} className="grid grid-cols-12 p-6 items-center hover:bg-white/[0.02] transition-all group border-l-2 border-transparent hover:border-blue-600">
              
              {/* Entity Info */}
              <div className="col-span-6 lg:col-span-5 flex items-center gap-6">
                <div className="relative w-12 h-12 bg-zinc-950 border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                  <FileText size={20} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                  <span className="absolute -top-2 -right-2 text-[8px] bg-blue-600 text-white px-1 font-bold">
                    ID_{page.id}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-wider group-hover:text-blue-400 transition-colors">
                    {page.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter italic">Virtual_Path:</span>
                    <span className="text-[9px] font-mono text-blue-500/80">/{page.slug}</span>
                  </div>
                </div>
              </div>

              {/* Status Tags */}
              <div className="hidden lg:flex col-span-3 items-center justify-center gap-3">
                {page.show_in_nav && (
                  <span className="px-2 py-1 border border-blue-500/20 text-blue-500 text-[8px] font-black uppercase tracking-tighter bg-blue-500/5">
                    Nav_Active
                  </span>
                )}
                <span className={`px-2 py-1 border text-[8px] font-black uppercase tracking-tighter ${
                  page.is_published 
                  ? "border-green-500/20 text-green-500 bg-green-500/5" 
                  : "border-zinc-800 text-zinc-700 bg-zinc-900"
                }`}>
                  {page.is_published ? "Protocol_Live" : "Draft_Mode"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="col-span-6 lg:col-span-4 flex items-center justify-end gap-2 px-2">
                {/* LIVE PREVIEW (Korrekt auf /dsp/[id]) */}
                <Link 
                  href={`/dsp/${page.id}`} 
                  target="_blank"
                  className="p-3 bg-zinc-950 hover:bg-blue-900/20 text-zinc-600 hover:text-blue-400 transition-all border border-white/5"
                  title="Open Preview"
                >
                  <ExternalLink size={14} />
                </Link>

                {/* EDIT ADMIN */}
                <Link 
                  href={`/admin/pages/edit/${page.id}`}
                  className="h-10 px-6 bg-zinc-950 hover:bg-zinc-800 text-white border border-white/10 flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all"
                >
                  <Edit3 size={14} className="text-orange-500" /> 
                  <span className="hidden sm:inline">Modify</span>
                </Link>
                
                {/* DELETE */}
                <button className="w-10 h-10 bg-zinc-950 hover:bg-red-950/40 text-zinc-800 hover:text-red-500 transition-all border border-white/5 flex items-center justify-center">
                  <Trash2 size={14} />
                </button>
              </div>

            </div>
          ))}

          {(!pages || pages.length === 0) && (
            <div className="p-24 text-center border-t border-white/5">
              <div className="inline-block p-4 border border-dashed border-zinc-800 mb-4">
                <FileText size={40} className="text-zinc-900" />
              </div>
              <p className="text-zinc-700 uppercase tracking-[0.5em] text-[10px] font-black italic">
                No Nodes Detected in Central Database
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER DATA */}
      <div className="mt-8 flex justify-between items-center text-[8px] text-zinc-700 uppercase tracking-[0.3em]">
        <div>Aether OS v4.6 // Enterprise Intelligence Hub</div>
        <div>System_Time: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
}