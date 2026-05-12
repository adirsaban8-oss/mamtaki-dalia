'use client';

import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { ArabesquePattern } from '@/components/ornaments/ArabesquePattern';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Value Propositions — three premium cards on a cedar section.
 *  – Section: cedar dark (rhythm break) with arabesque ornament.
 *  – Cards: cream-card surface, 2px gold top border, 48px padding,
 *    sharp 2px corners, weight-900 heading, custom Middle-Eastern icons.
 *  – Animation: viewport-triggered fade-up, 100ms stagger.
 */
export function ValueProps() {
  const locale = useLocale() as Locale;
  const t = useTranslations('Values');
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  const items = [
    { key: 'ingredients', Icon: DatePalmIcon },
    { key: 'handmade', Icon: DallahIcon },
    { key: 'delivery', Icon: DeliveryIcon },
  ] as const;

  return (
    <section
      className="relative overflow-hidden bg-cedar text-ivory py-16 md:py-[120px]"
      aria-labelledby="values-heading"
    >
      {/* Arabesque corners at 4% — barely visible, sets tone */}
      <div
        aria-hidden
        className="absolute -top-24 -end-24 w-[600px] h-[600px] text-gold-light pointer-events-none"
      >
        <ArabesquePattern opacity={0.04} className="absolute inset-0" />
      </div>
      <div
        aria-hidden
        className="absolute -bottom-24 -start-24 w-[600px] h-[600px] text-gold-light pointer-events-none hidden lg:block"
      >
        <ArabesquePattern opacity={0.04} className="absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        {/* Section header — light tone on dark bg */}
        <motion.header
          initial={{ y: 32, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.0, ease: easeLuxe }}
          className="flex flex-col items-center text-center"
        >
          <div className="flex items-center gap-5 text-gold-light/95">
            <span aria-hidden className="block h-px w-12 bg-gold" />
            <span className="font-display-en text-[12px] tracking-eyebrow uppercase">
              {t('eyebrow')}
            </span>
            <span aria-hidden className="block h-px w-12 bg-gold" />
          </div>

          <h2
            id="values-heading"
            className={`mt-6 md:mt-8 ${displayFont} font-black tracking-display leading-[1.05] text-balance text-ivory text-4xl md:text-5xl lg:text-6xl`}
          >
            {t('title')}
          </h2>

          <p className="mt-6 md:mt-8 max-w-2xl text-base md:text-lg leading-[1.7] text-ivory/80 text-pretty">
            {t('body')}
          </p>
        </motion.header>

        {/* Cards — cream surfaces with 2px gold top border, 48px padding */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {items.map(({ key, Icon }, idx) => (
            <motion.article
              key={key}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.0, delay: idx * 0.1, ease: easeLuxe }}
              className="group relative bg-cream-card border-t-2 border-gold shadow-card hover:shadow-hover transition-shadow duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] p-10 md:p-12 flex flex-col items-center text-center rounded-[2px]"
            >
              {/* Icon — 64px, gold-deep stroke */}
              <span className="text-gold-deep">
                <Icon />
              </span>

              {/* Card heading — 20px, display, weight 900 */}
              <h3 className={`mt-8 ${displayFont} font-black text-xl md:text-[22px] tracking-display text-cedar leading-tight`}>
                {t(`items.${key}.title`)}
              </h3>

              {/* Hairline gold divider */}
              <span aria-hidden className="mt-5 mb-6 block h-px w-12 bg-gold-deep/50" />

              {/* Body */}
              <p className="text-[15px] md:text-base leading-[1.7] text-coffee-muted text-pretty max-w-xs">
                {t(`items.${key}.body`)}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Icons — vintage line art, 64px, 1.5px stroke ─────────────────── */

function DatePalmIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* Trunk — vertical, slightly tapered */}
      <path d="M 32 58 L 32 22" />
      <path d="M 30 56 L 34 56" opacity="0.5" />
      <path d="M 30 50 L 34 50" opacity="0.5" />
      <path d="M 30 44 L 34 44" opacity="0.5" />
      <path d="M 30 38 L 34 38" opacity="0.5" />
      <path d="M 30 32 L 34 32" opacity="0.5" />
      <path d="M 30 26 L 34 26" opacity="0.5" />

      {/* Palm fronds — arching outward */}
      <path d="M 32 22 C 18 14, 10 18, 4 28" />
      <path d="M 32 22 C 46 14, 54 18, 60 28" />
      <path d="M 32 22 C 22 6, 14 8, 8 16" />
      <path d="M 32 22 C 42 6, 50 8, 56 16" />
      <path d="M 32 22 C 28 4, 24 4, 18 8" />
      <path d="M 32 22 C 36 4, 40 4, 46 8" />
      <path d="M 32 22 L 32 6" />

      {/* Dates — small clusters */}
      <circle cx="28" cy="20" r="1" fill="currentColor" />
      <circle cx="36" cy="20" r="1" fill="currentColor" />
      <circle cx="32" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function DallahIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* Dallah body — bulbous Arabic coffee pot */}
      <path d="M 22 30 C 22 22, 24 18, 32 18 C 40 18, 42 22, 42 30 L 42 48 C 42 52, 40 54, 36 54 L 28 54 C 24 54, 22 52, 22 48 Z" />

      {/* Pronounced curved spout — the signature dallah feature */}
      <path d="M 22 30 C 14 28, 10 22, 12 14 L 8 12" />
      <path d="M 22 36 C 18 36, 14 34, 14 30" opacity="0.5" />

      {/* Handle on the back */}
      <path d="M 42 32 C 48 32, 50 36, 50 42 C 50 46, 48 48, 42 48" />

      {/* Lid + finial */}
      <path d="M 25 18 L 39 18" />
      <path d="M 28 18 L 28 14 C 28 12, 30 11, 32 11 C 34 11, 36 12, 36 14 L 36 18" />
      <circle cx="32" cy="9" r="1.5" fill="currentColor" />

      {/* Steam */}
      <path d="M 14 8 C 15 6, 14 5, 15 3" opacity="0.4" />
      <path d="M 8 8 C 9 6, 8 5, 9 3" opacity="0.4" />
    </svg>
  );
}

function DeliveryIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* Stylized delivery truck — vintage feel */}
      {/* Cab + body */}
      <path d="M 6 42 L 6 24 L 36 24 L 36 42 Z" />
      <path d="M 36 30 L 46 30 L 52 36 L 52 42 L 36 42 Z" />

      {/* Cab window */}
      <path d="M 38 32 L 44 32 L 47 35 L 47 36 L 38 36 Z" fill="currentColor" opacity="0.18" />

      {/* Wheels */}
      <circle cx="16" cy="46" r="4" />
      <circle cx="16" cy="46" r="1.2" fill="currentColor" />
      <circle cx="44" cy="46" r="4" />
      <circle cx="44" cy="46" r="1.2" fill="currentColor" />

      {/* Decorative arabesque star on the side — signature touch */}
      <path d="M 21 33 L 22.5 30 L 24 33 L 27 33 L 24.5 35 L 25.5 38 L 21 36 L 16.5 38 L 17.5 35 L 15 33 L 18 33 Z" />

      {/* Speed / motion lines behind */}
      <path d="M 60 26 L 56 26" opacity="0.5" />
      <path d="M 60 30 L 54 30" opacity="0.5" />
      <path d="M 60 34 L 56 34" opacity="0.5" />
    </svg>
  );
}
