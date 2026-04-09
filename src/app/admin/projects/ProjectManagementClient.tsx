'use client';

import React, { useState } from 'react';
import { Plus, ListTodo, X } from 'lucide-react';
import AetherPlanner from "@/components/layout/backend/projects/AetherPlanner";
import NewTicketModal from "@/components/layout/backend/projects/NewTicketModal";

export default function ProjectManagementClient({ 
  initialProjects, 
  initialTickets 
}: { 
  initialProjects: any[], 
  initialTickets: any[] 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [projects] = useState(initialProjects);
  const [allTickets] = useState(initialTickets);

  return (
    <div className="min-h-screen bg-[#030303] text-white p-8 space-y-12">
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <h1 className="text-7xl font-black italic uppercase">Project <span className="text-orange-600">Engine</span></h1>
        <button onClick={() => setIsModalOpen(true)} className="px-8 py-4 bg-amber-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px]">
          <Plus className="inline mr-2" size={16} /> New Task
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px]">
          <p className="text-[10px] font-black text-white/30 uppercase mb-4">Active Projects</p>
          <p className="text-6xl font-black italic">{projects.length}</p>
        </div>
        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px]">
          <p className="text-[10px] font-black text-white/30 uppercase mb-4">Global Tickets</p>
          <p className="text-6xl font-black italic text-amber-500">{allTickets.length}</p>
        </div>
      </div>

      <section id="planner-view" className="p-10 bg-white/[0.01] border border-white/5 rounded-[48px]">
        <h2 className="text-lg font-black uppercase text-white/60 mb-10 flex items-center gap-3">
          <ListTodo size={20} className="text-amber-500" /> Timeline
        </h2>
        {/* HINWEIS: AetherPlanner akzeptiert jetzt 'tickets' als prop */}
        <AetherPlanner tasks={allTickets} projects={projects} />
      </section>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
          <div className="relative w-full max-w-xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute -top-12 right-0 text-white/40 uppercase font-black text-[10px]">
              <X size={20} className="inline mr-1"/> Close
            </button>
            <NewTicketModal projects={projects} />
          </div>
        </div>
      )}
    </div>
  );
}