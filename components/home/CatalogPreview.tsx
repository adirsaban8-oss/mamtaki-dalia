'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { Link } from '@/i18n/navigation';
import { orderedCategories } from '@/lib/mockData';
import { useProducts } from '@/lib/data/useProducts';
import { MenuCard } from '@/components/product/MenuCard';
import { buttonClasses } from '@/components/ui/Button';

/**
 * A taste of the catalog on the home page: two products from every
 * category with their prices, and one big button to the full catalog.
 * Sideways-scrolling strip on phones, 4-column grid on desktop.
 */
export function CatalogPreview() {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  const { products } = useProducts();

  const picks = useMemo(
    () => orderedCategories.flatMap((cat) => products.filter((p) => p.category === cat).slice(0, 2)),
    [products]
  );

  if (picks.length === 0) return null;

  return (
    <section className="relative bg-sand py-14 md:py-20" aria-labelledby="catalog-preview-heading">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <header className="flex flex-col items-center text-center mb-8 md:mb-12">
          <span className="text-[13px] font-medium text-gold-deep">
            {ar ? 'الأسعار تشمل الضريبة' : 'המחירים כוללים מע״מ'}
          </span>
          <h2
            id="catalog-preview-heading"
            className={`mt-3 ${displayFont} font-bold text-heading text-3xl md:text-5xl leading-[1.1] text-balance`}
          >
            {ar ? 'من الكتالوج' : 'מתוך הקטלוג'}
          </h2>
          <span aria-hidden className="rule-diamond block w-28 mt-6" />
        </header>
      </div>

      <div className="mx-auto max-w-7xl md:px-10">
        <div className="flex md:grid md:grid-cols-4 gap-3 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide px-5 md:px-0 pb-2">
          {picks.map((product, idx) => (
            <div key={product.id} className="shrink-0 w-[62%] sm:w-[40%] md:w-auto snap-start">
              <MenuCard product={product} index={idx} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 md:mt-12 flex justify-center px-5">
        <Link
          href="/shop"
          className={buttonClasses({
            variant: 'gold',
            size: 'lg',
            className: 'normal-case tracking-normal text-[15px] w-full max-w-sm sm:w-auto',
          })}
        >
          {ar ? `كل الكتالوج · ${products.length} منتجاً` : `לכל הקטלוג · ${products.length} מוצרים`}
        </Link>
      </div>
    </section>
  );
}
