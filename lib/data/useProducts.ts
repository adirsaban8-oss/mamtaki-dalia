'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { useCatalog } from '@/store/catalog';
import { isWordPressMode } from '@/lib/graphql/client';
import { PRODUCTS_QUERY, PRODUCT_BY_SLUG_QUERY } from '@/lib/graphql/queries';
import { mapWPProduct, mapWPProducts } from '@/lib/graphql/mappers';
import type { Product } from '@/lib/mockData';
import { seedCatalog } from '@/lib/data/catalogSeed';

/**
 * Unified data hook. Reads from WordPress (Apollo / WPGraphQL) when
 * NEXT_PUBLIC_DATA_SOURCE=wordpress, otherwise from the local Zustand
 * catalog. Apollo queries skip on the server pass to avoid hydration
 * mismatch, they kick in once the component hydrates.
 *
 * Until the owner publishes products in WordPress (or adds any to the
 * local admin), the starter catalog in `catalogSeed.ts` is shown.
 */
function useIsClient() {
  const [client, setClient] = useState(false);
  useEffect(() => setClient(true), []);
  return client;
}

export function useProducts(): { products: Product[]; loading: boolean; error?: Error } {
  const wpMode = isWordPressMode();
  const isClient = useIsClient();

  const apolloResult = useQuery<{ products: { nodes: Parameters<typeof mapWPProduct>[0][] } }>(
    PRODUCTS_QUERY,
    { skip: !wpMode || !isClient }
  );

  const localProducts = useCatalog((s) => s.products);

  if (wpMode) {
    const nodes = apolloResult.data?.products?.nodes ?? [];
    const loaded = isClient && !apolloResult.loading;
    const wpProducts = mapWPProducts(nodes).filter((p) => p.inStock !== false);
    return {
      products: loaded && nodes.length === 0 ? seedCatalog : wpProducts,
      loading: !loaded,
      error: apolloResult.error ? new Error(apolloResult.error.message) : undefined,
    };
  }

  const visibleLocal = localProducts.filter((p) => p.visible !== false);
  return {
    products: localProducts.length === 0 ? seedCatalog : visibleLocal,
    loading: false,
  };
}

/** Read a single product by slug. */
export function useProduct(slug: string): { product?: Product; loading: boolean } {
  const wpMode = isWordPressMode();
  const isClient = useIsClient();

  const apolloResult = useQuery<{ product: Parameters<typeof mapWPProduct>[0] | null }>(
    PRODUCT_BY_SLUG_QUERY,
    { skip: !wpMode || !isClient, variables: { slug } }
  );

  const localProduct = useCatalog((s) => s.products.find((p) => p.slug === slug));

  if (wpMode) {
    const node = apolloResult.data?.product;
    const loaded = isClient && !apolloResult.loading;
    return {
      product: node ? mapWPProduct(node) : loaded ? findSeed(slug) : undefined,
      loading: !loaded,
    };
  }

  return { product: localProduct ?? findSeed(slug), loading: false };
}

function findSeed(slug: string): Product | undefined {
  return seedCatalog.find((p) => p.slug === decodeURIComponent(slug));
}
