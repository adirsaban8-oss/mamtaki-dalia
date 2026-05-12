import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { ArabesquePattern } from '@/components/ornaments/ArabesquePattern';
import { Link } from '@/i18n/navigation';

type Props = { locale: Locale };

// To replace: drop a 1200×1600 portrait JPG at /public/images/story-portrait.jpg
// and swap this constant to `/images/story-portrait.jpg`.
const STORY_IMAGE =
  'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=1600&q=85&auto=format&fit=crop';

/**
 * Story Section — luxury heritage spread, two-column desktop.
 *  – Left: 3:4 portrait inside an offset gold frame + 16px-inset hairline.
 *  – Right: eyebrow → display weight-900 heading → 3 body paragraphs →
 *    inline gold-italic pull-quote → script-tone signature → ghost CTA.
 *  – Photo: slight desaturate so it sits inside the warm brand palette.
 *  – Padding: 64px mobile, 120px desktop. Arabesque corner at 4%.
 */
export async function Story({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'Story' });
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  return (
    <section
      className="relative overflow-hidden bg-sand py-16 md:py-[120px]"
      aria-labelledby="story-heading"
    >
      <div
        aria-hidden
        className="absolute -top-24 -end-24 w-[600px] h-[600px] text-gold pointer-events-none"
      >
        <ArabesquePattern opacity={0.04} className="absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-10 grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
        {/* ── Portrait ──────────────────────────────────────────────
           Two frames: an offset gold rectangle BEHIND the image, plus
           a 1px gold hairline 16px INSET inside the image itself. */}
        <div className="lg:col-span-6 order-2 lg:order-1">
          <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0 lg:ms-auto">
            {/* Offset frame */}
            <span
              aria-hidden
              className="absolute inset-0 translate-x-4 translate-y-4 rtl:-translate-x-4 border border-gold/60"
            />
            {/* Image */}
            <div className="relative w-full h-full overflow-hidden shadow-deep">
              <Image
                src={STORY_IMAGE}
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
                quality={85}
                style={{ filter: 'saturate(0.85) contrast(1.02)' }}
              />
              {/* Warm sepia overlay — keeps the photo in our palette */}
              <span
                aria-hidden
                className="absolute inset-0 mix-blend-multiply pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(201,166,107,0.10) 0%, rgba(28,58,46,0.30) 100%)',
                }}
              />
              {/* Inner hairline 16px inset — the spec's "16px inset" frame */}
              <span
                aria-hidden
                className="absolute inset-4 border border-gold/70 pointer-events-none"
              />
            </div>

            {/* Caption strip below the image — date stamp */}
            <div className="mt-6 flex items-center gap-4 ms-1">
              <span aria-hidden className="block h-px w-12 bg-gold" />
              <span className="font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
                {t('caption')}
              </span>
            </div>
          </div>
        </div>

        {/* ── Copy ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          {/* Eyebrow */}
          <div className="flex items-center gap-5 text-gold-deep">
            <span aria-hidden className="block h-px w-12 bg-gold" />
            <span className="font-display-en text-[12px] tracking-eyebrow uppercase">
              {t('eyebrow')}
            </span>
          </div>

          {/* Display heading — weight 900 */}
          <h2
            id="story-heading"
            className={`mt-6 md:mt-8 ${displayFont} font-black tracking-display leading-[1.05] text-cedar text-balance text-4xl md:text-5xl lg:text-6xl`}
          >
            {t('title')}
          </h2>

          {/* Body */}
          <div className="mt-8 md:mt-10 space-y-5 text-base md:text-lg leading-[1.8] text-coffee/90 text-pretty">
            <p>{t('para1')}</p>
            <p>{t('para2')}</p>
          </div>

          {/* Inline pull-quote — italic gold-deep, start border */}
          <blockquote className="my-10 md:my-12 ps-6 border-s-2 border-gold">
            <p className={`${displayFont} italic text-xl md:text-2xl leading-[1.4] text-gold-deep`}>
              {t('pullQuote')}
            </p>
            <cite className="mt-4 block not-italic font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
              — {t('quoteAttribution')}
            </cite>
          </blockquote>

          {/* Final paragraph + signature */}
          <p className="text-base md:text-lg leading-[1.8] text-coffee/90 text-pretty">
            {t('para3')}
          </p>

          <p className={`mt-10 ${displayFont} text-xl md:text-2xl text-burgundy`}>
            {t('signature')}
          </p>

          {/* CTA */}
          <div className="mt-10 md:mt-12">
            <Link
              href="/about"
              className="group inline-flex items-center gap-4 font-display-en text-[12px] tracking-eyebrow uppercase text-cedar hover:text-burgundy transition-colors duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
            >
              <span>{t('cta')}</span>
              <span
                aria-hidden
                className="h-px w-12 bg-current transition-[width] duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:w-20"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
