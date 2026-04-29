"use client";

import { useState, useTransition } from "react";
import { 
  Save, ArrowLeft, LayoutTemplate, Type, AlignLeft, 
  Image as ImageIcon, ExternalLink, Cpu, Trash2, 
  ArrowUp, ArrowDown, Plus 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateAetherPages } from "@/modules/inventory/actions";
import { updatePageIsLandingPage } from "../../actions";

// Types definieren für bessere Stabilität
interface Sector {
  id: string | number;
  title: string;
  subtitle?: string;
  content: string;
  image_url?: string;
  section_type: string;
  order_index: number;
}

export function DSPArchitect({ initialPage }: { initialPage: any }) {
  const [page, setPage] = useState(initialPage);
  const [sections, setSections] = useState<Sector[]>(initialPage.page_sections || []);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Sektor verschieben
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setSections(newSections.map((s, i) => ({ ...s, order_index: i })));
  };

  // Neuen Sektor hinzufügen
  const addSection = () => {
    const newSection: Sector = {
      id: `new-${Math.random().toString(36).substr(2, 9)}`,
      title: "New Sector",
      subtitle: "",
      content: "",
      image_url: "",
      section_type: "Standard",
      order_index: sections.length
    };
    setSections([...sections, newSection]);
  };

  // Sektor löschen
  const removeSection = (id: string | number) => {
    setSections(sections.filter(s => s.id !== id));
  };

  // Landingpage Status umschalten mit UI-Update
  const handleToggleLanding = () => {
    const nextStatus = !page.is_landingpage;
    // Optimistisches UI Update
    setPage({ ...page, is_landingpage: nextStatus });
    
    startTransition(async () => {
      const { success } = await updatePageIsLandingPage(page.id, nextStatus);
      if (!success) {
        // Rollback bei Fehler
        setPage({ ...page, is_landingpage: !nextStatus });
      }
      router.refresh();
    });
  };

  const handleSave = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateAetherPages(formData);
      if (result.success) {
        router.refresh();
      } else {
        console.error("Failed to deploy changes");
      }
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen font-mono text-white">
      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8 sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-6">
          <Link href="/admin/pages" className="p-3 bg-zinc-950 border border-white/10 text-zinc-500 hover:text-white transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-1">
              <Cpu size={12} className="text-blue-500" /> DSP_Architect_v1.0
            </div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">
              {page.title} <span className="text-blue-500">_MOD</span>
            </h1>
          </div>
        </div>
        
        <div className="flex gap-3 items-center">
          <button 
            type="button"
            onClick={handleToggleLanding}
            disabled={isPending}
            className={`px-4 py-3 border text-[9px] uppercase font-black tracking-widest transition-all ${
              page.is_landingpage ? 'border-orange-500 text-orange-500' : 'border-white/5 text-zinc-600'
            }`}
          >
            {page.is_landingpage ? "Active_Home" : "Set_Home"}
          </button>

          <button 
            type="submit"
            form="main-edit-form"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-500 text-white font-black py-3 px-8 flex items-center gap-3 transition-all uppercase text-[10px] tracking-widest"
          >
            <Save size={18} /> {isPending ? "Syncing..." : "Deploy_Changes"}
          </button>
        </div>
      </div>

      <form id="main-edit-form" action={handleSave}>
        <input type="hidden" name="page_id" value={page.id} />
        
        {/* Meta Configuration */}
        <section className="bg-zinc-900/20 border border-white/5 p-8 mb-12">
          <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2 text-blue-500">
            <Type size={14} /> Core_Settings
          </h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[8px] text-zinc-600 uppercase">Page Title</label>
              <input name="title" defaultValue={page.title} className="w-full bg-zinc-950 border border-white/10 p-4 outline-none focus:border-blue-500/50" placeholder="TITLE" />
            </div>
            <div className="space-y-2">
              <label className="text-[8px] text-zinc-600 uppercase">Page Slug</label>
              <input name="slug" defaultValue={page.slug} className="w-full bg-zinc-950 border border-white/10 p-4 text-blue-500 outline-none" placeholder="SLUG" />
            </div>
          </div>
        </section>

        {/* Sector Stream */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={section.id} className="relative group">
              <input type="hidden" name="section_id" value={section.id} />
              
              {/* Sector Controls */}
              <div className="absolute -left-12 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button type="button" onClick={() => moveSection(index, 'up')} className="p-2 bg-zinc-900 border border-white/5 hover:text-blue-500"><ArrowUp size={14}/></button>
                <button type="button" onClick={() => moveSection(index, 'down')} className="p-2 bg-zinc-900 border border-white/5 hover:text-blue-500"><ArrowDown size={14}/></button>
                <button type="button" onClick={() => removeSection(section.id)} className="p-2 bg-zinc-900 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"><Trash2 size={14}/></button>
              </div>

              <div className="bg-zinc-900/10 border border-white/5 p-8 hover:border-blue-500/30 transition-all">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                    <LayoutTemplate size={14} /> Sector_0{index + 1}
                  </div>
                  <select 
                    name={`section_type_${section.id}`}
                    value={section.section_type}
                    onChange={(e) => {
                      const newSections = [...sections];
                      newSections[index].section_type = e.target.value;
                      setSections(newSections);
                    }}
                    className="bg-transparent text-[10px] text-zinc-600 border-none outline-none font-bold cursor-pointer hover:text-white"
                  >
                    <option value="Hero">Hero_Module</option>
                    <option value="Standard">Standard_Module</option>
                    <option value="Grid">Grid_Registry</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[8px] text-zinc-600 uppercase">Sector Title</label>
                      <input 
                        name={`section_title_${section.id}`} 
                        value={section.title}
                        onChange={(e) => {
                          const newSections = [...sections];
                          newSections[index].title = e.target.value;
                          setSections(newSections);
                        }}
                        className="w-full bg-zinc-950/50 border border-white/5 p-4 text-xl font-black italic uppercase outline-none focus:border-blue-500/30" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] text-zinc-600 uppercase">Sector Subtitle</label>
                      <input 
                        name={`section_subtitle_${section.id}`} 
                        value={section.subtitle || ""}
                        onChange={(e) => {
                          const newSections = [...sections];
                          newSections[index].subtitle = e.target.value;
                          setSections(newSections);
                        }}
                        className="w-full bg-zinc-950/50 border border-white/5 p-4 text-sm font-bold uppercase outline-none focus:border-blue-500/30" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[8px] text-zinc-600 uppercase">Content Logic</label>
                    <textarea 
                      name={`section_content_${section.id}`} 
                      value={section.content}
                      onChange={(e) => {
                        const newSections = [...sections];
                        newSections[index].content = e.target.value;
                        setSections(newSections);
                      }}
                      rows={4}
                      className="w-full bg-transparent border-l border-white/5 p-4 text-zinc-400 outline-none focus:border-blue-500/30 font-sans text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[8px] text-zinc-600 uppercase flex items-center gap-2">
                      <ImageIcon size={10} /> Background Image URL
                    </label>
                    <input 
                      name={`section_image_${section.id}`} 
                      value={section.image_url || ""}
                      onChange={(e) => {
                        const newSections = [...sections];
                        newSections[index].image_url = e.target.value;
                        setSections(newSections);
                      }}
                      className="w-full bg-zinc-950/30 border border-white/5 p-3 text-[10px] font-mono text-blue-400/70 outline-none focus:border-blue-500/30" 
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Sector Button */}
          <button 
            type="button"
            onClick={addSection}
            className="w-full py-8 border-2 border-dashed border-white/5 text-zinc-600 hover:border-blue-500/30 hover:text-blue-500 transition-all flex flex-col items-center gap-2 group"
          >
            <Plus className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Initialize_New_Sector</span>
          </button>
        </div>
      </form>
    </div>
  );
}
