// src/components/SectionRenderer.tsx
import HeaderSection from "./sections/HeaderSection";
import BlockSection from "./sections/BlockSection"; // Neu importieren

const SECTION_COMPONENTS: Record<string, React.FC<any>> = {
  header: HeaderSection,
  block: BlockSection, // Hier registrieren (entspricht 'section_type' in der DB)
};

export function SectionRenderer({ section }: { section: any }) {
  const Component = SECTION_COMPONENTS[section.section_type];

  if (!Component) {
    return (
      <div className="p-10 border-2 border-dashed border-blue-700 text-red-600 text-center uppercase text-[10px] font-black italic">
        Fehler: Sektions-Typ "{section.section_type}" nicht im Kernel
        registriert!
      </div>
    );
  }

  return <Component section={section} />;
}
