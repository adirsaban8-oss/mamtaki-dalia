'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue, type ValueAnimationTransition } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { whatsappLink } from '@/lib/site';
import { Steam } from '@/components/fx/Steam';

/** The pull, frame by frame (AI edits of the shop's kanafeh photo, ⚠️ — a real video replaces them). */
const FRAMES = ['f1', 'p1', 'f2', 'p2', 'f3', 'p3', 'p4', 'f4', 'p5', 'p6'].map((n) => `/images/pull/${n}.webp`);
const ease = [0.7, 0, 0.2, 1] as const;

/**
 * Opening — "pull it yourself". The kanafeh with ice cream, a gold handle
 * on the photo: drag it up (or press ↑) and the fork lifts the wedge and
 * the cheese stretches with your finger; let go and it slowly settles back.
 * On load it shows the gesture once by itself. Off under reduced motion.
 */
export function HeroPull() {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  const p = useMotionValue(0); // 0 whole → 1 strands snapped
  const area = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; p: number } | null>(null);
  const anim = useRef<ReturnType<typeof animate> | null>(null);
  const [pct, setPct] = useState(0);
  const [touched, setTouched] = useState(false);
  useMotionValueEvent(p, 'change', (v) => setPct(Math.round(v * 100)));

  const go = (to: number, opts: ValueAnimationTransition<number> = {}) => {
    anim.current?.stop();
    anim.current = animate(p, to, { duration: 1.2, ease, ...opts });
  };

  // Show the gesture once: a short pull, then back.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => {
      anim.current = animate(p, [0, 0.42, 0], { duration: 3.2, times: [0, 0.5, 1], ease: 'easeInOut' });
    }, 1800);
    return () => { clearTimeout(t); anim.current?.stop(); };
  }, [p]);

  const onDown = (e: React.PointerEvent) => {
    anim.current?.stop();
    setTouched(true);
    drag.current = { y: e.clientY, p: p.get() };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current || !area.current) return;
    const h = area.current.getBoundingClientRect().height * 0.55;
    p.set(Math.min(1, Math.max(0, drag.current.p + (drag.current.y - e.clientY) / h)));
  };
  const onUp = () => {
    if (!drag.current) return;
    drag.current = null;
    // Fully pulled: hold the snapped strands a moment; otherwise settle back.
    if (p.get() > 0.92) go(0, { delay: 1.6, duration: 1.6 });
    else go(0, { duration: 1.1 });
  };
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 0.1 : e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? -0.1 : 0;
    if (!step) return;
    e.preventDefault();
    setTouched(true);
    go(Math.min(1, Math.max(0, p.get() + step)), { duration: 0.35 });
  };

  const hint = useTransform(p, [0, 0.15], [1, 0]);
  const stretch = useTransform(p, [0.2, 0.35, 0.75, 0.85], [0, 1, 1, 0]);
  const finale = useTransform(p, [0.82, 0.95], [0, 1]);
  const handleY = useTransform(p, [0, 1], ['0%', '-260%']);

  return (
    <section className="relative isolate overflow-hidden mt-16 sm:mt-20 h-[calc(100svh-4rem)] sm:h-[calc(100svh-5rem)] min-h-[560px] bg-[#0A0806] text-cream" aria-label={ar ? 'الكنافة' : 'הכנאפה'}>
      {/* The photo — drag anywhere on it with a mouse */}
      <motion.div
        ref={area}
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease }}
        onPointerDown={(e) => e.pointerType === 'mouse' && onDown(e)}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="absolute -z-20 inset-x-0 top-0 h-[64%] lg:h-full lg:right-auto lg:w-[72%] cursor-grab active:cursor-grabbing select-none"
      >
        {FRAMES.map((src, i) => (
          <Frame key={src} src={src} i={i} n={FRAMES.length} p={p} alt={ar ? 'كنافة ساخنة مع البوظة والفستق' : 'כנאפה חמה עם גלידה ופיסטוק'} />
        ))}
        <Steam className="absolute left-[16%] w-[44%] top-[-6%] h-[48%] lg:left-[18%] lg:w-[40%]" />
      </motion.div>

      {/* Shade on the reading side */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_top,#0A0806_0%,#0A0806_36%,rgba(10,8,6,0.6)_44%,transparent_58%)] lg:bg-[linear-gradient(to_left,#0A0806_0%,rgba(10,8,6,0.9)_30%,rgba(10,8,6,0.3)_52%,transparent_66%)]" />

      {/* The handle — the main control on phones */}
      <div className="absolute z-10 left-[50%] lg:left-[38%] top-[31%] lg:top-[62%] -translate-x-1/2 flex flex-col items-center gap-2">
        <motion.button
          type="button"
          role="slider"
          aria-label={ar ? 'اسحبوا الجبنة' : 'משכו את הגבינה'}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          style={{ y: handleY }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={onKey}
          className="touch-none w-16 h-16 rounded-full bg-gold-metal text-[#0A0806] shadow-[0_0_0_6px_rgba(233,185,73,0.18),0_12px_30px_-8px_rgba(0,0,0,0.8)] inline-flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>
          {!touched && <span aria-hidden className="absolute inset-0 rounded-full ring-2 ring-gold-light/70 motion-safe:animate-ping" />}
        </motion.button>
        <motion.span style={{ opacity: hint }} aria-hidden className="text-sm font-semibold text-cream drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] whitespace-nowrap">
          {ar ? 'اسحبوا للأعلى' : 'משכו למעלה'}
        </motion.span>
      </div>

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
            <Caption o={hint}>{ar ? 'اسحبوا الجبنة وشاهدوها تتمدّد.' : 'משכו את הגבינה ותראו אותה נמתחת.'}</Caption>
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

/** Frame i shows fully once the pull passes it and fades in as it approaches. */
function Frame({ src, i, n, p, alt }: { src: string; i: number; n: number; p: MotionValue<number>; alt: string }) {
  const opacity = useTransform(p, (v) => {
    const pos = v * (n - 1);
    return i <= Math.floor(pos) ? 1 : i === Math.floor(pos) + 1 ? pos - Math.floor(pos) : 0;
  });
  return (
    <motion.div style={i === 0 ? undefined : { opacity }} className="absolute inset-0">
      <Image src={src} alt={i === 0 ? alt : ''} fill draggable={false} priority={i === 0} fetchPriority={i === 0 ? 'high' : undefined} loading={i === 0 ? undefined : 'eager'} sizes="(min-width: 1024px) 72vw, 100vw" className="object-cover object-[46%_50%] lg:object-center" />
    </motion.div>
  );
}
