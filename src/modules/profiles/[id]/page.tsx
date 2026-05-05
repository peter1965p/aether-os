/**
 * AETHER OS // MODULE: PROFILES
 * Pfad: src/modules/profiles/[id]/page.tsx
 * Zweck: Dynamische Profilansicht mit integriertem Message-Center.
 */

import { createClient } from '@/lib/db';
import { notFound } from 'next/navigation';
// Wichtig: Achte auf den korrekten Import-Pfad deiner Komponenten
import AddressNode from '../components/AdressNode';
import CustomerMessageNode from "../components/CustomerMessageNode";
import { User, MapPin, Receipt, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProfilePageProps {
    params: {
        id: string; // Die vierstellige Kundennummer aus der URL
    };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const supabase = await createClient();

    // 1. Datenabfrage über die customer_number (z.B. 1001)
    const { data: customer, error } = await supabase
        .from('customers')
        .select('*')
        .eq('customer_number', params.id)
        .single();

    if (error || !customer) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-10 animate-in fade-in duration-700 font-mono">

            {/* NAVIGATION & STATUS */}
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <Link
                    href="/admin/users"
                    className="text-[10px] text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-2 uppercase font-black tracking-widest"
                >
                    <ArrowLeft size={12} /> Back_to_Registry
                </Link>
                <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-green-500 font-black uppercase tracking-[0.3em]">Identity_Verified</span>
                </div>
            </div>

            {/* HEADER SECTION */}
            <header className="space-y-2">
                <p className="text-blue-500 text-[10px] font-black tracking-[0.5em] uppercase">
                    Profile_Node // {customer.customer_number}
                </p>
                <h1 className="text-6xl font-black uppercase tracking-tighter italic text-white">
                    {customer.full_name || 'UNDEFINED_USER'}
                </h1>
            </header>

            {/* OBERE REIHE: STAMMDATEN & AKTIONEN */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLUMN 1: BASE DATA */}
                <section className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
                    <div className="flex items-center gap-3 text-blue-500">
                        <User size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest">Base_Data</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[9px] text-gray-600 uppercase font-black">Email_Uplink</label>
                            <p className="text-white font-bold truncate">{customer.email}</p>
                        </div>
                        <div>
                            <label className="text-[9px] text-gray-600 uppercase font-black">Member_Since</label>
                            <p className="text-white font-bold">
                                {new Date(customer.created_at).toLocaleDateString('de-DE')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* COLUMN 2: POSTAL NODE */}
                <section className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
                    <div className="flex items-center gap-3 text-blue-500">
                        <MapPin size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest">Postal_Node</h3>
                    </div>
                    <div className="space-y-4">
                        <p className="text-white font-bold leading-relaxed">
                            {customer.address_street || 'STREET_MISSING'}<br />
                            {customer.address_zip || '0000'} {customer.address_city || 'CITY_MISSING'}<br />
                            GERMANY
                        </p>
                        <button className="text-[10px] text-blue-500 border border-blue-500/20 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-black transition-all font-black uppercase">
                            Edit_Address
                        </button>
                    </div>
                </section>

                {/* COLUMN 3: QUICK ACTIONS */}
                <div className="space-y-4">
                    <div className="bg-blue-600 p-6 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-white transition-all">
                        <div className="text-black">
                            <p className="text-[9px] font-black uppercase opacity-50">View_Latest</p>
                            <h4 className="text-lg font-black uppercase italic">Invoices</h4>
                        </div>
                        <Receipt size={24} className="text-black" />
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-blue-600 transition-all">
                        <div className="text-white group-hover:text-black">
                            <p className="text-[9px] font-black uppercase opacity-50">Track_Current</p>
                            <h4 className="text-lg font-black uppercase italic">Orders</h4>
                        </div>
                        <Package size={24} className="group-hover:text-black" />
                    </div>
                </div>
            </div>

            {/* UNTERE REIHE: DAS INTELLIGENCE MESSAGE CENTER */}
            <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-8 shadow-2xl overflow-hidden">
                <CustomerMessageNode customerId={customer.id} />
            </div>

            {/* FOOTER / SYSTEM LOG */}
            <footer className="pt-10 border-t border-white/5">
                <div className="bg-black border border-white/5 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping"></div>
                    <p className="text-[8px] text-gray-600 font-mono uppercase tracking-[0.2em]">
                        System_Log: Profile_Access_Granted // Customer_Node_{customer.customer_number} // Session_Active
                    </p>
                </div>
            </footer>
        </div>
    );
}