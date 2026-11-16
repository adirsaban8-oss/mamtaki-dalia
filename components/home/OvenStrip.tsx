'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { Link } from '@/i18n/navigation';
import { useProducts } from '@/lib/data/useProducts';
import { isOpenNow } from '@/lib/hours';

/**
 * "Fresh out of the oven" — a thin strip under the hero: open/closed
 * right now (from the opening hours), then a slow marquee of the real
 * catalog with prices. Each name links to its product.
 */
export function OvenStrip() {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const { products } = useProducts();
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const tick = () => setOpen(isOpenNow());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const items = products.slice(0, 14);
  if (items.length === 0) return null;

  return (
    <section aria-label={ar ? 'طازج اليوم' : 'טרי היום'} className="relative z-10 bg-[#0A0806] text-gold-light border-y border-gold/25">
      <div className="flex items-stretch">
        <p className="shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3 bg-[#15100B] border-e border-gold/25 text-cream text-sm font-semibold" aria-live="polite">
          <span aria-hidden className={`block w-2.5 h-2.5 rounded-full ${open === null ? 'bg-cream/40' : open ? 'bg-[#8DB33A] motion-safe:animate-pulse' : 'bg-[#E8941A]'}`} />
          {open === null ? (ar ? 'ساعات العمل' : 'שעות פתיחה') : open ? (ar ? 'مفتوح الآن' : 'פתוח עכשיו') : ar ? 'مغلق الآن' : 'סגור כרגע'}
        </p>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max motion-safe:animate-ticker-rtl hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
                {items.map((p) => (
                  <li key={p.id} className="flex items-center">
                    <Link href={`/shop/${p.slug}`} tabIndex={copy === 1 ? -1 : undefined} className="px-5 py-3 text-[15px] font-semibold whitespace-nowrap hover:underline underline-offset-4">
                      {p.name[locale]}
                      {p.price > 0 && <span className="ms-2 font-normal opacity-75">₪{p.price}</span>}
                    </Link>
                    <span aria-hidden className="text-xs opacity-50">✦</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
