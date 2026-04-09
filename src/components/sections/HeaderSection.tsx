// HeaderSection.tsx
export default function HeaderSection({ section }: { section: any }) {
  return (
    <section className="py-20 flex flex-col items-center text-center">
      <h1
        className={`font-black italic uppercase tracking-tighter ${section.content_json?.fontSize || "text-8xl"}`}
      >
        {section.title}
      </h1>
      {section.subtitle && (
        <p className="text-white/40 font-mono uppercase tracking-[0.5em] text-xs mt-4">
          {section.subtitle}
        </p>
      )}
    </section>
  );
}
