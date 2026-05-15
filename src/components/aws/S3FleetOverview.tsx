import { getAllBuckets } from "@/modules/aws/aws.actions";
import { Database, Calendar, ExternalLink } from "lucide-react";

export async function S3FleetOverview() {
  // Wir nutzen die Funktion, die bei dir in der aws.actions.ts deklariert ist
  const result = await getAllBuckets();

  if (!result.success) {
    return (
      <div className="bg-red-950/20 border border-red-500/50 p-4 rounded-xl">
        <p className="text-red-500 font-mono text-[10px] uppercase tracking-widest">
          // Uplink_Error: {result.error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em]">
        // Active_S3_Fleet_Detected
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.buckets?.map((bucket: any) => (
          <div key={bucket.name} className="bg-black/60 border border-white/5 p-4 rounded-xl hover:border-cyan-500/30 transition-all group cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                  <Database size={16} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-white font-bold tracking-tight">{bucket.name}</p>
                  <p className="text-[9px] text-white/30 font-mono flex items-center gap-1 uppercase">
                    <Calendar size={10} /> Launch: {new Date(bucket.creationDate || bucket.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <ExternalLink size={14} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}