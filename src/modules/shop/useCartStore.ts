/**
 * Pfad: @/modules/shop/useCartStore.ts
 */
import { create } from 'zustand';

interface CartStore {
    isOpen: boolean;
    items: any[]; // Hier liegen deine Produkte im Warenkorb
    openCart: () => void;
    closeCart: () => void;
    setItems: (items: any[]) => void; // Methode zum Aktualisieren der Items
}

export const useCartStore = create<CartStore>((set) => ({
    isOpen: false,
    items: [],
    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
    setItems: (items) => set({ items }),
}));