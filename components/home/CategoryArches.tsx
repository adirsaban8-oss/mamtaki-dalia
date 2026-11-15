'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { categoryLabels, orderedCategories, type ProductCategory } from '@/lib/mockData';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

/** One representative photo per category. */
const CATEGORY_IMAGE: Record<ProductCategory, string> = {
  baklava: '/products/bird-nest-baklava.webp',
  kanafeh: '/products/red-kanafeh.webp',
  trays: '/products/turkish-baklava-tray.webp',
  cakes: '/products/dessert-mango.webp',
  'fruit-desserts': '/products/dessert-berries.webp',
  frozen: '/products/layali-beirut-tray.webp',
};

/**
 * Category row — arch-framed tiles (Dubai boutique motif). Six across on
 * desktop; a sideways-scrolling strip on phones.
 */
export function CategoryArches() {
  const locale = useLocale() as Locale;
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  return (
    <section className="relative bg-sand py-14 md:py-20" aria-labelledby="categories-heading">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <header className="flex flex-col items-center text-center mb-10 md:mb-14">
          <span className="text-[13px] font-medium text-gold-deep">
            {locale === 'ar' ? 'تصفحوا حسب الفئة' : 'עיינו לפי קטגוריה'}
          </span>
          <h2
            id="categories-heading"
            className={`mt-3 ${displayFont} font-bold text-heading text-3xl md:text-5xl leading-[1.1] text-balance`}
          >
            {locale === 'ar' ? 'من مطبخنا' : 'מהמטבח שלנו'}
          </h2>
          <span aria-hidden className="rule-diamond block w-28 mt-6" />
        </header>

        <ul className="-mx-5 px-5 md:mx-0 md:px-0 flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible scrollbar-hide snap-x snap-mandatory">
          {orderedCategories.map((category, idx) => (
            <motion.li
              key={category}
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, ease: easeLuxe, delay: idx * 0.06 }}
              className="shrink-0 w-[38%] sm:w-[28%] md:w-auto snap-start"
            >
              <Link href={`/shop#cat-${category}`} className="group block text-center">
                <div className="relative mx-2 mt-2">
                  <span
                    aria-hidden
                    className="absolute -inset-2 arch border border-gold-deep/50 group-hover:border-gold-deep transition-colors duration-500"
                  />
                  <div className="relative aspect-[3/4] arch overflow-hidden bg-sand">
                    <Image
                      src={CATEGORY_IMAGE[category]}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 25vw, 40vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                  </div>
                </div>
                <p className={`mt-5 ${displayFont} font-bold text-heading text-base md:text-lg leading-tight group-hover:text-gold-deep transition-colors duration-500`}>
                  {categoryLabels[category][locale]}
                </p>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
