'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { animate, motion, useMotionValue, useMotionTemplate, useTransform } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { whatsappLink } from '@/lib/site';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { Steam } from '@/components/fx/Steam';

const IMAGE = '/images/pull/f1.webp';
/** Where the kanafeh sits in the photo (%), so the spotlight opens from it. */
const FOCUS: Record<'mobile' | 'desktop', [number, number]> = { mobile: [42, 30], desktop: [28, 38] };
const ease = [0.7, 0, 0.2, 1] as const;

/**
 * Opening "the spotlight". The screen starts dark; a warm circle of light
 * opens from the kanafeh, ringed by a gold line like the rim of a plate,
 * until the whole dish is revealed. The name rises line by line from
 * behind a mask, steam drifts up, a sweep of light crosses the syrup.
 * Scrolling gives the photo a slow depth drift. Plays once per load.
 */
export function HeroSpotlight() {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  const ref = useRef<HTMLElement>(null);
  const [desk, setDesk] = useState<boolean | null>(null);

  // Spotlight radius in vmax, 0 → 140 (covers the screen)
  const r = useMotionValue(0);
  const ring = useTransform(r, [0, 60, 110], [1, 1, 0]);
  const [fx, fy] = FOCUS[desk ? 'desktop' : 'mobile'];
  const clip = useMotionTemplate`circle(${r}vmax at ${fx}% ${fy}%)`;
  const size = useTransform(r, (v) => `${v * 2}vmax`);

  // Scroll: photo drifts, text lifts away
  const p = useScrollProgress(ref, 0, 1);
  const imgY = useTransform(p, [0, 1], ['0%', '14%']);
  const imgScale = useTransform(p, [0, 1], [1.02, 1.12]);
  const textY = useTransform(p, [0, 1], ['0%', '-30%']);
  const textO = useTransform(p, [0, 0.7], [1, 0]);

  useEffect(() => {
    setDesk(window.matchMedia('(min-width: 1024px)').matches);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { r.set(140); return; }
    const a = animate(r, 140, { duration: 2.4, delay: 0.25, ease });
    return () => a.stop();
  }, [r]);

  const lines = ar ? ['حلويات', 'دالية الكرمل'] : ['ממתקי', 'דלית אל כרמל'];
  const rise = (i: number) => ({
    initial: { y: '105%' },
    animate: { y: '0%' },
    transition: { duration: 1.1, delay: 0.9 + i * 0.16, ease },
  });
  const fade = (d: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: d, ease },
  });

  return (
    <section ref={ref} className="relative isolate overflow-hidden mt-16 sm:mt-20 h-[calc(100svh-4rem)] sm:h-[calc(100svh-5rem)] min-h-[560px] bg-[#0A0806] text-cream" aria-label={ar ? 'الكنافة' : 'הכנאפה'}>
      {/* The photo, revealed through the spotlight */}
      <motion.div style={{ clipPath: clip, WebkitClipPath: clip }} className="absolute inset-0 -z-20">
        <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
          <Image src={IMAGE} alt={ar ? 'كنافة ساخنة مع البوظة والفستق' : 'כנאפה חמה עם גלידה ופיסטוק'} fill priority fetchPriority="high" sizes="100vw" className="object-cover object-[32%_50%] lg:object-[0%_50%]" />
          {/* A single sweep of warm light across the syrup */}
          <motion.span
            aria-hidden
            initial={{ x: '-60%', opacity: 0 }}
            animate={{ x: '60%', opacity: [0, 0.55, 0] }}
            transition={{ duration: 2.2, delay: 2.1, ease: 'easeInOut' }}
            className="absolute inset-y-0 w-1/2 left-1/4 bg-[linear-gradient(105deg,transparent_30%,rgba(255,236,190,0.45)_50%,transparent_70%)] mix-blend-soft-light"
          />
        </motion.div>
        <Steam className={`absolute top-[-4%] h-[50%] ${desk ? 'left-[52%] w-[34%]' : 'left-[16%] w-[48%]'}`} />
      </motion.div>

      {/* Gold ring on the edge of the light, like the rim of a plate */}
      <motion.span
        aria-hidden
        style={{ width: size, height: size, left: `${fx}%`, top: `${fy}%`, opacity: ring }}
        className="pointer-events-none absolute -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-gold-light/80 shadow-[0_0_40px_rgba(233,185,73,0.45),inset_0_0_40px_rgba(233,185,73,0.25)]"
      />

      {/* Shade on the reading side */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#0A0806_0%,#0A0806_30%,rgba(10,8,6,0.82)_46%,rgba(10,8,6,0.2)_66%,transparent_78%)] lg:bg-[linear-gradient(to_left,#0A0806_0%,rgba(10,8,6,0.9)_30%,rgba(10,8,6,0.3)_52%,transparent_66%)]" />

      <motion.div style={{ y: textY, opacity: textO }} className="relative h-full mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-20 pb-24 lg:pb-0 flex items-end lg:items-center">
        <div className="w-full max-w-xl">
          <motion.p {...fade(0.7)} className="flex items-center gap-3 text-sm font-semibold text-gold-light">
            <span aria-hidden className="block h-px w-10 bg-gold" />
            {ar ? 'دالية 10 · دالية الكرمل' : 'דליה 10 · דלית אל כרמל'}
          </motion.p>
          <h1 className={`${displayFont} mt-4 text-[3.2rem] sm:text-7xl xl:text-[5.6rem] leading-[1.02] font-black`}>
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span {...rise(i)} className="block text-gold-metal">{line}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p {...fade(1.35)} className={`${ar ? 'font-display-he' : 'font-display-ar'} mt-2 text-2xl sm:text-3xl text-gold-light`} lang={ar ? 'he' : 'ar'}>
            {ar ? 'ממתקי דלית אל כרמל' : 'حلويات دالية الكرمل'}
          </motion.p>
          <motion.p {...fade(1.5)} className="mt-5 text-lg sm:text-xl text-cream/85">
            {ar ? 'كنافة ساخنة مع البوظة، طازجة كل يوم.' : 'כנאפה חמה עם גלידה, טרייה מדי יום.'}
          </motion.p>
          <motion.div {...fade(1.7)} className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-7">
            <Link href="/shop" className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-gold-metal text-[#0A0806] text-lg font-bold shadow-[0_12px_40px_-12px_rgba(233,185,73,0.6)]">
              {ar ? 'للطلب' : 'להזמנה'}
            </Link>
            <a
              href={whatsappLink(ar ? 'مرحباً، أود أن أطلب' : 'שלום, אשמח להזמין')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-11 text-base font-semibold text-cream underline underline-offset-[6px] decoration-1 hover:no-underline"
            >
              {ar ? 'للطلب عبر واتساب' : 'להזמנה בוואטסאפ'}
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
