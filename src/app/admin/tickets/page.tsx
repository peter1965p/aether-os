import { createClient } from "@/lib/db"; // Dein Supabase Server-Client
import { Zap, Activity, Cpu } from "lucide-react";
import { revalidatePath } from "next/cache";
import { AetherTicket} from "@/types/ticket";
import { ExecuteButton} from "@/components/tickets/ExecuteButton";
import {TerminateButton} from "@/components/tickets/TerminateButton";

export default async function TicketsPage() {
    const supabase = await createClient();

    // 1. Daten aus der frisch erweiterten Tabelle holen
    const { data: tickets, error } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return (
            <div className="p-10 bg-black min-h-screen text-red-500 font-mono">
                CRITICAL_DB_ERROR: Unable to mount ticket_nodes.
            </div>
        );
    }

    return (
        <div className="p-6 bg-black min-h-screen text-white">
            {/* Header bleibt dein geiles Design */}
            <div className="flex justify-between items-center mb-8 px-2">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter uppercase italic">
                        Control <span className="text-blue-900">Center</span> // Tickets
                    </h1>
                    <p className="text-gray-500 text-[10px] font-mono tracking-widest uppercase">
                        Neural Resolution Layer v1.0 // Status: Secure
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-blue-500/5 border border-blue-500/20 px-4 py-2 rounded-sm text-blue-400 text-[10px] font-mono">
                        SYSTEM LOAD: 0.4%
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 px-4 py-2 rounded-sm text-green-400 text-[10px] font-mono uppercase">
                        AI SYNC: STABLE
                    </div>
                </div>
            </div>

            {/* Die dynamische Ticket-Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tickets?.map((ticket: AetherTicket) => (
                    <div
                        key={ticket.id}
                        className="group relative bg-[#050505] border border-gray-900 rounded-none p-5 transition-all hover:border-blue-900"
                    >
                        {/* Node Badge */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-mono text-gray-600 uppercase tracking-tighter">Node ID</span>
                                <span className="text-[11px] font-mono text-gray-300">
                  {ticket.asset_node_id ? ticket.asset_node_id.slice(0, 8) : "GENERIC_NODE"}
                </span>
                            </div>
                            <span className="border border-orange-500/50 px-2 py-0.5 text-[9px] text-orange-500 font-bold uppercase tracking-widest">
                {ticket.status || 'Open'}
              </span>
                        </div>

                        <h2 className="text-lg font-bold tracking-tight mb-1 group-hover:text-blue-400 transition-colors">
                            {ticket.subject}
                        </h2>
                        <p className="text-gray-500 text-xs italic mb-6">
                            "{ticket.message}"
                        </p>

                        {/* Neural Diagnosis Area */}
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2">
                                <Activity className="w-3 h-3 text-blue-500 animate-pulse" />
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Neural Diagnosis</span>
                            </div>
                            <div className="bg-black border border-gray-800 p-4 rounded-sm">
                                <p className="text-[11px] font-mono text-gray-400 leading-relaxed">
                                    {ticket.automated_action_log?.result || "Analysing via Aether Brain... Waiting for Neural Uplink."}
                                </p>
                            </div>
                        </div>

                        {/* Action Row */}
                        <div className="flex gap-2">
                            {ticket.status !== 'resolved' ? (
                            <ExecuteButton ticketId={ticket.id} />
                                ) : (
                                    <div className="flex-1 accent-green-500 border border-blue-900 text-green-400 text-[10px] items-center gap-2">
                                        Command Completed !!!
                                    </div>
                            )}
                            <div className="px-4 bg-[#111] border border-gray-800 text-gray-500 hover:text-red-500 hover:border-red-500/50 transition-all">
                                <span className="text-xs">✕</span>
                                <TerminateButton ticketId={ticket.id}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}