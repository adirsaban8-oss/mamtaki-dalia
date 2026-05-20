'use client';

import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { ArabesquePattern } from '@/components/ornaments/ArabesquePattern';
import { SectionDivider } from '@/components/ornaments/SectionDivider';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Instagram Feed — 2×3 grid of ornament tiles with a hover overlay.
 * Phase 1: no live Instagram fetch; each tile is a styled placeholder
 * (cedar gradient + arabesque + monogram letter) so the rhythm is
 * already in place when @mamtaki_dalia plugs in real media via the
 * Instagram Graph API in Phase 2.
 */
export function InstagramFeed() {
  const t = useTranslations('Instagram');
  const locale = useLocale() as Locale;
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  // 6 placeholder tiles, each with a different motif letter
  const tiles = [
    { letter: 'M', variant: 'star' as const },
    { letter: 'D', variant: 'crescent' as const },
    { letter: 'K', variant: 'rosette' as const },
    { letter: 'B', variant: 'star' as const },
    { letter: 'A', variant: 'crescent' as const },
    { letter: 'S', variant: 'rosette' as const },
  ];

  return (
    <section
      className="relative bg-ivory py-20 md:py-[120px]"
      aria-labelledby="instagram-heading"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <motion.header
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.0, ease: easeLuxe }}
          className="flex flex-col items-center text-center mb-12 md:mb-16"
        >
          <SectionDivider variant="crescent" className="mb-6" />
          <span className="font-display-en text-[12px] tracking-eyebrow uppercase text-gold-deep">
            {t('eyebrow')}
          </span>
          <h2
            id="instagram-heading"
            className={`mt-5 ${displayFont} font-black text-3xl md:text-5xl text-cedar tracking-display leading-[1.1] text-balance`}
          >
            {t('title')}
          </h2>
          <p className="mt-4 font-display-en text-lg md:text-xl text-burgundy tracking-display">
            @mamtaki_dalia
          </p>
        </motion.header>

        {/* 6-tile grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {tiles.map((tile, idx) => (
            <InstagramTile key={idx} index={idx} letter={tile.letter} variant={tile.variant} />
          ))}
        </div>

        {/* Follow CTA */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: easeLuxe, delay: 0.3 }}
          className="mt-14 md:mt-16 flex justify-center"
        >
          <a
            href="https://www.instagram.com/mamtaki_dalia/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 font-display-en text-[12px] tracking-eyebrow uppercase text-cedar hover:text-burgundy transition-colors duration-700"
          >
            <InstagramGlyph />
            <span>{t('follow')}</span>
            <span aria-hidden className="h-px w-12 bg-current transition-[width] duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:w-20" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ── tile ────────────────────────────────────────────────────────── */

type TileProps = {
  index: number;
  letter: string;
  variant: 'star' | 'crescent' | 'rosette';
};

function InstagramTile({ index, letter, variant }: TileProps) {
  // Alternate between cedar and burgundy tile backgrounds for visual
  // variety until real Instagram photos take over.
  const bgClass = index % 3 === 0 ? 'bg-cedar' : index % 3 === 1 ? 'bg-burgundy' : 'bg-cedar-deep';

  return (
    <motion.a
      href="https://www.instagram.com/mamtaki_dalia/"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0.96, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: easeLuxe, delay: index * 0.06 }}
      className={`group relative aspect-square overflow-hidden rounded-[2px] ${bgClass} flex items-center justify-center`}
    >
      {/* Arabesque pattern */}
      <div aria-hidden className="absolute inset-0 text-gold-light pointer-events-none">
        <ArabesquePattern opacity={0.18} className="absolute inset-0" />
      </div>

      {/* Center monogram letter */}
      <span className="relative font-display-en text-5xl md:text-6xl tracking-[0.2em] text-gold-light/85 group-hover:text-gold transition-colors duration-700">
        {letter}
      </span>

      {/* Hover overlay: gold scrim + Instagram glyph */}
      <span
        aria-hidden
        className="absolute inset-0 bg-gold/0 group-hover:bg-gold/30 transition-colors duration-700 flex items-center justify-center"
      >
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 text-cedar">
          <InstagramGlyph />
        </span>
      </span>
    </motion.a>
  );
}

function InstagramGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" />
    </svg>
  );
}
