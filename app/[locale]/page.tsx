import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/home/Hero';
import { Ticker } from '@/components/home/Ticker';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Story } from '@/components/home/Story';
import { ValueProps } from '@/components/home/ValueProps';
import { Testimonials } from '@/components/home/Testimonials';
import type { Locale } from '@/i18n/locales';

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header overHero />
      <main className="flex-1">
        <Hero />
        <Ticker />
        <FeaturedProducts locale={locale as Locale} />
        <Story locale={locale as Locale} />
        <ValueProps />
        <Testimonials />
      </main>
    </>
  );
}
