"use client";

import {
  getProjects,
  getTickets,
  getProjectTasks,
  createNewProject,
} from "@/modules/inventory/actions";
import AetherPlanner from "@/components/layout/backend/projects/AetherPlanner";
import { useEffect, useState } from "react";

// Wir definieren ein Interface, damit TypeScript nicht mehr meckert
interface EngineData {
  projects: any[];
  tickets: any[];
  tasks: any[];
}

export default function ProjectManagementPage() {
  // Hier sagen wir TypeScript explizit, was in den State darf
  const [data, setData] = useState<EngineData>({
    projects: [],
    tickets: [],
    tasks: [],
  });

  const loadData = async () => {
    try {
      const [p, t, ts] = await Promise.all([
        getProjects(),
        getTickets(),
        getProjectTasks(),
      ]);

      setData({
        projects: p || [],
        tickets: t || [],
        tasks: ts || [],
      });
    } catch (error) {
      console.error("AETHER OS // FETCH_ERROR", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProject = async () => {
    const name = prompt("Name des neuen Projekts:");
    if (name) {
      const res = await createNewProject(name);
      if (res.success) {
        await loadData(); // UI nach Erfolg neu laden
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white p-8 space-y-12">
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <h1 className="text-7xl font-black italic uppercase tracking-tighter">
          Project <span className="text-violet-900">Engine</span>
        </h1>
        <button
          onClick={handleCreateProject}
          className="bg-violet-900 text-black px-8 py-4 rounded-full font-black uppercase italic hover:bg-green-400 transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)]"
        >
          + Create Project
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            {/* Dein animierter Kreis */}
            <div
              className="w-24 h-24 border-4 border-green-400 rounded-full border-t-transparent animate-spin"
              style={{ animationDuration: "3s" }}
            />
          </div>
          <p className="text-[10px] font-black text-violet-900 uppercase mb-4 tracking-[0.4em]">
            Active Projects
          </p>
          <p className="text-7xl font-black italic">{data.projects.length}</p>
        </div>

        <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px]">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-[0.4em]">
            Support Tickets
          </p>
          <p className="text-7xl font-black italic text-violet-900">
            {data.tickets.length}
          </p>
        </div>
      </div>

      <section className="p-10 bg-white/[0.01] border border-white/5 rounded-[48px]">
        <div className="flex justify-between items-center mb-12 text-xl font-black uppercase text-white/40 tracking-[0.5em]">
          <h2>Timeline</h2>
          <span className="bg-violet-900 text-black text-[10px] px-4 py-2 rounded-full italic">
            {data.tasks.length} PLANNED
          </span>
        </div>
        {/* WICHTIG: Hier geben wir die Projekte an den Planner weiter! */}
        <AetherPlanner tasks={data.tasks} projects={data.projects} />
      </section>
    </div>
  );
}
