'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Product,
  ProductCategory,
  ProductBadge,
  PricingUnit,
  Translated,
} from '@/lib/mockData';

/**
 * Catalog store — Zustand + localStorage. The shop owner manages this
 * via /admin/catalog. Initial state ships EMPTY per Adir's directive
 * ("delete everything; leave the shop ready for the owner to fill in").
 *
 * Images are stored as base64 data URLs (admin uploader resizes before
 * persisting; 5MB localStorage cap is shared with the orders store).
 */

export type CatalogProduct = Product & {
  /** Whether the product is visible on the public shop. Default true. */
  visible: boolean;
};

type CatalogState = {
  products: CatalogProduct[];

  // CRUD
  addProduct: (product: Omit<CatalogProduct, 'id'>) => string;
  updateProduct: (id: string, patch: Partial<CatalogProduct>) => void;
  removeProduct: (id: string) => void;
  duplicateProduct: (id: string) => string | null;
  setVisible: (id: string, visible: boolean) => void;
  setInStock: (id: string, inStock: boolean) => void;
  reorderInCategory: (category: ProductCategory, fromIndex: number, toIndex: number) => void;

  // selectors
  findBySlug: (slug: string) => CatalogProduct | undefined;
  findById: (id: string) => CatalogProduct | undefined;
  visibleProducts: () => CatalogProduct[];
  byCategory: (category: ProductCategory) => CatalogProduct[];
  featured: () => CatalogProduct[];
};

function generateId(): string {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useCatalog = create<CatalogState>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (product) => {
        const id = generateId();
        set((state) => ({
          products: [...state.products, { ...product, id } as CatalogProduct],
        }));
        return id;
      },

      updateProduct: (id, patch) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      removeProduct: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),

      duplicateProduct: (id) => {
        const original = get().findById(id);
        if (!original) return null;
        const newId = generateId();
        const copy: CatalogProduct = {
          ...original,
          id: newId,
          slug: `${original.slug}-copy-${Date.now().toString(36).slice(-4)}`,
          name: {
            he: `${original.name.he} (עותק)`,
            ar: `${original.name.ar} (نسخة)`,
          },
        };
        set((state) => ({ products: [...state.products, copy] }));
        return newId;
      },

      setVisible: (id, visible) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, visible } : p)),
        })),

      setInStock: (id, inStock) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, inStock } : p)),
        })),

      reorderInCategory: (category, fromIndex, toIndex) =>
        set((state) => {
          const inCat = state.products.filter((p) => p.category === category);
          const outCat = state.products.filter((p) => p.category !== category);
          if (fromIndex < 0 || fromIndex >= inCat.length) return state;
          if (toIndex < 0 || toIndex >= inCat.length) return state;
          const next = [...inCat];
          const [moved] = next.splice(fromIndex, 1);
          next.splice(toIndex, 0, moved);
          return { products: [...outCat, ...next] };
        }),

      findBySlug: (slug) => get().products.find((p) => p.slug === slug),
      findById: (id) => get().products.find((p) => p.id === id),
      visibleProducts: () => get().products.filter((p) => p.visible !== false),
      byCategory: (category) =>
        get().products.filter((p) => p.category === category && p.visible !== false),
      featured: () =>
        get()
          .products.filter((p) => p.visible !== false && p.badges.includes('bestseller'))
          .slice(0, 4),
    }),
    {
      name: 'mamtaki-dalia-catalog-v1',
      storage: createJSONStorage(() => localStorage),
      // skip persist on the SSR pass
      skipHydration: false,
    }
  )
);

/* ── Helpers for admin form ──────────────────────────────────────── */

export function blankProduct(category: ProductCategory = 'kanafeh'): Omit<CatalogProduct, 'id'> {
  return {
    slug: '',
    monogram: '',
    name: { he: '', ar: '' },
    tastingNote: { he: '', ar: '' },
    description: { he: '', ar: '' },
    ingredients: { he: '', ar: '' },
    price: 0,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category,
    badges: [],
    inStock: true,
    freshnessHours: 24,
    confirmed: true,
    visible: true,
  };
}

/** Auto-derive a 3-character monogram from the Hebrew product name. */
export function deriveMonogram(hebrewName: string): string {
  const words = hebrewName.trim().split(/\s+/).filter(Boolean);
  const first = (s: string) => transliterateFirstLetter(s).toUpperCase();
  if (words.length >= 3) return `${first(words[0])} · ${first(words[1])} · ${first(words[2])}`;
  if (words.length === 2) return `${first(words[0])} · ${first(words[1])}`;
  if (words.length === 1) return first(words[0]);
  return 'M · D';
}

function transliterateFirstLetter(word: string): string {
  // Very rough Hebrew → Latin first-letter map for monograms.
  const map: Record<string, string> = {
    א: 'A', ב: 'B', ג: 'G', ד: 'D', ה: 'H', ו: 'V', ז: 'Z', ח: 'H',
    ט: 'T', י: 'Y', כ: 'K', ך: 'K', ל: 'L', מ: 'M', ם: 'M', נ: 'N',
    ן: 'N', ס: 'S', ע: 'A', פ: 'P', ף: 'P', צ: 'Tz', ץ: 'Tz', ק: 'Q',
    ר: 'R', ש: 'S', ת: 'T',
  };
  const ch = word[0] ?? '';
  return map[ch] ?? (ch.match(/[a-zA-Z]/) ? ch : 'M');
}

/** Auto-derive a URL slug from the Hebrew name. */
export function deriveSlug(hebrewName: string): string {
  const t: Record<string, string> = {
    א: 'a', ב: 'b', ג: 'g', ד: 'd', ה: 'h', ו: 'v', ז: 'z', ח: 'h',
    ט: 't', י: 'y', כ: 'k', ך: 'k', ל: 'l', מ: 'm', ם: 'm', נ: 'n',
    ן: 'n', ס: 's', ע: 'a', פ: 'p', ף: 'p', צ: 'ts', ץ: 'ts', ק: 'q',
    ר: 'r', ש: 'sh', ת: 't',
  };
  return hebrewName
    .toLowerCase()
    .split('')
    .map((c) => t[c] ?? (c.match(/[a-z0-9-]/) ? c : '-'))
    .join('')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** Re-export types for convenience. */
export type { ProductCategory, ProductBadge, PricingUnit, Translated };
