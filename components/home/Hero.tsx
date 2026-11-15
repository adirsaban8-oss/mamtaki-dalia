'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { whatsappLink } from '@/lib/site';
import type { Locale } from '@/i18n/locales';

/**
 * Hero — the shop's own tray photo fills the whole opening screen. The
 * name, the slogan and one button sit on top of it, over a soft shade
 * that keeps the white type readable. Address and hours close the block
 * in a single quiet line.
 */
export function Hero() {
  const locale = useLocale() as Locale;
  const t = useTranslations('Hero');
  const f = useTranslations('Footer');
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';

  return (
    <section
      className="relative isolate overflow-hidden mt-16 sm:mt-20 min-h-[calc(100svh-8.5rem)] lg:min-h-[640px] flex items-end lg:items-center bg-neutral-800 text-white"
      aria-label="Hero"
    >
      <Image
        src="/images/hero.webp"
        alt={ar ? 'صينية حلويات من المحل' : 'מגש ממתקים מהחנות'}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {/* Shade: from the bottom on phones, from the reading side on desktop */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/5 lg:hidden" />
      <div aria-hidden className="absolute inset-0 -z-10 hidden lg:block bg-gradient-to-l from-black/90 via-black/60 to-black/15" />

      <div className="w-full mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-20 pt-40 pb-9 lg:py-24">
        <div className="max-w-xl">
          <p className="text-base text-white/85">{t('titleLine1')}</p>
          <h1 className={`${displayFont} mt-1 text-[3.25rem] sm:text-7xl xl:text-[5.5rem] leading-[1.02] !font-bold !tracking-normal`}>
            {t('titleLine2')}
          </h1>
          <p className={`${displayFont} mt-3 text-2xl sm:text-3xl text-white/90`}>{t('eyebrow')}</p>

          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-7">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center h-[52px] px-9 rounded-full bg-white text-black text-base font-semibold hover:bg-neutral-200 transition-colors duration-300"
            >
              {ar ? 'الكتالوج والأسعار' : 'לקטלוג ולמחירים'}
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-11 text-base font-medium underline underline-offset-[6px] decoration-1 hover:no-underline"
            >
              {t('ctaStory')}
            </a>
          </div>

          <address className="mt-8 md:mt-12 pt-4 border-t border-white/30 not-italic text-sm leading-[1.7] text-white/85">
            {ar ? 'شارع دالية 10، دالية الكرمل' : 'רחוב דליה 10, דלית אל כרמל'}
            <span aria-hidden className="hidden sm:inline mx-2">·</span>
            <span className="block sm:inline-block">{f('hoursValue')}</span>
          </address>
        </div>
      </div>
    </section>
  );
}
