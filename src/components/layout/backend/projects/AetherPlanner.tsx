"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  createProjectTask,
  deleteProjectTask,
} from "@/modules/inventory/actions";

import "./calendar-fix.css";

const FullCalendar = dynamic(() => import("@fullcalendar/react"), {
  ssr: false,
});

export default function AetherPlanner({
  tasks = [],
  projects = [],
  staff = [],
}: {
  tasks?: any[];
  projects?: any[];
  staff?: any[];
  tickets?: any[]; // Akzeptiert jetzt auch tickets falls sie so genannt werden
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [priority, setPriority] = useState("medium");

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
    setIsModalOpen(true);
  };

  const handleEventClick = async (info: any) => {
    if (confirm(`AETHER OS // Task "${info.event.title}" wirklich löschen?`)) {
      // FIX: Wir übergeben die ID als String (da UUID), kein parseInt!
      await deleteProjectTask(info.event.id.toString());
    }
  };

  const handleSubmit = async () => {
    if (!title || !projectId) {
      setStatusMsg("ERROR: DATA INCOMPLETE");
      setTimeout(() => setStatusMsg(null), 3000);
      return;
    }

    const res = await createProjectTask({
      title,
      // FIX: Auch hier IDs als String behandeln, es sei denn deine DB nutzt explizit Integer
      project_id: projectId, 
      staff_id: staffId || undefined,
      start_date: selectedDate!,
      end_date: selectedDate!,
      priority,
    });

    if (res.success) {
      setStatusMsg("SYSTEM: TASK RECORDED");
      setTimeout(() => {
        setStatusMsg(null);
        setIsModalOpen(false);
        setTitle("");
        setProjectId("");
        setStaffId("");
        setPriority("medium");
      }, 1500);
    } else {
      setStatusMsg("DATABASE ERROR");
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  return (
    <div className="relative aether-planner-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        themeSystem="standard"
        height="auto"
        aspectRatio={2.5}
        events={tasks}
        locale="de"
      />

      {isModalOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-[#030303] border-l border-white/10 z-[9999] p-10 shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
          <header className="mb-10">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">
              New <span className="text-amber-500">Task</span>
            </h3>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-2">
              Scheduling for {selectedDate}
            </p>
          </header>

          {statusMsg && (
            <div className={`mb-6 p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest animate-pulse ${
              statusMsg.includes("ERROR") ? "bg-red-500/10 border-red-500/50 text-red-500" : "bg-amber-500/10 border-amber-500/50 text-amber-500"
            }`}>
              {statusMsg}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-amber-500/50 uppercase tracking-widest">Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-amber-500 transition-colors font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-amber-500/50 uppercase tracking-widest">Assign Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-amber-500 appearance-none cursor-pointer"
              >
                <option value="">Select Project...</option>
                {projects.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.project_name || p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-amber-500/50 uppercase tracking-widest">Responsible Staff</label>
              <select
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-amber-500 appearance-none cursor-pointer"
              >
                <option value="">Unassigned</option>
                {staff.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-amber-500/50 uppercase tracking-widest">Priority</label>
              <div className="flex gap-2">
                {["low", "medium", "high"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                      priority === p ? "bg-amber-500 border-amber-500 text-black" : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <button onClick={handleSubmit} className="w-full bg-amber-500 text-black font-black p-5 rounded-2xl uppercase italic hover:bg-white transition-all shadow-lg shadow-amber-500/20">
                Save to Engine
              </button>
              <button onClick={() => setIsModalOpen(false)} className="w-full text-white/20 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}