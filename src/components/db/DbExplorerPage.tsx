'use client';

import React, { useMemo, useState, useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Panel, BackgroundVariant } from 'reactflow';
import 'reactflow/dist/style.css';
import { AetherEditor } from '@/components/admin/AetherEditor';
import { ChevronLeft, ChevronRight, Zap, Database, Activity } from 'lucide-react';
import { executeSql, getDbSchema, updateTableCell, deleteTableRow, generateDbDump } from '@/modules/db/actions';

// Saubere Typ-Definitionen für das AETHER OS
interface DbColumn {
  name: string;
  type: string;
}

interface DbTable {
  table: string;
  columns: DbColumn[];
}

export default function DbExplorerPage() {
  const [code, setCode] = useState("-- Aether Kernel SQL\nSELECT * FROM site_settings;");
  const [results, setResults] = useState<{ success: boolean; data: any[]; error?: string } | null>(null);
  const [schema, setSchema] = useState<DbTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTable, setActiveTable] = useState("site_settings");
  const [isTreeOpen, setIsTreeOpen] = useState(true);

  const refreshSchema = async () => {
    const res = await getDbSchema();
    if (res.success && res.schema) {
      setSchema(res.schema as DbTable[]);
    }
  };

  useEffect(() => { refreshSchema(); }, []);

  const handleExecute = async (overrideCode?: string) => {
    setLoading(true);
    const query = overrideCode || code;
    const response = await executeSql(query);
    setResults(response as any);
    const match = query.match(/FROM\s+(\w+)/i);
    if (match) setActiveTable(match[1]);
    setLoading(false);
  };

  // React Flow Nodes & Edges
  const nodes = useMemo(() => schema.map((t, idx) => ({
    id: t.table,
    data: { label: (
      <div className="text-left font-mono p-1">
        <div className="text-amber-500 font-black border-b border-amber-500/20 mb-2 uppercase text-[10px] italic">{t.table}</div>
        {t.columns.slice(0, 5).map(c => (
          <div key={c.name} className="flex justify-between gap-4 text-[7px] opacity-60">
            <span>{c.name}</span>
            <span className="text-amber-700 italic">{c.type}</span>
          </div>
        ))}
      </div>
    )},
    position: { x: (idx % 4) * 250, y: Math.floor(idx / 4) * 220 },
    style: { background: '#050505', color: '#fff', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '15px', width: 200 },
  })), [schema]);

  const edges = useMemo(() => {
    const e: any[] = [];
    schema.forEach(t => {
      t.columns.forEach(c => {
        if (c.name.endsWith('_id')) {
          const target = c.name.replace('_id', 's');
          if (schema.find(st => st.table === target)) {
            e.push({ id: `e-${t.table}-${target}`, source: t.table, target: target, animated: true, style: { stroke: '#f59e0b', opacity: 0.2 } });
          }
        }
      });
    });
    return e;
  }, [schema]);

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      <header className="p-4 border-b border-white/5 flex justify-between items-center bg-[#050505]">
        <div className="flex items-center gap-4">
          <Database className="text-amber-500" size={20} />
          <h1 className="text-xl font-black italic uppercase tracking-tighter">DATABASE <span className="text-amber-500">KERNEL</span></h1>
        </div>
        <div className="flex items-center gap-4 px-3 py-1 bg-amber-500/5 border border-amber-500/20 rounded-full">
          <Activity size={10} className="text-amber-500 animate-pulse" />
          <span className="text-[8px] font-black uppercase text-amber-500 tracking-widest italic">AETHER Link Active</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className={`${isTreeOpen ? 'w-64' : 'w-12'} transition-all duration-500 border-r border-white/5 bg-[#050505] relative`}>
          <button onClick={() => setIsTreeOpen(!isTreeOpen)} className="absolute -right-3 top-10 z-50 bg-amber-500 text-black rounded-full p-1 shadow-glow hover:scale-110 transition-transform">
            {isTreeOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
          <div className={`p-6 overflow-y-auto h-full custom-scrollbar ${!isTreeOpen && 'hidden'}`}>
            <p className="text-[9px] font-black text-amber-500/50 uppercase mb-6 tracking-widest">System Tables</p>
            {schema.map((t) => (
              <div key={t.table} className="mb-3 group cursor-pointer" onClick={() => { setCode(`SELECT * FROM ${t.table};`); handleExecute(`SELECT * FROM ${t.table};`); }}>
                <span className="text-[11px] font-bold text-gray-500 group-hover:text-amber-500 transition-colors uppercase italic tracking-tighter">{t.table}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
          {/* ER-DIAGRAMM HERO */}
          <section className="h-[45%] bg-[#050505] rounded-[2.5rem] border border-white/10 overflow-hidden relative shadow-2xl">
            <ReactFlow nodes={nodes} edges={edges} fitView>
              <Background variant={BackgroundVariant.Dots} color="#f59e0b" gap={20} style={{ opacity: 0.05 }} />
              <Controls className="bg-black border-amber-500/20 fill-amber-500" />
              <Panel position="top-left" className="bg-black/80 p-3 rounded-xl border border-amber-500/20 backdrop-blur-md m-4">
                <span className="text-[9px] font-black text-amber-500 uppercase italic tracking-[0.2em]">Neural Architecture Map</span>
              </Panel>
            </ReactFlow>
          </section>

          {/* EDITOR */}
          <section className="h-[25%] rounded-[2.5rem] overflow-hidden border border-white/5 bg-black relative group shadow-inner">
            <button onClick={() => handleExecute()} className="absolute top-4 right-8 z-10 flex items-center gap-2 bg-amber-500 text-black px-5 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-white transition-all shadow-glow">
              <Zap size={12} fill="currentColor" /> Inject Query
            </button>
            <AetherEditor code={code} language="sql" onChange={(v) => setCode(v || "")} onExecute={handleExecute} />
          </section>

          {/* MATRIX */}
          <section className="h-[30%] bg-[#050505] rounded-[2.5rem] border border-white/5 p-8 overflow-hidden flex flex-col shadow-2xl">
            <p className="text-[9px] font-black text-gray-700 uppercase mb-4 tracking-[0.4em]">Kernel Output // {activeTable}</p>
            <div className="flex-1 overflow-auto rounded-xl border border-white/[0.03] bg-black/20 custom-scrollbar text-[10px] font-mono">
              {results?.data && results.data.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-[#0a0a0a] z-10">
                    <tr className="border-b border-white/10">
                      {Object.keys(results.data[0]).map(k => <th key={k} className="p-4 text-amber-900 uppercase font-black tracking-widest">{k}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {results.data.map((row:any, i:number) => (
                      <tr key={i} className="border-b border-white/[0.02] hover:bg-amber-500/[0.03] transition-colors">
                        {Object.values(row).map((v:any, j:number) => <td key={j} className="p-4 text-gray-500 group-hover:text-gray-300">{String(v)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="h-full flex items-center justify-center text-white/5 uppercase tracking-[0.5em] italic">No Uplink Data</div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}