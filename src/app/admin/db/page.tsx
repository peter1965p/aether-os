"use client";

import { useState } from "react";
import { 
  Database, Terminal as TerminalIcon, Save, Zap, 
  Activity, Cpu, Table as TableIcon, LayoutGrid, AlertTriangle, CheckCircle2
} from "lucide-react";
import { executeSql } from "@/modules/db/actions";

export default function DbExplorerPage() {
  const [code, setCode] = useState("-- AETHER SQL ENGINE V2\nSELECT * FROM products LIMIT 10;");
  const [results, setResults] = useState<any[] | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [statusMsg, setStatusMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleRunQuery = async () => {
    setIsExecuting(true);
    setResults(null);
    setStatusMsg(null);
    
    try {
      // res ist hier vom Typ { success: boolean, data: any, error?: any }
      const res = await executeSql(code);
      
      if (!res.success) {
        throw new Error(res.error || "QUERY_FAILED");
      }

      const dbData = res.data;

      // 1. Check für DDL Befehle (CREATE, INSERT, etc.) im data-Objekt
      // Wir nutzen 'any' cast oder prüfen auf Existenz in dbData
      if (dbData && !Array.isArray(dbData) && (typeof dbData === 'object')) {
        const command = (dbData as any).command;
        const rowCount = (dbData as any).rowCount;

        if (command || rowCount !== undefined) {
          setStatusMsg({
            type: 'success',
            text: `KERNEL_CONFIRMED: ${command || 'Operation'} successful. ${rowCount ?? 0} rows affected.`
          });
          setResults([]); 
          return;
        }
      } 
      
      // 2. Check für SELECT Ergebnisse (Array)
      if (Array.isArray(dbData)) {
        if (dbData.length === 0) {
          setStatusMsg({ type: 'success', text: "QUERY_COMPLETE: Sector is empty (0 rows)." });
        }
        setResults(dbData);
      } 
      else {
        // Falls ein einzelnes Objekt kommt, in Array packen für das Grid
        setResults(dbData ? [dbData] : []);
      }
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: `KERNEL_EXCEPTION: ${err.message || "Unknown error"}`
      });
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
            <p className="text-[10px] text-white/20 mt-2 tracking-[0.3em]">STABLE_STREAMS_ACTIVE</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* EDITOR TERMINAL */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col">
          <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TerminalIcon size={14} className="text-orange-500" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 text-xs">Query_Input</span>
            </div>
          </div>
          
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-48 bg-transparent p-6 text-sm text-green-500 outline-none resize-none caret-orange-500"
            spellCheck="false"
          />
          
          <div className="bg-white/[0.02] p-4 flex justify-end gap-4 border-t border-white/5">
            <button 
              onClick={handleRunQuery}
              disabled={isExecuting}
              className={`flex items-center gap-3 bg-[#ff4d00] text-black px-8 py-3 rounded-full font-black uppercase text-xs transition-all shadow-[0_0_20px_rgba(255,77,0,0.3)] ${isExecuting ? 'opacity-50' : 'hover:scale-105'}`}
            >
              {isExecuting ? <Activity size={14} className="animate-spin" /> : <Zap size={14} />} 
              Execute Kernel Query
            </button>
          </div>
        </div>

        {/* FEEDBACK & RESULTS */}
        <div className="space-y-6">
          {/* Status Messages (Success/Error) */}
          {statusMsg && (
            <div className={`p-6 rounded-2xl border flex items-center gap-4 animate-in slide-in-from-top-4 duration-300 ${
              statusMsg.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-green-500/10 border-green-500/50 text-green-500'
            }`}>
              {statusMsg.type === 'error' ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
              <span className="text-xs font-black uppercase tracking-widest">{statusMsg.text}</span>
            </div>
          )}

          {/* Grid/Table Toggle */}
          {results && results.length > 0 && (
            <div className="flex items-center justify-between px-4">
              <span className="text-[10px] font-bold text-[#ff4d00] uppercase tracking-widest">Stream_Output</span>
              <div className="flex bg-white/5 rounded-lg p-1">
                <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-orange-600 text-black" : "text-white/40"}`}><LayoutGrid size={14} /></button>
                <button onClick={() => setViewMode("table")} className={`p-1.5 rounded-md ${viewMode === "table" ? "bg-orange-600 text-black" : "text-white/40"}`}><TableIcon size={14} /></button>
              </div>
            </div>
          )}

          {/* Render Logic */}
          {results && results.length > 0 && (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {results.map((row, idx) => (
                  <div key={idx} className="bg-[#050505] border border-white/5 rounded-2xl p-5 hover:border-orange-600/30 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[7px] text-white/20 uppercase tracking-tighter">Node_0{idx}</span>
                      <Cpu size={10} className="text-orange-600" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase text-white truncate mb-4">
                      {row.name || row.title || row.full_name || "Data_Record"}
                    </h3>
                    <div className="pt-3 border-t border-white/5 flex justify-between items-end">
                       <span className="text-orange-500 font-black text-xs">{row.price ? `${row.price}€` : (row.id ? `#${row.id}` : 'ACK')}</span>
                       {row.stock !== undefined && <span className="text-[8px] text-green-500 font-bold">{row.stock} IN_CORE</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="text-white/30 uppercase border-b border-white/10 text-left"><th className="pb-3 px-2">Index</th>{Object.keys(results[0]).map(k => <th key={k} className="pb-3 px-2">{k}</th>)}</tr>
                  </thead>
                  <tbody>
                    {results.map((row, i) => (
                      <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.03]">
                        <td className="py-2 px-2 text-white/20">{i}</td>
                        {Object.values(row).map((v: any, j) => <td key={j} className="py-2 px-2 text-white/60">{String(v)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}