'use client';

import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { useProducts } from '@/lib/data/useProducts';
import { SectionHeading } from './SectionHeading';
import { MenuCard } from '@/components/product/MenuCard';
import { Link } from '@/i18n/navigation';
import { ArabesquePattern } from '@/components/ornaments/ArabesquePattern';

type Props = { locale: Locale };

/**
 * Featured Products — 4 visible products tagged "bestseller" from the
 * live catalog store. If the catalog is empty (owner hasn't added
 * anything yet), the section quietly hides itself.
 */
export function FeaturedProducts({ locale }: Props) {
  const t = useTranslations('FeaturedProducts');
  const { products } = useProducts();
  const featured = products.filter((p) => p.badges.includes('bestseller')).slice(0, 4);

  // Fallback: any 4 visible products if no bestsellers tagged yet
  const list = featured.length > 0 ? featured : products.slice(0, 4);

  if (list.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden bg-ivory py-12 md:py-20"
      aria-labelledby="featured-heading"
    >
      <div aria-hidden className="absolute -top-20 -end-20 w-[600px] h-[600px] text-gold pointer-events-none">
        <ArabesquePattern opacity={0.04} className="absolute inset-0" />
      </div>
      <div aria-hidden className="absolute -bottom-20 -start-20 w-[600px] h-[600px] text-gold pointer-events-none hidden lg:block">
        <ArabesquePattern opacity={0.04} className="absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <SectionHeading
          locale={locale}
          eyebrow={t('eyebrow')}
          title={t('title')}
          body={t('body')}
          align="center"
          tone="dark"
          ornament="star"
          id="featured-heading"
        />

        <div className="mt-12 md:mt-16">
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {list.map((product, idx) => (
              <MenuCard key={product.id} product={product} index={idx} />
            ))}
          </div>

          {/* Mobile: 2-column grid (replaces the horizontal-scroll
              variant that didn't feel right on iPhone). Desktop layout
              above is untouched. */}
          <div className="md:hidden grid grid-cols-2 gap-3">
            {list.map((product, idx) => (
              <MenuCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        </div>

        <div className="mt-12 md:mt-16 flex justify-center">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-4 font-display-en text-[12px] tracking-eyebrow uppercase text-cedar hover:text-burgundy transition-colors duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          >
            <span>{t('viewAll')}</span>
            <span aria-hidden className="h-px w-12 bg-current transition-[width] duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:w-20" />
          </Link>
        </div>
      </div>
    </section>
  );
}
