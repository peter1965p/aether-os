"use client";

import { useState } from "react";
import { 
  Database, 
  Terminal as TerminalIcon,
  Save,
  Zap,
  Activity,
  Cpu,
  Table as TableIcon,
  LayoutGrid
} from "lucide-react";
import { executeSql } from "@/modules/db/actions";

export default function DbExplorerPage() {
  const [code, setCode] = useState("-- AETHER SQL ENGINE V2\nSELECT * FROM products LIMIT 10;");
  const [results, setResults] = useState<any[] | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");

  const handleRunQuery = async () => {
    setIsExecuting(true);
    try {
      const res = await executeSql(code);
      // Wir gehen davon aus, dass res ein Array von Objekten ist
      setResults(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Query failed", err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 font-mono">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-600/10 rounded-xl border border-orange-600/20">
            <Database className="text-[#ff4d00]" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
              Kernel // <span className="text-[#ff4d00]">Database</span>
            </h1>
            <p className="text-[10px] text-white/20 mt-2 tracking-[0.3em]">AETHER SQL ENGINE V2.4 // STABLE_STREAMS_ACTIVE</p>
          </div>
        </div>
        
        <div className="flex gap-6">
          <div className="text-right">
            <span className="block text-[8px] text-white/20 uppercase tracking-widest">System Load</span>
            <span className="text-xs font-bold text-blue-500">0.4%</span>
          </div>
          <div className="text-right">
            <span className="block text-[8px] text-white/20 uppercase tracking-widest">Uplink Status</span>
            <span className="text-xs font-bold text-green-500">SECURE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* EDITOR TERMINAL */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col">
          <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TerminalIcon size={14} className="text-orange-500" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Query_Input_Buffer</span>
            </div>
            <span className="text-[9px] text-white/20 italic">CTRL+ENTER TO EXECUTE</span>
          </div>
          
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-48 bg-transparent p-6 text-sm text-green-500 outline-none resize-none caret-orange-500"
            spellCheck="false"
          />
          
          <div className="bg-white/[0.02] p-4 flex justify-end gap-4 border-t border-white/5">
            <button className="flex items-center gap-2 text-white/30 hover:text-white text-[10px] uppercase font-black transition-colors">
              <Save size={14} /> Save Script
            </button>
            <button 
              onClick={handleRunQuery}
              disabled={isExecuting}
              className={`flex items-center gap-3 bg-[#ff4d00] hover:bg-orange-500 text-black px-8 py-3 rounded-full font-black uppercase text-xs transition-all shadow-[0_0_20px_rgba(255,77,0,0.2)] ${isExecuting ? 'opacity-50' : ''}`}
            >
              {isExecuting ? <Activity size={14} className="animate-spin" /> : <Zap size={14} />} 
              {isExecuting ? "Processing..." : "Execute Kernel Query"}
            </button>
          </div>
        </div>

        {/* RESULTS SECTION */}
        {results && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-[#ff4d00] uppercase tracking-widest">Result_Stream</span>
                <span className="text-[10px] text-white/20">| {results.length} Rows returned</span>
              </div>
              <div className="flex bg-white/5 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-orange-600 text-black" : "text-white/40"}`}
                >
                  <LayoutGrid size={14} />
                </button>
                <button 
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-md transition-all ${viewMode === "table" ? "bg-orange-600 text-black" : "text-white/40"}`}
                >
                  <TableIcon size={14} />
                </button>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.map((row: any, idx: number) => (
                  <div key={idx} className="bg-[#050505] border border-white/5 rounded-2xl p-5 hover:border-orange-600/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                      <Cpu size={12} className="text-orange-500" />
                    </div>
                    
                    {/* Intelligentes Mapping */}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[8px] text-white/20 uppercase">Entry_{idx}</span>
                        {row.id && <span className="text-[10px] text-blue-500 font-bold">#ID_{row.id}</span>}
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xs font-black uppercase tracking-wider text-white truncate">
                          {row.name || row.title || row.full_name || "Untitled_Node"}
                        </h3>
                        <p className="text-[9px] text-white/40 truncate italic">{row.email || row.slug || "No_Description"}</p>
                      </div>

                      {/* Preis/Status Bereich */}
                      <div className="flex items-end justify-between mt-2 pt-3 border-t border-white/5">
                        <div className="flex flex-col">
                          <span className="text-[7px] text-white/20 uppercase tracking-tighter">Value_Metric</span>
                          <span className="text-sm font-black text-orange-500">
                            {row.price ? `${row.price}€` : row.tier ? row.tier.toUpperCase() : "N/A"}
                          </span>
                        </div>
                        {row.stock !== undefined && (
                          <div className="text-right">
                            <span className="text-[7px] text-white/20 uppercase block">Inventory</span>
                            <span className={`text-[10px] font-bold ${row.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {row.stock} UNITS
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Klassische Tabellenansicht als Backup */
              <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 uppercase tracking-widest">
                      {Object.keys(results[0] || {}).map(key => (
                        <th key={key} className="pb-3 px-2 font-black">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-white/60">
                    {results.map((row: any, i: number) => (
                      <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.02]">
                        {Object.values(row).map((val: any, j: number) => (
                          <td key={j} className="py-2 px-2 truncate max-w-[150px]">{String(val)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}