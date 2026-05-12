import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { ProductDetail } from '@/components/product/ProductDetail';
import { findProductBySlug, products } from '@/lib/mockData';
import type { Locale } from '@/i18n/locales';

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: PageProps<'/[locale]/shop/[slug]'>) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = findProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <Header overHero={false} />
      <main className="flex-1 pt-24 md:pt-28">
        <ProductDetail product={product} locale={locale as Locale} />
      </main>
    </>
  );
}
