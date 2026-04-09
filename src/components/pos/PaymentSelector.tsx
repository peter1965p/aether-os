// src/components/pos/PaymentSelector.tsx
'use client';

export function PaymentSelector({ onSelect, activeProvider }: any) {
  const providers = [
    { id: 'BANK_TERMINAL', name: 'EC/Girocard', icon: '🏦', desc: 'Lokales Terminal' },
    { id: 'STRIPE', name: 'Stripe Reader', icon: '💳', desc: 'Cloud Payment' },
    { id: 'MANUAL', name: 'Barzahlung', icon: '💶', desc: 'Manuelle Kasse' }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 mt-6">
      {providers.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`p-6 rounded-2xl border transition-all flex items-center justify-between group ${
            activeProvider === p.id 
            ? 'bg-orange-500 border-orange-500 text-black' 
            : 'bg-white/5 border-white/5 text-white hover:border-white/20'
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">{p.icon}</span>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase tracking-widest">{p.name}</div>
              <div className={`text-[8px] uppercase opacity-50 ${activeProvider === p.id ? 'text-black' : 'text-gray-400'}`}>
                {p.desc}
              </div>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${activeProvider === p.id ? 'bg-black' : 'bg-blue-500'} shadow-lg`} />
        </button>
      ))}
    </div>
  );
}