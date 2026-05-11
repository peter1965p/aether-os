'use client'

import CartDrawer from './CartDrawer'
import { useCartStore } from "@/modules/shop/useCartStore"

export default function ShopClient({
                                       children,
                                       cartItems
                                   }: {
    children: React.ReactNode,
    cartItems: any[]
}) {
    // Wir brauchen hier keinen lokalen State mehr!
    // Der Drawer im Inneren hört jetzt direkt auf den Store.

    return (
        <>
            {children}
            <CartDrawer items={cartItems} />
        </>
    )
}