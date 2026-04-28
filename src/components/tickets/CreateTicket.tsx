"use client";

import React, { useState } from "react"; // HIER: useState importiert!
import { Plus, Calendar, Zap, X, Activity } from "lucide-react";
import { createAetherTicket } from "@/modules/inventory/actions";

export function NewTicketDispatcher() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Der Button, der immer im Header zu sehen ist */}
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] py-2 px-4 uppercase tracking-[0.2em] flex items-center gap-2 transition-all border border-blue-400/50 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
                <Plus className="w-3 h-3" /> Initialize Node
            </button>

            {/* Das Slide-Over Panel */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-[#050505] border-l border-blue-500/30 p-8 h-full shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                                New <span className="text-blue-500 font-black">Dispatch</span>
                            </h2>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form action={async (formData) => {
                            const result = await createAetherTicket(formData);
                            if (result.success) {
                                setIsOpen(false);
                            } else {
                                alert("KERNEL_ERROR: Deployment failed");
                            }
                        }} className="space-y-6">

                            <div className="space-y-1">
                                <label className="text-[9px] font-mono text-blue-500 uppercase font-bold tracking-widest">Target / Subject</label>
                                <input
                                    name="subject"
                                    required
                                    className="w-full bg-[#0a0a0a] border border-gray-800 p-3 text-sm text-white focus:border-blue-500 outline-none font-mono"
                                    placeholder="HARDWARE_REPLACEMENT"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-mono text-blue-500 uppercase font-bold tracking-widest">Telemetry / Message</label>
                                <textarea
                                    name="message"
                                    required
                                    className="w-full bg-[#0a0a0a] border border-gray-800 p-3 text-sm text-white h-32 focus:border-blue-500 outline-none font-mono"
                                    placeholder="Analyze and report..."
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-mono text-blue-500 uppercase font-bold tracking-widest flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> Scheduled Execution
                                </label>
                                <input
                                    type="datetime-local"
                                    name="scheduled_date"
                                    required
                                    className="w-full bg-[#0a0a0a] border border-gray-800 p-3 text-sm text-white focus:border-blue-500 outline-none font-mono [color-scheme:dark]"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-white text-black font-black py-4 uppercase text-[11px] tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2 mt-8"
                            >
                                <Zap className="w-4 h-4 fill-current" /> Deploy Command
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}