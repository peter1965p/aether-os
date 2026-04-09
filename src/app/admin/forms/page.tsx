"use client";
import { useState, useEffect } from "react";
import { 
  Plus, Trash2, Edit3, Eye, Layout, 
  ExternalLink, Loader2, AlertCircle, X
} from "lucide-react";
import { createClient } from "@/lib/db";
import FormRenderer from "@/components/forms/FormRenderer";
import Link from "next/link";

export default function FormManagerPage() {
  const supabase = createClient();
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewForm, setPreviewForm] = useState<any>(null);

  // Formulare laden
  const fetchForms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setForms(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchForms(); }, []);

  // Formular löschen
  const deleteForm = async (id: string) => {
    if (!confirm("SYSTEM-WARNUNG: Formular endgültig löschen?")) return;
    
    const { error } = await supabase.from("forms").delete().eq("id", id);
    if (!error) setForms(forms.filter(f => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 font-sans">
      
      {/* VORSCHAU MODAL */}
      {previewForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[2.5rem] p-12 overflow-y-auto max-h-[90vh]">
            <button onClick={() => setPreviewForm(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <div className="mb-8">
              <span className="text-blue-500 text-[10px] font-black tracking-[0.3em] uppercase block mb-2">Live Preview</span>
              <h2 className="text-2xl font-black uppercase italic">{previewForm.name}</h2>
            </div>
            <FormRenderer 
              formId={previewForm.id} 
              formName={previewForm.name} 
              fields={previewForm.fields} 
            />
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-end mb-12">
        <div className="space-y-2">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Form Center</h1>
          <div className="flex items-center gap-4">
            <span className="text-blue-500 text-[9px] font-black tracking-[0.3em] uppercase">Status: Operative</span>
            <span className="text-slate-600 text-[9px] font-black tracking-[0.3em] uppercase italic">AETHER OS // DB ACCESS GRANTED</span>
          </div>
        </div>

        <Link 
          href="/admin/forms/new" 
          className="bg-[#b33927] hover:bg-[#d4442f] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-[0_0_30px_rgba(179,57,39,0.2)]"
        >
          <Plus size={16} /> Neues Formular initialisieren
        </Link>
      </div>

      {/* TABLE AREA */}
      <div className="bg-zinc-950/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-600 space-y-4">
            <Loader2 size={32} className="animate-spin text-blue-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Requesting Data Stream...</p>
          </div>
        ) : forms.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <AlertCircle size={40} className="mx-auto text-slate-800" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Keine Datensätze in der Datenbank gefunden.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">ID / Node</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Bezeichnung</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Endpoint (Slug)</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {forms.map((form, index) => (
                <tr key={form.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="p-6 font-mono text-[11px] text-blue-500 opacity-50 group-hover:opacity-100 transition-opacity">
                    #{String(index + 1).padStart(3, '0')}
                  </td>
                  <td className="p-6">
                    <span className="text-sm font-black uppercase italic tracking-tight group-hover:text-blue-400 transition-colors">
                      {form.name}
                    </span>
                    <div className="text-[9px] text-slate-600 font-mono mt-1 uppercase">
                      {form.fields?.length || 0} Felder konfiguriert
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                      <Layout size={12} className="text-slate-600" />
                      /{form.slug}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-end gap-3 opacity-30 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => setPreviewForm(form)}
                        className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                        title="Vorschau"
                      >
                        <Eye size={16} />
                      </button>
                      <Link 
                        href={`/admin/forms/${form.id}`}
                        className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-slate-400 hover:bg-white hover:text-black transition-all"
                        title="Editieren"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button 
                        onClick={() => deleteForm(form.id)}
                        className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-red-500/50 hover:bg-red-500 hover:text-white transition-all"
                        title="Löschen"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}