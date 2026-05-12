'use client';

import { create } from 'zustand';
import { products, type Product } from '@/lib/mockData';

export type CartItem = {
  productId: string;
  weight: number; // in kg
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;

  // actions
  add: (productId: string, weight: number) => void;
  remove: (productId: string) => void;
  setWeight: (productId: string, weight: number) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;

  // selectors
  count: () => number;
  subtotal: () => number;
};

/**
 * Cart store — Zustand, visual-only for Phase 1/2.
 *  – Pre-seeded with two items so the drawer never starts empty in demos.
 *    Remove the seed for production by setting initial `items: []`.
 *  – `weight` is stored in kilograms; price = product.pricePerKg * weight.
 */
export const useCart = create<CartState>((set, get) => ({
  // Demo seed — two items so the drawer is rich on first open
  items: [
    { productId: 'p_kanafeh_classic', weight: 1.0 },
    { productId: 'p_baklava_pistachio', weight: 0.5 },
  ],
  isOpen: false,

  add: (productId, weight) =>
    set((state) => {
      const existing = state.items.find((it) => it.productId === productId);
      if (existing) {
        return {
          items: state.items.map((it) =>
            it.productId === productId
              ? { ...it, weight: clampWeight(it.weight + weight) }
              : it
          ),
          isOpen: true,
        };
      }
      return {
        items: [...state.items, { productId, weight: clampWeight(weight) }],
        isOpen: true,
      };
    }),

  remove: (productId) =>
    set((state) => ({
      items: state.items.filter((it) => it.productId !== productId),
    })),

  setWeight: (productId, weight) =>
    set((state) => ({
      items: state.items.map((it) =>
        it.productId === productId ? { ...it, weight: clampWeight(weight) } : it
      ),
    })),

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),

  count: () => get().items.length,
  subtotal: () =>
    get().items.reduce((sum, it) => {
      const product = products.find((p) => p.id === it.productId);
      if (!product) return sum;
      return sum + product.pricePerKg * it.weight;
    }, 0),
}));

function clampWeight(w: number): number {
  if (Number.isNaN(w)) return 0.5;
  const min = 0.5;
  const max = 5;
  return Math.max(min, Math.min(max, Math.round(w * 4) / 4));
}

/** Convenience: look up the full Product for a cart item. */
export function getProductForItem(item: CartItem): Product | undefined {
  return products.find((p) => p.id === item.productId);
}
