import { getTickets } from "@/modules/inventory/actions"; 
import { revalidatePath } from "next/cache";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
    const tickets = await getTickets();

    return (
        <div className="p-6 bg-black min-h-screen text-white font-sans">
            {/* Header Bereich */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter uppercase italic">
                        Command <span className="text-blue-900">Center</span> // Tickets
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">AETHER OS v16.1.6 - Neural Resolution Active</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-900 px-4 py-2 rounded text-blue-400 text-xs font-mono">
                    SYSTEM LOAD: 0.4% | AI SYNC: STABLE
                </div>
            </div>

            {/* Ticket Grid - Hier werden ServiceNow & Jira erschlagen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tickets.map((ticket: any) => (
                    <div
                        key={ticket.id}
                        className="bg-[#0a0a0a] border border-gray-800 p-5 rounded-lg hover:border-blue-500 transition-all group relative overflow-hidden"
                    >
                        {/* Hintergrund-Glühen bei aktiven Tickets */}
                        <div className="absolute -inset-px bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  Node: {ticket.asset_node_id?.slice(0, 8) || "GENERIC_NODE"}
                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded border ${
                                    ticket.status === 'resolved' ? 'border-green-500 text-green-500' : 'border-orange-500 text-orange-500'
                                }`}>
                  {ticket.status?.toUpperCase()}
                </span>
                            </div>

                            <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                                {ticket.subject}
                            </h3>

                            <p className="text-gray-400 text-sm line-clamp-2 mb-4 italic">
                                "{ticket.message}"
                            </p>

                            <hr className="border-gray-800 my-4" />

                            {/* AI Insight Bereich */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Neural Diagnosis</span>
                                </div>
                                <div className="bg-black/50 p-3 rounded border border-gray-900 text-[11px] font-mono text-gray-300">
                                    {ticket.automated_action_log?.result || "Analyzing issue via Aether Brain..."}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-5 flex gap-2">
                                <button className="flex-1 bg-white text-black text-[11px] font-bold py-2 rounded hover:bg-blue-500 hover:text-white transition-colors uppercase">
                                    Execute Fix
                                </button>
                                <button className="px-3 bg-gray-900 border border-gray-700 rounded hover:bg-red-500/20 hover:border-red-500 transition-colors">
                                    <span className="text-[10px]">✕</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {tickets.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-gray-900 rounded-xl">
                    <p className="text-gray-600 font-mono italic">No active threats found. System secure.</p>
                </div>
            )}
        </div>
    );
}