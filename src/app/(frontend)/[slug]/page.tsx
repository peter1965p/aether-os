import db from "@/lib/db";
import { notFound } from "next/navigation";

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // --- SUPABASE FIX ---
  // Wir nutzen .from().select().eq().single() anstatt .prepare()
  const { data: page, error } = await db
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true) // Postgres nutzt true/false statt 1/0
    .single();

  if (error || !page) {
    notFound();
  }

  // Das Herzstück: Wir holen das JSON aus der DB
  // In Supabase könnte content_json bereits ein Objekt sein, falls der Spaltentyp jsonb ist
  let contentData = { modules: [] };
  try {
    if (typeof page.content_json === 'string') {
      contentData = JSON.parse(page.content_json || '{"modules": []}');
    } else if (page.content_json && typeof page.content_json === 'object') {
      contentData = page.content_json;
    }
  } catch (e) {
    console.error("AETHER_RENDER_ERROR: Invalid JSON in Database");
  }

  return (
    <main className="min-h-screen bg-[#020202] text-white p-20 flex flex-col items-center">
      {/* BACKGROUND DECO */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.05),transparent)] pointer-events-none" />

      <div className="space-y-12 w-full max-w-6xl relative z-10">
        {/* HEADER SECTION */}
        <div className="text-center space-y-6 mb-20">
          <h1 className="text-9xl font-black italic uppercase tracking-tighter animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {page.title}
          </h1>
          {/* Accent-Glow angepasst auf dein neues System-Rot */}
          <div className="h-[2px] w-32 bg-red-600 mx-auto shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
          <p className="text-white/20 font-mono uppercase tracking-[0.6em] text-[10px] italic">
            Node_Identifier // {page.slug.toUpperCase()}
          </p>
        </div>

        {/* DYNAMIC CONTENT RENDERER */}
        <section className="space-y-16">
          {contentData.modules && contentData.modules.length > 0 ? (
            contentData.modules.map((mod: any) => (
              <div
                key={mod.id}
                style={{
                  fontSize: `${mod.style?.fontSizePt || 48}pt`,
                  textAlign: (mod.style?.align?.replace("text-", "") ||
                    "center") as any,
                  color: mod.style?.color || "#FFFFFF",
                  fontFamily: mod.style?.fontFamily || "inherit",
                  lineHeight: "1.1",
                }}
                className="animate-in fade-in duration-1000"
              >
                {mod.type === "IMAGE" ? (
                  <div className="flex justify-center">
                    <img
                      src={mod.content}
                      alt="Aether Node Media"
                      className="max-w-full h-auto rounded-[3rem] shadow-2xl border border-white/5 transition-transform hover:scale-[1.02] duration-700"
                    />
                  </div>
                ) : (
                  <div className="font-black italic uppercase tracking-tighter leading-none">
                    {mod.content}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 border border-white/5 rounded-[4rem] bg-white/[0.01]">
              <p className="text-white/10 font-mono uppercase tracking-[0.4em] italic text-xs">
                No active nodes detected in cluster.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}