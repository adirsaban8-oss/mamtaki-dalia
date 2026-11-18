'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { whatsappLink } from '@/lib/site';
import { Steam } from '@/components/fx/Steam';

/** The pull, frame by frame, at eye level (AI edits of the shop's kanafeh photo; a real video replaces them). */
const FRAMES = Array.from({ length: 10 }, (_, i) => `/images/pull/seq/s${i}.webp`);
const ease = [0.7, 0, 0.2, 1] as const;

/**
 * Opening: the kanafeh with ice cream. As the visitor scrolls down, the
 * fork lifts the wedge and the cheese stretches; scrolling back lowers it.
 * The section is taller than the screen and the picture stays pinned
 * while the pull plays.
 */
export function HeroPull() {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  // 0 whole → 1 strands snapped; eased so a flick of the wheel still looks smooth.
  const p = useSpring(useTransform(scrollYProgress, [0, 0.85], [0, 1]), { stiffness: 140, damping: 30, mass: 0.6 });

  const hint = useTransform(p, [0, 0.12], [1, 0]);
  const stretch = useTransform(p, [0.15, 0.3, 0.75, 0.85], [0, 1, 1, 0]);
  const finale = useTransform(p, [0.82, 0.95], [0, 1]);
  // The camera leans in a little as the cheese rises.
  const lean = useTransform(p, [0, 1], [1, 1.05]);

  return (
    <section ref={section} className="relative mt-16 sm:mt-20 h-[240svh] bg-[#0A0806] text-cream" aria-label={ar ? 'الكنافة' : 'הכנאפה'}>
      <div className="sticky top-16 sm:top-20 isolate overflow-hidden h-[calc(100svh-4rem)] sm:h-[calc(100svh-5rem)] min-h-[560px]">
        {/* The photo */}
        <motion.div
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease }}
          className="absolute -z-20 inset-x-0 top-0 h-[64%] lg:h-full lg:right-auto lg:w-[72%]"
        >
          <motion.div style={{ scale: lean }} className="absolute inset-0 origin-[50%_70%]">
            {FRAMES.map((src, i) => (
              <Frame key={src} src={src} i={i} n={FRAMES.length} p={p} alt={ar ? 'كنافة ساخنة مع البوظة والفستق' : 'כנאפה חמה עם גלידה ופיסטוק'} />
            ))}
          </motion.div>
          <Steam className="absolute left-[14%] w-[40%] top-[12%] h-[46%] lg:left-[18%] lg:w-[34%]" />
        </motion.div>

        {/* Shade on the reading side */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_top,#0A0806_0%,#0A0806_36%,rgba(10,8,6,0.6)_44%,transparent_58%)] lg:bg-[linear-gradient(to_left,#0A0806_0%,rgba(10,8,6,0.9)_30%,rgba(10,8,6,0.3)_52%,transparent_66%)]" />

        {/* Words */}
        <div className="pointer-events-none relative h-full mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-20 pb-24 lg:pb-0 flex items-end lg:items-center">
          <div className="w-full max-w-xl">
            <h1 className={`${displayFont} text-[3.1rem] sm:text-7xl xl:text-[5.4rem] leading-[1.02] font-black`}>
              {(ar ? ['حلويات', 'دالية الكرمل'] : ['ממתקי', 'דלית אל כרמל']).map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <motion.span initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 1.1, delay: 0.5 + i * 0.15, ease }} className="block text-gold-metal">
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <div className="relative mt-4 h-9 sm:h-10 text-xl sm:text-2xl">
              <Caption o={hint}>{ar ? 'كنافة ساخنة، والجبنة تنتظر.' : 'כנאפה חמה, והגבינה מחכה.'}</Caption>
              <Caption o={stretch} gold>{ar ? 'تتمدّد… وتتمدّد…' : 'נמתחת… ונמתחת…'}</Caption>
              <Caption o={finale} gold>{ar ? 'ساخنة من الفرن. بانتظاركم.' : 'חמה מהתנור. מחכה לך.'}</Caption>
            </div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.1, ease }} className="pointer-events-auto mt-7 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-7">
              <Link href="/shop" className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-gold-metal text-[#0A0806] text-lg font-bold shadow-[0_12px_40px_-12px_rgba(233,185,73,0.6)]">
                {ar ? 'للطلب' : 'להזמנה'}
              </Link>
              <a href={whatsappLink(ar ? 'مرحباً، أود أن أطلب كنافة' : 'שלום, אשמח להזמין כנאפה')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-11 text-base font-semibold text-cream underline underline-offset-[6px] decoration-1 hover:no-underline">
                {ar ? 'للطلب عبر واتساب' : 'להזמנה בוואטסאפ'}
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Caption({ o, gold = false, children }: { o: MotionValue<number>; gold?: boolean; children: React.ReactNode }) {
  return (
    <motion.p style={{ opacity: o }} className={`absolute inset-x-0 top-0 ${gold ? 'font-display-he font-bold text-gold-light' : 'text-cream/85'}`}>
      {children}
    </motion.p>
  );
}

/** Frame i shows fully once the pull passes it; a short central cross-fade joins neighbours. */
function Frame({ src, i, n, p, alt }: { src: string; i: number; n: number; p: MotionValue<number>; alt: string }) {
  const opacity = useTransform(p, (v) => {
    const pos = Math.min(n - 1, Math.max(0, v * (n - 1)));
    const f = Math.min(1, Math.max(0, (pos - Math.floor(pos) - 0.3) / 0.4));
    return i <= Math.floor(pos) ? 1 : i === Math.floor(pos) + 1 ? f : 0;
  });
  return (
    <motion.div style={i === 0 ? undefined : { opacity }} className="absolute inset-0">
      <Image src={src} alt={i === 0 ? alt : ''} fill draggable={false} priority={i === 0} fetchPriority={i === 0 ? 'high' : undefined} loading={i === 0 ? undefined : 'eager'} sizes="(min-width: 1024px) 72vw, 100vw" className="object-cover object-[42%_50%] lg:object-center" />
    </motion.div>
  );
}
