import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://mamtaki-dalia-production.up.railway.app';

/** Public pages are indexable; the admin and checkout flows are not. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/he/admin', '/ar/admin', '/he/checkout', '/ar/checkout'] },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
