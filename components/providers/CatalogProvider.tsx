'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/mockData';
import { useCatalog } from '@/store/catalog';

/** Hands the server's catalog to the client store before anything below it renders. */
export function CatalogProvider({ products, children }: { products: Product[]; children: React.ReactNode }) {
  useState(() => {
    useCatalog.setState({ products });
    return null;
  });
  useEffect(() => {
    useCatalog.setState({ products });
  }, [products]);
  return <>{children}</>;
}
