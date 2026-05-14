'use client';

import { create } from 'zustand';
import { useCatalog } from './catalog';
import type { Product } from '@/lib/mockData';

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;

  add: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;

  count: () => number;
  subtotal: () => number;
};

function clamp(product: Product | undefined, qty: number): number {
  if (Number.isNaN(qty)) return product?.minWeight ?? 1;
  if (!product) return Math.max(1, qty);
  if (product.unit === 'per_kg') {
    const min = product.minWeight ?? 0.5;
    const max = 5;
    return Math.max(min, Math.min(max, Math.round(qty * 4) / 4));
  }
  return Math.max(1, Math.min(20, Math.round(qty)));
}

/** Resolve products from the live catalog store. */
function getProductSafe(id: string): Product | undefined {
  return useCatalog.getState().findById(id);
}

export const useCart = create<CartState>((set, get) => ({
  // Empty by default — catalog is empty, owner adds products via admin.
  items: [],
  isOpen: false,

  add: (productId, quantity) =>
    set((state) => {
      const product = getProductSafe(productId);
      const existing = state.items.find((it) => it.productId === productId);
      if (existing) {
        return {
          items: state.items.map((it) =>
            it.productId === productId
              ? { ...it, quantity: clamp(product, it.quantity + quantity) }
              : it
          ),
          isOpen: true,
        };
      }
      return {
        items: [...state.items, { productId, quantity: clamp(product, quantity) }],
        isOpen: true,
      };
    }),

  remove: (productId) =>
    set((state) => ({ items: state.items.filter((it) => it.productId !== productId) })),

  setQuantity: (productId, quantity) =>
    set((state) => {
      const product = getProductSafe(productId);
      return {
        items: state.items.map((it) =>
          it.productId === productId ? { ...it, quantity: clamp(product, quantity) } : it
        ),
      };
    }),

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),

  count: () => get().items.length,
  subtotal: () =>
    get().items.reduce((sum, it) => {
      const product = getProductSafe(it.productId);
      if (!product) return sum;
      return sum + product.price * it.quantity;
    }, 0),
}));

export function getProductForItem(item: CartItem): Product | undefined {
  return getProductSafe(item.productId);
}
