import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Trash2, Globe, LayoutTemplate, Zap } from "lucide-react";
import CommandBar from "./CommandBar";
import BasePageRegistry from "./BasePageRegistry";

// --- SERVER ACTIONS ---
async function deletePage(id: number) {
  "use server";
  try {
    // Erst prüfen, ob es ein System-Node ist
    const { data: page } = await db
      .from("pages")
      .select("is_system_node")
      .eq("id", id)
      .single();

    if (page?.is_system_node === 1) return;

    await db.from("pages").delete().eq("id", id);

    revalidatePath("/");
    revalidatePath("/admin/content");
  } catch (e) {
    console.error("AETHER_DELETE_ERROR", e);
  }
}

async function toggleNavVisibility(id: number, currentState: number) {
  "use server";
  try {
    const newState = currentState === 1 ? 0 : 1;
    await db.from("pages").update({ show_in_nav: newState }).eq("id", id);

    revalidatePath("/");
    revalidatePath("/admin/content");
  } catch (e) {
    console.error("AETHER_TOGGLE_ERROR", e);
  }
}

// --- MAIN COMPONENT ---
export default async function ContentEditor() {
  // Daten laden über Supabase
  const { data: rawPages, error } = await db
    .from("pages")
    .select("*")
    .order("is_system_node", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    console.error("AETHER_FETCH_ERROR", error.message);
  }

  const allPages = rawPages || [];

  return (
    <div className="p-10 space-y-8 bg-black min-h-screen font-sans">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white">
            AETHER // <span className="text-orange-500">Site TERMINAL</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-2 flex items-center gap-2">
            <Zap size={10} className="text-orange-500" /> Core Node Management
            // System Active
          </p>
        </div>
      </div>

      <CommandBar pages={allPages} />

      <BasePageRegistry pages={allPages} onToggleNav={toggleNavVisibility} />

      <div className="flex items-center gap-4 py-8">
        <div className="h-[1px] flex-1 bg-white/5" />
        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">
          Custom Nodes Cluster
        </span>
        <div className="h-[1px] flex-1 bg-white/5" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {allPages
          .filter((p: any) => p.is_system_node === 0)
          .map((page: any) => (
            <div
              key={`grid-node-${page.id}`}
              className="group bg-[#070707] border border-white/5 p-6 rounded-[2.5rem] hover:border-orange-500/30 transition-all relative overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-[9px] font-black text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full uppercase italic">
                  Node: {page.id}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <form
                    action={toggleNavVisibility.bind(
                      null,
                      page.id,
                      page.show_in_nav,
                    )}
                  >
                    <button
                      type="submit"
                      className={`p-2 rounded-lg ${page.show_in_nav ? "text-[#00FF00]" : "text-white/20"}`}
                    >
                      <LayoutTemplate size={14} />
                    </button>
                  </form>
                  <form action={deletePage.bind(null, page.id)}>
                    <button
                      type="submit"
                      className="p-2 text-white/20 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>
              </div>
              <h3 className="text-xl font-black italic uppercase text-white truncate">
                {page.title}
              </h3>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                <p className="text-[9px] font-mono text-white/20 uppercase flex items-center gap-2 italic">
                  <Globe size={10} /> /{page.slug}
                </p>
                <div
                  className={`size-1.5 rounded-full ${page.show_in_nav ? "bg-[#00FF00] shadow-[0_0_10px_#00FF00]" : "bg-white/10"}`}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
