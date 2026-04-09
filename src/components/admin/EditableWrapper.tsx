// src/components/admin/EditableWrapper.tsx
import { Move, Trash2, Edit3 } from "lucide-react";

export default function EditableWrapper({
  children,
  onDelete,
  isEditing,
}: {
  children: React.ReactNode;
  onDelete: () => void;
  isEditing: boolean;
}) {
  if (!isEditing) return <>{children}</>;

  return (
    <div className="relative group border-2 border-transparent hover:border-blue-500/50 transition-all">
      {/* Admin-Toolbar die beim Hover erscheint */}
      <div className="absolute -top-10 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <div className="bg-slate-800 border border-blue-800 flex rounded-lg overflow-hidden shadow-xl">
          <button className="p-2 hover:bg-white/5 text-zinc-400">
            <Move size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-500/20 text-red-600 border-l border-white/10"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
