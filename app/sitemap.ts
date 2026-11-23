import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/locales';
import { publicCatalog } from '@/lib/server/catalog';

export const dynamic = 'force-dynamic';

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://mamtaki-dalia-production.up.railway.app';

const PAGES = ['', '/shop', '/delivery', '/events', '/terms', '/returns', '/privacy', '/accessibility'];

/** Every public page and product, in both languages. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = [...PAGES, ...(await publicCatalog()).map((p) => `/shop/${p.slug}`)];
  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${BASE}/${locale}${path}`,
      changeFrequency: path.startsWith('/shop') || path === '' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : path.startsWith('/shop') ? 0.8 : 0.4,
    }))
  );
}
