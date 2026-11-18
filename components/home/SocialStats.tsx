'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { SOCIAL_CHECKED_ON, SOCIAL_STATS, type SocialStat } from '@/lib/social';

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Two figures only: followers on Instagram and on TikTok, as the
 * profiles show them, with the date they were read. Black, thin gold
 * frame, large gold numbers. Each cell links to the profile.
 */
export function SocialStats() {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  const [y, m, d] = SOCIAL_CHECKED_ON.split('-');

  return (
    <section className="bg-[#0A0806] text-cream py-16 md:py-24" aria-labelledby="social-heading">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.h2
          id="social-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease }}
          className={`${displayFont} text-center text-gold-metal text-3xl sm:text-4xl md:text-5xl font-black`}
        >
          {ar ? 'مجتمعنا' : 'הקהילה שלנו'}
        </motion.h2>

        <div className="mt-10 md:mt-12 grid grid-cols-2 border border-gold/45 rounded-[14px] overflow-hidden">
          {SOCIAL_STATS.map((s, i) => (
            <Cell key={s.platform} s={s} i={i} ar={ar} displayFont={displayFont} />
          ))}
        </div>

        <p className="mt-4 text-center text-[13px] text-cream/55">
          {ar ? 'كما يظهر في الحسابات، بتاريخ ' : 'כפי שמופיע בפרופילים, נכון ל‑'}
          <bdi dir="ltr">{`${d}.${m}.${y}`}</bdi>
        </p>
      </div>
    </section>
  );
}

function Cell({ s, i, ar, displayFont }: { s: SocialStat; i: number; ar: boolean; displayFont: string }) {
  const name = s.platform === 'instagram' ? 'Instagram' : 'TikTok';
  const label = ar ? `متابعون على ${name}` : `עוקבים ב${s.platform === 'instagram' ? 'אינסטגרם' : 'טיקטוק'}`;
  return (
    <motion.a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${s.shown} ${label}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: 0.12 + i * 0.12, ease }}
      className={`group flex flex-col items-center justify-center text-center px-3 py-9 sm:py-12 hover:bg-gold/[0.06] focus-visible:bg-gold/[0.08] focus-visible:outline-none transition-colors duration-500 ${i === 0 ? 'border-e border-gold/45' : ''}`}
    >
      <span className="text-gold/90 group-hover:text-gold-light transition-colors" aria-hidden>
        {s.platform === 'instagram' ? <InstagramIcon /> : <TikTokIcon />}
      </span>
      <bdi dir="ltr" className={`${displayFont} mt-4 text-gold-metal text-[2.6rem] sm:text-6xl md:text-7xl leading-none font-black`}>
        {s.shown}
      </bdi>
      <span className="mt-3 text-[13px] sm:text-[15px] text-cream/80">{label}</span>
      <span className="mt-1 text-[12px] text-gold/60" dir="ltr">{s.handle}</span>
    </motion.a>
  );
}

function InstagramIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.6 3c.4 2.2 1.8 3.7 4 4v3.1c-1.5 0-2.9-.4-4-1.2v6.3c0 3.3-2.6 5.8-5.8 5.8S5 18.5 5 15.2s2.6-5.8 5.8-5.8c.3 0 .6 0 .9.1v3.2a2.7 2.7 0 0 0-.9-.2 2.7 2.7 0 1 0 2.7 2.7V3h3.1z" />
    </svg>
  );
}
