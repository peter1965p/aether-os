"use client";
import { useState, useEffect } from "react";
import { 
  Plus, Trash2, Save, Type, Hash, AtSign, 
  CheckSquare, Layout, MousePointer2, Eye, X, ArrowLeft, GripVertical
} from "lucide-react";
import { createClient } from "@/lib/db";
import FormRenderer from "@/components/forms/FormRenderer";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FieldType = "text" | "number" | "email" | "textarea" | "checkbox";

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
}

interface Props {
  initialId?: string;
}

export default function FormEditorShared({ initialId }: Props) {
  const supabase = createClient();
  const router = useRouter();
  const [formName, setFormName] = useState("NEUES FORMULAR");
  const [fields, setFields] = useState<FormField[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (initialId) {
      const loadData = async () => {
        const { data } = await supabase.from("forms").select("*").eq("id", initialId).single();
        if (data) {
          setFormName(data.name);
          setFields(data.fields || []);
        }
      };
      loadData();
    }
  }, [initialId, supabase]);

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: `NEUES ${type.toUpperCase()} FELD`,
      placeholder: "EINGABE...",
      required: false,
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const saveForm = async () => {
    setIsSaving(true);
    const slug = formName.toLowerCase().trim().replace(/\s+/g, "-");
    const payload = { name: formName, slug, fields, updated_at: new Date() };

    const { error } = initialId 
      ? await supabase.from("forms").update(payload).eq("id", initialId)
      : await supabase.from("forms").insert([payload]);

    if (!error) {
      router.push("/admin/forms");
      router.refresh();
    }
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center px-10 py-6 border-b border-white/5 bg-zinc-950/40 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <Link href="/admin/forms" className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-all border border-white/5">
             <ArrowLeft size={20} />
          </Link>
          <div>
            <input 
              value={formName}
              onChange={(e) => setFormName(e.target.value.toUpperCase())}
              className="bg-transparent text-2xl font-black uppercase italic tracking-tighter outline-none text-white focus:text-blue-500 transition-colors"
            />
            <p className="text-blue-500 text-[9px] font-black tracking-[0.3em] uppercase mt-1">
              {initialId ? `UPDATE_SEQUENCE // ID: ${initialId}` : "INITIALIZING_NEW_NODE"}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={() => setShowPreview(true)} className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-zinc-900 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:border-blue-500/50 transition-all">
            <Eye size={14} className="text-blue-500" /> Vorschau
          </button>
          <button onClick={saveForm} disabled={isSaving} className="bg-[#b33927] hover:bg-[#d4442f] px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(179,57,39,0.2)]">
            <Save size={14} /> {isSaving ? "SYNCING..." : "Speichern"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR: HARDWARE LIBRARY */}
        <aside className="w-80 border-r border-white/5 p-8 bg-zinc-950/20 backdrop-blur-sm overflow-y-auto shadow-2xl">
          <h3 className="text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase mb-8">Hardware Library</h3>
          <div className="space-y-3">
            {[
              { type: "text", icon: <Type size={16}/>, label: "Textfeld" },
              { type: "email", icon: <AtSign size={16}/>, label: "E-Mail" },
              { type: "number", icon: <Hash size={16}/>, label: "Zahl" },
              { type: "textarea", icon: <Layout size={16}/>, label: "Textbereich" },
              { type: "checkbox", icon: <CheckSquare size={16}/>, label: "Checkbox" }
            ].map((btn) => (
              <button 
                key={btn.type}
                onClick={() => addField(btn.type as FieldType)}
                className="w-full flex items-center justify-between p-5 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-blue-500/50 hover:bg-zinc-800 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 group-hover:text-blue-500 transition-colors">{btn.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{btn.label}</span>
                </div>
                <Plus size={14} className="text-slate-700 group-hover:text-white" />
              </button>
            ))}
          </div>
        </aside>

        {/* CANVAS: EDITOR */}
        <main className="flex-1 p-12 overflow-y-auto bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black">
          {fields.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] text-slate-700 space-y-4">
               <MousePointer2 size={48} className="opacity-20 animate-pulse" />
               <p className="text-[10px] font-black uppercase tracking-[0.4em]">Warten auf Input Sequence...</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {fields.map((field, idx) => (
                <div key={field.id} className="group relative bg-zinc-900/40 border border-white/5 p-8 rounded-[2rem] hover:border-white/10 transition-all backdrop-blur-md">
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical size={20} className="text-slate-700" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Label</label>
                      <input 
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value.toUpperCase() })}
                        className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-[11px] font-bold tracking-tight focus:border-blue-500/50 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Placeholder</label>
                      <input 
                        value={field.placeholder}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-[11px] font-bold tracking-tight focus:border-blue-500/50 outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-6">
                    <div className="flex items-center gap-6">
                      <span className="text-[10px] font-mono text-blue-500/50">#0{idx + 1}</span>
                      <label className="flex items-center gap-3 cursor-pointer group/check">
                        <input 
                          type="checkbox" 
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${field.required ? 'bg-blue-500 border-blue-500' : 'border-white/10 bg-black'}`}>
                          {field.required && <CheckSquare size={12} />}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Pflichtfeld</span>
                      </label>
                    </div>
                    <button onClick={() => deleteField(field.id)} className="p-2 text-slate-700 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MODAL: PREVIEW */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
           <div className="bg-zinc-950 border border-white/10 p-16 rounded-[4rem] w-full max-w-2xl relative shadow-[0_0_100px_rgba(0,0,0,1)]">
              <button onClick={() => setShowPreview(false)} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors">
                <X size={32} />
              </button>
              <FormRenderer formId="preview" formName={formName} fields={fields} />
           </div>
        </div>
      )}
    </div>
  );
}