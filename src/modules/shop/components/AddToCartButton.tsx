'use client'
import { useState } from 'react';
import { ShoppingBag, Check, Loader2, AlertCircle } from 'lucide-react';
import { addToCartAction } from '@/modules/shop/actions';

export default function AddToCartButton({ productId }: { productId: number }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handlePress = async () => {
    setStatus('loading');
      const result = await addToCartAction(Number(productId));

    if (result.success) {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } else {
      setStatus('error');
    }
  };

  return (
      <div className="relative">
        <button
            onClick={handlePress}
            disabled={status === 'loading'}
            className={`size-12 rounded-xl transition-all active:scale-95 flex items-center justify-center shadow-xl border ${
                status === 'loading' ? 'bg-zinc-800 border-blue-500/50 text-blue-500' :
                    status === 'success' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' :
                        status === 'error' ? 'bg-red-600/20 border-red-600 text-red-500' :
                            'bg-white/[0.03] border-white/10 text-orange-600 hover:border-orange-600/50 hover:bg-orange-600/10'
            }`}
            title={status === 'idle' ? 'Init Checkout' : status}
        >
          {status === 'loading' && <Loader2 size={20} className="animate-spin" />}
          {status === 'success' && <Check size={20} />}
          {status === 'error' && <AlertCircle size={20} />}
          {status === 'idle' && <ShoppingBag size={20} />}
        </button>

        {/* Dein Mini-Toast bleibt, aber etwas dezenter */}
        {status === 'success' && (
            <div className="absolute -top-10 -right-2 animate-in fade-in zoom-in duration-300">
              <div className="bg-emerald-500 text-black text-[7px] font-black py-1 px-2 rounded-sm uppercase tracking-tighter whitespace-nowrap border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                Asset Logged
              </div>
            </div>
        )}
      </div>
  );
}