/**
 * AETHER OS // PROFILES // COMPONENT
 * Pfad: src/modules/profiles/components/AddressForm.tsx
 */

'use client';

import { useState } from 'react';
import { updateCustomerAddress } from '../actions';
import { Save, X, Loader2 } from 'lucide-react';

interface AddressFormProps {
    customer: any;
    onClose: () => void;
}

export default function AddressForm({ customer, onClose }: AddressFormProps) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        address_street: customer.address_street || '',
        address_city: customer.address_city || '',
        address_zip: customer.address_zip || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await updateCustomerAddress(customer.customer_number, form);

        setLoading(false);
        if (result.success) {
            onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-3">
                <input
                    placeholder="STRASSE & HAUSNUMMER"
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-blue-500 transition-all font-mono"
                    value={form.address_street}
                    onChange={e => setForm({...form, address_street: e.target.value})}
                    required
                />
                <div className="grid grid-cols-3 gap-3">
                    <input
                        placeholder="PLZ"
                        className="col-span-1 bg-black border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-blue-500 transition-all font-mono"
                        value={form.address_zip}
                        onChange={e => setForm({...form, address_zip: e.target.value})}
                        required
                    />
                    <input
                        placeholder="STADT"
                        className="col-span-2 bg-black border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-blue-500 transition-all font-mono"
                        value={form.address_city}
                        onChange={e => setForm({...form, address_city: e.target.value})}
                        required
                    />
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-black py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-white transition-all"
                >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Commit_Changes
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all"
                >
                    <X size={14} />
                </button>
            </div>
        </form>
    );
}