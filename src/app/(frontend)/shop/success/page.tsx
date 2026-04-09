import Link from 'next/link';
import { CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function SuccessPage({ searchParams }: { searchParams: { orderId: string } }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#050505] border border-orange-600/30 rounded-[3rem] p-12 text-center shadow-2xl shadow-orange-600/10">
        <div className="inline-flex p-6 bg-orange-600/10 rounded-full text-orange-600 mb-8 animate-bounce">
          <CheckCircleIcon className="size-16" />
        </div>

        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4">
          Sync <span className="text-orange-600">Complete</span>
        </h1>

        <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-12">
          Transaction successfully logged to AETHER_AUDIT_TRAIL
        </p>

        <div className="bg-white/5 rounded-2xl p-6 mb-12 border border-white/5 text-left font-mono">
          <div className="flex justify-between text-[10px] mb-2">
            <span className="text-white/20 uppercase">Order_ID:</span>
            <span className="text-blue-300 font-bold">#{searchParams.orderId}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-white/20 uppercase">Status:</span>
            <span className="text-emerald-500 font-bold uppercase">Distributed</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/shop"
            className="w-full bg-orange-600 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 hover:bg-blue-300 hover:text-orange-600 transition-all"
          >
            Return to Store
          </Link>
          <button className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">
            <DocumentTextIcon className="size-4" /> View Audit Log
          </button>
        </div>
      </div>
    </div>
  );
}
