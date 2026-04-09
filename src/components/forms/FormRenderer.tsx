"use client";
import { useState } from "react";
import { createClient } from "@/lib/db";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

interface FormField {
  id: string;
  type: "text" | "number" | "email" | "textarea" | "checkbox";
  label: string;
  placeholder: string;
  required: boolean;
}

interface FormRendererProps {
  formId: string;
  formName: string;
  fields: FormField[];
}

export default function FormRenderer({ formId, formName, fields }: FormRendererProps) {
  const supabase = createClient();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [honeypot, setHoneypot] = useState(""); // Bot-Schutz

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Wenn der Honeypot gefüllt ist, ist es ein Bot
    
    setStatus("submitting");

    const { error } = await supabase.from("form_submissions").insert([
      {
        form_id: formId,
        data: formData,
        submitted_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Fehler beim Senden:", error);
      setStatus("error");
    } else {
      setStatus("success");
      setFormData({});
    }
  };

  if (status === "success") {
    return (
      <div className="p-12 bg-zinc-950 border border-green-500/20 rounded-[2.5rem] text-center space-y-4">
        <div className="flex justify-center text-green-500">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="text-xl font-black uppercase italic text-white tracking-tighter">Vielen Dank!</h3>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
          Deine Nachricht wurde hocheffizient übermittelt.
        </p>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-6 text-[10px] font-black uppercase text-blue-500 hover:underline tracking-widest"
        >
          Weiteres Formular senden
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-950/50 p-10 border border-white/5 rounded-[3rem]">
      <div className="mb-8">
        <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">{formName}</h2>
        <div className="w-12 h-1 bg-[#b33927] mt-2" />
      </div>

      {/* Unsichtbarer Honeypot für Bots */}
      <input 
        type="text" 
        className="hidden" 
        value={honeypot} 
        onChange={(e) => setHoneypot(e.target.value)} 
      />

      <div className="grid grid-cols-1 gap-6">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">
              {field.label} {field.required && <span className="text-[#b33927]">*</span>}
            </label>
            
            {field.type === "textarea" ? (
              <textarea
                required={field.required}
                placeholder={field.placeholder}
                value={formData[field.id] || ""}
                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-[#b33927] focus:ring-0 outline-none transition-all min-h-[120px]"
              />
            ) : field.type === "checkbox" ? (
              <div className="flex items-center gap-3 p-4 bg-black/40 border border-white/5 rounded-2xl">
                <input
                  type="checkbox"
                  required={field.required}
                  checked={formData[field.id] || false}
                  onChange={(e) => setFormData({ ...formData, [field.id]: e.target.checked })}
                  className="rounded border-white/10 bg-black text-[#b33927] focus:ring-offset-0 focus:ring-0"
                />
                <span className="text-xs text-slate-400 font-medium">{field.placeholder || field.label}</span>
              </div>
            ) : (
              <input
                type={field.type}
                required={field.required}
                placeholder={field.placeholder}
                value={formData[field.id] || ""}
                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-[#b33927] focus:ring-0 outline-none transition-all"
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-[#b33927] hover:bg-[#d4442f] text-white font-black uppercase italic tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-2xl disabled:opacity-50"
      >
        {status === "submitting" ? (
          "Wird gesendet..."
        ) : (
          <>
            Senden <Send size={16} />
          </>
        )}
      </button>

      {status === "error" && (
        <p className="text-red-500 text-[10px] font-black uppercase text-center flex items-center justify-center gap-2">
          <AlertCircle size={14} /> Fehler beim Senden. Bitte erneut versuchen.
        </p>
      )}
    </form>
  );
}