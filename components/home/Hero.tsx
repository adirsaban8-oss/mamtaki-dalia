'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { whatsappLink } from '@/lib/site';
import type { Locale } from '@/i18n/locales';

/**
 * Hero — minimal split panel: a light-grey field with the place name set
 * very large, the shop's address and hours, and a black field with the
 * one action that matters: open the catalog. No photo, no ornament; the
 * product grid starts right below.
 */
export function Hero() {
  const locale = useLocale() as Locale;
  const t = useTranslations('Hero');
  const f = useTranslations('Footer');
  const ar = locale === 'ar';

  return (
    <section className="pt-16 sm:pt-20 grid lg:grid-cols-12" aria-label="Hero">
      {/* Light panel — who and where */}
      <div className="lg:col-span-7 bg-[#F4F4F4] text-black px-6 sm:px-12 lg:px-[8.5%] py-12 md:py-16 lg:py-20 flex flex-col justify-center">
        <h1 className="text-[3.4rem] sm:text-7xl lg:text-[6.5rem] leading-[0.95] !font-bold !tracking-[-0.04em]">
          {ar ? 'دالية الكرمل' : 'דלית אל כרמל'}
        </h1>
        <p className="mt-8 md:mt-10 text-[15px] text-neutral-600">
          {ar ? 'بالطلب المسبق · توصيل أو استلام من المحل' : 'בהזמנה מראש · משלוח או איסוף מהחנות'}
        </p>
        <p className="mt-1 text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.15] font-medium tracking-[-0.03em] text-balance">
          {ar ? 'حلوياتنا، طازجة كل يوم' : 'הממתקים שלנו, טריים מדי יום'}
        </p>
        <address className="mt-4 not-italic text-[15px] leading-[1.6] text-neutral-600">
          {ar ? 'حلويات دالية الكرمل — شارع دالية 10، دالية الكرمل' : 'ממתקי דלית אל כרמל — רחוב דליה 10, דלית אל כרמל'}
          <br />
          {f('hoursValue')}
        </address>
      </div>

      {/* Black panel — the action */}
      <div className="lg:col-span-5 bg-black text-white px-6 sm:px-12 lg:px-20 py-12 md:py-16 lg:py-20 flex flex-col justify-center">
        <p className="flex items-center gap-2.5 text-[13px] font-medium">
          <span aria-hidden className="block w-2.5 h-2.5 rounded-full bg-white" />
          {t('eyebrow')}
        </p>
        <p className="mt-6 text-4xl sm:text-[2.75rem] leading-[1.05] font-light tracking-[-0.03em] text-balance">
          {ar ? 'طلبكم يبدأ من هنا' : 'ההזמנה שלכם מתחילה כאן'}
        </p>
        <div className="mt-7 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center lg:items-stretch xl:items-center gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-3 h-12 px-8 rounded-full bg-white text-black text-[15px] font-bold hover:bg-neutral-200 transition-colors duration-300"
          >
            <GridIcon />
            {ar ? 'الكتالوج والأسعار' : 'לקטלוג ולמחירים'}
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-12 px-2 text-[15px] font-medium underline underline-offset-[6px] hover:no-underline"
          >
            {t('ctaStory')}
          </a>
        </div>
      </div>
    </section>
  );
}

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <rect x="1" y="1" width="6" height="6" />
      <rect x="9" y="1" width="6" height="6" />
      <rect x="1" y="9" width="6" height="6" />
      <rect x="9" y="9" width="6" height="6" />
    </svg>
  );
}
