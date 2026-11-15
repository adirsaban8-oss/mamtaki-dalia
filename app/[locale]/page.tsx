import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/home/Hero';
import { CategoryArches } from '@/components/home/CategoryArches';
import { HomeCollections } from '@/components/home/HomeCollections';
import { Story } from '@/components/home/Story';
import { ValueProps } from '@/components/home/ValueProps';
import { OrderBand } from '@/components/home/OrderBand';
import { Showcase } from '@/components/home/Showcase';
import { Footer } from '@/components/layout/Footer';
import type { Locale } from '@/i18n/locales';

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header overHero={false} />
      <main className="flex-1">
        <Hero />
        <CategoryArches />
        <HomeCollections />
        <OrderBand />
        <Story locale={locale as Locale} />
        <Showcase />
        <ValueProps />
      </main>
      <Footer locale={locale as Locale} />
    </>
  );
}
