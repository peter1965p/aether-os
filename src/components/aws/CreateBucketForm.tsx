"use client";

import { createNewBucket } from "@/modules/aws/aws.actions";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

export function CreateBucketForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const result = await createNewBucket(formData);
      if (result.error) {
        alert(`Uplink_Error: ${result.error}`);
      } else {
        // Formular zurücksetzen
        (document.getElementById("bucket-form") as HTMLFormElement).reset();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form 
      id="bucket-form"
      action={handleSubmit} 
      className="space-y-4 relative z-10"
    >
      <div className="space-y-2">
        <label className="text-[10px] text-white/40 uppercase font-bold ml-1">
          Bucket_Name
        </label>
        <input 
          name="bucketName"
          type="text" 
          required
          placeholder="aether-os-new-module..."
          className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
        />
      </div>
      <button 
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-900 disabled:text-white/20 text-black font-black py-3 rounded-xl transition-all active:scale-[0.98] uppercase text-xs tracking-tighter flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Initializing_Node...
          </>
        ) : (
          "Create_S3_Instance"
        )}
      </button>
    </form>
  );
}