'use client';

import { create } from 'zustand';
import type { Product } from '@/lib/mockData';

/**
 * The catalog on the client. The server reads it from the database (the
 * shop manages it in /admin) and CatalogProvider puts it here on every
 * page load, so prices and stock are never kept in the browser.
 */
type CatalogState = {
  products: Product[];
  findById: (id: string) => Product | undefined;
};

export const useCatalog = create<CatalogState>()((set, get) => ({
  products: [],
  findById: (id) => get().products.find((p) => p.id === id),
}));
