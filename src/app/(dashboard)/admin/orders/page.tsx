/**
 * AETHER OS // MODULE: ORDERS
 * Pfad: src/app/(dashboard)/admin/orders/page.tsx
 * Zweck: Zentrale Verwaltung aller Kundenbestellungen.
 * Status: TypeScript Optimized & UI Stable.
 */

import { createClient } from '@/lib/db';
import { ShoppingBag, Filter, ChevronRight, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

// 1. ÜBERBLICK ÜBER DIE STRUKTUR //
// Wir definieren das Interface außerhalb, damit es im gesamten File verfügbar ist.
interface OrderWithCustomer {
    id: number;
    total_price: number;
    status: string;
    order_date: string;
    customers: {
        full_name: string;
        customer_number: number;
    } | null;
}

export default async function AdminOrdersPage() {
    const supabase = await createClient();

    // Abfrage der Bestellungen inklusive Kundendaten aus Supabase
    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
            id,
            total_price,
            status,
            order_date,
            customers (
                full_name,
                customer_number
            )
        `)
        .order('order_date', { ascending: false });

    if (error) {
        console.error("AETHER_UPLINK_ERROR // Orders could not be fetched", error);
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700 font-mono">

            {/* HEADER */}
            <header className="flex justify-between items-end">
                <div className="space-y-2">
                    <p className="text-blue-500 text-[10px] font-black tracking-[0.5em] uppercase">
                        Registry // Transactions
                    </p>
                    <h1 className="text-5xl font-black uppercase tracking-tighter italic text-white">
                        Order_<span className="text-blue-500">Log</span>
                    </h1>
                </div>

                <div className="flex gap-4">
                    <button className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-all group">
                        <Filter size={14} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-white">Filter_Nodes</span>
                    </button>
                </div>
            </header>

            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Total_Volume"
                    value={`${orders?.length || 0}`}
                    sub="Registered_Orders"
                />

                <StatCard
                    label="Revenue_Uplink"
                    value={`${orders?.reduce((acc: number, curr: any) => acc + (Number(curr.total_price) || 0), 0).toFixed(2)}€`}
                    sub="Total_Value"
                    color="text-green-500"
                />

                <StatCard
                    label="Pending_Nodes"
                    value={`${orders?.filter((o: any) => o.status === 'pending').length || 0}`}
                    sub="Action_Required"
                    color="text-yellow-500"
                />
            </div>

            {/* ORDERS TABLE */}
            <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="p-6 text-[9px] font-black uppercase text-gray-500 tracking-widest">Order_ID</th>
                        <th className="p-6 text-[9px] font-black uppercase text-gray-500 tracking-widest">Customer</th>
                        <th className="p-6 text-[9px] font-black uppercase text-gray-500 tracking-widest">Status</th>
                        <th className="p-6 text-[9px] font-black uppercase text-gray-500 tracking-widest">Date</th>
                        <th className="p-6 text-[9px] font-black uppercase text-gray-500 tracking-widest text-right">Amount</th>
                        <th className="p-6 text-[9px] font-black uppercase text-gray-500 tracking-widest text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                    {/* Wir mappen hier mit dem Interface OrderWithCustomer */}
                    {orders?.map((order: OrderWithCustomer) => (
                        <tr key={order.id} className="group hover:bg-white/[0.01] transition-colors">
                            <td className="p-6">
                                <span className="text-blue-500 font-bold">#ORD-{order.id.toString().padStart(4, '0')}</span>
                            </td>
                            <td className="p-6">
                                <div className="flex flex-col">
                                    <span className="text-white font-bold uppercase text-xs">{order.customers?.full_name || 'UNKNOWN_ENTITY'}</span>
                                    <span className="text-[8px] text-gray-600 font-mono tracking-widest uppercase">Node_{order.customers?.customer_number}</span>
                                </div>
                            </td>
                            <td className="p-6">
                                <StatusBadge status={order.status} />
                            </td>
                            <td className="p-6 text-[10px] text-gray-400 uppercase">
                                {format(new Date(order.order_date), 'dd.MM.yyyy // HH:mm')}
                            </td>
                            <td className="p-6 text-right">
                                <span className="text-white font-black italic">{Number(order.total_price).toFixed(2)} €</span>
                            </td>
                            <td className="p-6 text-right">
                                <div className="flex justify-end gap-2">
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="p-2 bg-white/5 rounded-lg border border-white/10 hover:border-blue-500 transition-all text-gray-400 hover:text-blue-500"
                                    >
                                        <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- HELPER COMPONENTS ---

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        pending: "bg-yellow-500/10 border-yellow-500/20 text-yellow-500",
        shipped: "bg-blue-500/10 border-blue-500/20 text-blue-500",
        completed: "bg-green-500/10 border-green-500/20 text-green-500",
        cancelled: "bg-red-500/10 border-red-500/20 text-red-500",
    };

    return (
        <span className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${styles[status] || styles.pending}`}>
            {status || 'undefined'}
        </span>
    );
}

function StatCard({ label, value, sub, color = "text-blue-500" }: any) {
    return (
        <div className="bg-[#050505] border border-white/5 p-6 rounded-[2rem] shadow-xl space-y-2">
            <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em]">{label}</p>
            <h4 className={`text-2xl font-black italic uppercase ${color}`}>{value}</h4>
            <p className="text-[7px] text-gray-800 font-mono uppercase tracking-widest">{sub}</p>
        </div>
    );
}