import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/home/Hero';
import { Ticker } from '@/components/home/Ticker';
import { Story } from '@/components/home/Story';
import { ValueProps } from '@/components/home/ValueProps';
import { CategoryArches } from '@/components/home/CategoryArches';
import { OrderBand } from '@/components/home/OrderBand';
import { Footer } from '@/components/layout/Footer';
import type { Locale } from '@/i18n/locales';

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header overHero />
      <main className="flex-1">
        <Hero />
        <CategoryArches />
        <Ticker />
        <Story locale={locale as Locale} />
        <ValueProps />
        <OrderBand />
      </main>
      <Footer locale={locale as Locale} />
    </>
  );
}
