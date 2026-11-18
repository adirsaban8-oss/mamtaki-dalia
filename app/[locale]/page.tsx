import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { HeroPull } from '@/components/home/HeroPull';
import { OvenStrip } from '@/components/home/OvenStrip';
import { Statement } from '@/components/home/Statement';
import { Chapters } from '@/components/home/Chapters';
import { MenuGallery } from '@/components/home/MenuGallery';
import { SocialStats } from '@/components/home/SocialStats';
import { Reviews } from '@/components/home/Reviews';
import { OrderBand } from '@/components/home/OrderBand';
import { Showcase } from '@/components/home/Showcase';
import { Place } from '@/components/home/Place';
import { Footer } from '@/components/layout/Footer';
import type { Locale } from '@/i18n/locales';

/**
 * Home, the story top to bottom: the Pull (kanafeh), fresh-today strip,
 * one sentence about the kitchen, three house desserts as chapters, the
 * menu by arch, followers and customer reviews, events and trays, the
 * shop window, the village + contact.
 */
export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header overHero={false} />
      <main className="flex-1">
        <HeroPull />
        <OvenStrip />
        <Statement />
        <Chapters />
        <MenuGallery />
        <SocialStats />
        <Reviews />
        <OrderBand />
        <Showcase />
        <Place />
      </main>
      <Footer locale={locale as Locale} />
    </>
  );
}
