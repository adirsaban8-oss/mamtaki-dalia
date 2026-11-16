import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { ProductPageClient } from '@/components/product/ProductPageClient';
import { Footer } from '@/components/layout/Footer';
import type { Locale } from '@/i18n/locales';
import { seedCatalog } from '@/lib/data/catalogSeed';

export const dynamic = 'force-dynamic';

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://mamtaki-dalia-production.up.railway.app';

/** Title, description and share image come from the product itself. */
export async function generateMetadata({ params }: PageProps<'/[locale]/shop/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  const l: Locale = locale === 'ar' ? 'ar' : 'he';
  const product = seedCatalog.find((p) => p.slug === decodeURIComponent(slug));
  if (!product) return {};
  return {
    title: product.name[l],
    description: product.description[l],
    alternates: { canonical: `${BASE}/${l}/shop/${product.slug}` },
    openGraph: {
      title: product.name[l],
      description: product.description[l],
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: PageProps<'/[locale]/shop/[slug]'>) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l: Locale = locale === 'ar' ? 'ar' : 'he';
  const product = seedCatalog.find((p) => p.slug === decodeURIComponent(slug));

  // Structured data, only facts that exist in the catalog (no ratings, no reviews).
  const jsonLd = product && {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[l],
    description: product.description[l],
    image: product.image ? `${BASE}${product.image}` : undefined,
    brand: { '@type': 'Brand', name: l === 'ar' ? 'حلويات دالية الكرمل' : 'ממתקי דלית אל כרמל' },
    ...(product.price > 0 && {
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'ILS',
        availability: 'https://schema.org/InStock',
        url: `${BASE}/${l}/shop/${product.slug}`,
      },
    }),
  };

  return (
    <>
      <Header overHero={false} />
      <main className="flex-1 pt-24 md:pt-28">
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
          />
        )}
        <ProductPageClient slug={slug} locale={locale as Locale} />
      </main>
      <Footer locale={locale as Locale} />
    </>
  );
}
