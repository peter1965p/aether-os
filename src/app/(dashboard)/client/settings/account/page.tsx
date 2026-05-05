"use client";

/**
 * AETHER OS // CLIENT PROFILE PAGE
 * Nutzt useActionState, um den TS2322 Fehler zu vermeiden.
 */

import { useActionState } from "react";
import { updateClientProfileAction, ActionState } from "@/modules/users/user.actions";

export default function AccountPage() {
    // 1. Initialer Status (nichts passiert bisher)
    const initialState: ActionState = null;

    /**
     * 2. Der Hook verbindet die Server Action mit dem Frontend.
     * state: Enthält Erfolg/Fehler-Meldungen der Action.
     * formAction: Die Version der Funktion, die ins <form action={...}> kommt.
     * isPending: Wahr, während die DB-Abfrage läuft.
     */
    const [state, formAction, isPending] = useActionState(
        updateClientProfileAction,
        initialState
    );

    return (
        <div className="max-w-4xl mx-auto py-10 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
                    Profil Einstellungen
                </h1>
                <p className="text-zinc-500 text-xs tracking-widest uppercase">AETHER OS // Identity Management</p>
            </div>

            {/* 3. Wir nutzen formAction statt der rohen Funktion */}
            <form action={formAction} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl transition-all hover:border-blue-500/20">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em] ml-2">
                                Anzeigename
                            </label>
                            <input
                                name="userName" // Wichtig: Muss mit formData.get("userName") übereinstimmen
                                type="text"
                                required
                                placeholder="Dein Name für das System..."
                                className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                            />
                        </div>
                    </div>

                    {/* 4. Feedback-Bereich für den Nutzer */}
                    {state?.success && (
                        <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                            <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest animate-pulse text-center">
                                {state.message}
                            </p>
                        </div>
                    )}

                    {state?.error && (
                        <div className="mt-6 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                            <p className="text-red-600 text-[10px] font-black uppercase tracking-widest text-center">
                                {state.error}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isPending}
                        className={`px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg
                            ${isPending
                            ? 'bg-zinc-800 text-zinc-500 cursor-wait'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 hover:scale-[1.02]'
                        }`}
                    >
                        {isPending ? "Synchronisiere..." : "Profil aktualisieren"}
                    </button>
                </div>
            </form>
        </div>
    );
}