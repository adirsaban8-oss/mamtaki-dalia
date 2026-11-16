'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import type { Product } from '@/lib/mockData';
import { whatsappLink } from '@/lib/site';
import { OrderButton } from '@/components/order/OrderButton';

/**
 * The lead product of a gallery: a large photo filling its cell, with the
 * name, price and order button laid over a soft shade at the bottom.
 * On phones it keeps a 4:5 shape; on desktop it fills a 2×2 grid area.
 */
export function FeatureCard({ product, className = '' }: { product: Product; className?: string }) {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  const suffix = product.unitLabel
    ? product.unitLabel[locale]
    : product.unit === 'per_kg'
      ? ar ? 'كغ' : 'ק״ג'
      : product.unit === 'per_piece'
        ? ar ? 'قطعة' : 'יחידה'
        : ar ? 'صينية' : 'מגש';

  return (
    <article className={`group relative isolate overflow-hidden rounded-[14px] bg-cedar aspect-[4/5] lg:aspect-auto lg:min-h-[520px] ${className}`}>
      <Link href={`/shop/${product.slug}`} className="absolute inset-0 -z-10" aria-label={product.name[locale]}>
        {product.image && (
          <Image
            src={product.image}
            alt={product.name[locale]}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
        )}
      </Link>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#1C130D]/90 via-[#1C130D]/25 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-7 text-white">
        <p className="text-[13px] text-white/80">{product.tastingNote[locale]}</p>
        <h3 className={`${displayFont} mt-1 text-[1.9rem] sm:text-4xl font-bold leading-[1.1]`}>{product.name[locale]}</h3>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-lg font-semibold">
            {product.price > 0 ? `₪${product.price}` : ar ? 'السعر حسب الطلب' : 'מחיר לפי הזמנה'}
            {product.price > 0 && <span className="text-sm font-normal text-white/75"> / {suffix}</span>}
          </p>
          <OrderButton product={product} named
            className="pointer-events-auto shrink-0 inline-flex items-center h-11 px-6 rounded-full bg-white text-[#2A1B12] text-[15px] font-semibold hover:bg-[#F3E6CF] transition-colors duration-300"
          >
            {ar ? 'للطلب' : 'להזמנה'}
          </OrderButton>
        </div>
      </div>
    </article>
  );
}
