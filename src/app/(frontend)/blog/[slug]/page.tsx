import { getBlogPostBySlug } from "@/modules/blog/actions";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  // 1. WICHTIG: Warte auf die URL-Parameter
  const { slug } = await params;

  // 2. Abfrage an den Kernel mit dem Slug aus der URL
  const { data: post } = await getBlogPostBySlug(slug);

  // 3. Wenn die DB nichts liefert -> 404
  if (!post) {
    console.error(`Post mit Slug ${slug} nicht in DB gefunden.`);
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] pt-40 pb-20 px-6">
      <article className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
            {post.title}
          </h1>
          <div className="h-1 w-24 bg-[#ff4d00]" />
        </header>

        {post.main_image && (
          <div className="mb-12 rounded-[2.5rem] overflow-hidden border border-[#1a1a1a]">
            <img
              src={post.main_image}
              alt={post.title}
              className="w-full h-auto object-cover opacity-90"
            />
          </div>
        )}

        <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">
          {post.content}
        </div>
      </article>
    </main>
  );
}
