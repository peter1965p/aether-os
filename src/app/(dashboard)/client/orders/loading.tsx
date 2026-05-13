import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-mono">
            <div className="relative">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
                <div className="absolute inset-0 blur-2xl bg-blue-500/20 animate-pulse" />
            </div>
            <div className="mt-6 text-[10px] uppercase tracking-[0.8em] text-blue-500 font-black italic">
                Aether // Syncing_Data_Stream...
            </div>
        </div>
    );
}