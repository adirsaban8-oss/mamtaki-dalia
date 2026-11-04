'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { buttonClasses } from '@/components/ui/Button';
import { whatsappLink } from '@/lib/site';
import type { Locale } from '@/i18n/locales';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

/** Signature photograph shown inside the hero arch. */
const HERO_IMAGE = '/images/hero.webp';

/**
 * Hero — Dubai-boutique split layout (after Bateel / Hafiz Mustafa):
 * deep ink field with a faint gold khatam tile, headline + CTAs on the
 * reading side, and one signature product inside a keyhole arch with a
 * gold hairline arch set just outside it. No carousel.
 */
export function Hero() {
  const locale = useLocale() as Locale;
  const t = useTranslations('Hero');
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  return (
    <section
      className="relative isolate overflow-hidden bg-cedar text-ivory"
      aria-label="Hero"
    >
      {/* Khatam tile — 7% so it reads as texture, never as pattern noise */}
      <div aria-hidden className="absolute inset-0 -z-10 pattern-khatam opacity-[0.07]" />
      {/* Soft emerald glow behind the arch */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 70% at 28% 55%, rgba(31,77,63,0.55) 0%, transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-7xl px-5 md:px-10 pt-28 pb-16 md:pt-36 md:pb-24 grid lg:grid-cols-12 items-center gap-12 lg:gap-16">
        {/* Copy — first in DOM so it sits on the reading (right) side in RTL */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-start">
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: easeLuxe }}
            className="flex items-center gap-4 text-gold"
          >
            <span aria-hidden className="block h-px w-10 bg-gold" />
            <span className="text-[13px] font-medium text-gold-light">{t('eyebrow')}</span>
          </motion.div>

          <motion.h1
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: easeLuxe }}
            className={`mt-6 ${displayFont} font-bold leading-[1.08] text-balance`}
          >
            <span className="block text-[2.6rem] sm:text-6xl lg:text-7xl text-ivory">{t('titleLine1')}</span>
            <span className="block text-[2.6rem] sm:text-6xl lg:text-7xl text-gold mt-1">{t('titleLine2')}</span>
          </motion.h1>

          <motion.p
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.45, ease: easeLuxe }}
            className="mt-6 md:mt-8 max-w-xl text-base sm:text-lg leading-relaxed text-ivory/80 text-pretty"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.6, ease: easeLuxe }}
            className="mt-9 md:mt-11 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-sm sm:max-w-none sm:w-auto"
          >
            <Link
              href="/shop"
              className={buttonClasses({ variant: 'gold', size: 'lg', className: 'normal-case tracking-normal text-[15px]' })}
            >
              {t('ctaShop')}
              <Arrow />
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: 'outline', size: 'lg', className: 'normal-case tracking-normal text-[15px]' })}
            >
              {t('ctaStory')}
            </a>
          </motion.div>
        </div>

        {/* Arch — signature product on a sand stage */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.3, delay: 0.25, ease: easeLuxe }}
          className="lg:col-span-6 flex justify-center"
        >
          <div className="relative w-[82%] max-w-[460px] sm:w-[62%] lg:w-full">
            <span aria-hidden className="absolute -inset-3 sm:-inset-4 arch border border-gold/60" />
            <span aria-hidden className="absolute -inset-6 sm:-inset-8 arch border border-gold/20" />
            <div className="relative aspect-[4/5] arch overflow-hidden bg-cedar-deep">
              <Image
                src={HERO_IMAGE}
                alt={locale === 'ar' ? 'حلويات دالية الكرمل' : 'ממתקי דלית אל כרמל'}
                fill
                priority
                quality={85}
                sizes="(min-width: 1024px) 460px, 80vw"
                className="object-cover"
              />
              {/* Soft inner vignette so the photo melts into the ink field */}
              <span aria-hidden className="absolute inset-0 shadow-[inset_0_-40px_80px_rgba(12,23,19,0.35)]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Gold baseline */}
      <span aria-hidden className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
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
