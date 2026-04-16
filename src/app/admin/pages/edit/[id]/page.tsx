import { createClient } from "@/lib/db";
import { notFound } from "next/navigation";
import { 
  Save, 
  ArrowLeft, 
  LayoutTemplate, 
  Type, 
  AlignLeft, 
  Image as ImageIcon, 
  ExternalLink,
  Cpu
} from "lucide-react";
import Link from "next/link";
import { updateAetherPages } from "@/modules/inventory/actions";
export const dynamic = 'force-dynamic';
export default async function EditPage(probs:{ params: Promise<{ id: string}> }) {
  
  const params = await probs.params;
  const id  = params.id;

  const db = await createClient();

  // Daten abrufen inklusive Sektionen
  const { data: page } = await db
    .from('pages')
    .select('*, page_sections(*)')
    .eq('id', id)
    .single();

  if (!page) return notFound();

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen font-mono text-white">
      {/* FORM START MIT VARIANTE 1 WRAPPER */}
      <form action={async (formData: FormData) => {
        "use server";
        await updateAetherPages(formData);
      }}>
        <input type="hidden" name="page_id" value={id} />

        {/* HEADER BAR */}
        <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center gap-6">
            <Link 
              href="/admin/pages" 
              className="p-3 bg-zinc-950 border border-white/10 text-zinc-500 hover:text-white hover:border-blue-500/50 transition-all"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-1">
                <Cpu size={12} className="text-blue-500" /> System_Edit_Node
              </div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter">
                {page.title} <span className="text-zinc-700 mx-2">//</span> <span className="text-blue-500">ID_{id}</span>
              </h1>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Link 
              href={`/dsp/${id}`} 
              target="_blank"
              className="flex items-center gap-2 px-6 py-3 border border-white/10 text-[10px] uppercase font-bold tracking-widest hover:bg-white/5 transition-all"
            >
              <ExternalLink size={14} /> Preview
            </Link>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-black py-3 px-8 flex items-center gap-3 transition-all uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.2)]"
            >
              <Save size={18} /> Deploy_Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Core Settings / Metadata */}
          <section className="bg-zinc-900/20 border border-white/5 p-8 relative overflow-hidden">
            <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <Type size={14} className="text-blue-500" /> Header_Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Display Title</label>
                <input 
                  name="title" 
                  defaultValue={page.title} 
                  className="w-full bg-zinc-950 border border-white/10 p-4 text-white outline-none focus:border-blue-500/50 transition-all font-bold uppercase italic tracking-tight" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">URL Identifier (Slug)</label>
                <input 
                  name="slug" 
                  defaultValue={page.slug} 
                  className="w-full bg-zinc-950 border border-white/10 p-4 text-blue-500 outline-none focus:border-blue-500/50 transition-all font-mono italic" 
                />
              </div>
            </div>
          </section>

          {/* Sektionen Loop / Sector Modules */}
          <div className="space-y-6">
            {page.page_sections?.sort((a:any, b:any) => a.order_index - b.order_index).map((section: any, index: number) => (
              <section key={section.id} className="bg-zinc-900/10 border border-white/5 p-8 relative group hover:border-white/10 transition-all">
                <input type="hidden" name="section_id" value={section.id} />
                
                <div className="absolute left-0 top-0 w-[2px] h-0 group-hover:h-full bg-blue-600 transition-all duration-500" />
                
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                    <LayoutTemplate size={14} className="text-blue-500" /> 
                    Sector_0{index + 1} <span className="text-zinc-800">//</span> {section.section_type || "Standard"}
                  </h2>
                  <div className="text-[9px] text-zinc-700 font-mono">UUID: {section.id}</div>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Sector Heading</label>
                      <input 
                        name={`section_title_${section.id}`} 
                        defaultValue={section.title} 
                        className="w-full bg-zinc-950 border border-white/5 p-4 text-white outline-none focus:border-blue-500/30 transition-all font-black uppercase italic" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Sub_Caption</label>
                      <input 
                        name={`section_subtitle_${section.id}`} 
                        defaultValue={section.subtitle} 
                        className="w-full bg-zinc-950 border border-white/5 p-4 text-blue-500/80 outline-none focus:border-blue-500/30 transition-all font-bold uppercase italic tracking-widest text-xs" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <AlignLeft size={12} /> Body_Content_Stream
                    </label>
                    <textarea 
                      name={`section_content_${section.id}`} 
                      defaultValue={section.content} 
                      rows={6} 
                      className="w-full bg-zinc-950 border border-white/5 p-6 text-zinc-400 outline-none focus:border-blue-500/30 transition-all text-sm leading-relaxed font-sans" 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <ImageIcon size={12} /> Static_Asset_Source
                    </label>
                    <input 
                      name={`section_image_${section.id}`} 
                      defaultValue={section.image_url} 
                      className="w-full bg-zinc-950 border border-white/5 p-4 text-zinc-500 outline-none focus:border-blue-500/30 transition-all text-[10px] font-mono" 
                    />
                  </div>
                </div>
              </section>
            ))}
          </div>

          <div className="py-12 flex justify-center">
            <button 
              type="submit" 
              className="flex items-center gap-4 text-zinc-500 hover:text-blue-500 transition-all group"
            >
              <div className="h-px w-12 bg-zinc-800 group-hover:w-20 group-hover:bg-blue-500 transition-all"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Execute_Global_Deploy</span>
              <div className="h-px w-12 bg-zinc-800 group-hover:w-20 group-hover:bg-blue-500 transition-all"></div>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}