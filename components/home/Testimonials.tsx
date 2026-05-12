'use client';

import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { testimonials } from '@/lib/mockData';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Testimonials — 3 cards visible per the ultra-luxury spec.
 *  – Section: ivory (light) for warmth, 64px/120px vertical padding.
 *  – Cards: cream-card surface, 1px gold-deep border (full), sharp 2px,
 *    32px padding, big decorative gold quote-mark in the corner.
 *  – Quote: 20px italic Display font, cedar text.
 *  – Stars: 5 custom gold SVG stars at the top.
 *  – Animation: viewport fade-up, 100ms stagger.
 */
export function Testimonials() {
  const locale = useLocale() as Locale;
  const t = useTranslations('Testimonials');
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  return (
    <section
      className="relative bg-ivory py-16 md:py-[120px]"
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        {/* Section header */}
        <motion.header
          initial={{ y: 32, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.0, ease: easeLuxe }}
          className="flex flex-col items-center text-center"
        >
          <div className="flex items-center gap-5 text-gold-deep">
            <span aria-hidden className="block h-px w-12 bg-gold" />
            <span className="font-display-en text-[12px] tracking-eyebrow uppercase">
              {t('eyebrow')}
            </span>
            <span aria-hidden className="block h-px w-12 bg-gold" />
          </div>

          <h2
            id="reviews-heading"
            className={`mt-6 md:mt-8 ${displayFont} font-black tracking-display leading-[1.05] text-balance text-cedar text-4xl md:text-5xl lg:text-6xl`}
          >
            {t('title')}
          </h2>
        </motion.header>

        {/* 3-card grid · mobile horizontal scroll-snap */}
        <div className="mt-16 md:mt-24">
          <div className="hidden md:grid md:grid-cols-3 gap-8 lg:gap-10">
            {testimonials.map((item, idx) => (
              <TestimonialCard key={item.id} item={item} locale={locale} displayFont={displayFont} index={idx} />
            ))}
          </div>

          <div className="md:hidden -mx-5 px-5 overflow-x-auto snap-x snap-mandatory flex gap-5 pb-4 scroll-pl-5 scrollbar-hide">
            {testimonials.map((item, idx) => (
              <div key={item.id} className="snap-start shrink-0 w-[82%]">
                <TestimonialCard item={item} locale={locale} displayFont={displayFont} index={idx} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type CardProps = {
  item: (typeof testimonials)[number];
  locale: Locale;
  displayFont: string;
  index: number;
};

function TestimonialCard({ item, locale, displayFont, index }: CardProps) {
  return (
    <motion.figure
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.0, delay: index * 0.1, ease: easeLuxe }}
      whileHover={{ y: -6 }}
      className="relative h-full bg-cream-card border border-gold-deep/40 hover:border-gold transition-[border-color,box-shadow] duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] shadow-card hover:shadow-hover p-8 md:p-10 flex flex-col rounded-[2px]"
    >
      {/* Decorative oversize quote mark — top-end corner */}
      <span
        aria-hidden
        className="absolute -top-2 end-6 font-display-en text-[120px] leading-none text-gold/15 select-none pointer-events-none"
      >
        “
      </span>

      {/* Stars */}
      <div
        className="relative flex items-center gap-1 text-gold"
        aria-label={`${item.rating} / 5`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} filled={i < item.rating} />
        ))}
      </div>

      {/* Quote — 20px italic, Display font, cedar */}
      <blockquote className="relative mt-6">
        <p className={`${displayFont} italic text-[19px] md:text-xl leading-[1.55] text-cedar text-pretty`}>
          {item.quote[locale]}
        </p>
      </blockquote>

      {/* Hairline divider */}
      <span aria-hidden className="block h-px w-12 bg-gold-deep/40 mt-8" />

      {/* Attribution */}
      <figcaption className="mt-5 flex flex-col">
        <span className={`${displayFont} text-base font-black text-cedar`}>
          {item.author[locale]}
        </span>
        <span className="font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted mt-1">
          {item.role[locale]}
        </span>
      </figcaption>
    </motion.figure>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden
    >
      <path d="M 8 1.5 L 9.9 6 L 14.5 6.4 L 11 9.4 L 12.1 14 L 8 11.4 L 3.9 14 L 5 9.4 L 1.5 6.4 L 6.1 6 Z" />
    </svg>
  );
}
