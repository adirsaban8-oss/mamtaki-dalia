'use client';

import { useEffect, useState } from 'react';
import { useCatalog } from '@/store/catalog';
import { ProductDetail } from './ProductDetail';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';

type Props = { slug: string; locale: Locale };

/**
 * Client wrapper that resolves a product from the localStorage catalog
 * store. Until the store hydrates we show a quiet skeleton; if no
 * product matches the slug, we show a "not found" panel with a link
 * back to the catalog.
 */
export function ProductPageClient({ slug, locale }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const product = useCatalog((s) => s.products.find((p) => p.slug === slug));
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-5 md:px-10 py-24">
        <div className="h-12 w-2/3 bg-sand/60 rounded-[2px] animate-pulse" />
        <div className="mt-4 h-6 w-1/3 bg-sand/40 rounded-[2px] animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-5 md:px-10 py-24 md:py-32 text-center">
        <p className="font-display-en text-[12px] tracking-eyebrow uppercase text-gold-deep">
          404
        </p>
        <h1 className={`mt-6 ${displayFont} font-black text-3xl md:text-4xl text-cedar text-balance`}>
          {locale === 'ar' ? 'هذا المنتج غير موجود بعد' : 'המוצר הזה עוד לא קיים'}
        </h1>
        <p className="mt-4 text-base text-ink/70 leading-relaxed">
          {locale === 'ar'
            ? 'ربما تم إزالته أو لم يُضف بعد إلى القائمة.'
            : 'ייתכן שהוסר או שעוד לא הוסף לתפריט.'}
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-3 font-display-en text-[12px] tracking-eyebrow uppercase text-cedar hover:text-burgundy transition-colors duration-500"
        >
          <span>{locale === 'ar' ? 'العودة إلى القائمة' : 'חזרה לקטלוג'}</span>
          <span aria-hidden className="h-px w-12 bg-current" />
        </Link>
      </div>
    );
  }

  return <ProductDetail product={product} locale={locale} />;
}
