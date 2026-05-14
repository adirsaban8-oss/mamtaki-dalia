import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { ProductPageClient } from '@/components/product/ProductPageClient';
import type { Locale } from '@/i18n/locales';

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params,
}: PageProps<'/[locale]/shop/[slug]'>) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header overHero={false} />
      <main className="flex-1 pt-24 md:pt-28">
        <ProductPageClient slug={slug} locale={locale as Locale} />
      </main>
    </>
  );
}
