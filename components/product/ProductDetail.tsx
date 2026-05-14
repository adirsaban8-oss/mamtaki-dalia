'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import type { Product } from '@/lib/mockData';
import { useCart } from '@/store/cart';
import { useCatalog } from '@/store/catalog';
import { Link } from '@/i18n/navigation';
import { WeightSelector } from './WeightSelector';
import { MenuCard } from './MenuCard';
import { buttonClasses } from '@/components/ui/Button';
import { ArabesquePattern } from '@/components/ornaments/ArabesquePattern';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

type Props = { product: Product; locale: Locale };

/**
 * Product Detail — text-led, no gallery. The product's identity is
 * carried by:
 *  – the SKU monogram, displayed as a typographic seal at large scale
 *  – an arabesque rosette ornament centered behind the monogram
 *  – the tasting note and full description
 *
 * The right-hand panel keeps the WeightSelector / price / add-to-cart.
 */
export function ProductDetail({ product, locale }: Props) {
  const t = useTranslations('Product');
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  const isWeighted = product.unit === 'per_kg';
  const [weight, setWeight] = useState(product.minWeight ?? 0.5);
  const [openSection, setOpenSection] = useState<string | null>('ingredients');

  const add = useCart((s) => s.add);

  const total = useMemo(() => {
    if (!isWeighted) return product.price;
    return product.price * weight;
  }, [product, weight, isWeighted]);

  const allProducts = useCatalog((s) => s.products);
  const related = useMemo(
    () =>
      allProducts
        .filter(
          (p) =>
            p.id !== product.id &&
            p.visible !== false &&
            (p.category === product.category || p.badges.includes('bestseller'))
        )
        .slice(0, 4),
    [product, allProducts]
  );

  const sections = [
    { key: 'ingredients', title: t('ingredients'), body: product.ingredients[locale] },
    { key: 'allergens', title: t('allergens'), body: t('allergensBody') },
    { key: 'storage', title: t('storage'), body: t('storageBody') },
    { key: 'prepTime', title: t('prepTime'), body: t('prepTimeBody') },
  ] as const;

  const priceSuffix =
    product.unit === 'per_kg'
      ? locale === 'ar' ? '/ كغ' : '/ ק״ג'
      : product.unit === 'per_piece'
        ? locale === 'ar' ? '/ قطعة' : '/ מנה'
        : locale === 'ar' ? '/ علبة' : '/ מארז';

  return (
    <article className="relative bg-ivory">
      <div
        aria-hidden
        className="absolute -top-12 -end-24 w-[500px] h-[500px] text-gold pointer-events-none"
      >
        <ArabesquePattern opacity={0.04} className="absolute inset-0" />
      </div>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="relative mx-auto max-w-7xl px-5 md:px-10 pt-8 md:pt-10">
        <ol className="flex items-center gap-3 font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
          <li>
            <Link href="/" className="hover:text-burgundy transition-colors duration-500">
              {locale === 'ar' ? 'الرئيسية' : 'בית'}
            </Link>
          </li>
          <li aria-hidden>·</li>
          <li>
            <Link href="/shop" className="hover:text-burgundy transition-colors duration-500">
              {locale === 'ar' ? 'القائمة' : 'הקטלוג'}
            </Link>
          </li>
          <li aria-hidden>·</li>
          <li className="text-cedar truncate">{product.name[locale]}</li>
        </ol>
      </nav>

      {/* Hero — 2 column desktop */}
      <div className="relative mx-auto max-w-7xl px-5 md:px-10 pt-10 md:pt-14 pb-16 md:pb-24 grid lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Left — Monogram seal in place of a photo */}
        <div className="lg:col-span-6 order-1">
          <MonogramSeal product={product} />
        </div>

        {/* Right — details panel */}
        <div className="lg:col-span-6 order-2 flex flex-col">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            {product.badges.includes('bestseller') && <Pill>{t('bestsellerBadge')}</Pill>}
            {product.badges.includes('kosher') && <Pill>{t('kosherBadge')}</Pill>}
            <Pill>{t('freshBadge')}</Pill>
            {product.badges.includes('vegan') && <Pill>{t('veganBadge')}</Pill>}
            {product.badges.includes('seasonal') && (
              <Pill>{locale === 'ar' ? 'موسمي' : 'עונתי'}</Pill>
            )}
          </div>

          <h1
            className={`${displayFont} font-black tracking-display leading-[1.05] text-cedar text-4xl md:text-5xl text-balance`}
          >
            {product.name[locale]}
          </h1>

          {/* Tasting note — italic gold-deep, the poetic line */}
          <p
            className={`mt-5 italic ${displayFont} text-lg md:text-xl leading-[1.5] text-gold-deep text-pretty`}
          >
            {product.tastingNote[locale]}
          </p>

          {/* Full description */}
          <p className="mt-6 text-base md:text-[17px] leading-relaxed text-ink/80 text-pretty">
            {product.description[locale]}
          </p>

          {/* Hairline */}
          <span aria-hidden className="block h-px w-full bg-hairline mt-8 mb-8" />

          {/* Price label */}
          <div className="flex items-baseline gap-3">
            <span className="font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
              {isWeighted ? t('priceKgNote') : t('priceUnitNote')}
            </span>
            <span className={`${displayFont} text-2xl text-burgundy font-medium`}>
              ₪{product.price}
            </span>
          </div>

          {/* Weight selector — only when sold per kg */}
          {isWeighted && product.minWeight !== undefined && product.weightStep !== undefined && (
            <>
              <span aria-hidden className="block h-px w-full bg-hairline mt-8 mb-8" />
              <WeightSelector
                weight={weight}
                onChange={setWeight}
                min={product.minWeight}
                max={5}
                step={product.weightStep}
              />
            </>
          )}

          {/* Live total */}
          <div className="mt-8 flex items-baseline justify-between">
            <div>
              <p className="font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
                {t('totalLabel')}
              </p>
              <p className="font-display-en text-[10px] tracking-eyebrow uppercase text-coffee-muted/70 mt-1">
                {isWeighted ? t('totalNote') : t('totalNoteFixed')}
              </p>
            </div>
            <motion.span
              key={total}
              initial={{ scale: 1.08, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: easeLuxe }}
              className={`${displayFont} font-black text-4xl text-burgundy tabular-nums`}
            >
              ₪{total.toFixed(0)}
            </motion.span>
          </div>

          {/* Add to cart */}
          <button
            type="button"
            onClick={() => add(product.id, isWeighted ? weight : 1)}
            className={buttonClasses({ variant: 'primary', size: 'lg', className: 'w-full mt-8 h-16' })}
          >
            {t('addToCart')}
            <CartBagIcon />
          </button>

          {/* Freshness note */}
          <p className="mt-6 font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted text-center">
            {t('freshness', { hours: product.freshnessHours })}
          </p>

          {/* Accordion */}
          <div className="mt-10 border-t border-hairline">
            {sections.map((section) => (
              <AccordionItem
                key={section.key}
                title={section.title}
                body={section.body}
                isOpen={openSection === section.key}
                onToggle={() =>
                  setOpenSection((c) => (c === section.key ? null : section.key))
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="relative bg-ivory py-16 md:py-[120px] border-t border-hairline/60">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <header className="flex flex-col items-center text-center mb-12 md:mb-16">
            <div className="flex items-center gap-5 text-gold-deep">
              <span aria-hidden className="block h-px w-12 bg-gold" />
              <span className="font-display-en text-[12px] tracking-eyebrow uppercase">
                {locale === 'ar' ? 'مقترحات' : 'מומלץ'}
              </span>
              <span aria-hidden className="block h-px w-12 bg-gold" />
            </div>
            <h2 className={`mt-6 ${displayFont} font-black text-3xl md:text-5xl text-cedar tracking-display leading-[1.05] text-balance`}>
              {t('relatedHeading')}
            </h2>
          </header>

          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {related.map((p, idx) => (
              <MenuCard key={p.id} product={p} index={idx} />
            ))}
          </div>
          <div className="md:hidden -mx-5 px-5 overflow-x-auto snap-x snap-mandatory flex gap-5 pb-4 scrollbar-hide">
            {related.map((p, idx) => (
              <div key={p.id} className="snap-start shrink-0 w-[82%]">
                <MenuCard product={p} index={idx} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

/* ── Monogram seal — the photo-less product identity ─────────────── */

function MonogramSeal({ product }: { product: Product }) {
  return (
    <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
      {/* Outer parchment surface */}
      <div className="absolute inset-0 bg-cream-card border border-gold-deep/40 rounded-[2px] shadow-soft" />

      {/* Inner hairline frame (16px inset) */}
      <span aria-hidden className="absolute inset-4 border border-gold/30 rounded-[2px] pointer-events-none" />

      {/* Decorative rosette behind the monogram */}
      <div className="absolute inset-12 flex items-center justify-center pointer-events-none">
        <Rosette />
      </div>

      {/* Monogram — typographic seal */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <span className="font-display-en text-[10px] tracking-[0.4em] uppercase text-gold-deep/70">
          Maison Dalia · Est. 1985
        </span>
        <span className="mt-6 font-display-en text-[26px] md:text-[32px] tracking-[0.45em] text-gold uppercase">
          {product.monogram}
        </span>
        <span className="mt-6 block h-px w-16 bg-gold-deep/50" aria-hidden />
        <span className="mt-6 font-display-en text-[10px] tracking-[0.4em] uppercase text-gold-deep/70">
          {product.category.replace(/-/g, ' ')}
        </span>
      </div>
    </div>
  );
}

function Rosette() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 240 240"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.7"
      className="text-gold-deep/30"
      aria-hidden
    >
      {/* Eight-pointed star */}
      <path d="M 120 20 L 145 95 L 220 95 L 160 140 L 185 215 L 120 170 L 55 215 L 80 140 L 20 95 L 95 95 Z" />
      <path d="M 120 50 L 138 100 L 190 100 L 148 132 L 165 185 L 120 154 L 75 185 L 92 132 L 50 100 L 102 100 Z" />
      <circle cx="120" cy="120" r="30" />
      <circle cx="120" cy="120" r="6" fill="currentColor" />
      <path d="M 120 90 L 120 150 M 90 120 L 150 120" opacity="0.4" />
    </svg>
  );
}

/* ── Accordion ────────────────────────────────────────────────────── */

function AccordionItem({
  title,
  body,
  isOpen,
  onToggle,
}: {
  title: string;
  body: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-hairline">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between py-5 text-start group"
      >
        <span className="font-display-en text-[12px] tracking-eyebrow uppercase text-cedar group-hover:text-burgundy transition-colors duration-500">
          {title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.5, ease: easeLuxe }}
          className="text-gold-deep"
          aria-hidden
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M 0 7 L 14 7 M 7 0 L 7 14" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.6, ease: easeLuxe }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-[15px] leading-relaxed text-ink/70 text-pretty">{body}</p>
      </motion.div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 h-7 inline-flex items-center font-display-en text-[11px] tracking-eyebrow uppercase border border-gold-deep/60 text-gold-deep rounded-[2px]">
      {children}
    </span>
  );
}

function CartBagIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M 3 5 L 13 5 L 12 14 L 4 14 Z" />
      <path d="M 5 5 L 5 3 a 3 3 0 0 1 6 0 L 11 5" />
    </svg>
  );
}
