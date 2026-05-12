import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { ShopContent } from '@/components/shop/ShopContent';
import type { Locale } from '@/i18n/locales';

export default async function ShopPage({ params }: PageProps<'/[locale]/shop'>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header overHero={false} />
      <main className="flex-1 pt-24 md:pt-28">
        <ShopContent locale={locale as Locale} />
      </main>
    </>
  );
}
