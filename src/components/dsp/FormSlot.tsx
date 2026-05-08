import { createClient } from "@/lib/db";
import FormRenderer from "@/components/forms/FormRenderer";

interface FormSlotProps {
    slug: string;
}

export default async function FormSlot({ slug }: FormSlotProps) {
    const db = await createClient();

    // Wir säubern den Slug (falls im Form Center mit "/" gespeichert)
    const cleanSlug = slug.startsWith("/") ? slug.substring(1) : slug;

    const { data: form, error } = await db
        .from("forms")
        .select("*")
        .eq("slug", cleanSlug)
        .single();

    if (error || !form) {
        return (
            <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-[2rem] text-center">
                <p className="text-[10px] font-mono uppercase text-red-500 tracking-[0.4em] animate-pulse">
                    Critical Error // Form_Node_Offline: {cleanSlug}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            {/* Dekorativer System-Indikator */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-30" />

            <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">
            Secure Inlet // {form.name}
          </span>
                </div>
                <span className="text-[8px] font-mono text-white/10 uppercase italic">
          Encrypted_Transmission_Active
        </span>
            </div>

            <FormRenderer
                formId={form.id}
                formName={form.name}
                fields={form.fields}
            />
        </div>
    );
}