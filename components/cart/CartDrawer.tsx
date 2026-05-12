'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { useCart, getProductForItem, type CartItem } from '@/store/cart';
import { buttonClasses } from '@/components/ui/Button';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Cart Drawer — slides in from the text-end of the viewport (right in
 * LTR, left in RTL). Visual only, no checkout flow.
 *  – 480px wide on desktop, full-bleed on mobile.
 *  – Overlay: cedar/60 with blur.
 *  – Sticky bottom subtotal + burgundy CTA.
 *  – Empty state: copper-tray SVG + nudge to start shopping.
 */
export function CartDrawer() {
  const locale = useLocale() as Locale;
  const t = useTranslations('Cart');
  const { items, isOpen, close } = useCart();
  const subtotal = useCart((s) => s.subtotal());

  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  // Lock body scroll while open
  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label={t('close')}
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: easeLuxe }}
            className="fixed inset-0 z-[60] bg-cedar/60 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t('title')}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.7, ease: easeLuxe }}
            className="fixed inset-y-0 end-0 z-[70] w-full sm:w-[480px] bg-ivory shadow-deep flex flex-col"
            style={{
              // Animate from the writing-mode end: right in LTR, left in RTL.
              // x: '100%' is text-end-side because the panel is anchored to end-0.
            }}
          >
            {/* Header */}
            <header className="flex items-center justify-between px-6 md:px-8 h-20 border-b border-hairline/60">
              <h2 className={`${displayFont} font-black text-2xl tracking-display text-cedar`}>
                {t('title')} <span className="text-coffee-muted text-base font-medium">({items.length})</span>
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label={t('close')}
                className="w-10 h-10 inline-flex items-center justify-center text-cedar hover:text-burgundy transition-colors duration-500"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
                  <path d="M 5 5 L 19 19" />
                  <path d="M 19 5 L 5 19" />
                </svg>
              </button>
            </header>

            {/* Items list — scrollable */}
            {items.length > 0 ? (
              <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
                <ul className="space-y-6">
                  {items.map((item) => (
                    <CartLineItem key={item.productId} item={item} locale={locale} />
                  ))}
                </ul>
              </div>
            ) : (
              <EmptyState locale={locale} onClose={close} />
            )}

            {/* Sticky subtotal — only when items exist */}
            {items.length > 0 && (
              <footer className="border-t border-hairline/60 bg-cream-card px-6 md:px-8 py-6 space-y-5">
                <div className="flex items-baseline justify-between">
                  <span className={`${displayFont} text-base text-cedar`}>{t('subtotal')}</span>
                  <span className={`${displayFont} font-black text-2xl text-burgundy`}>
                    ₪{subtotal.toFixed(0)}
                  </span>
                </div>
                <p className="font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted -mt-2">
                  {t('shippingNote')}
                </p>

                <Link
                  href="/checkout"
                  onClick={close}
                  className={buttonClasses({ variant: 'primary', size: 'lg', className: 'w-full' })}
                >
                  {t('checkout')}
                </Link>
                <button
                  type="button"
                  onClick={close}
                  className="block mx-auto font-display-en text-[12px] tracking-eyebrow uppercase text-cedar hover:text-burgundy transition-colors duration-500"
                >
                  {t('continueShopping')}
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Line Item ────────────────────────────────────────────────────── */

function CartLineItem({ item, locale }: { item: CartItem; locale: Locale }) {
  const product = getProductForItem(item);
  const t = useTranslations('Cart');
  const setWeight = useCart((s) => s.setWeight);
  const remove = useCart((s) => s.remove);
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  if (!product) return null;

  const lineTotal = product.pricePerKg * item.weight;
  const step = product.weightStep;
  const min = product.minWeight;
  const max = 5;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.5, ease: easeLuxe }}
      className="flex gap-3 sm:gap-4"
    >
      {/* Thumb */}
      <div className="relative shrink-0 w-20 h-20 overflow-hidden bg-ivory border border-hairline">
        <Image src={product.image} alt="" fill sizes="80px" className="object-cover" />
      </div>

      {/* Details — name + total share the top row so the stepper can use
          the FULL content width below. Critical for fitting on 320px. */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className={`${displayFont} text-base font-black text-cedar leading-tight min-w-0`}>
            {product.name[locale]}
          </h3>
          <span className={`${displayFont} text-base font-black text-burgundy tabular-nums shrink-0`}>
            ₪{lineTotal.toFixed(0)}
          </span>
        </div>
        <p className="font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted mt-1">
          ₪{product.pricePerKg} {locale === 'ar' ? '/ كغ' : '/ ק״ג'}
        </p>

        {/* Stepper row — gets the full width since the total moved up */}
        <div className="mt-3 flex items-center gap-3">
          <div className="inline-flex items-center border border-hairline">
            <button
              type="button"
              onClick={() => setWeight(product.id, item.weight - step)}
              disabled={item.weight <= min}
              aria-label={t('decreaseWeight')}
              className="w-8 h-8 inline-flex items-center justify-center text-cedar hover:bg-sand disabled:opacity-30 transition-colors duration-300"
            >
              <svg width="10" height="2" viewBox="0 0 10 2" aria-hidden><path d="M 0 1 L 10 1" stroke="currentColor" strokeWidth="1.2" /></svg>
            </button>
            <span className="px-2.5 font-display-en text-sm text-cedar tabular-nums min-w-[3rem] text-center">
              {item.weight.toFixed(2)}{locale === 'ar' ? 'كغ' : 'ק״ג'}
            </span>
            <button
              type="button"
              onClick={() => setWeight(product.id, item.weight + step)}
              disabled={item.weight >= max}
              aria-label={t('increaseWeight')}
              className="w-8 h-8 inline-flex items-center justify-center text-cedar hover:bg-sand disabled:opacity-30 transition-colors duration-300"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                <path d="M 0 5 L 10 5 M 5 0 L 5 10" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            onClick={() => remove(product.id)}
            aria-label={t('remove')}
            className="text-coffee-muted hover:text-burgundy transition-colors duration-500 ms-auto"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden>
              <path d="M 3 4 L 13 4" />
              <path d="M 6 4 L 6 2 L 10 2 L 10 4" />
              <path d="M 4.5 4 L 5 14 L 11 14 L 11.5 4" />
            </svg>
          </button>
        </div>
      </div>
    </motion.li>
  );
}

/* ── Empty state ──────────────────────────────────────────────────── */

function EmptyState({ locale, onClose }: { locale: Locale; onClose: () => void }) {
  const t = useTranslations('Cart');
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
      {/* Empty copper tray illustration */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gold-deep/70"
        aria-hidden
      >
        <ellipse cx="60" cy="80" rx="48" ry="14" />
        <ellipse cx="60" cy="80" rx="48" ry="14" transform="translate(0 -10)" opacity="0.5" />
        <path d="M 12 70 L 12 78" opacity="0.4" />
        <path d="M 108 70 L 108 78" opacity="0.4" />
        <path d="M 30 38 L 26 30" opacity="0.5" />
        <path d="M 90 38 L 94 30" opacity="0.5" />
        <path d="M 60 28 L 60 22" opacity="0.5" />
        <circle cx="60" cy="76" r="2" fill="currentColor" opacity="0.4" />
      </svg>

      <h3 className={`mt-8 ${displayFont} font-black text-2xl text-cedar`}>{t('emptyTitle')}</h3>
      <p className="mt-3 text-base text-coffee-muted leading-relaxed max-w-xs">{t('emptyBody')}</p>

      <Link
        href="/shop"
        onClick={onClose}
        className={`${buttonClasses({ variant: 'primary', size: 'md' })} mt-8`}
      >
        {t('emptyCta')}
      </Link>
    </div>
  );
}
