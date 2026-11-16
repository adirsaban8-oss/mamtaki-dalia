'use client';

import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import type { Product } from '@/lib/mockData';
import { whatsappLink } from '@/lib/site';
import { ORDERING_MODE } from '@/lib/ordering';
import { DEFAULT_GRAMS, orderMessage } from '@/lib/weight';
import { useCart } from '@/store/cart';

type Props = {
  product: Product;
  /** Chosen weight for per-kg products (defaults to 1 kg). */
  grams?: number;
  className?: string;
  /** Content in WhatsApp mode (today's label + icon). */
  children: React.ReactNode;
  /** Content in site mode; defaults to "add to cart". */
  siteChildren?: React.ReactNode;
  /** Shown after the label in both modes (e.g. the price). */
  suffix?: React.ReactNode;
  /** Give the button an accessible name that includes the product. */
  named?: boolean;
};

/**
 * The one order button. In WhatsApp mode it opens WhatsApp with the product
 * (and weight); in site mode it adds the same product and weight to the cart.
 * The mode comes from lib/ordering.ts.
 */
export function OrderButton({ product, grams, className, children, siteChildren, suffix, named }: Props) {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const add = useCart((s) => s.add);
  const byKg = product.unit === 'per_kg';

  if (ORDERING_MODE === 'whatsapp') {
    return (
      <a
        href={whatsappLink(orderMessage(product, locale, byKg ? grams : undefined))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={named ? `${ar ? 'طلب عبر واتساب' : 'הזמנה בוואטסאפ'}: ${product.name[locale]}` : undefined}
        className={className}
      >
        {children}
        {suffix}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => add(product.id, byKg ? (grams ?? DEFAULT_GRAMS) / 1000 : 1)}
      aria-label={named ? `${ar ? 'أضف إلى السلة' : 'הוספה לסל'}: ${product.name[locale]}` : undefined}
      className={className}
    >
      {siteChildren ?? (ar ? 'أضف إلى السلة' : 'הוספה לסל')}
      {suffix}
    </button>
  );
}
