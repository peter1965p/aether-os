import Link from 'next/link';
import DeleteButton from './DeleteButton';
import { executeSql } from "@/modules/db/actions"; // Wir nutzen die Kernel-Action

export default async function AdminBlogPage() {
  let posts: any[] = [];
  
  // Da dies eine Server Component ist, führen wir die Query direkt async aus
  try {
    const query = `
      SELECT id, title, slug, created_at 
      FROM blog_posts 
      ORDER BY id DESC
    `;
    
    const response = await executeSql(query);
    
    if (response?.success) {
      posts = response.data;
    } else {
      console.error("Kernel-Fehler:", response?.error);
    }
  } catch (error) {
    console.error("Datenbank-Fehler:", error);
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Manage <span className="text-[#ff4d00]">Posts</span>
          </h1>
          <p className="text-[#444444] text-sm mt-2 font-bold uppercase tracking-widest">
            Connected to: AETHER OS KERNEL / table: blog_posts
          </p>
        </div>
        
        <Link href="/admin/blog/new">
          <button className="bg-[#ff4d00] text-white px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-lg shadow-[#ff4d00]/20 active:scale-95">
            NEW ARTICLE +
          </button>
        </Link>
      </div>

      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0f0f0f] text-[#333333] text-[10px] font-black uppercase tracking-widest border-b border-[#1a1a1a]">
            <tr>
              <th className="px-10 py-6">Article Title</th>
              <th className="px-10 py-6">Slug</th>
              <th className="px-10 py-6">Created At</th>
              <th className="px-10 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-10 py-20 text-center text-[#444444] font-bold uppercase tracking-widest">
                  Noch keine Einträge vorhanden.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-10 py-6 font-bold text-white group-hover:text-[#ff4d00] transition-colors">
                    {post.title}
                  </td>
                  <td className="px-10 py-6 font-mono text-xs text-[#555555]">
                    /{post.slug}
                  </td>
                  <td className="px-10 py-6 text-[#999999] text-xs font-bold uppercase">
                    {post.created_at ? new Date(post.created_at).toLocaleDateString('de-DE') : '---'}
                  </td>                  
                  <td className="px-10 py-6 text-right space-x-4">
                    <Link href={`/admin/blog/edit/${post.id}`}>
                      <button className="text-[#198B02] hover:text-[#00FF15] font-black text-xs hover:underline decoration-2 underline-offset-4 cursor-pointer transition-colors uppercase">
                        EDIT
                      </button>
                    </Link>
                              
                    <DeleteButton id={post.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}