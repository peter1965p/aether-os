import Link from 'next/link';
import { getBlogPosts } from "@/modules/blog/actions";
import { ImageIcon } from "lucide-react";

export default async function BlogOverview() {
  const { data: posts } = await getBlogPosts();

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-6 lg:px-24 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 uppercase leading-none">
            FROM THE <span className="text-[#ff4d00]">BLOG</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts?.map((post: any) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group">
              <div className="bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-[#1a1a1a] hover:border-[#ff4d00]/40 transition-all duration-500 shadow-2xl flex flex-col h-full">

                <div className="aspect-video bg-[#050505] relative overflow-hidden">
                  {post.main_image ? (
                    <img src={post.main_image} alt={post.title} className="object-cover w-full h-full opacity-70 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#1a1a1a]">
                      <ImageIcon size={48} />
                    </div>
                  )}
                </div>

                <div className="p-10">
                  <h2 className="text-2xl font-black mb-4 group-hover:text-[#ff4d00] transition-colors uppercase tracking-tighter">
                    {post.title}
                  </h2>
                  <p className="text-slate-500 text-sm line-clamp-2">{post.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
