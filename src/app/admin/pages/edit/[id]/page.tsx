// src/app/admin/pages/edit/[id]/page.tsx
import { createClient } from "@/lib/db";
import { notFound } from "next/navigation";
import { Save, ArrowLeft, LayoutTemplate, Type, AlignLeft, Image as ImageIcon, Plus } from "lucide-react";
import Link from "next/link";
import { updateAetherPage } from "@/modules/inventory/actions"; // Dein Roman-Import

export default async function EditPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = params;

  const { data: page } = await supabase
    .from('pages')
    .select('*, page_sections(*)')
    .eq('id', id)
    .single();

  if (!page) return notFound();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* FORM START */}
      <form action={updateAetherPage}>
        <input type="hidden" name="page_id" value={id} />

        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <Link href="/admin/pages" className="p-3 bg-zinc-900 rounded-xl text-zinc-500 hover:text-white transition-all border border-white/5">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                Edit Node: <span className="text-blue-500">{page.title}</span>
              </h1>
            </div>
          </div>
          <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-black py-3 px-8 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-green-900/20 uppercase text-xs tracking-widest">
            <Save size={18} /> Deploy Changes
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Core Settings */}
          <section className="bg-zinc-950/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
            <h2 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Type size={14} className="text-blue-500" /> Core Parameters
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-600 uppercase ml-2">Internal Title</label>
                <input name="title" defaultValue={page.title} className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/30 transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-600 uppercase ml-2">URL Slug</label>
                <input name="slug" defaultValue={page.slug} className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-blue-500 outline-none focus:border-blue-500/30 transition-all font-mono italic" />
              </div>
            </div>
          </section>

          {/* Sektionen Loop */}
          {page.page_sections?.sort((a:any, b:any) => a.order_index - b.order_index).map((section: any, index: number) => (
            <section key={section.id} className="bg-zinc-950/40 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl relative">
              <input type="hidden" name="section_id" value={section.id} />
              <div className="absolute -left-3 top-10 w-1 h-20 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
              
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <LayoutTemplate size={14} className="text-orange-500" /> Section _{index + 1}
                </h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-600 uppercase ml-2">Heading</label>
                    <input name={`section_title_${section.id}`} defaultValue={section.title} className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/30 transition-all font-black uppercase italic" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-600 uppercase ml-2">Sub-Heading</label>
                    <input name={`section_subtitle_${section.id}`} defaultValue={section.subtitle} className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-blue-500 outline-none focus:border-blue-500/30 transition-all font-black uppercase italic" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase ml-2 flex items-center gap-2"><AlignLeft size={12} /> Content Body</label>
                  <textarea name={`section_content_${section.id}`} defaultValue={section.content} rows={5} className="w-full bg-black border border-white/5 rounded-3xl px-6 py-4 text-zinc-400 outline-none focus:border-blue-500/30 transition-all text-sm leading-relaxed" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase ml-2 flex items-center gap-2"><ImageIcon size={12} /> Media Resource URL</label>
                  <input name={`section_image_${section.id}`} defaultValue={section.image_url} className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-zinc-500 outline-none focus:border-blue-500/30 transition-all text-[10px] font-mono" />
                </div>
              </div>
            </section>
          ))}
        </div>
      </form>
    </div>
  );
}