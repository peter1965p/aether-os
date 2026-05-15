// src/components/admin/S3StorageMonitor.tsx
import { getBucketOverview } from "@/modules/aws/aws.actions";
import { PurgeBtn } from "@/components/aws/PurgeBtn";

export async function S3StorageMonitor() {
  const { files, success } = await getBucketOverview();

  return (
    <div className="bg-black/40 border border-white/10 rounded-xl p-6">
      <h3 className="text-cyan-400 font-mono mb-4">// AWS_STORAGE_NODES</h3>
      <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {files.map((file) => (
          <div key={file.key} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded hover:border-cyan-900/50 transition-colors">
            <div className="font-mono text-[11px]">
              <p className="text-white/80">{file.key}</p>
              <p className="text-white/40 text-[9px]">{file.lastModified?.toLocaleString()} | {file.size}</p>
            </div>
            {/* Hier nutzen wir deine neue Fernbedienung! */}
            <PurgeBtn userId="1" currentUrl={`https://.../${file.key}`} />
          </div>
        ))}
      </div>
    </div>
  );
}