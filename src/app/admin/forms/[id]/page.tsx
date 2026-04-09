import FormEditorShared from "@/components/admin/FormEditorShared";

export default function EditFormPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-black">
      {/* Die ID wird aus der URL extrahiert und lädt die DB-Daten */}
      <FormEditorShared initialId={params.id} />
    </div>
  );
}