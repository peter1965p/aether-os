"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Search, 
  User, 
  Package, 
  FileText, 
  ArrowRight,
  Database
} from "lucide-react";
import Link from "next/link";

interface GlobalResult {
  id: string;
  label: string;
  type: 'Kunde' | 'Mitarbeiter' | 'Produkt' | 'Rechnung';
  url: string;
  details?: string;
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState<GlobalResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!query) return;
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
      setLoading(false);
    }
    fetchResults();
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Kunde': return <User size={16} className="text-blue-500" />;
      case 'Produkt': return <Package size={16} className="text-orange-500" />;
      case 'Rechnung': return <FileText size={16} className="text-purple-500" />;
      default: return <Database size={16} className="text-emerald-500" />;
    }
  };

  return (
    <div className="p-10 space-y-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
          SEARCH <span className="text-blue-500 italic">RESULTS</span>
        </h1>
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
          <Search size={12} />
          <span>QUERY_STRING: "{query}"</span>
          <span className="text-gray-800">//</span>
          <span>FOUND: {results.length} NODES</span>
        </div>
      </div>

      {/* RESULT TABLE */}
      <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-[2rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.05] bg-white/[0.02]">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Type</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Identifier / Name</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="px-8 py-10 bg-white/[0.01]" />
                </tr>
              ))
            ) : results.length > 0 ? (
              results.map((res) => (
                <tr key={res.id + res.type} className="group hover:bg-blue-500/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/[0.03] rounded-lg border border-white/5">
                        {getIcon(res.type)}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{res.type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black italic uppercase text-white tracking-tight group-hover:text-blue-400 transition-colors">
                        {res.label}
                      </span>
                      <span className="text-[8px] font-bold text-gray-700 tracking-widest uppercase">NODE_ID: {res.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ACTIVE_NODE</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                      href={res.url} 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-blue-600 hover:border-blue-500 transition-all active:scale-95"
                    >
                      Access Node <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                   <p className="text-[10px] font-black text-red-900 uppercase tracking-[0.5em]">No Data synchronized for this Query</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}