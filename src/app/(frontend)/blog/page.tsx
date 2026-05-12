/**
 * AETHER OS // INTELLIGENCE FEED (BLOG OVERVIEW)
 * Pfad: /src/app/(frontend)/blog/page.tsx
 */

import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from "@/modules/blog/actions";
import { ImageIcon, ChevronRight, Hash, Calendar } from "lucide-react";

export default async function BlogOverview() {
  const { data: posts } = await getBlogPosts();

  return (
      <main className="min-h-screen bg-[#020406] pt-40 pb-32 px-6 lg:px-24 text-white relative overflow-hidden">

        {/* --- COSMIC BACKGROUND LAYER --- */}
        <div className="absolute inset-0 z-0">
          <Image
              src="/images/aether-header.png"
              alt="Aether Universe"
              fill
              className="object-cover opacity-20 scale-110 blur-[4px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020406] via-transparent to-[#020406]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">

          {/* --- HEADER: MASSIVE CHROME STYLE --- */}
          <div className="text-center mb-32 relative">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.8em] mb-4 animate-pulse">
              Terminal_Transmission // Intelligence_Reports
            </p>
            <h1 className="text-7xl md:text-[10rem] font-black tracking-[-0.06em] mb-4 uppercase leading-none select-none">
              THE <span className="bg-gradient-to-b from-orange-200 via-orange-500 to-orange-900 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(234,88,12,0.4)] italic">FEED</span>
            </h1>
            <div className="h-[2px] w-24 bg-orange-600 mx-auto mt-8 shadow-[0_0_20px_#ea580c]"></div>
          </div>

          {/* --- GRID: INTELLIGENCE NODES --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts?.map((post: any) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group relative">

                  {/* Outer Glow Effect on Hover */}
                  <div className="absolute -inset-2 bg-blue-600/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3rem]"></div>

                  <div className="relative bg-black/40 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden border border-white/5 group-hover:border-orange-500/40 transition-all duration-700 flex flex-col h-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                    {/* IMAGE UNIT */}
                    <div className="aspect-[16/10] bg-zinc-900 relative overflow-hidden border-b border-white/5">
                      {post.main_image ? (
                          <img
                              src={post.main_image}
                              alt={post.title}
                              className="object-cover w-full h-full opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[1.5s] ease-out"
                          />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-800">
                            <ImageIcon size={64} strokeWidth={1} />
                          </div>
                      )}

                      {/* Badge: Category/Status */}
                      <div className="absolute top-6 left-6 flex gap-2">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-orange-500">
                        Intel_Report
                    </span>
                      </div>
                    </div>

                    {/* CONTENT UNIT */}
                    <div className="p-10 flex flex-col flex-1">
                      <div className="flex items-center gap-4 mb-6 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Calendar size={12} /> 08/05/2026</span>
                        <span className="h-1 w-1 bg-zinc-800 rounded-full"></span>
                        <span className="flex items-center gap-1 text-blue-500"><Hash size={12} /> Aether_OS</span>
                      </div>

                      <h2 className="text-3xl font-black mb-6 group-hover:text-white transition-colors uppercase tracking-tighter italic leading-[0.9] text-zinc-200">
                        {post.title}
                      </h2>

                      <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-8 line-clamp-3 italic opacity-80 group-hover:opacity-100 transition-opacity">
                        {post.excerpt || "Decrypting node data... Intelligence briefing pending for this sector."}
                      </p>

                      <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 group-hover:text-orange-400 transition-colors">
                        Access_Report
                    </span>
                        <ChevronRight size={18} className="text-zinc-800 group-hover:text-orange-500 group-hover:translate-x-2 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
            ))}
          </div>

          {/* --- BACKGROUND DECO --- */}
          <div className="absolute top-1/2 -left-20 w-96 h-96 bg-blue-600/5 blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-orange-600/5 blur-[120px] pointer-events-none"></div>
        </div>
      </main>
  );
}