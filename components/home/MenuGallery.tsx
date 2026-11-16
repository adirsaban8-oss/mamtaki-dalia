'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { Link } from '@/i18n/navigation';
import { categoryLabels, orderedCategories, type ProductCategory } from '@/lib/mockData';
import { useProducts } from '@/lib/data/useProducts';
import { MenuCard } from '@/components/product/MenuCard';
import { FeatureCard } from '@/components/product/FeatureCard';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

const ARCH_IMAGE: Partial<Record<ProductCategory, string>> = {
  baklava: '/products/bird-nest-baklava.webp',
  kanafeh: '/products/red-kanafeh.webp',
  trays: '/products/turkish-baklava-tray.webp',
  cakes: '/products/dessert-mango.webp',
};

/**
 * The menu on the home page. Four arches — the shape of the village's
 * doorways — choose a category; below them an editorial gallery: one lead
 * dessert large, three or four beside it, and a tile to the rest.
 */
export function MenuGallery() {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  const { products } = useProducts();

  const cats = useMemo(
    () => orderedCategories.filter((c) => products.some((p) => p.category === c)),
    [products]
  );
  const [cat, setCat] = useState<ProductCategory>('baklava');
  const current = cats.includes(cat) ? cat : cats[0];
  if (!current) return null;

  const all = products.filter((p) => p.category === current);
  const [lead, ...rest] = all;
  const small = rest.slice(0, 3);
  const more = all.length - 1 - small.length;
  const wideTile = small.length % 2 === 0;

  return (
    <section className="bg-sand py-20 md:py-28" aria-labelledby="menu-heading">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gold-deep">{ar ? 'القائمة' : 'התפריט'}</p>
            <h2 id="menu-heading" className={`${displayFont} mt-2 text-4xl md:text-[3.4rem] leading-[1.08] font-black text-gold-metal`}>
              {ar ? 'ماذا تحبون أن تتذوقوا اليوم؟' : 'מה בא לכם לטעום היום?'}
            </h2>
          </div>
          <Link href="/shop" className="inline-flex items-center h-11 text-[15px] font-semibold text-gold underline underline-offset-[6px] decoration-1 hover:no-underline">
            {ar ? `الكتالوج الكامل · ${products.length}` : `לקטלוג המלא · ${products.length}`}
          </Link>
        </header>

        {/* Arches — category selector */}
        <div role="tablist" aria-label={ar ? 'الفئات' : 'קטגוריות'} className="mt-10 md:mt-12 grid grid-cols-4 gap-3 sm:gap-6 md:gap-10 max-w-3xl">
          {cats.map((c) => {
            const on = c === current;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={on}
                onClick={() => setCat(c)}
                className="group flex flex-col items-center text-center"
              >
                <span className={`relative block w-full p-1 sm:p-1.5 arch border-[1.5px] transition-colors duration-500 ${on ? 'border-gold' : 'border-transparent group-hover:border-gold-deep/50'}`}>
                  <span className="relative block aspect-[3/4] arch overflow-hidden bg-cedar">
                    {ARCH_IMAGE[c] && (
                      <Image
                        src={ARCH_IMAGE[c]!}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 170px, 22vw"
                        className={`object-cover transition-all duration-700 ${on ? 'scale-100' : 'scale-[1.04] saturate-[0.7] opacity-80 group-hover:opacity-100 group-hover:saturate-100'}`}
                      />
                    )}
                  </span>
                </span>
                <span className={`${displayFont} mt-3 text-[13px] sm:text-base md:text-lg font-bold leading-tight transition-colors duration-500 ${on ? 'text-heading' : 'text-coffee-muted'}`}>
                  {categoryLabels[c][locale]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: easeLuxe }}
            role="tabpanel"
            className="mt-10 md:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-x-3 md:gap-x-5 gap-y-10 lg:gap-y-8"
          >
            <FeatureCard product={lead} className="col-span-2 lg:row-span-2" />
            {small.map((p, i) => (
              <MenuCard key={p.id} product={p} index={i} />
            ))}
            <Link
              href={more > 0 ? `/shop#cat-${current}` : '/shop'}
              className={`group flex flex-col justify-end min-h-[160px] rounded-[10px] border border-gold/40 bg-[radial-gradient(120%_100%_at_80%_100%,rgba(255,195,0,0.16),transparent_60%)] text-gold p-5 md:p-7 hover:border-gold hover:bg-gold/10 transition-colors duration-300 ${wideTile ? 'col-span-2' : ''}`}
            >
              <span className={`${displayFont} text-2xl md:text-3xl font-bold leading-tight`}>
                {more > 0
                  ? ar ? `${more} أخرى من ${categoryLabels[current].ar}` : `עוד ${more} ב${categoryLabels[current].he}`
                  : ar ? 'كل الكتالوج' : 'לכל הקטלוג'}
              </span>
              <span className="mt-2 text-[15px] text-cream/80 group-hover:text-cream">
                {ar ? 'إلى القائمة ←' : 'לצפייה ←'}
              </span>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
