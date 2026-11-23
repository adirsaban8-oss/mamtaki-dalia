'use client';

import { useCatalog } from '@/store/catalog';
import type { Product } from '@/lib/mockData';
import { seedCatalog } from '@/lib/data/catalogSeed';

/**
 * The products to show. They come from the server (the database the shop
 * manages in /admin) through CatalogProvider; the starter catalog is only
 * a fallback for a page rendered without it.
 */
export function useProducts(): { products: Product[]; loading: boolean; error?: Error } {
  const products = useCatalog((s) => s.products);
  return { products: products.length === 0 ? seedCatalog : products, loading: false };
}

/** A single product by slug. */
export function useProduct(slug: string): { product?: Product; loading: boolean } {
  const s = decodeURIComponent(slug);
  const products = useCatalog((st) => st.products);
  return { product: (products.length === 0 ? seedCatalog : products).find((p) => p.slug === s), loading: false };
}
