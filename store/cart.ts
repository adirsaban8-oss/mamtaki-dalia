'use client';

import { create } from 'zustand';
import { products, type Product } from '@/lib/mockData';

/**
 * `quantity` is interpreted by product unit:
 *  – per_kg    → weight in kilograms (clamped to product.minWeight)
 *  – per_piece → integer count
 *  – per_box   → integer count
 *
 * The field is still named `quantity` everywhere; for kg products the
 * UI labels it as a weight in the unit suffix.
 */
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

export const useCart = create<CartState>((set, get) => ({
  // Pre-seeded so the drawer is never empty in client demos.
  items: [
    { productId: 'p_kanafeh_classic', quantity: 1.0 },
    { productId: 'p_baklava_pistachio', quantity: 0.5 },
    { productId: 'p_gift_box_signature', quantity: 1 },
  ],
  isOpen: false,

  add: (productId, quantity) =>
    set((state) => {
      const product = products.find((p) => p.id === productId);
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
      const product = products.find((p) => p.id === productId);
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
      const product = products.find((p) => p.id === it.productId);
      if (!product) return sum;
      return sum + product.price * it.quantity;
    }, 0),
}));

export function getProductForItem(item: CartItem): Product | undefined {
  return products.find((p) => p.id === item.productId);
}
