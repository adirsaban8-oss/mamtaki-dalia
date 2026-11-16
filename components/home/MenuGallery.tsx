'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { Link } from '@/i18n/navigation';
import { categoryLabels, orderedCategories, type Product, type ProductCategory } from '@/lib/mockData';
import { useProducts } from '@/lib/data/useProducts';
import { Glisten } from '@/components/fx/Glisten';
import { OrderSheet } from '@/components/product/OrderSheet';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

const ARCH_IMAGE: Partial<Record<ProductCategory, string>> = {
  baklava: '/products/bird-nest-baklava.webp',
  kanafeh: '/products/red-kanafeh.webp',
  trays: '/products/turkish-baklava-tray.webp',
  cakes: '/products/dessert-mango.webp',
};

/**
 * The shop window. Four arches choose a counter; below them the trays run
 * sideways like walking along the window in the morning, drag (or swipe)
 * and they snap into place. Tapping a tray opens a sheet to pick the
 * weight and order.
 */
export function MenuGallery() {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  const { products } = useProducts();
  const cats = useMemo(() => orderedCategories.filter((c) => products.some((p) => p.category === c)), [products]);
  const [cat, setCat] = useState<ProductCategory>('baklava');
  const [open, setOpen] = useState<Product | null>(null);
  const stripRef = useRef<HTMLUListElement>(null);
  const strip = useDrag(stripRef);
  const current = cats.includes(cat) ? cat : cats[0];
  if (!current) return null;
  const items = products.filter((p) => p.category === current);

  return (
    <section className="bg-sand py-20 md:py-28 overflow-hidden" aria-labelledby="menu-heading">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gold-deep">{ar ? 'الواجهة' : 'הוויטרינה'}</p>
            <h2 id="menu-heading" className={`${displayFont} mt-2 text-4xl md:text-[3.4rem] leading-[1.08] font-black text-gold-metal`}>
              {ar ? 'ماذا تحبون أن تتذوقوا اليوم؟' : 'מה בא לכם לטעום היום?'}
            </h2>
          </div>
          <Link href="/shop" className="inline-flex items-center h-11 text-[15px] font-semibold text-gold underline underline-offset-[6px] decoration-1 hover:no-underline">
            {ar ? `الكتالوج الكامل · ${products.length}` : `לקטלוג המלא · ${products.length}`}
          </Link>
        </header>

        {/* Arches, which counter */}
        <div role="tablist" aria-label={ar ? 'الفئات' : 'קטגוריות'} className="mt-10 md:mt-12 grid grid-cols-4 gap-3 sm:gap-6 md:gap-10 max-w-3xl">
          {cats.map((c) => {
            const on = c === current;
            return (
              <button key={c} role="tab" aria-selected={on} onClick={() => { setCat(c); strip.reset(); }} className="group flex flex-col items-center text-center">
                <span className={`relative block w-full p-1 sm:p-1.5 arch border-[1.5px] transition-colors duration-500 ${on ? 'border-gold' : 'border-transparent group-hover:border-gold-deep/50'}`}>
                  <span className="relative block aspect-[3/4] arch overflow-hidden bg-cedar">
                    {ARCH_IMAGE[c] && (
                      <Image src={ARCH_IMAGE[c]!} alt="" fill sizes="(min-width: 768px) 170px, 22vw" className={`object-cover transition-all duration-700 ${on ? 'scale-100' : 'scale-[1.04] saturate-[0.7] opacity-80 group-hover:opacity-100 group-hover:saturate-100'}`} />
                    )}
                  </span>
                </span>
                <span className={`${displayFont} mt-3 text-[13px] sm:text-base md:text-lg font-bold leading-tight transition-colors duration-500 ${on ? 'text-heading' : 'text-coffee-muted'}`}>
                  {categoryLabels[c][locale]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* The window, sideways, drag + snap */}
      <AnimatePresence mode="wait">
        <motion.ul
          key={current}
          ref={stripRef}
          {...strip.handlers}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: easeLuxe }}
          role="tabpanel"
          aria-label={categoryLabels[current][locale]}
          className="mt-10 md:mt-14 flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-5 md:px-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))] pb-4 cursor-grab active:cursor-grabbing select-none"
        >
          {items.map((p) => (
            <li key={p.id} className="shrink-0 w-[72%] sm:w-[44%] lg:w-[30%] xl:w-[26%] snap-start">
              <button type="button" onClick={() => !strip.moved() && setOpen(p)} className="group block w-full text-start" aria-haspopup="dialog">
                <span className="relative block aspect-[4/5] rounded-[14px] overflow-hidden bg-cedar shadow-[0_24px_50px_-28px_rgba(0,0,0,0.9)]">
                  {p.image && <Image src={p.image} alt={p.name[locale]} fill draggable={false} sizes="(min-width: 1024px) 28vw, 72vw" className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]" />}
                  {(p.category === 'baklava' || p.category === 'kanafeh') && <Glisten strength={0.26} />}
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-3 end-3 inline-flex items-center h-9 px-4 rounded-full bg-gold-metal text-[#0A0806] text-sm font-bold">
                    {ar ? 'للطلب' : 'להזמנה'}
                  </span>
                </span>
                <span className={`${displayFont} mt-4 block text-xl md:text-2xl font-bold text-heading leading-tight`}>{p.name[locale]}</span>
                <span className="mt-1 flex items-baseline justify-between gap-3">
                  <span className="text-[14px] text-coffee-muted line-clamp-1">{p.tastingNote[locale]}</span>
                  {p.price > 0 && <span className="shrink-0 text-base font-semibold text-gold">₪{p.price}</span>}
                </span>
              </button>
            </li>
          ))}
          <li className="shrink-0 w-[60%] sm:w-[34%] lg:w-[22%] snap-start">
            <Link href={`/shop#cat-${current}`} className="flex h-full min-h-[240px] flex-col justify-end rounded-[14px] border border-gold/40 bg-[radial-gradient(120%_100%_at_80%_100%,rgba(255,195,0,0.16),transparent_60%)] p-6 text-gold hover:border-gold hover:bg-gold/10 transition-colors">
              <span className={`${displayFont} text-2xl md:text-3xl font-bold leading-tight`}>
                {ar ? `كل ${categoryLabels[current].ar}` : `כל ה${categoryLabels[current].he}`}
              </span>
              <span className="mt-2 text-[15px] text-cream/80">{ar ? 'في الكتالوج ←' : 'בקטלוג ←'}</span>
            </Link>
          </li>
        </motion.ul>
      </AnimatePresence>

      <OrderSheet product={open} onClose={() => setOpen(null)} />
    </section>
  );
}

/** Mouse drag-to-scroll for the strip (touch scrolls natively). */
function useDrag(ref: React.RefObject<HTMLUListElement | null>) {
  const st = useRef({ down: false, x: 0, left: 0, moved: 0 });
  return {
    reset: () => ref.current?.scrollTo({ left: 0 }),
    moved: () => st.current.moved > 6,
    handlers: {
      onPointerDown: (e: React.PointerEvent) => {
        if (e.pointerType !== 'mouse' || !ref.current) return;
        st.current = { down: true, x: e.clientX, left: ref.current.scrollLeft, moved: 0 };
        ref.current.style.scrollSnapType = 'none';
      },
      onPointerMove: (e: React.PointerEvent) => {
        const s = st.current;
        if (!s.down || !ref.current) return;
        const dx = e.clientX - s.x;
        s.moved = Math.max(s.moved, Math.abs(dx));
        ref.current.scrollLeft = s.left - dx;
      },
      onPointerUp: () => {
        st.current.down = false;
        if (ref.current) ref.current.style.scrollSnapType = '';
      },
      onPointerLeave: () => {
        st.current.down = false;
        if (ref.current) ref.current.style.scrollSnapType = '';
      },
    },
  };
}
