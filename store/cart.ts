'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useCatalog } from './catalog';
import { seedCatalog } from '@/lib/data/catalogSeed';
import type { Product } from '@/lib/mockData';
import { MAX_GRAMS, MIN_GRAMS, STEP_GRAMS } from '@/lib/weight';

export type CartItem = {
  productId: string;
  /** kg for per-kg products (200 g steps), otherwise a count. */
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;

  add: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;

  count: () => number;
  subtotal: () => number;
};

const STEP_KG = STEP_GRAMS / 1000;

/** Same rules as the product page: 200 g steps, 200 g – 10 kg; 1–20 units. */
function clamp(product: Product | undefined, qty: number): number {
  if (Number.isNaN(qty)) return product?.unit === 'per_kg' ? 1 : 1;
  if (product?.unit === 'per_kg') {
    const stepped = Math.round(qty / STEP_KG) * STEP_KG;
    return Math.round(Math.max(MIN_GRAMS / 1000, Math.min(MAX_GRAMS / 1000, stepped)) * 1000) / 1000;
  }
  return Math.max(1, Math.min(20, Math.round(qty)));
}

/** Resolve products from the live catalog store, falling back to the starter catalog the site shows. */
function getProductSafe(id: string): Product | undefined {
  return useCatalog.getState().findById(id) ?? seedCatalog.find((p) => p.id === id);
}

/** Per-kg prices are per kilo; the line total is rounded like the product page. */
export function lineTotal(product: Product, quantity: number): number {
  return product.unit === 'per_kg' ? Math.round(product.price * quantity) : product.price * quantity;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      add: (productId, quantity) =>
        set((state) => {
          const product = getProductSafe(productId);
          const existing = state.items.find((it) => it.productId === productId);
          if (existing) {
            return {
              items: state.items.map((it) =>
                it.productId === productId ? { ...it, quantity: clamp(product, it.quantity + quantity) } : it
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, { productId, quantity: clamp(product, quantity) }], isOpen: true };
        }),

      remove: (productId) => set((state) => ({ items: state.items.filter((it) => it.productId !== productId) })),

      setQuantity: (productId, quantity) =>
        set((state) => {
          const product = getProductSafe(productId);
          return {
            items: state.items.map((it) => (it.productId === productId ? { ...it, quantity: clamp(product, quantity) } : it)),
          };
        }),

      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),

      count: () => get().items.length,
      subtotal: () =>
        get().items.reduce((sum, it) => {
          const product = getProductSafe(it.productId);
          return product ? sum + lineTotal(product, it.quantity) : sum;
        }, 0),
    }),
    {
      name: 'mamtaki-cart-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
      // Restored on the client after mount (CartDrawer) so server and
      // client render the same empty cart first.
      skipHydration: true,
    }
  )
);

export function getProductForItem(item: CartItem): Product | undefined {
  return getProductSafe(item.productId);
}
