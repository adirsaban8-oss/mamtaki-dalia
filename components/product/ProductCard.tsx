'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import type { Product } from '@/lib/mockData';

type Props = {
  product: Product;
  index?: number;
};

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Luxury product card per the Patchi/Bateel spec.
 *  – Unified card: 1px gold-deep border (always), shadow-card → shadow-hover.
 *  – Hover: card lifts 8px, border opacity 0.4 → 1, image zooms to 1.04,
 *    caption shifts -4px. All over 600ms ease-out-quad.
 *  – Content: cream-card surface, 32px padding, name 24px, ghost CTA.
 *  – Badge: top-end gold pill — at most one badge.
 *  – Sharp 2px corners.
 */
export function ProductCard({ product, index = 0 }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('FeaturedProducts');
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  const badge = pickBadge(product, locale);

  return (
    <motion.article
      initial={{ y: 32, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.0, ease: easeLuxe, delay: index * 0.1 }}
      className="group relative"
    >
      <Link
        href={`/shop/${product.slug}`}
        className="block focus:outline-none"
        aria-label={product.name[locale]}
      >
        <motion.div
          initial={false}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.6, ease: easeLuxe }}
          className="relative bg-cream-card border border-gold-deep/40 group-hover:border-gold transition-[border-color,box-shadow] duration-[600ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] shadow-card group-hover:shadow-hover rounded-[2px]"
        >
          {/* Image — 1:1 inside the card, with a hairline divider below */}
          <div className="relative aspect-square overflow-hidden bg-ivory">
            <motion.div
              className="absolute inset-0"
              initial={false}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.7, ease: easeLuxe }}
            >
              <Image
                src={product.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 90vw"
                className="object-cover"
              />
            </motion.div>

            {/* Subtle dark scrim at the bottom for any photo without contrast */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, transparent 0%, rgba(26,46,31,0.10) 100%)',
              }}
            />

            {/* Badge — top-end, gold-outlined pill */}
            {badge && (
              <span className="absolute top-4 end-4 z-20 px-3 py-1 bg-ivory/95 backdrop-blur-sm border border-gold-deep/50 text-gold-deep text-[10px] tracking-eyebrow uppercase font-display-en">
                {badge}
              </span>
            )}
          </div>

          {/* Caption — 32px padding, lifts -4px on hover */}
          <motion.div
            initial={false}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.6, ease: easeLuxe }}
            className="p-6 md:p-8 flex flex-col gap-3"
          >
            <h3 className={`${displayFont} font-black tracking-display text-cedar text-xl md:text-2xl leading-tight`}>
              {product.name[locale]}
            </h3>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-en text-[16px] text-burgundy font-medium">
                ₪{product.pricePerKg}
              </span>
              <span className="font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
                {locale === 'ar' ? '/ كغ' : '/ ק״ג'}
              </span>
            </div>

            {/* Ghost CTA — gold outline, sharp corners */}
            <span className="mt-5 inline-flex items-center justify-center gap-2 h-11 px-5 border border-gold-deep/60 text-gold-deep font-display-en text-[12px] tracking-eyebrow uppercase transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:bg-gold-deep group-hover:text-ivory group-hover:border-gold-deep rounded-[2px]">
              {t('cardCta')}
              <Arrow />
            </span>
          </motion.div>
        </motion.div>
      </Link>
    </motion.article>
  );
}

function pickBadge(product: Product, locale: Locale): string | null {
  if (product.badges.includes('bestseller')) {
    return locale === 'ar' ? 'الأكثر مبيعاً' : 'מומלץ';
  }
  if (product.badges.includes('new')) {
    return locale === 'ar' ? 'جديد' : 'חדש';
  }
  if (product.badges.includes('kosher')) {
    return locale === 'ar' ? 'كوشير' : 'כשר';
  }
  return null;
}

function Arrow() {
  return (
    <svg
      width="14"
      height="8"
      viewBox="0 0 14 8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="rtl:rotate-180"
    >
      <path d="M 1 4 L 12 4" />
      <path d="M 9 1 L 12 4 L 9 7" />
    </svg>
  );
}
