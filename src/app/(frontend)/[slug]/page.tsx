import db from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Shield, Terminal } from "lucide-react";
import VisitorTracker from "@/components/VisitorTracker";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Unser lupenreiner Typen-Spiegel für die neue 'sectors' Tabelle
interface SectorEntry {
  id: number;
  page_id: number;
  section_type: string;
  title: string;
  subtitle: string;
  content: string;
  image_url: string;
  button_text: string;
  order_index: number;
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Core-Page holen
  const { data: page, error: pageError } = await db
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .single();

  if (pageError || !page) {
    notFound();
  }

  // 2. Sektoren direkt aus der neuen 'sectors' Tabelle ziehen
  const { data: sectors, error: sectorsError } = await db
      .from("sectors")
      .select("*")
      .eq("page_id", page.id)
      .order("order_index", { ascending: true }) as { data: SectorEntry[] | null, error: any };

  return (
      <>
        <VisitorTracker />
        <div className="min-h-screen bg-[#020406] text-zinc-300 font-mono selection:bg-blue-500/30 scroll-smooth w-full overflow-x-hidden relative">

            {/* --- GLOBAL STATUS BAR --- */}
            <div className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-2 flex justify-between items-center text-[10px] tracking-[0.3em] uppercase text-zinc-500">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-blue-500 font-black">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        AETHER_DPS_KERNEL // ACTIVE
                    </div>
                </div>
                <div className="flex gap-8 italic font-bold">
                    <span className="hidden md:inline text-zinc-700 tracking-tighter">NODE_SYNC: 100%</span>
                    <span className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">DPS_ROUTE: /{page.slug}</span>
                </div>
            </div>

            {/* --- HERO SECTION --- */}
            <section className="relative w-screen left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] min-h-[85vh] flex items-center justify-center overflow-hidden bg-black mb-12">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/aether-header.png"
                        alt="Aether OS Cosmic Interface"
                        fill
                        priority
                        className="object-cover opacity-80 select-none scale-105 transition-transform duration-[20s] animate-pulse"
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#020406_100%)] opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#020406] via-transparent to-[#020406] opacity-100"></div>
                </div>

                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 text-center pt-20">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-orange-500/30 bg-black/60 backdrop-blur-2xl text-orange-500 text-[10px] tracking-[0.5em] uppercase mb-16 animate-pulse shadow-[0_0_40px_rgba(234,88,12,0.1)]">
                        <Shield size={14} /> DPS_Link_Established // ID_{page.id}
                    </div>

                    <div className="relative mb-12 group">
                        <h1 className="text-[5rem] md:text-[10rem] font-black tracking-[-0.08em] leading-none select-none flex flex-wrap justify-center items-center uppercase">
                            <span className="relative bg-gradient-to-b from-orange-200 via-orange-500 to-orange-950 bg-clip-text text-transparent drop-shadow-[0_0_70px_rgba(234,88,12,0.5)] transition-all duration-1000">
                                {page.title}
                            </span>
                        </h1>
                        <div className="mt-6">
                            <p className="text-blue-400/40 font-mono text-[11px] tracking-[1.8em] uppercase italic opacity-60">
                                Core_System_Node // {page.slug.toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mt-8" />
                </div>
            </section>

            {/* --- CONTENT HUB --- */}
            <main className="w-full max-w-5xl mx-auto px-6 pb-32 relative z-20 space-y-16">
                {sectors && sectors.length > 0 ? (
                    sectors.map((sector, index) => (
                        <section 
                          key={sector.id} 
                          className="w-full relative group bg-black/40 border border-white/5 rounded-[5px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md hover:border-orange-500/20 transition-all duration-500"
                        >
                          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-800 group-hover:border-orange-500 transition-colors" />
                          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-800 group-hover:border-orange-500 transition-colors" />
                          
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            
                            <div className="lg:col-span-4 space-y-3">
                              <div className="inline-block bg-zinc-950 border border-white/5 font-mono text-[9px] text-zinc-500 uppercase tracking-[0.25em] px-3 py-1 rounded-[3px]">
                                SECTOR_0{index + 1} // {sector.section_type || "STANDARD_MODULE"}
                              </div>
                              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-orange-500 transition-colors duration-300">
                                {sector.title || "UNTITLED_NODE"}
                              </h2>
                              {sector.subtitle && (
                                <p className="text-blue-400/60 font-mono text-[10px] tracking-widest uppercase italic mt-1">
                                  // {sector.subtitle}
                                </p>
                              )}
                            </div>
                            
                            <div className="lg:col-span-8 space-y-6 pl-0 lg:pl-8 border-l-0 lg:border-l border-white/5 text-zinc-400 text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-mono">
                              <div className="text-zinc-300">
                                {sector.content || "// No payload data in this block."}
                              </div>
                              
                              {sector.image_url && (
                                <div className="mt-6 border border-white/5 p-1 bg-zinc-900/20 rounded-sm overflow-hidden">
                                  <img 
                                    src={sector.image_url} 
                                    alt={sector.title || "Sector image"} 
                                    className="w-full h-auto grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                  />
                                </div>
                              )}

                              {sector.button_text && (
                                <div className="pt-4">
                                  <button className="px-4 py-2 border border-orange-500/40 bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-black font-mono text-xs uppercase tracking-widest transition-all duration-300">
                                    {sector.button_text}
                                  </button>
                                </div>
                              )}
                            </div>

                          </div>
                        </section>
                    ))
                ) : (
                    <div className="text-center py-20 border border-dashed border-zinc-800 rounded-[5px] max-w-md mx-auto bg-zinc-950/10 backdrop-blur-sm">
                        <Terminal size={24} className="text-zinc-700 mx-auto mb-4 animate-pulse" />
                        <p className="text-zinc-600 font-mono uppercase tracking-[0.3em] italic text-[10px]">
                          // No active segments tied to this slug node.
                        </p>
                        <p className="text-zinc-700 font-mono text-[9px] uppercase tracking-widest mt-2">
                          Check database link for page_id: {page.id}
                        </p>
                    </div>
                )}
            </main>

        </div>
      </>
  );
}