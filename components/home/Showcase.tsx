'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import type { Translated } from '@/lib/mockData';
import { Link } from '@/i18n/navigation';
import { buttonClasses } from '@/components/ui/Button';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

const INSTAGRAM = 'https://www.instagram.com/mamtaki_dalia/';

type Tile = { src: string; caption: Translated; className: string };

/** Mosaic placement: 4 columns × 2 rows on desktop (explicit), the video
 *  spanning both rows. DOM order is tuned for the 2-column phone grid. */
const TILES: Tile[] = [
  {
    src: '/images/gallery/strawberries.webp',
    caption: { he: 'קינוחי תות', ar: 'حلويات الفراولة' },
    className: 'md:row-start-1 md:col-start-4',
  },
  {
    src: '/images/gallery/mango.webp',
    caption: { he: 'קינוח מנגו', ar: 'حلوى المانجو' },
    className: 'md:row-start-2 md:col-start-2',
  },
  {
    src: '/images/gallery/tartlets.webp',
    caption: { he: 'טארטלטים בפירות טריים', ar: 'تارت بالفواكه الطازجة' },
    className: 'col-span-2 md:col-span-2 md:row-start-1 md:col-start-2',
  },
  {
    src: '/images/gallery/basbousa.webp',
    caption: { he: 'הריסה בפיסטוק', ar: 'هريسة بالفستق' },
    className: 'md:row-start-2 md:col-start-3',
  },
  {
    src: '/images/gallery/turkish.webp',
    caption: { he: 'בקלאווה טורקית', ar: 'بقلاوة تركية' },
    className: 'md:row-start-2 md:col-start-4',
  },
];

/**
 * "From our showcase" — the shop's own video and photos in a gold-framed
 * mosaic. Everything here is real, shot at the shop.
 */
export function Showcase() {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';

  return (
    <section className="relative bg-page py-16 md:py-24" aria-labelledby="showcase-heading">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <header className="flex flex-col items-center text-center mb-10 md:mb-14">
          <span className="text-[13px] font-medium text-gold-deep">
            {ar ? 'طازج كل يوم' : 'טרי מדי יום'}
          </span>
          <h2
            id="showcase-heading"
            className={`mt-3 ${displayFont} font-bold text-heading text-3xl md:text-5xl leading-[1.1] text-balance`}
          >
            {ar ? 'من واجهتنا' : 'מהוויטרינה שלנו'}
          </h2>
          <span aria-hidden className="rule-diamond block w-28 mt-6" />
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-4 md:h-[720px]">
          {/* Video — spans both rows */}
          <motion.figure
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: easeLuxe }}
            className="relative row-span-2 md:col-start-1 md:row-start-1 overflow-hidden rounded-[2px] border border-gold/40 bg-cedar h-[440px] md:h-auto"
          >
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src="/videos/showcase.mp4"
              poster="/videos/showcase-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={ar ? 'جولة في واجهة الحلويات' : 'סיור בוויטרינת הממתקים'}
            />
            <span aria-hidden className="absolute inset-2 border border-gold/30 pointer-events-none" />
            <figcaption className="absolute bottom-0 inset-x-0 p-4 pt-12 bg-gradient-to-t from-black/85 to-transparent">
              <span className={`${displayFont} text-lg font-bold text-ivory`}>
                {ar ? 'الواجهة في دالية الكرمل' : 'הוויטרינה בדלית אל כרמל'}
              </span>
            </figcaption>
          </motion.figure>

          {TILES.map((tile, i) => (
            <motion.figure
              key={tile.src}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: easeLuxe, delay: 0.08 * (i + 1) }}
              className={`group relative overflow-hidden rounded-[2px] border border-gold/25 bg-cedar h-[210px] md:h-auto ${tile.className}`}
            >
              <Image
                src={tile.src}
                alt={tile.caption[locale]}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
              />
              <span aria-hidden className="absolute inset-2 border border-gold/0 group-hover:border-gold/50 transition-colors duration-700 pointer-events-none" />
              <figcaption className="absolute bottom-0 inset-x-0 p-3 md:p-4 pt-10 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-[13px] md:text-[15px] font-medium text-gold-light">{tile.caption[locale]}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-6">
          <Link
            href="/shop"
            className={buttonClasses({ variant: 'gold', size: 'lg', className: 'normal-case tracking-normal text-[15px] w-full max-w-sm sm:w-auto' })}
          >
            {ar ? 'كل المنتجات والأسعار' : 'לכל המוצרים והמחירים'}
          </Link>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 h-11 text-[15px] font-medium text-gold hover:text-gold-light transition-colors duration-500"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
            </svg>
            {ar ? 'المزيد في إنستغرام' : 'עוד אצלנו באינסטגרם'}
          </a>
        </div>
      </div>
    </section>
  );
}
