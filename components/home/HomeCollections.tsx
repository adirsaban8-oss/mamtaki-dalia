'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { Link } from '@/i18n/navigation';
import { categoryEyebrow, categoryLabels, orderedCategories } from '@/lib/mockData';
import { useProducts } from '@/lib/data/useProducts';
import { MenuCard } from '@/components/product/MenuCard';
import { buttonClasses } from '@/components/ui/Button';

/**
 * Home page collections — one generous row per category, straight from
 * the real catalog: four products with their photos and prices and a
 * link to the rest of that category. Sideways strip on phones, four
 * columns on desktop. Ends with one button to the whole catalog.
 */
export function HomeCollections() {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  const { products } = useProducts();

  const rows = useMemo(
    () =>
      orderedCategories
        .map((category) => ({ category, all: products.filter((p) => p.category === category) }))
        .filter((r) => r.all.length > 0),
    [products]
  );

  if (rows.length === 0) return null;

  return (
    <>
      {rows.map(({ category, all }, idx) => (
        <section
          key={category}
          className={`py-14 md:py-20 ${idx % 2 === 0 ? 'bg-page' : 'bg-sand'}`}
          aria-labelledby={`home-${category}`}
        >
          <div className="mx-auto max-w-[1440px] px-5 md:px-10">
            <header className="flex items-end justify-between gap-4 mb-7 md:mb-10">
              <div>
                <p className="text-[13px] md:text-sm font-medium text-gold-deep">{categoryEyebrow[category][locale]}</p>
                <h2 id={`home-${category}`} className={`${displayFont} mt-1.5 font-bold text-heading text-3xl md:text-5xl leading-[1.1]`}>
                  {categoryLabels[category][locale]}
                </h2>
              </div>
              <Link
                href={`/shop#cat-${category}`}
                className="shrink-0 inline-flex items-center h-11 text-[15px] font-semibold text-gold underline underline-offset-[6px] decoration-1 hover:no-underline"
              >
                {ar ? `الكل (${all.length})` : `לכל ה־${all.length}`}
              </Link>
            </header>
          </div>

          <div className="mx-auto max-w-[1440px] md:px-10">
            <div className="flex md:grid md:grid-cols-4 gap-3 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide px-5 md:px-0 scroll-px-5">
              {all.slice(0, 4).map((product, i) => (
                <div key={product.id} className="shrink-0 w-[66%] sm:w-[42%] md:w-auto snap-start">
                  <MenuCard product={product} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <div className="bg-page pb-16 md:pb-24 pt-2 flex justify-center px-5">
        <Link
          href="/shop"
          className={buttonClasses({
            variant: 'gold',
            size: 'lg',
            className: 'normal-case tracking-normal text-base w-full max-w-sm sm:w-auto !rounded-full px-10',
          })}
        >
          {ar ? `كل الكتالوج · ${products.length} منتجاً` : `לכל הקטלוג · ${products.length} מוצרים`}
        </Link>
      </div>
    </>
  );
}
