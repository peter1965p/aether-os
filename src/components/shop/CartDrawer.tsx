'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon, ShoppingBagIcon, TrashIcon, CreditCardIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { removeFromCartAction } from '@/modules/shop/actions'
import { finalizeTransactionAction } from '@/modules/shop/actions'
import { useRouter } from 'next/navigation'

interface CartItem {
  id: number
  produkt_id: number
  name: string
  preis: number
  menge: number
}

export default function CartDrawer({
  open,
  setOpen,
  items
}: {
  open: boolean
  setOpen: (open: boolean) => void
  items: CartItem[]
}) {
  const [isSyncing, setIsSyncing] = useState(false)
  const router = useRouter()

  // Berechnung des Gesamtwerts basierend auf deinem ER-Diagramm
  const subtotal = items.reduce((acc, item) => acc + (item.preis * item.menge), 0)

  const handleCheckout = async () => {
    setIsSyncing(true)
    const result = await finalizeTransactionAction()

    if (result.success) {
      setOpen(false)
      // Erfolgreich geloggt im Audit Trail
      router.push(`/shop/success?orderId=${result.orderId}`)
    } else {
      alert(`SYSTEM_SYNC_ERROR: ${result.error}`)
    }
    setIsSyncing(false)
  }

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-[100]">
      {/* Backdrop mit AETHER-Blur-Effekt */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-auto bg-[#050505] border-l border-white/10 shadow-2xl">
                <div className="flex-1 overflow-y-auto px-6 py-8">
                  <div className="flex items-start justify-between border-b border-white/5 pb-6">
                    <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-white">
                      Selected <span className="text-orange-600">Assets</span>
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="relative p-2 text-white/20 hover:text-orange-600 transition-colors"
                      >
                        <XMarkIcon aria-hidden="true" className="size-8" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-12">
                    <div className="flow-root">
                      {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-20 italic">
                          <ShoppingBagIcon className="size-12 mb-4" />
                          <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Assets Logged</p>
                        </div>
                      ) : (
                        <ul role="list" className="-my-6 divide-y divide-white/5">
                          {items.map((product) => (
                            <li key={product.id} className="flex py-6 group">
                              <div className="size-20 shrink-0 overflow-hidden rounded-2xl bg-white/5 border border-white/10 group-hover:border-orange-600/30 transition-all">
                                <div className="flex items-center justify-center h-full text-orange-600/30 group-hover:text-orange-600">
                                  <ShoppingBagIcon className="size-8" />
                                </div>
                              </div>

                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-black italic uppercase tracking-tighter text-white">
                                    <h3>{product.name}</h3>
                                    <p className="ml-4 text-blue-300">{(product.preis * product.menge).toLocaleString('de-DE')} €</p>
                                  </div>
                                  <p className="mt-1 text-[10px] font-bold text-white/20 uppercase tracking-widest italic">
                                    Node_Ref: {product.produkt_id}
                                  </p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-[10px] font-black uppercase tracking-widest">
                                  <p className="text-white/40">Quantity <span className="text-white">{product.menge}</span></p>
                                  <button
                                    type="button"
                                    onClick={async () => await removeFromCartAction(product.id)}
                                    className="text-orange-600/50 hover:text-orange-600 transition-colors flex items-center gap-1"
                                  >
                                    <TrashIcon className="size-3" /> Remove
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* Checkout Section im AETHER OS Style */}
                <div className="border-t border-white/10 bg-white/[0.01] px-6 py-8">
                  <div className="flex justify-between text-sm font-black italic uppercase tracking-widest text-white mb-2">
                    <p>Total Sync Value</p>
                    <p className="text-2xl text-orange-600">{subtotal.toLocaleString('de-DE')} €</p>
                  </div>
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-8">
                    Transaction logged in realtime audit trail.
                  </p>

                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleCheckout}
                      disabled={isSyncing || items.length === 0}
                      className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-orange-600 px-6 py-5 transition-all hover:bg-blue-300 active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >
                      <div className="relative z-10 flex items-center gap-3 text-xs font-black italic uppercase tracking-[0.2em] text-blue-300 group-hover:text-orange-600">
                        {isSyncing ? (
                          <ArrowPathIcon className="size-5 animate-spin" />
                        ) : (
                          <CreditCardIcon className="size-5" />
                        )}
                        {isSyncing ? 'Synchronizing Node...' : 'Finalize Transaction'}
                      </div>
                    </button>

                    <button
                      onClick={() => setOpen(false)}
                      className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
                    >
                      Continue System Browsing &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
