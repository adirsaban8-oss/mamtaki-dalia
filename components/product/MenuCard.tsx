'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import type { Product } from '@/lib/mockData';
import { whatsappLink } from '@/lib/site';
import { OrderButton } from '@/components/order/OrderButton';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

type Props = {
  product: Product;
  index?: number;
  /** When true, render as a wider one-line list row (for the editorial
   *  catalog layout). Default false (Pattern A: Menu Card). */
  variant?: 'card' | 'row';
};

/**
 * Catalog card, Dubai-boutique style (after Bateel): white card on the
 * cream page, square full-bleed photo,
 * display-serif name, gold diamond rule, price in gold-deep (or "price
 * on request" while the owner hasn't set one). Hover: border turns gold
 * and the photo zooms 4%, no lift, no shadow.
 *
 * The `row` variant is kept for compact lists.
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
      initial={{ y: 16, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: easeLuxe, delay: (index % 4) * 0.06 }}
      className="group relative"
    >
      <Link href={`/shop/${product.slug}`} className="block" aria-label={product.name[locale]}>
        {/* Photo, tall, edge to edge, no frame */}
        <div className="relative aspect-[3/4] bg-sand overflow-hidden rounded-[10px] shadow-[0_10px_30px_-18px_rgba(42,27,18,0.55)] group-hover:shadow-[0_18px_40px_-18px_rgba(42,27,18,0.7)] transition-shadow duration-500">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name[locale]}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm tracking-[0.3em] uppercase text-coffee-muted">{product.monogram}</span>
            </div>
          )}
          {primaryBadge(product, locale) && (
            <span className="absolute top-3 start-3 px-2.5 h-6 inline-flex items-center bg-page text-heading text-[11px] font-medium">
              {primaryBadge(product, locale)}
            </span>
          )}
        </div>
        <h3 className={`${displayFont} mt-4 sm:mt-5 font-bold text-heading text-[17px] sm:text-xl leading-[1.2]`}>
          {product.name[locale]}
        </h3>
        <p className="mt-1 text-[13px] sm:text-sm leading-snug text-coffee-muted line-clamp-1">{product.tastingNote[locale]}</p>
      </Link>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-[15px] sm:text-base font-semibold text-heading">
          {priceLabel}
          {priceSuffix && <span className="text-[13px] font-normal text-coffee-muted"> {priceSuffix}</span>}
        </p>
        <OrderButton product={product} named
          className="shrink-0 inline-flex items-center h-10 px-4 sm:px-5 rounded-full border border-gold text-gold text-[13px] sm:text-sm font-semibold hover:bg-gold hover:text-[#0A0806] transition-colors duration-300"
        >
          {locale === 'ar' ? 'للطلب' : 'להזמנה'}
        </OrderButton>
      </div>
    </motion.article>
  );
}

/* ── Catalog row variant, for menu-style category sections ──────── */

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
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 sm:gap-x-5 md:gap-x-8">
          {/* Thumb, featured image if available; monogram otherwise.
              Smaller on phones so the name column gets enough width. */}
          {product.image ? (
            <div className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-page border border-gold-deep/30 rounded-[2px] overflow-hidden shrink-0">
              <Image
                src={product.image}
                alt=""
                fill
                sizes="(min-width: 768px) 96px, 56px"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]"
              />
            </div>
          ) : (
            <span className="font-display-en text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gold/70 group-hover:text-gold transition-colors duration-700 self-center">
              {product.monogram}
            </span>
          )}

          {/* Name + tasting note */}
          <div className="min-w-0">
            <h3
              className={`${displayFont} font-bold tracking-display text-heading text-base sm:text-xl md:text-2xl leading-tight`}
            >
              {product.name[locale]}
            </h3>
            <p className="mt-1 sm:mt-1.5 italic font-display-en text-[12px] sm:text-[14px] md:text-[15px] leading-[1.5] text-ink/65 text-pretty line-clamp-2">
              {product.tastingNote[locale]}
            </p>
          </div>

          {/* Price */}
          <div className="text-end self-center shrink-0">
            <div className="flex items-baseline gap-1 sm:gap-1.5 justify-end">
              <span className="font-display-en text-base sm:text-lg md:text-xl text-ink/90 font-medium tabular-nums">
                {priceLabel}
              </span>
            </div>
            <span className="font-display-en text-[9px] sm:text-[10px] tracking-eyebrow uppercase text-coffee-muted mt-0.5 sm:mt-1 block">
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
  if (!product.price) return locale === 'ar' ? 'السعر حسب الطلب' : 'מחיר לפי הזמנה';
  return `₪${product.price}`;
}

function formatPriceSuffix(product: Product, locale: Locale): string {
  if (!product.price) return '';
  if (product.unitLabel) return `/ ${product.unitLabel[locale]}`;
  switch (product.unit) {
    case 'per_kg':
      return locale === 'ar' ? '/ كغ' : '/ ק״ג';
    case 'per_piece':
      return locale === 'ar' ? '/ قطعة' : '/ יחידה';
    case 'per_box':
      return locale === 'ar' ? '/ صينية' : '/ מגש';
  }
}

function primaryBadge(product: Product, locale: Locale): string | null {
  if (product.badges.includes('bestseller')) {
    return locale === 'ar' ? 'الأكثر طلباً' : 'הכי מבוקש';
  }
  if (product.badges.includes('new')) {
    return locale === 'ar' ? 'جديد' : 'חדש';
  }
  if (product.badges.includes('seasonal')) {
    return locale === 'ar' ? 'موسمي' : 'עונתי';
  }
  return null;
}
