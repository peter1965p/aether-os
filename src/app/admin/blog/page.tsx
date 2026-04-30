import Link from 'next/link';
import DeleteButton from './DeleteButton';
import { getBlogPosts } from "@/modules/blog/actions";

// Erzwingt, dass die Seite bei jedem Request neu geladen wird (kein Cache)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminBlogPage() {
  // Wir rufen direkt deine funktionierende Server Action auf
  const { data: posts, success } = await getBlogPosts();

  return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* HEADER SECTION */}
        <div className="flex justify-between items-end">
          <div className="flex-1">
            <p className="text-[10px] font-black text-[#ff4d00] uppercase tracking-[0.5em] mb-2">
              System // Blog Management
            </p>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-white italic">
              MANAGE <span className="text-[#ff4d00]">POSTS</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${success ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`} />
              <p className="text-[#444444] text-[9px] font-bold uppercase tracking-widest">
                Node Status: {success ? 'Connected' : 'Sync Error'} / Provider: Supabase Engine
              </p>
            </div>
          </div>

          <Link href="/admin/blog/new">
            <button className="bg-[#ff4d00] text-black px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-[#ff4d00]/10 active:scale-95 italic">
              Create New Entry +
            </button>
          </Link>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0f0f0f] text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
            <tr>
              <th className="px-10 py-8">Article Identity</th>
              <th className="px-10 py-8">Route / Slug</th>
              <th className="px-10 py-8">Timestamp</th>
              <th className="px-10 py-8 text-right">Operations</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
            {!posts || posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center">
                    <p className="text-[#444444] font-black uppercase tracking-[0.3em] text-xs">
                      No Nodes Found in Cluster.
                    </p>
                    <p className="text-[9px] text-gray-700 uppercase mt-2 italic">Waiting for incoming data packets...</p>
                  </td>
                </tr>
            ) : (
                posts.map((post: any, index: number) => (
                    <tr key={post.id || `post-${index}`} className="hover:bg-white/[0.01] transition-all group">
                      <td className="px-10 py-8">
                        <p className="font-black text-white group-hover:text-[#ff4d00] transition-colors uppercase tracking-tight text-lg italic">
                          {post.title}
                        </p>
                        <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">ID: {post.id}</span>
                      </td>
                      <td className="px-10 py-8">
                        <span className="px-3 py-1 bg-white/5 rounded-md font-mono text-[10px] text-gray-500 group-hover:text-gray-300 transition-colors">
                          /{post.slug}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                          {post.created_at ? new Date(post.created_at).toLocaleDateString('de-DE') : '---'}
                        </p>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end items-center gap-6">
                          <Link href={`/admin/blog/edit/${post.id}`}>
                            <button className="text-white/40 hover:text-[#ff4d00] font-black text-[10px] tracking-widest transition-all uppercase italic">
                              Edit_Node
                            </button>
                          </Link>

                          <DeleteButton id={post.id} />
                        </div>
                      </td>
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </div>

        {/* SYSTEM FOOTER INFO */}
        <div className="flex justify-between items-center px-4">
          <p className="text-[8px] font-bold text-gray-800 uppercase tracking-[0.3em]">
            Aether OS // Records: {posts?.length || 0}
          </p>
          <div className="h-px flex-1 bg-white/5 mx-8" />
          <p className="text-[8px] font-bold text-gray-800 uppercase tracking-[0.3em]">
            Kernel V16.1.6 // Security: {success ? 'Encrypted' : 'Compromised'}
          </p>
        </div>
      </div>
  );
}