import { createClient } from "@/lib/db";
import Link from "next/link";
import {
  FileText,
  Edit3,
  Plus,
  ExternalLink,
  Settings2,
  Activity
} from "lucide-react";
import { LandingPageToggle } from "./LandingPageToggle"; 
import { DeletePageButton } from "@/components/admin/DeletePageButton";

interface PageEntry {
  id: number;
  title: string;
  slug: string;
  nav_order: number;
  show_in_nav: boolean;
  is_published: boolean;
  is_landingpage: boolean;
}

export default async function PagesManagement() {
  const supabase = await createClient();

  // Daten aus dem Kernel laden
  const { data: pages, error } = await supabase
      .from('pages')
      .select('*')
      .order('id', { ascending: true }) as { data: PageEntry[] | null, error: any };

  return (
      <div className="p-12 font-mono max-w-7xl mx-auto min-h-screen bg-[#020406] text-zinc-300 selection:bg-blue-500/30">

        {/* HEADER SECTION WITH CLEAN SPACE */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8 border-b border-white/5 pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Activity size={14} className="text-blue-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-black">
                AETHER OS // CMS MODULE
              </span>
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
              DSP{" "}
              <span className="bg-gradient-to-r from-orange-500 via-cyan-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(234,88,12,0.5)] pr-2">
                Nodes
              </span>
            </h1>
            <p className="text-zinc-600 text-[11px] uppercase tracking-widest font-bold">
              Verwaltung der dynamischen Seiten-Architektur
            </p>
          </div>

          <button className="group relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white font-black py-4 px-8 rounded-[3px] flex items-center gap-4 transition-all border border-orange-500/30 shadow-[0_0_30px_rgba(234,88,12,0.25)] uppercase text-[10px] tracking-widest self-stretch sm:self-auto">
            <Plus size={16} />
            <span>Initialise New Node</span>
            <div className="absolute right-4 translate-x-10 group-hover:translate-x-0 transition-transform duration-300">
              <Settings2 size={16} />
            </div>
          </button>
        </div>

        {/* NODES LIST CONTAINER */}
        <div className="bg-zinc-950/40 border border-white/5 rounded-[6px] overflow-hidden shadow-2xl relative backdrop-blur-md">
          
          {/* Matrix Tech-Ecken */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-700" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-700" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-700" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-700" />

          {/* TABLE HEADER (STRENGES ALIGNMENT) */}
          <div className="grid grid-cols-12 p-5 bg-white/[0.02] border-b border-white/5 text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold items-center">
            <div className="col-span-12 md:col-span-5 px-2">Entity / Identifier</div>
            <div className="hidden md:block col-span-4 text-center">Status / Operational Meta</div>
            <div className="hidden md:block col-span-3 text-right px-4">Actions</div>
          </div>

          {/* TABLE ROWS */}
          <div className="divide-y divide-white/5">
            {pages?.map((page) => {
                const previewPath = page.is_landingpage ? "/" : `/${page.slug}`;

                return (
                <div
                    key={page.id}
                    className={`grid grid-cols-12 p-6 items-center gap-4 hover:bg-white/[0.01] transition-all group border-l-2 ${
                        page.is_landingpage
                            ? "border-orange-500 bg-orange-500/[0.02]"
                            : "border-transparent hover:border-blue-600"
                    }`}
                >

                  {/* Column 1: Ident / Title (Sicher verpackt gegen Layout-Sprengung) */}
                  <div className="col-span-12 md:col-span-5 flex items-center gap-5 min-w-0">
                    <div className={`relative shrink-0 w-12 h-12 bg-black border flex items-center justify-center transition-colors rounded-[4px] ${
                        page.is_landingpage ? "border-orange-500/40" : "border-white/10 group-hover:border-blue-500/40"
                    }`}>
                      <FileText
                          size={18}
                          className={page.is_landingpage ? "text-orange-500" : "text-zinc-600 group-hover:text-blue-500"}
                      />
                      <span className={`absolute -top-2 -right-2 text-[8px] px-1.5 py-0.5 font-bold tracking-tight rounded-[2px] ${
                          page.is_landingpage ? "bg-orange-600 text-white" : "bg-blue-600 text-white"
                      }`}>
                        ID_{page.id}
                      </span>
                    </div>
                    
                    <div className="truncate">
                      <h3 className={`font-black text-sm uppercase tracking-wider truncate transition-colors ${
                          page.is_landingpage ? "text-orange-400" : "text-white group-hover:text-blue-400"
                      }`}>
                        {page.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 truncate">
                        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter italic shrink-0">Virtual_Path:</span>
                        <span className="text-[9px] font-mono text-blue-400/80 font-bold truncate">{previewPath}</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Status Toggles & Badges (Zentriert & Clean) */}
                  <div className="col-span-12 sm:col-span-7 md:col-span-4 flex items-center justify-start md:justify-center gap-3 flex-wrap">
                    <LandingPageToggle
                      pageId={page.id}
                      initialIsLandingPage={page.is_landingpage}
                    />

                    {page.show_in_nav && (
                        <span className="px-2.5 py-1 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest bg-blue-500/5 rounded-[2px]">
                          Nav_Active
                        </span>
                    )}

                    <span className={`px-2.5 py-1 border text-[8px] font-black uppercase tracking-widest rounded-[2px] ${
                        page.is_published
                            ? "border-green-500/20 text-green-400 bg-green-500/5"
                            : "border-zinc-800 text-zinc-600 bg-zinc-900/40"
                    }`}>
                      {page.is_published ? "Protocol_Live" : "Draft_Mode"}
                    </span>
                  </div>

                  {/* Column 3: Action Buttons (Sauber rechtsbündig gefangen) */}
                  <div className="col-span-12 sm:col-span-5 md:col-span-3 flex items-center justify-end gap-2 w-full">
                    <Link
                        href={previewPath}
                        target="_blank"
                        className="p-3 bg-zinc-950 hover:bg-blue-950/60 text-zinc-500 hover:text-blue-400 transition-all border border-white/5 rounded-[3px] hover:border-blue-500/30 focus:outline-none"
                        title="Open Live Node Preview"
                    >
                      <ExternalLink size={14} />
                    </Link>

                    <Link
                        href={`/admin/pages/edit/${page.id}`}
                        className="h-10 px-5 bg-zinc-950 hover:bg-zinc-900 text-white border border-white/10 flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all rounded-[3px] hover:border-orange-500/40 shrink-0"
                    >
                      <Edit3 size={12} className="text-orange-500" />
                      <span>Modify</span>
                    </Link>

                    <div className="shrink-0">
                      <DeletePageButton pageId={page.id} title={page.title}/>
                    </div>
                  </div>

                </div>
              );
            })}

            {(!pages || pages.length === 0) && (
                <div className="p-24 text-center border-t border-white/5">
                  <div className="inline-block p-4 border border-dashed border-zinc-800 mb-4">
                    <FileText size={40} className="text-zinc-800" />
                  </div>
                  <p className="text-zinc-600 uppercase tracking-[0.5em] text-[10px] font-black italic">
                    No Nodes Detected in Central Database
                  </p>
                </div>
            )}
          </div>
        </div>

        {/* FOOTER DATA */}
        <div className="mt-12 flex justify-between items-center text-[9px] text-zinc-700 uppercase tracking-[0.3em] border-t border-white/5 pt-6">
          <div>Aether OS v4.6 // Enterprise Intelligence Hub</div>
          <div>System_Time: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
  );
}