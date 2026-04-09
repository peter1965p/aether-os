// src/components/sections/BlockSection.tsx
export default function BlockSection({ section, isEditing, onUpdate }: any) {
  if (isEditing) {
    return (
      <section className="py-16 px-6 md:px-20 bg-white">
        <div className="max-w-4xl mx-auto space-y-4">
          <input
            className="w-full text-4xl font-extrabold outline-none border-b border-dashed border-slate-200 focus:border-blue-500 transition-colors"
            value={section.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
          />
          <textarea
            className="w-full text-lg text-slate-600 outline-none border-b border-dashed border-slate-200 focus:border-blue-500 min-h-[150px] resize-none"
            value={section.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
          />
        </div>
      </section>
    );
  }

  // Normaler Anzeige-Modus (Frontend)
  return (
    <section className="py-16 px-6 md:px-20 bg-white text-slate-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-6">{section.title}</h2>
        <div className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">
          {section.content}
        </div>
      </div>
    </section>
  );
}
