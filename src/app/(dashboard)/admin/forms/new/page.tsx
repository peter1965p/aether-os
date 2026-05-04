import FormEditorShared from "@/components/admin/FormEditorShared";

export default function NewFormPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Ohne initialId startet die Component im Erstellungs-Modus */}
      <FormEditorShared />
    </div>
  );
}