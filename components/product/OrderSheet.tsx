'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import type { Product } from '@/lib/mockData';
import { Link } from '@/i18n/navigation';
import { whatsappLink } from '@/lib/site';
import { DEFAULT_GRAMS, MAX_GRAMS, MIN_GRAMS, QUICK_GRAMS, STEP_GRAMS, orderMessage, totalFor, weightLabel } from '@/lib/weight';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;
const FILL_CELLS = 15; // one cell ≈ 200 g of a 3 kg tray

/**
 * Bottom sheet for a quick order from the shop window. Per-kg products get
 * the same 200 g stepper and total as the product page (lib/weight.ts);
 * the tray graphic fills with pieces as the weight grows.
 */
export function OrderSheet({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  // Weight per product: opening another product starts again at 1 kg.
  const [pick, setPick] = useState({ slug: '', grams: DEFAULT_GRAMS });
  const grams = pick.slug === product?.slug ? pick.grams : DEFAULT_GRAMS;
  const setGrams = (fn: (g: number) => number) => setPick({ slug: product?.slug ?? '', grams: fn(grams) });
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!product) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.documentElement.style.overflow = ''; };
  }, [product, onClose]);

  const byKg = product?.unit === 'per_kg';
  const filled = Math.min(FILL_CELLS, Math.round(grams / STEP_GRAMS));

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.button
            type="button"
            aria-label={ar ? 'إغلاق' : 'סגירה'}
            onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-[2px] cursor-default"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ duration: 0.5, ease: easeLuxe }}
            className="fixed inset-x-0 bottom-0 z-[71] mx-auto max-w-2xl max-h-[88dvh] overflow-y-auto rounded-t-[22px] bg-[#15100B] border-t border-gold/40 text-cream pb-[max(1.25rem,env(safe-area-inset-bottom))]"
          >
            <div className="sticky top-0 flex justify-center pt-3 pb-1 bg-[#15100B]"><span aria-hidden className="block w-10 h-1 rounded-full bg-cream/25" /></div>
            <div className="px-5 sm:px-7 pb-2 flex gap-4 sm:gap-6 items-start">
              <div className="relative shrink-0 w-28 sm:w-36 aspect-[4/5] rounded-[10px] overflow-hidden bg-cedar">
                {product.image && <Image src={product.image} alt={product.name[locale]} fill sizes="144px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <h3 id="sheet-title" className={`${displayFont} text-2xl sm:text-3xl font-bold text-heading leading-tight`}>{product.name[locale]}</h3>
                <p className="mt-1 text-[14px] text-coffee-muted">{product.tastingNote[locale]}</p>
                {product.price > 0 && (
                  <p className="mt-3 text-lg font-semibold text-gold">
                    ₪{product.price}
                    <span className="text-sm font-normal text-coffee-muted"> / {product.unitLabel?.[locale] ?? (byKg ? (ar ? 'كغ' : 'ק״ג') : ar ? 'وحدة' : 'יחידה')}</span>
                  </p>
                )}
              </div>
              <button ref={closeRef} type="button" onClick={onClose} aria-label={ar ? 'إغلاق' : 'סגירה'} className="shrink-0 -m-2 w-11 h-11 inline-flex items-center justify-center text-cream/70 hover:text-cream">
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden><path d="M2 2l10 10M12 2L2 12" /></svg>
              </button>
            </div>

            {byKg && (
              <div className="px-5 sm:px-7 pt-5">
                {/* The tray fills with pieces as the weight grows */}
                <div aria-hidden className="grid grid-cols-[repeat(15,1fr)] gap-1 p-2 rounded-[8px] border border-gold/30 bg-black/30">
                  {Array.from({ length: FILL_CELLS }, (_, i) => (
                    <span key={i} className={`aspect-square rounded-[3px] transition-colors duration-300 ${i < filled ? 'bg-gold-metal' : 'bg-cream/10'}`} />
                  ))}
                </div>
                <div className="mt-4 flex items-stretch h-12 border border-gold/50 rounded-full overflow-hidden">
                  <button type="button" onClick={() => setGrams((g) => Math.max(MIN_GRAMS, g - STEP_GRAMS))} disabled={grams <= MIN_GRAMS} aria-label={ar ? 'أقل 200 غرام' : 'הפחתת 200 גרם'} className="w-16 text-2xl text-cream hover:bg-gold hover:text-[#0A0806] disabled:opacity-30 transition-colors">−</button>
                  <output aria-live="polite" className={`${displayFont} flex-1 inline-flex items-center justify-center text-lg font-bold`}>{weightLabel(grams, locale)}</output>
                  <button type="button" onClick={() => setGrams((g) => Math.min(MAX_GRAMS, g + STEP_GRAMS))} disabled={grams >= MAX_GRAMS} aria-label={ar ? 'زيادة 200 غرام' : 'הוספת 200 גרם'} className="w-16 text-2xl text-cream hover:bg-gold hover:text-[#0A0806] disabled:opacity-30 transition-colors">+</button>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {QUICK_GRAMS.map((g) => (
                    <button key={g} type="button" onClick={() => setGrams(() => g)} aria-pressed={grams === g} className={`h-11 rounded-full border text-[15px] font-medium transition-colors ${grams === g ? 'bg-gold border-gold text-[#0A0806]' : 'border-gold/40 text-cream hover:border-gold'}`}>
                      {weightLabel(g, locale)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="px-5 sm:px-7 pt-6 flex flex-col gap-3">
              <a
                href={whatsappLink(orderMessage(product, locale, byKg ? grams : undefined))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-14 rounded-full bg-gold-metal text-[#0A0806] text-lg font-bold"
              >
                {ar ? 'للطلب عبر واتساب' : 'להזמנה בוואטסאפ'}
                {product.price > 0 && <bdi dir="ltr">· ₪{byKg ? totalFor(product, grams) : product.price}</bdi>}
              </a>
              <Link href={`/shop/${product.slug}`} onClick={onClose} className="inline-flex items-center justify-center h-11 text-[15px] font-medium text-cream underline underline-offset-[6px] decoration-1 hover:no-underline">
                {ar ? 'كل التفاصيل' : 'לכל הפרטים'}
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
