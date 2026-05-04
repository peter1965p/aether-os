"use client";

import React, { useState } from "react";
import { Plus, Save, Layout } from "lucide-react";
import { createNewSection, savePageSections } from "../actions";

export default function EditorClient({
  initialSections,
  pageId,
}: {
  initialSections: any[];
  pageId: string;
}) {
  const [sections, setSections] = useState(initialSections || []);

  const handleAdd = async (type: string) => {
    const res = await createNewSection(pageId, type, sections.length);
    if (res.success) {
      setSections([...sections, res.newSection]);
    } else {
      alert("Fehler: " + res.error);
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="flex justify-between mb-8 border-b pb-4">
        <h1 className="font-black uppercase tracking-widest text-slate-400 text-xs">
          AETHER OS // EDITOR
        </h1>
        <button
          onClick={() => savePageSections(pageId, sections)}
          className="bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-tighter shadow-lg hover:bg-blue-700 transition-all"
        >
          Speichern
        </button>
      </div>

      <div className="space-y-4 mb-12">
        {sections.length > 0 ? (
          sections.map((s: any) => (
            <div
              key={s.id}
              className="p-6 border-2 border-slate-100 rounded-2xl bg-slate-50/50"
            >
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                {s.section_type}
              </span>
              <input
                className="block w-full bg-transparent text-xl font-bold mt-2 outline-none"
                value={s.title || ""}
                onChange={(e) =>
                  setSections(
                    sections.map((sec) =>
                      sec.id === s.id ? { ...sec, title: e.target.value } : sec,
                    ),
                  )
                }
              />
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed rounded-[2rem] text-slate-300 uppercase text-[10px] font-bold tracking-[0.3em]">
            Keine Sektionen
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleAdd("header")}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-blue-500 transition-all shadow-sm"
        >
          <Plus size={14} /> + Header
        </button>
        <button
          onClick={() => handleAdd("block")}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-blue-500 transition-all shadow-sm"
        >
          <Plus size={14} /> + Inhaltsblock
        </button>
      </div>
    </div>
  );
}
