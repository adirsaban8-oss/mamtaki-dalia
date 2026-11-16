import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/home/Hero';
import { Statement } from '@/components/home/Statement';
import { Signature } from '@/components/home/Signature';
import { MenuGallery } from '@/components/home/MenuGallery';
import { OrderBand } from '@/components/home/OrderBand';
import { Story } from '@/components/home/Story';
import { Showcase } from '@/components/home/Showcase';
import { Footer } from '@/components/layout/Footer';
import type { Locale } from '@/i18n/locales';

/**
 * Home — a tasting in order: the kanafeh scene (dark), the handwork
 * sentence (espresso), three signature desserts (ivory), the menu by
 * arch (cream), events over a real photo, the family story, the shop
 * window. Each section has its own composition and background.
 */
export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header overHero={false} />
      <main className="flex-1">
        <Hero />
        <Statement />
        <Signature />
        <MenuGallery />
        <OrderBand />
        <Story locale={locale as Locale} />
        <Showcase />
      </main>
      <Footer locale={locale as Locale} />
    </>
  );
}
