import { revalidatePath } from 'next/cache';
import { executeSql } from "@/modules/db/actions"; // Kernel-Uplink nutzen [cite: 2026-03-28]

// SERVER ACTION: Umgestellt auf executeSql
async function deleteComment(formData: FormData) {
  'use server';
  const id = formData.get('id');
  
  // Löschvorgang über den AETHER OS Kernel [cite: 2026-02-20]
  await executeSql(`DELETE FROM blog_comments WHERE id = ${id}`);
  
  revalidatePath('/admin/comments');
}

export default async function AdminCommentsPage() {
  let comments: any[] = [];

  try {
    // Abfrage über den Kernel inkl. Join [cite: 2026-03-28]
    const response = await executeSql(`
      SELECT c.*, p.title as post_title 
      FROM blog_comments c 
      JOIN blog_posts p ON c.post_id = p.id 
      ORDER BY c.created_at DESC
    `);

    if (response?.success) {
      comments = response.data;
    }
  } catch (error) {
    console.error("Kernel-Fehler beim Laden der Kommentare:", error);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20 selection:bg-[#ff4d00]/30 font-sans">
      <main className="max-w-7xl mx-auto pt-32 px-10">
        
        {/* Header Sektion - AETHER OS STYLE */}
        <header className="mb-12 flex justify-between items-end">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#ff4d00] rounded-full animate-pulse shadow-[0_0_10px_rgba(255,77,0,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff4d00]">
                Aether // Security System
              </span>
            </div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
              Comment <span className="text-[#222]">Control</span>
            </h1>
          </div>
          <div className="bg-[#111] border border-white/5 px-8 py-4 rounded-2xl">
            <span className="text-[10px] font-black uppercase text-gray-500 block mb-1">Total Logs</span>
            <span className="text-2xl font-black italic text-[#ff4d00]">{comments.length}</span>
          </div>
        </header>

        {/* Die Dark Table */}
        <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-[#111]">
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Author / Context</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Transmission Content</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {comments.map((comment) => (
                <tr key={comment.id} className="group hover:bg-[#ff4d00]/[0.02] transition-colors">
                  <td className="p-8 align-top">
                    <div className="space-y-1">
                      <p className="font-black text-white italic text-lg uppercase tracking-tighter group-hover:text-[#ff4d00] transition-colors">
                        {comment.author_name}
                      </p>
                      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest truncate max-w-[200px]">
                        Re: {comment.post_title}
                      </p>
                      <p className="text-[9px] text-gray-700 font-black mt-2">
                        {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : 'UNKNOWN'}
                      </p>
                    </div>
                  </td>
                  <td className="p-8 align-top">
                    <div className="max-w-xl">
                      <p className="text-gray-400 text-sm leading-relaxed font-medium bg-[#161616] p-6 rounded-2xl border border-white/5 group-hover:border-[#ff4d00]/20 transition-all">
                        "{comment.content}"
                      </p>
                    </div>
                  </td>
                  <td className="p-8 text-right align-top">
                    <form action={deleteComment}>
                      <input type="hidden" name="id" value={comment.id} />
                      <button 
                        type="submit"
                        className="bg-red-500/10 text-red-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-red-500/5"
                      >
                        Purge Log
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {comments.length === 0 && (
            <div className="py-32 text-center bg-[#0d0d0d]">
              <div className="text-4xl mb-4 opacity-10 text-[#ff4d00]">◈</div>
              <p className="text-gray-600 font-black uppercase tracking-[0.5em] text-xs">
                Static noise detected. No logs found.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}