'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import type { Product } from '@/lib/mockData';
import { whatsappLink } from '@/lib/site';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

type Props = {
  product: Product;
  index?: number;
  /** When true, render as a wider one-line list row (for the editorial
   *  catalog layout). Default false (Pattern A: Menu Card). */
  variant?: 'card' | 'row';
};

/**
 * Catalog card — Dubai-boutique style (after Bateel): white card on the
 * cream page, square full-bleed photo,
 * display-serif name, gold diamond rule, price in gold-deep (or "price
 * on request" while the owner hasn't set one). Hover: border turns gold
 * and the photo zooms 4% — no lift, no shadow.
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
      className="group relative h-full flex flex-col bg-cream-card border border-hairline hover:border-gold transition-colors duration-500 rounded-[4px] overflow-hidden"
    >
      <Link
        href={`/shop/${product.slug}`}
        className="flex flex-1 flex-col"
        aria-label={product.name[locale]}
      >
        {/* Photo — white stage, product inset so every cut-out sits alike */}
        <div className="relative aspect-square bg-sand overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name[locale]}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display-en text-sm tracking-[0.3em] uppercase text-gold/70">
                {product.monogram}
              </span>
            </div>
          )}
          {primaryBadge(product, locale) && (
            <span className="absolute top-3 start-3 px-2.5 h-6 inline-flex items-center rounded-[2px] bg-cedar text-gold-light text-[11px] font-medium">
              {primaryBadge(product, locale)}
            </span>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-1 flex-col items-center text-center px-3 sm:px-5 pt-4 sm:pt-5 pb-3 sm:pb-4">
          <h3
            className={`${displayFont} font-bold text-heading text-[17px] sm:text-xl leading-[1.2] text-balance`}
          >
            {product.name[locale]}
          </h3>
          <p className="mt-1.5 text-[12px] sm:text-[13px] leading-snug text-coffee-muted line-clamp-2 text-pretty min-h-[2.5em]">
            {product.tastingNote[locale]}
          </p>
          <div className="mt-auto pt-4 flex flex-col items-center">
            <span aria-hidden className="rule-diamond block w-20" />
            <p className="mt-3 text-[13px] sm:text-sm font-medium text-gold-deep">
              {priceLabel}
              {priceSuffix && <span className="text-coffee-muted font-normal"> {priceSuffix}</span>}
            </p>
          </div>
        </div>
      </Link>
      <div className="px-3 sm:px-5 pb-4 sm:pb-5">
        <a
          href={whatsappLink(
            locale === 'ar' ? `مرحباً، أود أن أطلب: ${product.name.ar}` : `שלום, אשמח להזמין: ${product.name.he}`
          )}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${locale === 'ar' ? 'طلب عبر واتساب' : 'הזמנה בוואטסאפ'}: ${product.name[locale]}`}
          className="flex items-center justify-center gap-2 h-10 rounded-[2px] border border-gold/60 text-gold-light text-[13px] sm:text-sm font-medium hover:bg-gold hover:text-black hover:border-gold transition-colors duration-300"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.43 1.27 4.86L2 22l5.27-1.38c1.38.75 2.95 1.18 4.77 1.18 5.52 0 10-4.48 10-10s-4.48-9.8-10-9.8zM16.5 14.81c-.21-.1-1.23-.61-1.42-.68-.19-.07-.33-.1-.47.1-.14.2-.54.68-.66.82-.12.14-.24.16-.45.06-.21-.1-.88-.32-1.68-1.03-.62-.55-1.04-1.24-1.16-1.45-.12-.21-.01-.32.09-.42.09-.09.21-.24.32-.36.1-.12.14-.2.21-.34.07-.14.04-.26-.02-.36-.05-.1-.47-1.14-.65-1.55-.17-.41-.34-.36-.47-.36-.12 0-.26-.02-.4-.02s-.36.05-.55.26c-.19.21-.72.7-.72 1.71 0 1 .74 1.97.84 2.11.1.14 1.45 2.22 3.51 3.11.49.21.87.34 1.17.43.49.16.94.13 1.29.08.39-.06 1.23-.5 1.4-.99.17-.49.17-.91.12-.99-.05-.08-.19-.13-.4-.23z" />
          </svg>
          {locale === 'ar' ? 'للطلب' : 'להזמנה'}
        </a>
      </div>
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
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 sm:gap-x-5 md:gap-x-8">
          {/* Thumb — featured image if available; monogram otherwise.
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
