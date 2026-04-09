"use client";

import { useState } from "react";
import { 
  Database, 
  Terminal as TerminalIcon,
  Save,
  Zap
} from "lucide-react";
// Import ohne die Cite-Tags:
import { executeSql, getDbSchema } from "@/modules/db/actions";

export default function DbExplorerPage() {
  const [code, setCode] = useState("-- AETHER SQL ENGINE V2\nSELECT * FROM products LIMIT 10;");
  const [results, setResults] = useState<any>(null);

  const handleRunQuery = async () => {
    try {
      const res = await executeSql(code);
      setResults(res);
    } catch (err) {
      setResults({ error: "Query failed" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="flex items-center gap-4 mb-10">
        <Database className="text-[#ff4d00]" size={32} />
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          Kernel // <span className="text-[#ff4d00]">Database</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 shadow-2xl">
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 bg-transparent font-mono text-sm text-green-500 outline-none resize-none"
          />
          <div className="flex justify-end mt-4">
            <button 
              onClick={handleRunQuery}
              className="flex items-center gap-2 bg-[#ff4d00] hover:bg-white hover:text-black text-white px-8 py-3 rounded-xl font-black uppercase text-xs transition-all"
            >
              <Zap size={14} /> Run Query
            </button>
          </div>
        </div>

        {results && (
          <div className="bg-[#050505] border border-white/5 rounded-[2rem] p-8 font-mono text-[10px] overflow-x-auto">
             <pre className="text-gray-400">{JSON.stringify(results, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}