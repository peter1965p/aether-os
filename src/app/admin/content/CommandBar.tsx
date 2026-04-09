"use client";

import { useState } from "react";
import {
  Search,
  Edit3,
  Type,
  CheckCircle,
  PlusSquare,
  ChevronDown,
} from "lucide-react";

export default function CommandBar({ pages }: { pages: any[] }) {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleAction = (type: string) => {
    if (!selectedNode) return;
    if (type === "edit")
      window.location.href = `/admin/content/edit/${selectedNode.id}`;
    if (type === "rename") {
      const n = prompt("Node Name:", selectedNode.title);
      if (n) alert("In Arbeit: Umbenennen zu " + n);
    }
  };

  return (
    <div className="w-full bg-slate-800 p-1 flex items-center gap-1 rounded-xl mb-8 shadow-[0_0_30px_rgba(0,255,0,0.15)] relative">
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 px-4 py-2 bg-slate-500 border-orange-600 text-orange-600 font-black uppercase italic text-[10px] rounded-lg min-w-[200px] justify-between"
        >
          <div className="flex items-center gap-2">
            <Search size={14} />
            <span className="truncate">
              {selectedNode ? selectedNode.title : "Seite Auswählen"}
            </span>
          </div>
          <ChevronDown
            size={12}
            className={isDropdownOpen ? "rotate-180" : ""}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 border border-blue-600 rounded-2xl z-[100] p-2 shadow-2xl">
            {pages.map((p) => (
              <button
                key={`cmd-select-${p.id}`}
                onClick={() => {
                  setSelectedNode(p);
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between mb-1
                  ${selectedNode?.id === p.id ? "bg-slate-800 text-blue-600" : "text-orange-600 hover:bg-slate-600"}
                `}
              >
                <span className="text-[10px] font-black uppercase italic">
                  {p.title}
                </span>
                {p.is_system_node === 1 && (
                  <span className="text-[7px] border border-current px-1 rounded">
                    System
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-6 w-[1px] bg-black/10 mx-2" />

      <div className="flex items-center gap-1">
        {[
          { id: "edit", label: "Bearbeiten", icon: Edit3 },
          { id: "rename", label: "Umbenennen", icon: Type },
          { id: "base_set", label: "Basis setzen", icon: CheckCircle },
        ].map((btn) => (
          <button
            key={`btn-action-${btn.id}`}
            disabled={!selectedNode}
            onClick={() => handleAction(btn.id)}
            className={`flex items-center gap-2 px-4 py-2 font-black uppercase italic text-[10px] rounded-lg transition-all
              ${!selectedNode ? "opacity-20 cursor-not-allowed text-blue-600" : "bg-slate-600 text-orange-600 hover:scale-105 active:scale-95"}
            `}
          >
            <btn.icon size={14} /> {btn.label}
          </button>
        ))}
      </div>

      <button className="flex items-center gap-2 px-6 py-2 bg-slate-600 text-orange-600 font-black uppercase italic text-[10px] rounded-lg hover:bg-slate-800 hover:text-white transition-all ml-auto">
        <PlusSquare size={14} /> Neue Seite erstellen
      </button>
    </div>
  );
}
