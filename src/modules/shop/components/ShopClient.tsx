/**
 * AETHER OS // SHOP_CLIENT_UNIT
 * Pfad: src/modules/shop/components/ShopClient.tsx
 *
 * Diese Komponente dient als Client-Side Wrapper für den Shop-Bereich.
 * Sie rendert den globalen Warenkorb-Drawer, der nun autonom arbeitet.
 */

'use client'

import CartDrawer from './CartDrawer'

interface ShopClientProps {
    children: React.ReactNode;
    // HINWEIS: cartItems wurde entfernt, da der Drawer 
    // die Daten nun direkt via Server Action (Uplink) bezieht.
}

export default function ShopClient({ children }: ShopClientProps) {
    /**
     * SYSTEM_LOGIK:
     * Der ShopClient ist nun "stateless". Er muss keine Daten mehr an den Drawer
     * durchreichen (Prop-Drilling), was die Performance verbessert und
     * Synchronisationsfehler zwischen Server und Client minimiert.
     */

    return (
        <>
            {/* Rendert die Shop-Inhalte (Produkte, Kategorien etc.) */}
            {children}

            {/* 
                Der CartDrawer wird nun ohne Props aufgerufen. 
                Er triggert seinen Daten-Sync selbstständig, sobald 
                er über den useCartStore geöffnet wird.
            */}
            <CartDrawer />
        </>
    )
}