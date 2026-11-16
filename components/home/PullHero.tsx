'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { PULL_SOURCE, type PullSource } from '@/lib/pullSource';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { whatsappLink } from '@/lib/site';
import { Steam } from '@/components/fx/Steam';
import { Glisten } from '@/components/fx/Glisten';

/**
 * The home hero — a pinned scene (≈240vh). Scrolling drives the media
 * (a living photo drifting out from a macro crop, or a real stretch
 * video); three words grow one after another; then gold syrup runs down
 * over the screen and the order call appears on it.
 */
export function PullHero({ source = PULL_SOURCE }: { source?: PullSource }) {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  const ref = useRef<HTMLElement>(null);
  const p = useScrollProgress(ref, 0, 1);
  const media = useTransform(p, [0, 0.7], [0, 1], { clamp: true });

  const w1 = useTransform(p, [0.04, 0.12, 0.24, 0.3], [0, 1, 1, 0]);
  const w2 = useTransform(p, [0.28, 0.36, 0.46, 0.52], [0, 1, 1, 0]);
  const w3 = useTransform(p, [0.5, 0.58, 0.66, 0.72], [0, 1, 1, 0]);
  const s1 = useTransform(p, [0.04, 0.3], [0.9, 1.15]);
  const s2 = useTransform(p, [0.28, 0.52], [0.9, 1.15]);
  const s3 = useTransform(p, [0.5, 0.72], [0.9, 1.15]);
  const title = useTransform(p, [0, 0.06], [1, 0]);
  const veil = useTransform(p, [0.7, 0.86], [0, 0.78]);
  const finale = useTransform(p, [0.76, 0.88], [0, 1]);
  const steam = useTransform(p, [0, 0.3], [1, 0]);
  const cue = useTransform(p, [0, 0.05], [1, 0]);

  // A short buzz on Android as the strands break.
  const buzzed = useRef(false);
  useMotionValueEvent(p, 'change', (v) => {
    if (!buzzed.current && v > 0.7) {
      buzzed.current = true;
      try { navigator.vibrate?.(10); } catch {}
    }
  });

  // A real stretch video earns the stretch words; a still photo does not.
  const stretch = source.kind !== 'living';
  const words: [MotionValue<number>, MotionValue<number>, string][] = stretch
    ? [[w1, s1, ar ? 'ساخنة' : 'חמה'], [w2, s2, ar ? 'تتمدّد' : 'נמתחת'], [w3, s3, ar ? 'تذوب' : 'נמסה']]
    : [[w1, s1, ar ? 'ساخنة' : 'חמה'], [w2, s2, ar ? 'مقرمشة' : 'פריכה'], [w3, s3, ar ? 'مع البوظة' : 'עם גלידה']];

  return (
    <section ref={ref} className="relative h-[240vh] bg-page text-cream" aria-label={ar ? 'الكنافة' : 'הכנאפה'}>
      <div className="sticky top-16 sm:top-20 h-[calc(100svh-4rem)] sm:h-[calc(100svh-5rem)] overflow-hidden isolate">
        <div className="absolute -z-20 top-[2%] left-[-18%] w-[136%] aspect-[5/4] lg:inset-y-0 lg:left-0 lg:w-[72%] lg:aspect-auto overflow-hidden">
          {source.kind === 'living' && <Living source={source} progress={media} />}
          {source.kind === 'frames' && <Frames source={source} progress={media} />}
          {source.kind !== 'living' && (
            <motion.div style={{ opacity: steam }} className="absolute inset-0">
              <Steam className="absolute left-[18%] w-[42%] top-[-4%] h-[50%]" />
            </motion.div>
          )}
          {source.kind === 'video' && <Video source={source} progress={media} />}
        </div>
        {/* Shade: from the bottom on phones, from the reading side on desktop */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#0A0806_0%,#0A0806_34%,rgba(10,8,6,0.45)_48%,transparent_62%)] lg:hidden" />
        <div aria-hidden className="absolute inset-0 -z-10 hidden lg:block bg-[linear-gradient(to_left,#0A0806_0%,#0A0806_30%,rgba(10,8,6,0.5)_45%,transparent_68%)]" />

        <div className="relative h-full mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-20 pb-24 lg:pb-0 flex items-end lg:items-center">
          <div className="relative w-full max-w-xl">
            {/* Opening: the name */}
            <motion.div style={{ opacity: title }}>
              <h1 className={`${displayFont} text-gold-metal text-[3.1rem] sm:text-7xl xl:text-[5.4rem] leading-[1.02] font-black`}>
                {ar ? (
                  <><span className="block">حلويات</span><span className="block">دالية الكرمل</span></>
                ) : (
                  <><span className="block">ממתקי</span><span className="block">דלית אל כרמל</span></>
                )}
              </h1>
              <p className={`${ar ? 'font-display-he' : 'font-display-ar'} mt-2 text-2xl sm:text-3xl text-gold-light`} lang={ar ? 'he' : 'ar'}>
                {ar ? 'ממתקי דלית אל כרמל' : 'حلويات دالية الكرمل'}
              </p>
              <p className="mt-6 text-lg sm:text-xl text-cream/85">
                {ar ? 'كنافة ساخنة مع البوظة، طازجة كل يوم.' : 'כנאפה חמה עם גלידה, טרייה מדי יום.'}
              </p>
            </motion.div>

            {/* The three words, one at a time */}
            <div aria-hidden className={`${displayFont} pointer-events-none absolute inset-x-0 bottom-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2`}>
              {words.map(([opacity, scale, text]) => (
                <motion.p key={text} style={{ opacity, scale }} className="absolute bottom-0 lg:bottom-auto start-0 origin-[right_center] text-gold-metal text-7xl sm:text-8xl lg:text-[8.5rem] leading-none font-black whitespace-nowrap">
                  {text}
                </motion.p>
              ))}
            </div>
          </div>
        </div>

        <motion.div aria-hidden style={{ opacity: veil }} className="absolute inset-0 z-10 bg-[#0A0806]" />

        {/* The order call */}
        <motion.div style={{ opacity: finale }} className="absolute inset-0 z-20 pointer-events-none">
          <div className="h-full mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-20 pb-24 lg:pb-0 flex flex-col justify-end lg:justify-center">
            <p className={`${displayFont} text-gold-metal text-5xl sm:text-6xl lg:text-8xl leading-[1.04] font-black text-balance max-w-3xl`}>
              {ar ? 'ساخنة من الفرن. بانتظاركم.' : 'חמה מהתנור. מחכה לך.'}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-7 pointer-events-auto">
              <Link href="/shop" className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-gold-metal text-[#0A0806] text-lg font-bold shadow-[0_12px_40px_-12px_rgba(233,185,73,0.6)]">
                {ar ? 'للطلب' : 'להזמנה'}
              </Link>
              <a
                href={whatsappLink(ar ? 'مرحباً، أود أن أطلب كنافة' : 'שלום, אשמח להזמין כנאפה')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-11 text-base font-semibold text-cream underline underline-offset-[6px] decoration-1 hover:no-underline"
              >
                {ar ? 'للطلب عبر واتساب' : 'להזמנה בוואטסאפ'}
              </a>
            </div>
          </div>
        </motion.div>

        {/* "Scroll slowly" cue */}
        <motion.div style={{ opacity: cue }} aria-hidden className="absolute bottom-5 lg:bottom-8 inset-x-0 flex flex-col items-center gap-2 text-[13px] text-cream/80">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="motion-safe:animate-bounce">
            <path d="M9 11V5a2 2 0 1 1 4 0v6M13 10V8a2 2 0 1 1 4 0v4M9 11V9a2 2 0 1 0-4 0v5a7 7 0 0 0 7 7h1a6 6 0 0 0 6-6v-3a2 2 0 1 0-4 0" />
          </svg>
          {ar ? 'مرّروا ببطء' : 'גללו לאט'}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Living photo ───────────────────────────────────────────────── */

function Living({ source, progress }: { source: Extract<PullSource, { kind: 'living' }>; progress: MotionValue<number> }) {
  // Macro Drift: starts close on the kadaif, slowly opens to the whole dish.
  const scale = useTransform(progress, [0, 1], [1.45, 1]);
  const [fx, fy] = source.focus;
  return (
    <motion.div style={{ scale, transformOrigin: `${fx}% ${fy}%` }} className="absolute inset-0">
      <Image src={source.image} alt="כנאפה חמה עם גלידה ופיסטוק" fill priority fetchPriority="high" sizes="(min-width: 1024px) 72vw, 136vw" className="object-cover" />
      <Glisten strength={0.38} />
      <Steam className="absolute left-[30%] w-[45%] top-[-6%] h-[52%]" />
    </motion.div>
  );
}

/* ── Image sequence ─────────────────────────────────────────────── */

function Frames({ source, progress }: { source: Extract<PullSource, { kind: 'frames' }>; progress: MotionValue<number> }) {
  return source.frames.length < 12 ? (
    <>{source.frames.map((src, i) => <Layer key={src} src={src} i={i} n={source.frames.length} progress={progress} />)}</>
  ) : (
    <Canvas frames={source.frames} progress={progress} />
  );
}

function Layer({ src, i, n, progress }: { src: string; i: number; n: number; progress: MotionValue<number> }) {
  const at = i / (n - 1);
  const opacity = useTransform(progress, [Math.max(0, at - 0.6 / (n - 1)), at], [0, 1]);
  return (
    <motion.div style={i === 0 ? undefined : { opacity }} className="absolute inset-0">
      <Image src={src} alt={i === 0 ? 'כנאפה חמה עם גלידה ופיסטוק' : ''} fill priority={i === 0} fetchPriority={i === 0 ? 'high' : undefined} loading={i === 0 ? undefined : 'eager'} sizes="(min-width: 1024px) 72vw, 136vw" className="object-cover" />
    </motion.div>
  );
}

function Canvas({ frames, progress }: { frames: string[]; progress: MotionValue<number> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Progressive load: every 4th frame first, then the rest.
    const order = [...frames.keys()].sort((a, b) => (a % 4 === 0 ? 0 : 1) - (b % 4 === 0 ? 0 : 1) || a - b);
    order.forEach((i) => {
      const im = new window.Image();
      im.src = frames[i];
      im.onload = () => i === 0 && setReady(true);
      imgs.current[i] = im;
    });
  }, [frames]);

  const draw = (v: number) => {
    const c = canvas.current;
    if (!c) return;
    let i = Math.round(v * (frames.length - 1));
    while (i > 0 && !imgs.current[i]?.complete) i--;
    const im = imgs.current[i];
    const ctx = c.getContext('2d');
    if (!im?.complete || !ctx) return;
    c.width = im.naturalWidth;
    c.height = im.naturalHeight;
    ctx.drawImage(im, 0, 0);
  };
  useMotionValueEvent(progress, 'change', draw);
  useEffect(() => { if (ready) draw(progress.get()); });

  return (
    <>
      <Image src={frames[0]} alt="כנאפה חמה עם גלידה ופיסטוק" fill priority fetchPriority="high" sizes="(min-width: 1024px) 72vw, 136vw" className="object-cover" />
      <canvas ref={canvas} aria-hidden className="absolute inset-0 w-full h-full object-cover" />
    </>
  );
}

/* ── Video ──────────────────────────────────────────────────────── */

function Video({ source, progress }: { source: Extract<PullSource, { kind: 'video' }>; progress: MotionValue<number> }) {
  const video = useRef<HTMLVideoElement>(null);
  useMotionValueEvent(progress, 'change', (v) => {
    const el = video.current;
    if (!el || !el.duration) return;
    const t = v * (el.duration - 0.05);
    requestAnimationFrame(() => { if (video.current) video.current.currentTime = t; });
  });
  return (
    <>
      <Image src={source.poster} alt="כנאפה חמה עם גלידה ופיסטוק" fill priority fetchPriority="high" sizes="(min-width: 1024px) 72vw, 136vw" className="object-cover" />
      <video ref={video} muted playsInline preload="auto" poster={source.poster} aria-hidden className="absolute inset-0 w-full h-full object-cover">
        {source.webm && <source src={source.webm} type="video/webm" />}
        <source src={source.mp4} type="video/mp4" />
      </video>
    </>
  );
}
