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
import { useCatalog } from '@/store/catalog';
import type { Locale } from '@/i18n/locales';
import { MenuCard } from '@/components/product/MenuCard';
import { ArabesquePattern } from '@/components/ornaments/ArabesquePattern';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

const ALL_BADGES: ProductBadge[] = ['bestseller', 'new', 'seasonal', 'kosher', 'vegan'];

type Props = { locale: Locale };

/**
 * Catalog page — full menu organized by category, no product photos.
 * Each category renders as a section header + a list of MenuCard rows
 * (Pattern C: Editorial List from the design DNA).
 *
 *  – Optional badge filter chips at the top — affect ALL category lists.
 *  – Sticky sub-nav on desktop with category anchors.
 *  – Empty state when filters exclude everything.
 */
export function ShopContent({ locale }: Props) {
  const t = useTranslations('Shop');
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  const [activeBadges, setActiveBadges] = useState<ProductBadge[]>([]);
  const allProducts = useCatalog((s) => s.products);

  const filteredByCategory = useMemo(() => {
    const map = new Map<ProductCategory, Product[]>();
    for (const category of orderedCategories) {
      const list = allProducts
        .filter((p) => p.category === category && p.visible !== false)
        .filter((p) => {
          if (activeBadges.length === 0) return true;
          return activeBadges.some((b) => p.badges.includes(b));
        });
      if (list.length > 0) map.set(category, list);
    }
    return map;
  }, [activeBadges, allProducts]);

  const totalCount = useMemo(
    () => Array.from(filteredByCategory.values()).reduce((sum, l) => sum + l.length, 0),
    [filteredByCategory]
  );

  const toggleBadge = (badge: ProductBadge) =>
    setActiveBadges((cur) => (cur.includes(badge) ? cur.filter((b) => b !== badge) : [...cur, badge]));

  return (
    <section className="relative bg-ivory pb-16 md:pb-[120px]">
      {/* Decorative arabesque */}
      <div
        aria-hidden
        className="absolute -top-12 -end-24 w-[600px] h-[600px] text-gold pointer-events-none"
      >
        <ArabesquePattern opacity={0.04} className="absolute inset-0" />
      </div>

      {/* Page header */}
      <header className="relative mx-auto max-w-7xl px-5 md:px-10 pt-16 md:pt-24 pb-12 md:pb-16 flex flex-col items-center text-center">
        <div className="flex items-center gap-5 text-gold-deep">
          <span aria-hidden className="block h-px w-12 bg-gold" />
          <span className="font-display-en text-[12px] tracking-eyebrow uppercase">
            {t('eyebrow')}
          </span>
          <span aria-hidden className="block h-px w-12 bg-gold" />
        </div>
        <h1
          className={`mt-6 md:mt-8 ${displayFont} font-black tracking-display leading-[1.05] text-cedar text-balance text-4xl md:text-6xl lg:text-7xl`}
        >
          {t('title')}
        </h1>
        <p className="mt-6 md:mt-8 max-w-2xl text-base md:text-lg leading-[1.7] text-ink/70 text-pretty">
          {t('body')}
        </p>
      </header>

      {/* Filter chips */}
      <div className="relative mx-auto max-w-7xl px-5 md:px-10 mb-12 md:mb-16 flex flex-wrap items-center justify-center gap-2.5">
        {ALL_BADGES.map((badge) => {
          const active = activeBadges.includes(badge);
          return (
            <button
              key={badge}
              type="button"
              onClick={() => toggleBadge(badge)}
              aria-pressed={active}
              className={`px-4 h-9 inline-flex items-center font-display-en text-[11px] tracking-eyebrow uppercase border transition-colors duration-500 rounded-[2px] ${active ? 'border-gold bg-gold text-ivory' : 'border-gold-deep/40 text-coffee-muted hover:border-gold hover:text-cedar'}`}
            >
              {t(`tags.${badge}`)}
            </button>
          );
        })}
        {activeBadges.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveBadges([])}
            className="ms-2 font-display-en text-[11px] tracking-eyebrow uppercase text-burgundy hover:text-burgundy-deep transition-colors duration-500"
          >
            {t('clearAll')}
          </button>
        )}
      </div>

      {/* Category index — sticky pill nav on desktop */}
      <nav
        aria-label="Categories"
        className="relative mx-auto max-w-7xl px-5 md:px-10 mb-16 md:mb-20 hidden lg:flex flex-wrap items-center justify-center gap-2 sticky top-[88px] z-30"
      >
        <div className="bg-cream-card border border-gold-deep/30 px-2 py-1.5 flex flex-wrap items-center gap-1 rounded-[2px] shadow-soft backdrop-blur">
          {Array.from(filteredByCategory.keys()).map((category) => (
            <a
              key={category}
              href={`#cat-${category}`}
              className="font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted hover:text-cedar transition-colors duration-500 px-3 py-2"
            >
              {categoryLabels[category][locale]}
            </a>
          ))}
        </div>
      </nav>

      {/* Catalog body */}
      <div className="relative mx-auto max-w-5xl px-5 md:px-10">
        {allProducts.length === 0 ? (
          // Catalog empty — the owner hasn't added any products yet.
          <CatalogEmptyState locale={locale} displayFont={displayFont} />
        ) : totalCount === 0 ? (
          <div className="py-24 text-center">
            <p className={`${displayFont} text-2xl text-cedar`}>
              {locale === 'ar' ? 'لا توجد نتائج' : 'אין מוצרים שתואמים את הסינון'}
            </p>
            <button
              type="button"
              onClick={() => setActiveBadges([])}
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

function CatalogEmptyState({ locale, displayFont }: { locale: Locale; displayFont: string }) {
  return (
    <div className="py-24 md:py-32 flex flex-col items-center text-center max-w-xl mx-auto">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-gold-deep/50" aria-hidden>
        <circle cx="40" cy="40" r="38" />
        <circle cx="40" cy="40" r="28" opacity="0.4" />
        <path d="M 40 18 L 47 30 L 60 32 L 50 42 L 53 56 L 40 50 L 27 56 L 30 42 L 20 32 L 33 30 Z" />
      </svg>
      <p className={`mt-8 ${displayFont} font-black text-2xl md:text-3xl text-cedar tracking-display leading-tight text-balance`}>
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
        className="mt-8 inline-flex items-center gap-3 font-display-en text-[12px] tracking-eyebrow uppercase text-cedar hover:text-burgundy transition-colors duration-500"
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
      className="mb-20 md:mb-28 scroll-mt-32"
      aria-labelledby={`heading-${category}`}
    >
      {/* Category header */}
      <motion.header
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: easeLuxe }}
        className="flex flex-col items-center text-center mb-10 md:mb-14"
      >
        <div className="flex items-center gap-5 text-gold-deep">
          <span aria-hidden className="block h-px w-12 bg-gold" />
          <span className="font-display-en text-[11px] tracking-eyebrow uppercase">
            {categoryEyebrow[category][locale]}
          </span>
          <span aria-hidden className="block h-px w-12 bg-gold" />
        </div>
        <h2
          id={`heading-${category}`}
          className={`mt-5 md:mt-6 ${displayFont} font-black tracking-display leading-[1.05] text-cedar text-balance text-3xl md:text-4xl lg:text-5xl`}
        >
          {categoryLabels[category][locale]}
        </h2>
      </motion.header>

      {/* Items — Editorial List (vertical, dot-leader feel) */}
      <div className="border-t border-gold-deep/20">
        {items.map((product, idx) => (
          <MenuCard key={product.id} product={product} variant="row" index={idx} />
        ))}
      </div>
    </section>
  );
}
