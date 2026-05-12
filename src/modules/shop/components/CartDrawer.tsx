'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import {
    CreditCard,
    Loader2,
    ShoppingBag,
    X,
    Trash2
} from "lucide-react";
import { removeFromCartAction, getCartItemsAction, finalizeTransactionAction } from '@/modules/shop/actions'
import { useRouter } from 'next/navigation'
import { useCartStore } from "@/modules/shop/useCartStore"

interface CartItem {
    id: number
    produkt_id: number
    name: string
    preis: number
    menge: number
}

// Wir entfernen 'items' aus den Props, da wir sie intern synchronisieren
export default function CartDrawer() {
    const [localItems, setLocalItems] = useState<CartItem[]>([])
    const [isSyncing, setIsSyncing] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(false)
    const router = useRouter()

    const isOpen = useCartStore((state) => state.isOpen)
    const closeCart = useCartStore((state) => state.closeCart)

    /**
     * SYSTEM_SYNC_PROTOCOL:
     * Diese Funktion holt die aktuellen Assets direkt aus der Datenbank/Server Action.
     */
    const syncBufferData = async () => {
        setIsLoadingData(true)
        try {
            const data = await getCartItemsAction()
            // Wir mappen die Daten auf unser lokales Interface
            setLocalItems(data as CartItem[])
        } catch (error) {
            console.error("BUFFER_SYNC_FAULT", error)
        } finally {
            setIsLoadingData(false)
        }
    }

    /**
     * Trigger den Sync, sobald der Drawer geöffnet wird.
     */
    useEffect(() => {
        if (isOpen) {
            syncBufferData()
        }
    }, [isOpen])

    const subtotal = localItems.reduce((acc, item) => acc + (item.preis * item.menge), 0)

    const handleRemove = async (id: string) => {
        const result = await removeFromCartAction(id)
        if (result.success) {
            // Nach dem Löschen sofort neu synchronisieren
            syncBufferData()
            router.refresh()
        }
    }

    const handleCheckout = async () => {
        setIsSyncing(true)
        try {
            const result = await finalizeTransactionAction()
            if (result.success) {
                closeCart()
                router.push(`/shop/success?orderId=${result.orderId}`)
            } else {
                alert(`SYSTEM_SYNC_ERROR: ${result.error || 'Unknown Rejection'}`)
            }
        } catch (error) {
            alert("CRITICAL_UPLINK_FAILURE")
        } finally {
            setIsSyncing(false)
        }
    }

    return (
        <Dialog open={isOpen} onClose={closeCart} className="relative z-[100]">
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
                                                onClick={closeCart}
                                                className="relative p-2 text-white/20 hover:text-orange-600 transition-colors"
                                            >
                                                <X aria-hidden="true" className="size-8" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-12">
                                        <div className="flow-root">
                                            {isLoadingData ? (
                                                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                                    <Loader2 className="size-8 animate-spin text-orange-600 mb-4" />
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Syncing Buffer...</p>
                                                </div>
                                            ) : localItems.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-20 opacity-20 italic">
                                                    <ShoppingBag className="size-12 mb-4" />
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Assets Logged</p>
                                                </div>
                                            ) : (
                                                <ul role="list" className="-my-6 divide-y divide-white/5">
                                                    {localItems.map((product) => (
                                                        <li key={product.id} className="flex py-6 group">
                                                            {/* Asset Icon Slot */}
                                                            <div className="size-20 shrink-0 overflow-hidden rounded-2xl bg-white/5 border border-white/10 group-hover:border-orange-600/30 transition-all">
                                                                <div className="flex items-center justify-center h-full text-orange-600/30 group-hover:text-orange-600">
                                                                    <ShoppingBag className="size-8" />
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
                                                                        onClick={() => handleRemove(String(product.id))}
                                                                        className="text-orange-600/50 hover:text-orange-600 transition-colors flex items-center gap-1"
                                                                    >
                                                                        <Trash2 className="size-3" /> Remove
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

                                {/* Footer-Sektor */}
                                <div className="border-t border-white/10 bg-white/[0.01] px-6 py-8">
                                    <div className="flex justify-between text-sm font-black italic uppercase tracking-widest text-white mb-2">
                                        <p>Total Sync Value</p>
                                        <p className="text-2xl text-orange-600">{subtotal.toLocaleString('de-DE')} €</p>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <button
                                            onClick={handleCheckout}
                                            disabled={isSyncing || localItems.length === 0}
                                            className="group relative flex w-full items-center justify-between overflow-hidden rounded-sm border border-blue-500/30 bg-blue-600/10 px-6 py-4 transition-all duration-300 hover:border-blue-500 hover:bg-blue-600/20 disabled:opacity-30"
                                        >
                                            <div className="relative z-10 flex flex-col text-left">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 group-hover:text-white">
                                                  {isSyncing ? "Synchronizing Node..." : "Finalize Transaction"}
                                                </span>
                                            </div>
                                            <div className="relative z-10">
                                                {isSyncing ? (
                                                    <Loader2 size={18} className="animate-spin text-blue-500" />
                                                ) : (
                                                    <CreditCard size={18} className="text-blue-500" />
                                                )}
                                            </div>
                                        </button>

                                        <button
                                            onClick={closeCart}
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