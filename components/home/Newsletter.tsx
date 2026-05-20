'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { ArabesquePattern } from '@/components/ornaments/ArabesquePattern';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Newsletter — burgundy section, single email input, "join the family"
 * copy with a 10% first-order discount hook. No real backend in Phase 1
 * (visual + form validation only); the submit just shows a thank-you.
 */
export function Newsletter() {
  const t = useTranslations('Newsletter');
  const locale = useLocale() as Locale;
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setError(true);
      return;
    }
    setError(false);
    setSubmitted(true);
  };

  return (
    <section
      className="relative bg-burgundy text-ivory py-20 md:py-28 overflow-hidden"
      aria-labelledby="newsletter-heading"
    >
      <div aria-hidden className="absolute -top-32 -end-32 w-[500px] h-[500px] text-gold-light pointer-events-none">
        <ArabesquePattern opacity={0.05} className="absolute inset-0" />
      </div>
      <div aria-hidden className="absolute -bottom-32 -start-32 w-[500px] h-[500px] text-gold-light pointer-events-none">
        <ArabesquePattern opacity={0.05} className="absolute inset-0" />
      </div>

      <motion.div
        initial={{ y: 24, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.0, ease: easeLuxe }}
        className="relative mx-auto max-w-2xl px-5 md:px-10 flex flex-col items-center text-center"
      >
        <div className="flex items-center gap-5 text-gold-light/85">
          <span aria-hidden className="block h-px w-12 bg-gold" />
          <span className="font-display-en text-[12px] tracking-eyebrow uppercase">
            {t('eyebrow')}
          </span>
          <span aria-hidden className="block h-px w-12 bg-gold" />
        </div>

        <h2
          id="newsletter-heading"
          className={`mt-6 ${displayFont} font-black text-3xl md:text-5xl text-ivory tracking-display leading-[1.1] text-balance`}
        >
          {t('title')}
        </h2>

        <p className="mt-5 max-w-md text-base md:text-[17px] leading-relaxed text-ivory/80 text-pretty">
          {t('subtitle')}
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-10 w-full max-w-lg flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(false);
              }}
              placeholder={t('placeholder')}
              aria-label={t('placeholder')}
              className={`flex-1 h-14 px-5 bg-ivory text-cedar text-base placeholder:text-coffee-muted/60 focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300 rounded-[2px] border ${error ? 'border-gold ring-2 ring-gold' : 'border-transparent'}`}
            />
            <button
              type="submit"
              className="h-14 px-8 bg-gold hover:bg-gold-deep text-burgundy font-display-en text-xs tracking-eyebrow uppercase font-bold rounded-[2px] transition-colors duration-500 whitespace-nowrap"
            >
              {t('cta')}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: easeLuxe }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <span className="w-14 h-14 inline-flex items-center justify-center border border-gold-light/60 rounded-full text-gold-light">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M 4 12 L 10 18 L 20 6" />
              </svg>
            </span>
            <p className={`${displayFont} text-2xl text-ivory mt-2`}>{t('thankYou')}</p>
            <p className="text-sm text-ivory/70">{t('thankYouNote')}</p>
          </motion.div>
        )}

        <p className="mt-6 font-display-en text-[10px] tracking-eyebrow uppercase text-ivory/50">
          {t('privacy')}
        </p>
      </motion.div>
    </section>
  );
}
