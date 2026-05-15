import { Suspense } from "react";
import { S3StorageMonitor } from "@/components/aws/S3StorageMonitor";
import { S3FleetOverview } from "@/components/aws/S3FleetOverview"; // Unser neues Modul!
import { CreateBucketForm } from "@/components/aws/CreateBucketForm";
import { HardDrive, Activity, Plus, Layers } from "lucide-react";

export const metadata = {
  title: "AETHER | AWS_INFRASTRUCTURE",
};

export default async function AWSManagementPage() {
  return (
    <main className="p-6 space-y-6">
      {/* HEADER: SYSTEM STATUS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white flex items-center gap-3">
            <HardDrive className="text-cyan-500" size={32} />
            AWS_ORBITAL_STORAGE //
          </h1>
          <p className="text-white/40 font-mono text-[10px] mt-1 tracking-widest">
            REGION: EU-CENTRAL-1 (FRANKFURT) // STATUS: ENCRYPTED_UPLINK_STABLE
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
            S3_Service_Online
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: CONTROL & CONFIG */}
        <div className="space-y-6">
          <section className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <Plus size={80} />
            </div>
            
            <h2 className="text-cyan-400 font-mono text-xs mb-6 flex items-center gap-2 tracking-widest">
              <Plus size={14} /> // INITIALIZE_NEW_BUCKET
            </h2>

            <CreateBucketForm />
          </section>

          {/* INFRASTRUCTURE MONITOR CARD */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-6">
            <h2 className="text-white/40 font-mono text-[10px] mb-4 uppercase tracking-[0.3em] flex items-center gap-2">
              <Activity size={12} /> Infrastructure_Health
            </h2>
            <div className="space-y-4 font-mono">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] text-white/60">LATENCY_FRA</span>
                <span className="text-xs text-cyan-400">24ms</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] text-white/60">ENCRYPTION</span>
                <span className="text-xs text-green-500">AES-256</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/60">PROTOCOL</span>
                <span className="text-xs text-white/40">V4_SIGN</span>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: FLEET & STORAGE MONITOR */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* NEW: S3 FLEET OVERVIEW (Ganze Power der S3) */}
          <section className="bg-black/40 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <Suspense fallback={<div className="h-32 animate-pulse bg-white/5 rounded-xl" />}>
              <S3FleetOverview />
            </Suspense>
          </section>

          {/* BUCKET CONTENT MONITOR */}
          <section className="bg-black/20 border border-white/5 rounded-2xl flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-white font-bold tracking-[0.2em] text-[10px] uppercase flex items-center gap-2">
                    <Layers size={14} className="text-cyan-500" />
                    Live_Asset_Registry // Nodes
                </h2>
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">Scanning directory: /nodes/</span>
            </div>
            
            <div className="p-2">
                <Suspense fallback={
                    <div className="w-full h-[300px] flex flex-col items-center justify-center gap-4">
                        <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                        <span className="text-white/20 font-mono text-[10px] animate-pulse uppercase tracking-[0.2em]">
                            Syncing_Assets...
                        </span>
                    </div>
                }>
                    <S3StorageMonitor />
                </Suspense>
            </div>
          </section>
        </div>

      </div>
    </main>
  );
}