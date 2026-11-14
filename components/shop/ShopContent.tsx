'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  orderedCategories,
  categoryLabels,
  categoryEyebrow,
  type ProductCategory,
  type ProductBadge,
  type Product,
} from '@/lib/mockData';
import { useProducts } from '@/lib/data/useProducts';
import type { Locale } from '@/i18n/locales';
import { MenuCard } from '@/components/product/MenuCard';
import { ArabesquePattern } from '@/components/ornaments/ArabesquePattern';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

type Props = {
  locale: Locale;
  /** Home page: the grid only — no page title, search or category bar. */
  embedded?: boolean;
};

/**
 * Catalog page — full menu organized by category, no product photos.
 * Each category renders as a section header + a list of MenuCard rows
 * (Pattern C: Editorial List from the design DNA).
 *
 *  – Optional badge filter chips at the top — affect ALL category lists.
 *  – Sticky sub-nav on desktop with category anchors.
 *  – Empty state when filters exclude everything.
 */
export function ShopContent({ locale, embedded = false }: Props) {
  const t = useTranslations('Shop');
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  const [activeBadges, setActiveBadges] = useState<ProductBadge[]>([]);
  const [search, setSearch] = useState('');
  const { products: allProducts, loading } = useProducts();

  const filteredByCategory = useMemo(() => {
    const map = new Map<ProductCategory, Product[]>();
    for (const category of orderedCategories) {
      const list = allProducts
        .filter((p) => p.category === category)
        .filter((p) => {
          const q = search.trim().toLowerCase();
          if (!q) return true;
          return [p.name.he, p.name.ar, p.tastingNote.he, p.tastingNote.ar].some((s) => s.toLowerCase().includes(q));
        })
        .filter((p) => {
          if (activeBadges.length === 0) return true;
          return activeBadges.some((b) => p.badges.includes(b));
        });
      if (list.length > 0) map.set(category, list);
    }
    return map;
  }, [activeBadges, allProducts, search]);

  const totalCount = useMemo(
    () => Array.from(filteredByCategory.values()).reduce((sum, l) => sum + l.length, 0),
    [filteredByCategory]
  );


  return (
    <section className="relative overflow-x-clip bg-page pb-6 md:pb-10">
      {/* Decorative arabesque */}
      <div
        aria-hidden
        className="absolute -top-12 -end-24 w-[600px] h-[600px] text-gold pointer-events-none"
      >
        <ArabesquePattern opacity={0.04} className="absolute inset-0" />
      </div>

      {/* Page header */}
      {!embedded && (
      <header className="relative mx-auto max-w-7xl px-5 md:px-10 pt-12 md:pt-16 pb-8 md:pb-12 flex flex-col items-center text-center">
        <div className="flex items-center gap-5 text-gold-deep">
          <span aria-hidden className="block h-px w-12 bg-gold" />
          <span className="text-[13px] font-medium">
            {t('eyebrow')}
          </span>
          <span aria-hidden className="block h-px w-12 bg-gold" />
        </div>
        <h1
          className={`mt-6 md:mt-8 ${displayFont} font-black tracking-display leading-[1.05] text-heading text-balance text-4xl md:text-6xl lg:text-7xl`}
        >
          {t('title')}
        </h1>
        <p className="mt-6 md:mt-8 max-w-2xl text-base md:text-lg leading-[1.7] text-ink/70 text-pretty">
          {t('body')}
        </p>
        <label className="mt-7 w-full max-w-md">
          <span className="sr-only">{locale === 'ar' ? 'بحث في الكتالوج' : 'חיפוש בקטלוג'}</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={locale === 'ar' ? 'ابحثوا عن منتج… مثلاً: كنافة' : 'חפשו מוצר… למשל: כנאפה'}
            className="w-full h-12 px-5 bg-cream-card border border-gold-deep/50 rounded-full text-base text-ivory text-center placeholder:text-coffee-muted/70 focus:border-gold outline-none"
          />
        </label>
      </header>
      )}

      {/* Category index — sticky, scrolls sideways on phones */}
      {!embedded && (
      <nav
        aria-label={locale === 'ar' ? 'الفئات' : 'קטגוריות'}
        className="sticky top-16 sm:top-[72px] z-30 mb-10 md:mb-14 bg-page/95 backdrop-blur border-y border-hairline"
      >
        <div className="mx-auto max-w-7xl px-4 md:px-10 flex gap-2 overflow-x-auto scrollbar-hide py-3 md:justify-center">
          {Array.from(filteredByCategory.keys()).map((category) => (
            <a
              key={category}
              href={`#cat-${category}`}
              className="shrink-0 h-11 md:h-9 px-4 inline-flex items-center rounded-full border border-hairline bg-cream-card text-[13px] font-medium text-heading hover:border-gold hover:text-gold-deep transition-colors duration-500 whitespace-nowrap"
            >
              {categoryLabels[category][locale]}
            </a>
          ))}
        </div>
      </nav>
      )}

      {/* Catalog body */}
      <div className={`relative mx-auto max-w-[1440px] px-4 md:px-[25px] ${embedded ? 'pt-10 md:pt-[60px]' : ''}`}>
        {loading && allProducts.length === 0 ? (
          <CatalogSkeleton />
        ) : allProducts.length === 0 ? (
          // Catalog empty — the owner hasn't added any products yet.
          <CatalogEmptyState locale={locale} displayFont={displayFont} />
        ) : totalCount === 0 ? (
          <div className="py-24 text-center">
            <p className={`${displayFont} text-2xl text-heading`}>
              {locale === 'ar' ? 'لا توجد نتائج' : 'אין מוצרים שתואמים את הסינון'}
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveBadges([]);
                setSearch('');
              }}
              className="mt-6 font-display-en text-[12px] tracking-eyebrow uppercase text-burgundy hover:text-burgundy-deep transition-colors duration-500"
            >
              {t('clearAll')}
            </button>
          </div>
        ) : (
          Array.from(filteredByCategory.entries()).map(([category, items]) => (
            <CategorySection
              key={category}
              category={category}
              items={items}
              locale={locale}
              displayFont={displayFont}
            />
          ))
        )}
      </div>
    </section>
  );
}

/* ── Category section ─────────────────────────────────────────────── */

type SectionProps = {
  category: ProductCategory;
  items: Product[];
  locale: Locale;
  displayFont: string;
};

function CatalogSkeleton() {
  return (
    <div className="space-y-12 py-8" aria-hidden>
      {[0, 1].map((cat) => (
        <div key={cat} className="space-y-6">
          {/* Category header skeleton */}
          <div className="flex flex-col items-center gap-4">
            <div className="h-3 w-40 bg-sand/70 rounded-[2px] animate-pulse" />
            <div className="h-10 w-56 bg-sand rounded-[2px] animate-pulse" />
          </div>
          {/* Row skeletons */}
          <div className="border-t border-gold-deep/15">
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-x-5 md:gap-x-8 py-6 md:py-7 border-b border-gold-deep/15"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 bg-sand/70 rounded-[2px] animate-pulse" />
                <div className="space-y-2.5">
                  <div className="h-5 w-2/3 bg-sand rounded-[2px] animate-pulse" />
                  <div className="h-3 w-1/2 bg-sand/60 rounded-[2px] animate-pulse" />
                </div>
                <div className="h-5 w-14 bg-sand rounded-[2px] animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CatalogEmptyState({ locale, displayFont }: { locale: Locale; displayFont: string }) {
  return (
    <div className="py-24 md:py-32 flex flex-col items-center text-center max-w-xl mx-auto">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-gold-deep/50" aria-hidden>
        <circle cx="40" cy="40" r="38" />
        <circle cx="40" cy="40" r="28" opacity="0.4" />
        <path d="M 40 18 L 47 30 L 60 32 L 50 42 L 53 56 L 40 50 L 27 56 L 30 42 L 20 32 L 33 30 Z" />
      </svg>
      <p className={`mt-8 ${displayFont} font-black text-2xl md:text-3xl text-heading tracking-display leading-tight text-balance`}>
        {locale === 'ar' ? 'القائمة قيد التحضير' : 'התפריט בהכנה'}
      </p>
      <p className="mt-4 text-base text-ink/70 leading-relaxed text-pretty">
        {locale === 'ar'
          ? 'نقوم بإضافة المنتجات قريباً. تابعونا على إنستغرام للتحديثات.'
          : 'אנחנו מוסיפים מוצרים בקרוב. עקבו אחרינו באינסטגרם לעדכונים.'}
      </p>
      <a
        href="https://www.instagram.com/mamtaki_dalia/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-3 font-display-en text-[12px] tracking-eyebrow uppercase text-heading hover:text-burgundy transition-colors duration-500"
      >
        <span>@mamtaki_dalia</span>
        <span aria-hidden className="h-px w-12 bg-current" />
      </a>
    </div>
  );
}

function CategorySection({ category, items, locale, displayFont }: SectionProps) {
  return (
    <section
      id={`cat-${category}`}
      className="mb-16 md:mb-24 scroll-mt-40"
      aria-labelledby={`heading-${category}`}
    >
      {/* Category header */}
      <motion.header
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: easeLuxe }}
        className="flex items-baseline justify-between gap-4 mb-5 md:mb-6 pb-3 border-b border-black"
      >
        <h2
          id={`heading-${category}`}
          className={`${displayFont} font-bold leading-[1.1] text-heading text-2xl md:text-[2rem]`}
        >
          {categoryLabels[category][locale]}
        </h2>
        <span className="text-[13px] text-coffee-muted">{categoryEyebrow[category][locale]}</span>
      </motion.header>

      {/* Items — card grid: 2 cols phone, 3 tablet, 4 desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2.5 gap-y-10 md:gap-y-12">
        {items.map((product, idx) => (
          <MenuCard key={product.id} product={product} index={idx} />
        ))}
      </div>
    </section>
  );
}
