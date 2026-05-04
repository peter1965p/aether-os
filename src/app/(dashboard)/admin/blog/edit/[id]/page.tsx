import db from '@/lib/db';
import { updatePost } from '@/modules/blog/actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Die Funktion muss 'async' sein, um 'await' nutzen zu können
export default async function EditPostPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Params auspacken (Das löst den Fehler!)
  const { id } = await params;

  // 2. Post mit der echten ID aus der SQLite laden
  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id) as any;

  if (!post) notFound();

  // 3. ID an die Server Action binden
  const updateWithId = updatePost.bind(null, Number(id));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Modify <span className="text-[#00FF15]">Entry</span>
          </h1>
          <p className="text-[#444444] text-xs font-bold uppercase tracking-[0.3em] mt-2">
            System ID: {id} // Database: blog_posts
          </p>
        </div>
        <Link href="/admin/blog" className="text-[10px] font-bold text-[#666666] hover:text-white uppercase tracking-widest transition-colors">
          &larr; Back to Fleet
        </Link>
      </div>

      <form action={updateWithId} className="space-y-6 bg-[#0a0a0a] border border-[#1a1a1a] p-12 rounded-[2.5rem] shadow-2xl">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#333333] ml-2">Header Title</label>
            <input 
              name="title"
              required
              defaultValue={post.title}
              className="w-full bg-[#050505] border border-[#1a1a1a] rounded-2xl px-6 py-4 text-white outline-none focus:border-[#00FF15] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#333333] ml-2">Short Excerpt</label>
            <textarea 
              name="excerpt"
              required
              rows={2}
              defaultValue={post.excerpt}
              className="w-full bg-[#050505] border border-[#1a1a1a] rounded-2xl px-6 py-4 text-white outline-none focus:border-[#00FF15] transition-all resize-none font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#333333] ml-2">Core Content</label>
            <textarea 
              name="content"
              required
              rows={12}
              defaultValue={post.content}
              className="w-full bg-[#050505] border border-[#1a1a1a] rounded-2xl px-6 py-4 text-white outline-none focus:border-[#00FF15] transition-all resize-none font-mono text-sm leading-relaxed"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button 
            type="submit"
            className="flex-1 bg-[#198B02] hover:bg-[#00FF15] text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-[#00FF15]/10 uppercase text-sm tracking-widest"
          >
            Execute Update
          </button>
        </div>
      </form>
    </div>
  );
}