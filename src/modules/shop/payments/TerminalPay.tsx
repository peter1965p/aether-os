'use client'

import { finalizeTransactionAction } from "../actions";
import { useCartStore } from "../useCartStore";
import { useState } from "react";
import { Zap, Loader2 } from "lucide-react";

export default function TerminalPay({ userData }: { userData: { email: string; full_name: string } }) {
    const [loading, setLoading] = useState(false);
    const fetchItems = useCartStore((state: any) => state.fetchItems);

    const handlePayment = async () => {
        setLoading(true);
        // Nutzt deine bestehende Engine aus der actions.ts
        const result = await finalizeTransactionAction(userData);

        if (result.success) {
            await fetchItems(); // Navbar-Sync
            window.location.href = `/shop/success?token=${result.magicToken}`; //
        } else {
            setLoading(false);
            alert("SYSTEM_ERROR: Uplink rejected.");
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 py-4 font-black italic uppercase rounded-xl transition-all flex items-center justify-center gap-3"
        >
            {loading ? <Loader2 className="animate-spin" /> : <><Zap size={20} /> Initiate_Uplink</>}
        </button>
    );
}