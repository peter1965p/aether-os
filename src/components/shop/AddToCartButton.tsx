'use client'
import { useState } from 'react';
import { ShoppingBag, Check, Loader2, AlertCircle } from 'lucide-react';
import { addToCartAction } from '@/modules/shop/actions';

export default function AddToCartButton({ productId }: { productId: number }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handlePress = async () => {
    setStatus('loading');
    const result = await addToCartAction(productId);

    if (result.success) {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handlePress}
        disabled={status === 'loading'}
        className={`px-8 py-4 rounded-2xl font-black italic uppercase text-xs tracking-widest transition-all active:scale-95 flex items-center gap-3 shadow-lg ${
          status === 'loading' ? 'bg-blue-300 text-orange-600' :
          status === 'success' ? 'bg-emerald-500 text-black' :
          status === 'error' ? 'bg-red-600 text-white' :
          'bg-orange-600 text-blue-300 hover:bg-blue-300 hover:text-orange-600 shadow-orange-600/20'
        }`}
      >
        {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
        {status === 'success' && <Check size={16} />}
        {status === 'error' && <AlertCircle size={16} />}
        {status === 'idle' && <ShoppingBag size={16} />}

        {status === 'loading' ? 'Syncing...' :
         status === 'success' ? 'Added' :
         status === 'error' ? 'DB Error' : 'Init Checkout'}
      </button>

      {/* Mini-Toast-Overlay */}
      {status === 'success' && (
        <div className="absolute -top-12 left-0 right-0 animate-bounce">
          <div className="bg-emerald-500 text-black text-[9px] font-black py-1 px-3 rounded-full text-center uppercase tracking-tighter">
            System Synchronized // Asset Logged
          </div>
        </div>
      )}
    </div>
  );
}
