'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { products, type ProductCategory, type ProductBadge } from '@/lib/mockData';
import type { Locale } from '@/i18n/locales';
import { ProductCard } from '@/components/product/ProductCard';
import { ArabesquePattern } from '@/components/ornaments/ArabesquePattern';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

type SortKey = 'popular' | 'newest' | 'priceAsc' | 'priceDesc';

const CATEGORIES: ProductCategory[] = [
  'kanafeh',
  'baklava',
  'beirut-nights',
  'gift-boxes',
  'specialty',
  'catering',
];

const TAGS: ProductBadge[] = ['bestseller', 'kosher', 'new', 'vegan'];

type Props = { locale: Locale };

export function ShopContent({ locale }: Props) {
  const t = useTranslations('Shop');
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  const [activeCategories, setActiveCategories] = useState<ProductCategory[]>([]);
  const [activeTags, setActiveTags] = useState<ProductBadge[]>([]);
  const [sort, setSort] = useState<SortKey>('popular');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategories.length > 0) {
      list = list.filter((p) => activeCategories.includes(p.category));
    }
    if (activeTags.length > 0) {
      list = list.filter((p) => activeTags.some((tag) => p.badges.includes(tag)));
    }
    switch (sort) {
      case 'priceAsc':
        list.sort((a, b) => a.pricePerKg - b.pricePerKg);
        break;
      case 'priceDesc':
        list.sort((a, b) => b.pricePerKg - a.pricePerKg);
        break;
      case 'newest':
        list.sort((a, b) => Number(b.badges.includes('new')) - Number(a.badges.includes('new')));
        break;
      default:
        list.sort((a, b) => Number(b.badges.includes('bestseller')) - Number(a.badges.includes('bestseller')));
    }
    return list;
  }, [activeCategories, activeTags, sort]);

  const toggleCategory = (c: ProductCategory) =>
    setActiveCategories((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));
  const toggleTag = (tag: ProductBadge) =>
    setActiveTags((cur) => (cur.includes(tag) ? cur.filter((x) => x !== tag) : [...cur, tag]));
  const clearAll = () => {
    setActiveCategories([]);
    setActiveTags([]);
    setSort('popular');
  };

  return (
    <section className="relative bg-ivory pb-16 md:pb-[120px]">
      {/* Top arabesque corner */}
      <div
        aria-hidden
        className="absolute -top-12 -end-24 w-[600px] h-[600px] text-gold pointer-events-none"
      >
        <ArabesquePattern opacity={0.04} className="absolute inset-0" />
      </div>

      {/* Page header */}
      <div className="relative mx-auto max-w-7xl px-5 md:px-10 pt-16 md:pt-24 pb-12 md:pb-20 flex flex-col items-center text-center">
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
        <p className="mt-6 md:mt-8 max-w-2xl text-base md:text-lg leading-[1.7] text-coffee-muted text-pretty">
          {t('body')}
        </p>
      </div>

      {/* Layout — sidebar + grid */}
      <div className="relative mx-auto max-w-7xl px-5 md:px-10 grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-14">
        {/* Sidebar (desktop) / drawer trigger (mobile) */}
        <aside className="hidden lg:block">
          <FilterPanel
            locale={locale}
            activeCategories={activeCategories}
            activeTags={activeTags}
            sort={sort}
            onToggleCategory={toggleCategory}
            onToggleTag={toggleTag}
            onSetSort={setSort}
            onClear={clearAll}
            resultsCount={filtered.length}
          />
        </aside>

        {/* Mobile: open filter button + count */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-3 px-5 h-11 border border-gold-deep/60 text-cedar font-display-en text-[12px] tracking-eyebrow uppercase rounded-[2px] hover:bg-sand transition-colors duration-500"
          >
            <FilterIcon />
            {t('filterTitle')}
          </button>
          <span className="font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
            {t('resultsCount', { count: filtered.length })}
          </span>
        </div>

        {/* Grid */}
        <div>
          <div className="hidden lg:flex items-center justify-end mb-6">
            <span className="font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
              {t('resultsCount', { count: filtered.length })}
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
              {filtered.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className={`${displayFont} text-2xl text-cedar`}>
                {locale === 'ar' ? 'لا توجد نتائج' : 'אין מוצרים שתואמים את הסינון'}
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-6 font-display-en text-[12px] tracking-eyebrow uppercase text-burgundy hover:text-burgundy-deep transition-colors duration-500"
              >
                {t('clearAll')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="lg:hidden fixed inset-0 z-[55] flex">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-cedar/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.6, ease: easeLuxe }}
            className="relative w-[85%] max-w-sm h-full bg-ivory shadow-deep p-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className={`${displayFont} font-black text-2xl text-cedar`}>{t('filterTitle')}</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close"
                className="w-10 h-10 inline-flex items-center justify-center text-cedar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
                  <path d="M 5 5 L 19 19" />
                  <path d="M 19 5 L 5 19" />
                </svg>
              </button>
            </div>
            <FilterPanel
              locale={locale}
              activeCategories={activeCategories}
              activeTags={activeTags}
              sort={sort}
              onToggleCategory={toggleCategory}
              onToggleTag={toggleTag}
              onSetSort={setSort}
              onClear={clearAll}
              resultsCount={filtered.length}
            />
          </motion.aside>
        </div>
      )}
    </section>
  );
}

/* ── Filter Panel ─────────────────────────────────────────────────── */

type FilterPanelProps = {
  locale: Locale;
  activeCategories: ProductCategory[];
  activeTags: ProductBadge[];
  sort: SortKey;
  resultsCount: number;
  onToggleCategory: (c: ProductCategory) => void;
  onToggleTag: (tag: ProductBadge) => void;
  onSetSort: (s: SortKey) => void;
  onClear: () => void;
};

function FilterPanel({
  locale,
  activeCategories,
  activeTags,
  sort,
  onToggleCategory,
  onToggleTag,
  onSetSort,
  onClear,
}: FilterPanelProps) {
  const t = useTranslations('Shop');
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  return (
    <div className="bg-cream-card border border-hairline p-7 md:p-8 rounded-[2px] lg:sticky lg:top-28 space-y-9">
      <div className="flex items-center justify-between">
        <h2 className={`${displayFont} font-black text-xl text-cedar`}>{t('filterTitle')}</h2>
        {(activeCategories.length > 0 || activeTags.length > 0 || sort !== 'popular') && (
          <button
            type="button"
            onClick={onClear}
            className="font-display-en text-[11px] tracking-eyebrow uppercase text-burgundy hover:text-burgundy-deep transition-colors duration-500"
          >
            {t('clearAll')}
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterGroup title={t('categoriesHeading')} displayFont={displayFont}>
        <ul className="space-y-2.5">
          {CATEGORIES.map((cat) => {
            const active = activeCategories.includes(cat);
            return (
              <li key={cat}>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <span
                    aria-hidden
                    className={`inline-flex items-center justify-center w-4 h-4 border transition-colors duration-300 ${active ? 'bg-gold border-gold' : 'bg-transparent border-gold-deep/60 group-hover:border-gold'}`}
                  >
                    {active && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M 1 4 L 4 7 L 9 1" />
                      </svg>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={active}
                    onChange={() => onToggleCategory(cat)}
                  />
                  <span className={`${active ? 'text-cedar' : 'text-coffee-muted group-hover:text-cedar'} text-sm transition-colors duration-300`}>
                    {t(`categories.${cat}`)}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      {/* Tags / Badges */}
      <FilterGroup title={t('tagsHeading')} displayFont={displayFont}>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => {
            const active = activeTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleTag(tag)}
                aria-pressed={active}
                className={`px-3 h-8 inline-flex items-center font-display-en text-[11px] tracking-eyebrow uppercase border transition-colors duration-300 rounded-[2px] ${active ? 'border-gold bg-gold text-ivory' : 'border-gold-deep/50 text-coffee-muted hover:border-gold hover:text-cedar'}`}
              >
                {t(`tags.${tag}`)}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* Price range — visual only for the demo */}
      <FilterGroup title={t('priceHeading')} displayFont={displayFont}>
        <div className="pt-2">
          <div className="relative h-1 bg-hairline">
            <span className="absolute inset-y-0 start-[10%] end-[15%] bg-gold" />
            <span className="absolute -top-1.5 start-[10%] w-4 h-4 rounded-full bg-cream-card border border-gold-deep" />
            <span className="absolute -top-1.5 end-[15%] w-4 h-4 rounded-full bg-cream-card border border-gold-deep" />
          </div>
          <div className="mt-4 flex items-center justify-between font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
            <span>₪120</span>
            <span>₪280</span>
          </div>
        </div>
      </FilterGroup>

      {/* Sort */}
      <FilterGroup title={t('sortHeading')} displayFont={displayFont}>
        <ul className="space-y-2">
          {(['popular', 'newest', 'priceAsc', 'priceDesc'] as const).map((key) => {
            const active = sort === key;
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => onSetSort(key)}
                  className={`flex items-center justify-between w-full text-start text-sm transition-colors duration-300 ${active ? 'text-cedar' : 'text-coffee-muted hover:text-cedar'}`}
                >
                  <span>{t(`sort.${key}`)}</span>
                  {active && (
                    <span aria-hidden className="block h-px w-6 bg-gold" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({
  title,
  displayFont,
  children,
}: {
  title: string;
  displayFont: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className={`${displayFont} font-black text-[15px] text-cedar mb-4 pb-3 border-b border-hairline/60`}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden>
      <path d="M 0 3 L 9 3" />
      <path d="M 12 3 L 14 3" />
      <path d="M 0 7 L 3 7" />
      <path d="M 6 7 L 14 7" />
      <path d="M 0 11 L 9 11" />
      <path d="M 12 11 L 14 11" />
      <circle cx="10.5" cy="3" r="1.5" />
      <circle cx="4.5" cy="7" r="1.5" />
      <circle cx="10.5" cy="11" r="1.5" />
    </svg>
  );
}
