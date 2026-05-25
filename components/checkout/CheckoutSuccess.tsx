'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { ArabesquePattern } from '@/components/ornaments/ArabesquePattern';
import { buttonClasses } from '@/components/ui/Button';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

type Props = { locale: Locale };

export function CheckoutSuccess({ locale }: Props) {
  const t = useTranslations('CheckoutSuccess');
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    const stored = sessionStorage.getItem('lastOrderNumber');
    if (stored) setOrderNumber(stored);
  }, []);

  return (
    <section className="relative py-20 md:py-32 min-h-[60vh] flex items-center">
      <div
        aria-hidden
        className="absolute -top-12 -end-24 w-[500px] h-[500px] text-gold pointer-events-none"
      >
        <ArabesquePattern opacity={0.04} className="absolute inset-0" />
      </div>
      <div
        aria-hidden
        className="absolute -bottom-12 -start-24 w-[500px] h-[500px] text-gold pointer-events-none"
      >
        <ArabesquePattern opacity={0.04} className="absolute inset-0" />
      </div>

      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.0, ease: easeLuxe }}
        className="relative mx-auto max-w-2xl px-5 md:px-10 flex flex-col items-center text-center"
      >
        {/* Gold check seal */}
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easeLuxe }}
          className="w-20 h-20 inline-flex items-center justify-center border-2 border-gold rounded-full text-gold"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M 4 12 L 10 18 L 20 6" />
          </svg>
        </motion.span>

        <div className="mt-8 flex items-center gap-5 text-gold-deep">
          <span aria-hidden className="block h-px w-12 bg-gold" />
          <span className="font-display-en text-[12px] tracking-eyebrow uppercase">
            {t('eyebrow')}
          </span>
          <span aria-hidden className="block h-px w-12 bg-gold" />
        </div>

        <h1
          className={`mt-6 ${displayFont} font-black text-[2.5rem] md:text-5xl lg:text-6xl text-cedar tracking-display leading-[1.05] text-balance`}
        >
          {t('title')}
        </h1>

        {orderNumber && (
          <div className="mt-8 flex flex-col items-center">
            <span className="font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
              {t('orderNumber')}
            </span>
            <span className={`mt-2 ${displayFont} font-black text-3xl md:text-4xl text-burgundy tabular-nums`}>
              #{orderNumber}
            </span>
          </div>
        )}

        <p className="mt-8 max-w-md text-base md:text-lg leading-relaxed text-ink/80 text-pretty">
          {t('body')}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/shop"
            className={buttonClasses({ variant: 'primary', size: 'lg' })}
          >
            {t('keepShopping')}
          </Link>
          <Link
            href="/"
            className={buttonClasses({ variant: 'ghost', size: 'lg' })}
          >
            {t('home')}
          </Link>
        </div>

        <p className="mt-12 font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
          {t('contactNote')}
        </p>
      </motion.div>
    </section>
  );
}
