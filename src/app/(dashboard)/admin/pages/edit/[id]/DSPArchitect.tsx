"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Save, ArrowLeft, LayoutTemplate, Type, AlignLeft,
  Image as ImageIcon, ExternalLink, Cpu, Trash2,
  ArrowUp, ArrowDown, Plus, Send, Settings2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import db from "@/lib/db";
import { updateAetherPages } from "@/modules/inventory/actions";
import { updatePageIsLandingPage } from "../../actions";

// --- NEUE IMPORTS FÜR DIE KI ---
import { ComplianceGuard } from "@/modules/admin/components/ComplianceGuard";
import { getSystemIdentity } from "@/lib/identity";

// --- TYPES ---
interface Sector {
  id: string | number;
  title: string;
  subtitle?: string;
  content: string;
  image_url?: string;
  section_type: string;
  order_index: number;
}

interface FormLibraryItem {
  name: string;
  slug: string;
}

export function DSPArchitect({ initialPage }: { initialPage: any }) {
  // State für die Seite (wird jetzt live aktualisiert für die KI)
  const [page, setPage] = useState(initialPage);
  const [sections, setSections] = useState<Sector[]>(initialPage.page_sections || []);
  const [availableForms, setAvailableForms] = useState<FormLibraryItem[]>([]);
  const [systemIdentity, setSystemIdentity] = useState<any>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // --- INITIAL DATA FETCH (Forms & Identity) ---
  useEffect(() => {
    async function initData() {
      const [{ data: formsData }, identityData] = await Promise.all([
        db.from("forms").select("name, slug"),
        getSystemIdentity()
      ]);

      if (formsData) setAvailableForms(formsData);
      if (identityData) setSystemIdentity(identityData);
    }
    initData();
  }, []);

  // --- SECTOR LOGIC ---
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setSections(newSections.map((s, i) => ({ ...s, order_index: i })));
  };

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

  const removeSection = (id: string | number) => {
    setSections(sections.filter(s => s.id !== id));
  };

  // --- ACTIONS ---
  const handleToggleLanding = () => {
    const nextStatus = !page.is_landingpage;
    setPage({ ...page, is_landingpage: nextStatus });

    startTransition(async () => {
      const { success } = await updatePageIsLandingPage(page.id, nextStatus);
      if (!success) setPage({ ...page, is_landingpage: !nextStatus });
      router.refresh();
    });
  };

  const handleSave = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateAetherPages(formData);
      if (result.success) {
        router.refresh();
      } else {
        console.error("AETHER // Deployment Failed");
      }
    });
  };

  return (
      <div className="p-8 max-w-5xl mx-auto min-h-screen font-mono text-white">

        {/* HEADER BAR */}
        <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8 sticky top-0 bg-black/80 backdrop-blur-md z-50">
          <div className="flex items-center gap-6">
            <Link href="/admin/pages" className="p-3 bg-zinc-950 border border-white/10 text-zinc-500 hover:text-white transition-all rounded-xl">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-1">
                <Cpu size={12} className="text-blue-500" /> DSP_Architect_v1.2 // Sector_Flow
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
                className={`px-4 py-3 border text-[9px] uppercase font-black tracking-widest transition-all rounded-xl ${
                    page.is_landingpage ? 'border-orange-500 text-orange-500 bg-orange-500/5' : 'border-white/5 text-zinc-600 hover:border-white/20'
                }`}
            >
              {page.is_landingpage ? "Active_Home" : "Set_Home"}
            </button>

            <button
                type="submit"
                form="main-edit-form"
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-500 text-white font-black py-3 px-8 flex items-center gap-3 transition-all uppercase text-[10px] tracking-widest rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              <Save size={18} /> {isPending ? "Deploying..." : "Deploy_Changes"}
            </button>
          </div>
        </div>

        <form id="main-edit-form" action={handleSave}>
          <input type="hidden" name="page_id" value={page.id} />

          {/* ⚡️ AI COMPLIANCE GUARD (Analysiert Title, Slug und Sektoren) ⚡️ */}
          <ComplianceGuard
              page={page}
              sections={sections}
              identity={systemIdentity}
          />

          {/* CORE SETTINGS */}
          <section className="bg-zinc-900/20 border border-white/5 p-8 mb-12 rounded-3xl backdrop-blur-sm">
            <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2 text-blue-500">
              <Settings2 size={14} /> Core_Settings
            </h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[8px] text-zinc-600 uppercase tracking-widest">Page Title</label>
                <input
                    name="title"
                    value={page.title}
                    onChange={(e) => setPage({...page, title: e.target.value})}
                    className="w-full bg-zinc-950 border border-white/10 p-4 outline-none focus:border-blue-500/50 rounded-xl font-bold uppercase"
                    placeholder="TITLE"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] text-zinc-600 uppercase tracking-widest">Page Slug</label>
                <input
                    name="slug"
                    value={page.slug}
                    onChange={(e) => setPage({...page, slug: e.target.value})}
                    className="w-full bg-zinc-950 border border-white/10 p-4 text-blue-500 outline-none rounded-xl font-mono"
                    placeholder="SLUG"
                />
              </div>
            </div>
          </section>

          {/* SECTOR STREAM */}
          <div className="space-y-8">
            {sections.map((section, index) => (
                <div key={section.id} className="relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <input type="hidden" name="section_id" value={section.id} />

                  {/* Floating Controls */}
                  <div className="absolute -left-14 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                    <button type="button" onClick={() => moveSection(index, 'up')} className="p-2 bg-zinc-900 border border-white/10 rounded-lg hover:text-blue-500 transition-colors"><ArrowUp size={14}/></button>
                    <button type="button" onClick={() => moveSection(index, 'down')} className="p-2 bg-zinc-900 border border-white/10 rounded-lg hover:text-blue-500 transition-colors"><ArrowDown size={14}/></button>
                    <button type="button" onClick={() => removeSection(section.id)} className="p-2 bg-zinc-900 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                  </div>

                  <div className="bg-[#050505] border border-white/5 p-8 rounded-[2rem] group-hover:border-blue-500/30 transition-all shadow-xl">
                    <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                      <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                        Sector_0{index + 1} // {section.section_type}
                      </div>

                      {/* TYPE SELECTOR */}
                      <div className="flex items-center gap-4">
                        <label className="text-[8px] text-zinc-600 uppercase font-bold">Module_Type:</label>
                        <select
                            name={`section_type_${section.id}`}
                            value={section.section_type}
                            onChange={(e) => {
                              const newSections = [...sections];
                              newSections[index].section_type = e.target.value;
                              setSections(newSections);
                            }}
                            className="bg-zinc-900 px-4 py-2 text-[10px] text-white border border-white/10 outline-none font-bold cursor-pointer hover:border-blue-500/50 rounded-lg transition-all"
                        >
                          <option value="Standard">STANDARD_MODULE</option>
                          <option value="Hero">HERO_INTERFACE</option>
                          <option value="Grid">GRID_REGISTRY</option>
                          <option value="Form">FORM_UPLINK</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {section.section_type === "Form" ? (
                          <div className="bg-blue-500/[0.03] border border-blue-500/20 p-8 rounded-2xl space-y-6 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                                <Send size={20} />
                              </div>
                              <div>
                                <h4 className="text-xs font-black uppercase text-white tracking-widest">Hardware_Link_Configuration</h4>
                                <p className="text-[8px] text-zinc-500 uppercase mt-1">Wähle eine Node aus der Form Library</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <label className="text-[8px] text-blue-500/60 uppercase font-black tracking-widest">Active Form Endpoint</label>
                              <select
                                  name={`section_content_${section.id}`}
                                  value={section.content}
                                  onChange={(e) => {
                                    const newSections = [...sections];
                                    newSections[index].content = e.target.value;
                                    setSections(newSections);
                                  }}
                                  className="w-full bg-zinc-950 border border-white/10 p-5 text-sm font-black uppercase tracking-tighter outline-none focus:border-blue-500 text-white rounded-xl"
                              >
                                <option value="">-- WAITING FOR SELECTION --</option>
                                {availableForms.map(f => (
                                    <option key={f.slug} value={f.slug}>{f.name.toUpperCase()} (/{f.slug})</option>
                                ))}
                              </select>
                            </div>
                          </div>
                      ) : (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[8px] text-zinc-600 uppercase tracking-widest">Sector Title</label>
                                <input
                                    name={`section_title_${section.id}`}
                                    value={section.title}
                                    onChange={(e) => {
                                      const newSections = [...sections];
                                      newSections[index].title = e.target.value;
                                      setSections(newSections);
                                    }}
                                    className="w-full bg-zinc-950/50 border border-white/5 p-4 text-xl font-black italic uppercase outline-none focus:border-blue-500/30 rounded-xl"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[8px] text-zinc-600 uppercase tracking-widest">Sector Subtitle</label>
                                <input
                                    name={`section_subtitle_${section.id}`}
                                    value={section.subtitle || ""}
                                    onChange={(e) => {
                                      const newSections = [...sections];
                                      newSections[index].subtitle = e.target.value;
                                      setSections(newSections);
                                    }}
                                    className="w-full bg-zinc-950/50 border border-white/5 p-4 text-sm font-bold uppercase outline-none focus:border-blue-500/30 rounded-xl"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[8px] text-zinc-600 uppercase tracking-widest">Content Logic</label>
                              <textarea
                                  name={`section_content_${section.id}`}
                                  value={section.content}
                                  onChange={(e) => {
                                    const newSections = [...sections];
                                    newSections[index].content = e.target.value;
                                    setSections(newSections);
                                  }}
                                  rows={4}
                                  className="w-full bg-transparent border-l-2 border-white/5 p-6 text-zinc-400 outline-none focus:border-blue-500/30 font-sans text-sm rounded-r-xl"
                              />
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addSection}
                className="w-full py-12 border-2 border-dashed border-white/5 rounded-[2rem] text-zinc-600 hover:border-blue-500/30 hover:text-blue-500 transition-all flex flex-col items-center justify-center gap-4 group bg-white/[0.01]"
            >
              <div className="p-4 rounded-full bg-zinc-900 border border-white/5 group-hover:border-blue-500/30 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all">
                <Plus className="group-hover:rotate-90 transition-transform duration-300" size={24} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em]">Initialize_New_Sector</span>
            </button>
          </div>
        </form>
      </div>
  );
}