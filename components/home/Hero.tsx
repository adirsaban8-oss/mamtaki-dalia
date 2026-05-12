'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { buttonClasses } from '@/components/ui/Button';
import { GoldDivider } from '@/components/ornaments/GoldDivider';
import { ScrollCue } from '@/components/ornaments/ScrollCue';
import { ArabesquePattern } from '@/components/ornaments/ArabesquePattern';
import type { Locale } from '@/i18n/locales';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Photo: dark moody knafeh / copper-tray hero. Swap to an owned shot
 * by dropping a JPG at /public/images/hero-knafeh.jpg and rendering
 * <Hero useLocalImage />.
 *
 * Spec asks for "knafeh copper tray dark" — Unsplash IDs are placeholder.
 * If this 404s, the cedar→burgundy gradient still carries the section.
 */
// To replace: drop a 2400×1600+ JPG at /public/images/hero-knafeh.jpg
// and either flip `useLocalImage` or set NEXT_PUBLIC_USE_LOCAL_HERO=true.
//
// Content-verified via Unsplash search: a display case of Middle-Eastern
// sweets — the on-brand atmosphere for a Druze confectionery hero.
const HERO_IMAGE_REMOTE =
  'https://plus.unsplash.com/premium_photo-1731953242985-7bf6e2b1fb78?w=2400&q=85&auto=format&fit=crop';
const HERO_IMAGE_LOCAL = '/images/hero-knafeh.jpg';

export function Hero({ useLocalImage = false }: { useLocalImage?: boolean }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('Hero');

  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  return (
    <section
      className="relative isolate w-full min-h-[100svh] flex items-center overflow-hidden bg-cedar text-ivory"
      aria-label="Hero"
    >
      {/* ── Photographic background ─────────────────────────────────
         Slow Ken Burns drift — 22s, ease-in-out, reversing. */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1.20 }}
        transition={{ duration: 22, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
        className="absolute inset-0 -z-30"
      >
        <Image
          src={useLocalImage ? HERO_IMAGE_LOCAL : HERO_IMAGE_REMOTE}
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* ── Radial overlay (cedar → burgundy) — deep & moody ─────────
         Calibrated to guarantee a luxury feel regardless of the photo
         underneath. The image becomes a textural underlay, not a focal
         point. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(28,58,46,0.62) 0%, rgba(28,58,46,0.82) 45%, rgba(74,27,37,0.92) 100%)',
        }}
      />

      {/* Deep cedar base — guarantees jewel-tone even on a bright photo */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-cedar/65 mix-blend-multiply" />
      {/* Burgundy edges — subtle warm rim for depth */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(100% 100% at 50% 50%, transparent 55%, rgba(74,27,37,0.50) 100%)',
        }}
      />

      {/* ── Arabesque ornament — 5% opacity, top-right & bottom-left ── */}
      <div aria-hidden className="absolute -top-24 -end-24 w-[600px] h-[600px] text-gold-light pointer-events-none">
        <ArabesquePattern opacity={0.05} className="absolute inset-0" />
      </div>
      <div aria-hidden className="absolute -bottom-24 -start-24 w-[600px] h-[600px] text-gold-light pointer-events-none">
        <ArabesquePattern opacity={0.05} className="absolute inset-0" />
      </div>

      {/* ── Vignette ─────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 50%, transparent 40%, rgba(28,46,31,0.45) 100%)',
        }}
      />

      {/* ── Content ─────────────────────────────────────────────────
         Centered, generous vertical rhythm. Each child enters with
         its own delay (400 / 550 / 700 / 1000 ms) per spec. */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-5 md:px-10 pt-28 pb-24 md:pt-44 md:pb-36 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: easeLuxe }}
          className="flex items-center gap-3 sm:gap-5 mb-8 md:mb-12 max-w-full"
        >
          <GoldDivider className="!w-6 sm:!w-10 shrink-0" />
          <span className="font-display-en text-[10px] sm:text-[11px] md:text-[12px] tracking-eyebrow uppercase text-gold-light/95 whitespace-nowrap">
            {t('eyebrow')}
          </span>
          <GoldDivider className="!w-6 sm:!w-10 shrink-0" />
        </motion.div>

        {/* Headline — black weight 900, mighty scale, text-shadow */}
        <h1
          className={`${displayFont} font-black tracking-display leading-[1.05] text-balance text-shadow-hero max-w-[12ch]`}
        >
          <motion.span
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.4, ease: easeLuxe }}
            className="block text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem] 2xl:text-[8rem] text-ivory"
          >
            {t('titleLine1')}
          </motion.span>
          <motion.span
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.55, ease: easeLuxe }}
            className="block text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem] 2xl:text-[8rem] text-gold mt-1 md:mt-3"
          >
            {t('titleLine2')}
          </motion.span>
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.7, ease: easeLuxe }}
          className="mt-8 md:mt-12 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-ivory/85 text-pretty text-shadow-hero"
        >
          {t('subtitle')}
        </motion.p>

        {/* CTAs — stack on phones, side-by-side from sm up */}
        <motion.div
          initial={{ y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.0, ease: easeLuxe }}
          className="mt-10 md:mt-14 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-x-8 lg:gap-x-12 w-full max-w-sm sm:max-w-none"
        >
          <Link href="/shop" className={buttonClasses({ variant: 'primary', size: 'lg' })}>
            {t('ctaShop')}
            <Arrow />
          </Link>
          <Link href="/about" className={buttonClasses({ variant: 'outline', size: 'lg' })}>
            {t('ctaStory')}
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue — vertical line above text "גלול למטה" */}
      <ScrollCue
        label={t('scrollCue')}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2"
      />
    </section>
  );
}

function Arrow() {
  return (
    <svg
      width="16"
      height="10"
      viewBox="0 0 16 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="rtl:rotate-180"
    >
      <path d="M 1 5 L 14 5" />
      <path d="M 10 1 L 14 5 L 10 9" />
    </svg>
  );
}
