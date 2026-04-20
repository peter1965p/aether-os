import { createClient } from "@/lib/db";
import { notFound } from "next/navigation";

interface DSPPageViewProps {
  id: string | number;
}

export default async function DSPPageView({ id }: DSPPageViewProps) {
  const db = await createClient();

  // Datenabfrage für die spezifische Node
  const { data: page } = await db
    .from('pages')
    .select('*, page_sections(*)')
    .eq('id', id)
    .single();

  if (!page) return notFound();

  // Sortierung der Sektoren
  const sections = page.page_sections?.sort((a: any, b: any) => a.order_index - b.order_index);

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans selection:bg-blue-500 selection:text-white">
      {sections?.map((section: any, index: number) => (
        <section 
          key={section.id} 
          className="relative min-h-[70vh] flex items-center border-b border-white/5 overflow-hidden py-20 px-6"
        >
          {/* BACKGROUND_ASSET_ENGINE */}
          {section.image_url && (
            <div className="absolute inset-0 z-0">
              <img 
                src={section.image_url} 
                className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950" />
            </div>
          )}

          {/* CONTENT_GRID */}
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center gap-4">
                <span className="h-px w-8 bg-blue-500" />
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-blue-500">
                  Sector_ID_0{index + 1}
                </span>
              </div>

              <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] text-white">
                {section.title}
              </h2>

              {section.subtitle && (
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-zinc-400 italic">
                  {section.subtitle}
                </h3>
              )}

              <div className="max-w-2xl text-lg text-zinc-500 leading-relaxed font-light">
                {section.content}
              </div>

              {/* ACTION_TRIGGER (Beispiel für Anpassbarkeit) */}
              {section.button_text && (
                <button className="px-10 py-4 bg-white text-black font-black uppercase italic text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-[8px_8px_0_rgba(255,255,255,0.1)] hover:shadow-none">
                  {section.button_text}
                </button>
              )}
            </div>

            {/* DECORATIVE_SIDEBAR */}
            <div className="lg:col-span-4 hidden lg:flex flex-col justify-end items-end opacity-20">
               <span className="text-[12rem] font-black italic leading-none select-none tracking-tighter">
                 0{index + 1}
               </span>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}