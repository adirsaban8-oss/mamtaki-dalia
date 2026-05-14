'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import type { Product } from '@/lib/mockData';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

type Props = {
  product: Product;
  index?: number;
  /** When true, render as a wider one-line list row (for the editorial
   *  catalog layout). Default false (Pattern A: Menu Card). */
  variant?: 'card' | 'row';
};

/**
 * Catalog primitive. No product photo — the SKU monogram is the visual
 * identity. Layout:
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │ [K · N · F]                                       [bestseller]│
 *   │                                                                │
 *   │              כנאפה גבינה קלאסית                                │
 *   │      גבינה רכה · סירופ ורדים · פיסטוק חלבי                    │
 *   │                                                                │
 *   │              ─────────────                                     │
 *   │              ₪160  /  ק"ג                                      │
 *   └──────────────────────────────────────────────────────────────┘
 *
 *  – Sharp 2px corners (luxury discipline).
 *  – 1px gold-deep hairline border at 40% opacity, full gold on hover.
 *  – Subtle -4px lift (less than the photo-card -8px; less mass to move).
 *  – Hover: monogram fades from gold/60 to full gold; small directional
 *    chevron appears next to the price.
 */
export function MenuCard({ product, index = 0, variant = 'card' }: Props) {
  const locale = useLocale() as Locale;
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  const priceLabel = formatPrice(product, locale);
  const priceSuffix = formatPriceSuffix(product, locale);

  if (variant === 'row') {
    return (
      <CatalogRow product={product} index={index} locale={locale} displayFont={displayFont} priceLabel={priceLabel} priceSuffix={priceSuffix} />
    );
  }

  return (
    <motion.article
      initial={{ y: 24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.0, ease: easeLuxe, delay: index * 0.08 }}
      className="group relative"
    >
      <Link
        href={`/shop/${product.slug}`}
        className="block focus:outline-none"
        aria-label={product.name[locale]}
      >
        <motion.div
          initial={false}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.7, ease: easeLuxe }}
          className="relative bg-cream-card border border-gold-deep/40 group-hover:border-gold transition-[border-color] duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] rounded-[2px] p-7 md:p-10 min-h-[320px] flex flex-col"
        >
          {/* Header row: monogram + badge */}
          <div className="flex items-start justify-between gap-4 mb-8 md:mb-10">
            <span className="font-display-en text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gold/70 group-hover:text-gold transition-colors duration-700">
              {product.monogram}
            </span>
            {primaryBadge(product, locale) && (
              <span className="font-display-en text-[10px] tracking-eyebrow uppercase text-gold-deep border border-gold-deep/40 px-2 py-0.5 rounded-[2px]">
                {primaryBadge(product, locale)}
              </span>
            )}
          </div>

          {/* Title + tasting note — main content block */}
          <div className="flex-1 flex flex-col items-start text-start">
            <h3
              className={`${displayFont} font-black tracking-display text-cedar text-2xl md:text-[26px] leading-[1.15] text-balance`}
            >
              {product.name[locale]}
            </h3>
            <p className="mt-3 md:mt-4 italic font-display-en text-[15px] md:text-base leading-[1.55] text-ink/70 text-pretty">
              {product.tastingNote[locale]}
            </p>
          </div>

          {/* Footer row: hairline + price */}
          <div className="mt-7 md:mt-8 flex items-end justify-between gap-4">
            <span aria-hidden className="block h-px w-12 bg-gold-deep/40" />
            <div className="flex items-baseline gap-1.5">
              <span className="font-display-en text-lg md:text-[20px] text-ink/85 font-medium tabular-nums">
                {priceLabel}
              </span>
              <span className="font-display-en text-[10px] md:text-[11px] tracking-eyebrow uppercase text-coffee-muted">
                {priceSuffix}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.article>
  );
}

/* ── Catalog row variant — for menu-style category sections ──────── */

type RowProps = {
  product: Product;
  index: number;
  locale: Locale;
  displayFont: string;
  priceLabel: string;
  priceSuffix: string;
};

function CatalogRow({ product, index, locale, displayFont, priceLabel, priceSuffix }: RowProps) {
  return (
    <motion.div
      initial={{ y: 12, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: easeLuxe, delay: index * 0.05 }}
      className="group"
    >
      <Link
        href={`/shop/${product.slug}`}
        className="block py-6 md:py-7 border-b border-gold-deep/15 hover:border-gold-deep/40 transition-colors duration-500 group/row"
      >
        <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 md:gap-x-8">
          {/* Monogram — sits like a chapter number */}
          <span className="font-display-en text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gold/70 group-hover:text-gold transition-colors duration-700 self-center">
            {product.monogram}
          </span>

          {/* Name + tasting note */}
          <div className="min-w-0">
            <h3
              className={`${displayFont} font-bold tracking-display text-cedar text-xl md:text-2xl leading-tight`}
            >
              {product.name[locale]}
            </h3>
            <p className="mt-1.5 italic font-display-en text-[14px] md:text-[15px] leading-[1.55] text-ink/65 text-pretty">
              {product.tastingNote[locale]}
            </p>
          </div>

          {/* Price */}
          <div className="text-end self-center">
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className="font-display-en text-lg md:text-xl text-ink/90 font-medium tabular-nums">
                {priceLabel}
              </span>
            </div>
            <span className="font-display-en text-[10px] tracking-eyebrow uppercase text-coffee-muted mt-1 block">
              {priceSuffix}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── helpers ──────────────────────────────────────────────────────── */

function formatPrice(product: Product, locale: Locale): string {
  return `₪${product.price}`;
}

function formatPriceSuffix(product: Product, locale: Locale): string {
  switch (product.unit) {
    case 'per_kg':
      return locale === 'ar' ? '/ كغ' : '/ ק״ג';
    case 'per_piece':
      return locale === 'ar' ? '/ قطعة' : '/ מנה';
    case 'per_box':
      return locale === 'ar' ? '/ علبة' : '/ מארז';
  }
}

function primaryBadge(product: Product, locale: Locale): string | null {
  if (product.badges.includes('bestseller')) {
    return locale === 'ar' ? 'الأكثر مبيعاً' : 'מומלץ';
  }
  if (product.badges.includes('new')) {
    return locale === 'ar' ? 'جديد' : 'חדש';
  }
  if (product.badges.includes('seasonal')) {
    return locale === 'ar' ? 'موسمي' : 'עונתי';
  }
  return null;
}
