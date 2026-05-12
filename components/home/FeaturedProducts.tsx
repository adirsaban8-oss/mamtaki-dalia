import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { featuredProducts } from '@/lib/mockData';
import { SectionHeading } from './SectionHeading';
import { ProductCard } from '@/components/product/ProductCard';
import { Link } from '@/i18n/navigation';
import { ArabesquePattern } from '@/components/ornaments/ArabesquePattern';

type Props = { locale: Locale };

export async function FeaturedProducts({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'FeaturedProducts' });

  return (
    <section
      className="relative overflow-hidden bg-ivory py-16 md:py-[120px]"
      aria-labelledby="featured-heading"
    >
      {/* Arabesque corner at 4% opacity — barely there, sets the tone */}
      <div
        aria-hidden
        className="absolute -top-20 -end-20 w-[600px] h-[600px] text-gold pointer-events-none"
      >
        <ArabesquePattern opacity={0.04} className="absolute inset-0" />
      </div>
      <div
        aria-hidden
        className="absolute -bottom-20 -start-20 w-[600px] h-[600px] text-gold pointer-events-none hidden lg:block"
      >
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
          id="featured-heading"
        />

        {/* Grid · 4 cols desktop / 2 tablet / 1.2 mobile w/ scroll-snap peek */}
        <div className="mt-16 md:mt-24">
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>

          <div className="md:hidden -mx-5 px-5 overflow-x-auto snap-x snap-mandatory flex gap-5 pb-4 scroll-pl-5 scrollbar-hide">
            {featuredProducts.map((product, idx) => (
              <div key={product.id} className="snap-start shrink-0 w-[82%]">
                <ProductCard product={product} index={idx} />
              </div>
            ))}
          </div>
        </div>

        {/* View-all link */}
        <div className="mt-16 md:mt-24 flex justify-center">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-4 font-display-en text-[12px] tracking-eyebrow uppercase text-cedar hover:text-burgundy transition-colors duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          >
            <span>{t('viewAll')}</span>
            <span
              aria-hidden
              className="h-px w-12 bg-current transition-[width] duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:w-20"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
