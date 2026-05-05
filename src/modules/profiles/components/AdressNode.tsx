/**
 * AETHER OS // PROFILES // COMPONENT
 * Pfad: src/modules/profiles/components/AddressNode.tsx
 * Zweck: Steuert den Wechsel zwischen Anzeige und Bearbeitungsmodus der Adresse.
 */

'use client';

import { useState } from 'react';
import { MapPin, Edit3 } from 'lucide-react';
import AddressForm from './AdressForm';

interface AddressNodeProps {
    customer: {
        customer_number: string;
        address_street: string | null;
        address_city: string | null;
        address_zip: string | null;
    };
}

export default function AddressNode({ customer }: AddressNodeProps) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <section className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] hover:border-blue-500/20 transition-all duration-500 shadow-2xl">
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <MapPin size={20} className="text-blue-500" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Postal_Node</h3>
                </div>

                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                        title="Edit_Address"
                    >
                        <Edit3 size={16} />
                    </button>
                )}
            </div>

            {isEditing ? (
                <AddressForm
                    customer={customer}
                    onClose={() => setIsEditing(false)}
                />
            ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="text-white font-bold text-sm leading-relaxed">
                        {customer.address_street || 'NO_STREET_SET'}<br />
                        {customer.address_zip || '0000'} {customer.address_city || 'NO_CITY_SET'}<br />
                        <span className="text-gray-500 uppercase text-[10px]">Region: Germany</span>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <p className="text-[8px] text-gray-700 uppercase font-black italic">
                            Status: Address_Buffer_Stable
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}