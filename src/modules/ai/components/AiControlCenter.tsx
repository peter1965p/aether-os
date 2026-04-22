"use client";

import { useState } from "react";
import { BrainCircuit, AlertTriangle, Zap, RefreshCw } from "lucide-react";
import { syncAetherBrain, uploadBrainToS3 } from "../ai.actions";

export function AiControlCenter({ initialStrategy }: { initialStrategy: any }) {
    const [status, setStatus] = useState<'idle' | 'syncing' | 'success'>('idle');
    const [message, setMessage] = useState(initialStrategy.message);

    const handleSystemSync = async () => {
        setStatus('syncing');
        setMessage("AETHER KERNEL: INITIATING NEURAL UPLINK...");

        try {
            // 1. Vektoren generieren
            await syncAetherBrain();
            // 2. Ab nach Frankfurt (S3)
            await uploadBrainToS3();

            setMessage("KI-ANALYSE ABGESCHLOSSEN. 6 NODES KRITISCH.");
            setStatus('success');
        } catch (error) {
            setMessage("SYSTEM ERROR: UPLINK FAILED.");
            setStatus('idle');
        }
    };

    return (
        <div className="bg-[#0a0a0a] border border-blue-500/20 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/40 transition-all">
            <div className={`absolute top-4 right-8 flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black tracking-tighter ${status === 'syncing' ? 'animate-pulse bg-blue-500/10 border-blue-500 text-blue-500' : 'bg-amber-500/10 border-amber-500/50 text-amber-500'}`}>
                {status === 'syncing' ? <RefreshCw size={10} className="animate-spin" /> : <AlertTriangle size={10} />}
                {status === 'syncing' ? 'UPLINK ACTIVE' : initialStrategy.status}
            </div>

            <div className="max-w-2xl">
                <p className="text-2xl font-black italic text-white uppercase mb-2">"{message}"</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed mb-6">
                    Der AETHER-Kern spiegelt lokale Vektordaten in Echtzeit in den Frankfurter S3-Bucket.
                </p>

                <button
                    onClick={handleSystemSync}
                    disabled={status === 'syncing'}
                    className="group/btn relative px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition-all disabled:opacity-50 overflow-hidden"
                >
              <span className="relative z-10 flex items-center gap-2">
                <Zap size={14} className={status === 'syncing' ? 'animate-pulse' : ''} />
                  {status === 'syncing' ? 'Syncing Brain...' : 'Trigger System Scan'}
              </span>
                </button>
            </div>

            {/* Die Empfehlungen rendern wir hier drunter weiter wie gehabt */}
            {initialStrategy.recommendations.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {initialStrategy.recommendations.map((rec: any, i: number) => (
                        <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl group/card hover:border-blue-500/50 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black text-blue-500 tracking-tighter uppercase">{rec.product}</span>
                                <span className="text-[8px] text-gray-500 uppercase">Prio: {rec.priority}</span>
                            </div>
                            <p className="text-xs font-bold text-white mb-2">{rec.action}</p>
                            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                <div className={`h-full bg-blue-500 ${rec.priority === 'CRITICAL' ? 'w-full bg-red-500 animate-pulse' : 'w-[40%]'}`} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}