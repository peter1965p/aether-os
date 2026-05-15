import { db } from "@/lib/db";
import AvatarUpload from "@/components/profile/AvatarUpload";
import { notFound } from "next/navigation";

export default async function ProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Next.js 16 Safety: Params asynchron auspacken
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) return notFound();

  // 2. Daten-Uplink (maybeSingle für Ghost-Mode-Resistenz)
  const { data: profile } = await db
    .from('profiles')
    .select('*')
    .eq('customer_id', numericId)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-[#020202] text-zinc-100 p-8 font-mono">
      {/* Visual Identity Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex justify-between items-end">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-white/5">
            User_Identity //
          </h1>
          <span className="text-[10px] text-blue-500/50 mb-2">AETHER_OS_CORE_V1.1</span>
        </div>
        <div className="h-[1px] w-full bg-gradient-to-r from-blue-600 via-zinc-800 to-transparent mt-2" />
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Profile Card / Identity Node */}
        <div className="md:col-span-4 p-8 bg-[#050505] border border-zinc-900 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-2 opacity-20">
            <div className="w-16 h-16 border-t border-r border-blue-500" />
          </div>

          <AvatarUpload 
            userId={id} 
            currentUrl={profile?.avatar_url} 
          />

          <div className="mt-8 space-y-4">
            <div className="text-center">
              <span className="text-[9px] font-black tracking-[0.4em] text-blue-500 uppercase">
                {profile ? "Node_Verified" : "Sync_Required"}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-zinc-900/30 border border-zinc-800 rounded text-[8px] text-zinc-500">
                UPLINK: <span className="text-blue-400">STABLE</span>
              </div>
              <div className="p-2 bg-zinc-900/30 border border-zinc-800 rounded text-[8px] text-zinc-500">
                ID: <span className="text-white">{id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* System & Interface Config */}
        <div className="md:col-span-8 space-y-6">
          <div className="p-6 bg-[#050505] border border-zinc-900 rounded-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-2 h-2 rounded-full ${profile ? 'bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-red-900'}`} />
              <h2 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">System_Parameters</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
                <span className="text-[10px] text-zinc-600 uppercase font-bold">Theme_Engine</span>
                <span className="text-xs text-blue-400">{profile?.theme_pref || "AETHER_DEFAULT"}</span>
              </div>
              <div className="flex justify-between p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
                <span className="text-[10px] text-zinc-600 uppercase font-bold">Last_Uplink</span>
                <span className="text-xs text-zinc-400">
                  {profile?.last_login ? new Date(profile.last_login).toLocaleString() : "---"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}