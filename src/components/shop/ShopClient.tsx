'use client'

import { useState } from 'react'
import CartDrawer from './CartDrawer'
import { ShoppingBagIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

export default function ShopClient({
  children,
  cartItems
}: {
  children: React.ReactNode,
  cartItems: any[]
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const totalItems = cartItems.reduce((acc, item) => acc + item.menge, 0)

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 animate-in fade-in duration-1000">

      {/* GLOBAL HEADER */}
      <header className="flex justify-between items-start mb-20">
        <div>
          <p className="text-orange-600 font-mono text-[10px] tracking-[0.4em] uppercase mb-2">
            Aether OS // external_distribution_node
          </p>
          <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">
            System <span className="text-orange-600 underline decoration-1 underline-offset-8">Store</span>
          </h1>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
            <GlobeAltIcon className="size-4 text-blue-300" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Node: Online_Access</span>
          </div>

          {/* DER TRIGGER-BUTTON FÜR DEN DRAWER */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl group hover:border-orange-600/50 transition-all active:scale-95"
          >
            <ShoppingBagIcon className="size-4 text-orange-600 group-hover:animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Assets: <span className="text-orange-600">{totalItems}</span>
            </span>
          </button>
        </div>
      </header>

      {/* HIER RENDERT DIE PRODUKT-LISTE */}
      {children}

      {/* DER NEUE DRAWER (MIT HEADLESS UI) */}
      <CartDrawer
        open={isDrawerOpen}
        setOpen={setIsDrawerOpen}
        items={cartItems}
      />
    </div>
  )
}
