import { getPageSections } from "@/modules/inventory/actions";
import db from "@/lib/db";
import { notFound } from "next/navigation";

export default async function DSP_Live_View({ params }: { params: { id: string } }) {
  const { id } = params;

  // 1. Hole die Page-Meta-Daten aus der Datenbank
  const { data: page, error: pageError } = await db
    .from('pages')
    .select('*')
    .eq('id', id)
    .single();

  // Falls die ID nicht existiert oder ein Fehler auftritt -> 404
  if (pageError || !page) return notFound();

  // 2. Hole alle zugehörigen Sektoren
  const sections = await getPageSections(parseInt(id));

  return (
    <main className="min-h-screen bg-[#05070a] text-white font-mono selection:bg-blue-500/30">
      {/* SYSTEM STATUS BAR */}
      <nav className="p-4 border-b border-white/5 flex justify-between items-center text-[10px] tracking-[0.4em] uppercase text-zinc-600 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <span>AETHER OS // NODE_LIVE_PREVIEW</span>
        </div>
        <div className="flex gap-6">
          <span>STATUS: OPERATIONAL</span>
          <span className="text-blue-500">ID: {id}</span>
        </div>
      </nav>

      {/* PAGE HEADER */}
      <header className="max-w-7xl mx-auto px-6 pt-32 pb-20 border-l border-white/5 ml-6 lg:ml-auto">
        <div className="space-y-2">
          <span className="text-blue-500 text-xs font-bold uppercase tracking-[0.5em]">Initialising_Protocol</span>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-none">
            {page.title}
          </h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] mt-4">
            Slug_Reference: /{page.slug}
          </p>
        </div>
      </header>

      {/* DYNAMIC SECTOR RENDERER */}
      <div className="space-y-0">
        {sections && sections.length > 0 ? (
          sections.map((section: any, index: number) => (
            <section 
              key={section.id} 
              className="max-w-7xl mx-auto px-6 py-24 border-l border-white/5 border-t hover:bg-white/[0.01] transition-all group relative"
            >
              {/* Index Number Indicator */}
              <div className="absolute -left-[1px] top-0 w-[1px] h-0 group-hover:h-full bg-blue-600 transition-all duration-700 shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4">
                  <span className="text-zinc-700 text-[9px] font-bold tracking-[0.4em] uppercase block mb-3">
                    SECTOR_0{index + 1} // {section.section_type || "GENERIC_MODULE"}
                  </span>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter group-hover:text-blue-400 transition-colors duration-500">
                    {section.title}
                  </h2>
                  {section.subtitle && (
                    <p className="text-blue-500/60 text-xs mt-4 uppercase tracking-[0.2em] font-bold italic">
                      {section.subtitle}
                    </p>
                  )}
                </div>
                
                <div className="lg:col-span-8">
                  <div className="text-zinc-400 text-sm md:text-base leading-relaxed whitespace-pre-line max-w-3xl">
                    {section.content}
                  </div>
                  
                  {section.image_url && (
                    <div className="mt-12 border border-white/5 p-1 bg-zinc-900/20 rounded-sm overflow-hidden">
                      <img 
                        src={section.image_url} 
                        alt={section.title} 
                        className="w-full grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 ease-in-out scale-[1.01] hover:scale-100"
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))
        ) : (
          <div className="max-w-7xl mx-auto px-6 py-20 border-l border-white/5 text-zinc-600 italic text-sm">
            // No sectors detected for this node. Use Company Admin to add content.
          </div>
        )}
      </div>

      {/* TERMINAL FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 py-32 border-l border-white/5 flex flex-col items-center gap-4">
        <div className="h-px w-20 bg-zinc-800" />
        <p className="text-zinc-800 text-[8px] uppercase tracking-[1.5em] text-center">
          End of Node Transmission // AETHER OS CORE
        </p>
      </footer>
    </main>
  );
}