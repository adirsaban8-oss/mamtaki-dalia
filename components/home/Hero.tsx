'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { whatsappLink } from '@/lib/site';
import type { Locale } from '@/i18n/locales';

const FRAMES = [1, 2, 3, 4].map((n) => `/images/hero-scene/f${n}.webp`);

/**
 * Hero — a scroll scene. The screen stays pinned while the visitor
 * scrolls: a whole hot kanafeh, then it is cut, lifted, and the cheese
 * stretches. The name and the two buttons stay on screen the whole time;
 * one short line under the name changes with each stage.
 */
export function Hero() {
  const locale = useLocale() as Locale;
  const t = useTranslations('Hero');
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';

  const ref = useRef<HTMLElement>(null);
  // Scroll progress through the pinned scene, 0 → 1.
  const p = useMotionValue(0);
  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      p.set(span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [p]);

  // Each later frame fades in over the one before it.
  const o2 = useTransform(p, [0.12, 0.3], [0, 1]);
  const o3 = useTransform(p, [0.38, 0.56], [0, 1]);
  const o4 = useTransform(p, [0.64, 0.82], [0, 1]);
  const scale = useTransform(p, [0, 1], [1, 1.1]);

  // One caption per stage.
  const c1 = useTransform(p, [0, 0.1, 0.2], [1, 1, 0]);
  const c2 = useTransform(p, [0.2, 0.3, 0.42, 0.5], [0, 1, 1, 0]);
  const c3 = useTransform(p, [0.5, 0.6, 0.7, 0.78], [0, 1, 1, 0]);
  const c4 = useTransform(p, [0.78, 0.88], [0, 1]);
  const cue = useTransform(p, [0, 0.08], [1, 0]);

  const captions: [MotionValue<number>, string][] = [
    [c1, ar ? 'ببساطة لذيذ' : t('eyebrow')],
    [c2, ar ? 'تُقطَّع أمام أعينكم' : 'נחתכת מול העיניים'],
    [c3, ar ? 'ساخنة من الصينية' : 'חמה, ישר מהמגש'],
    [c4, ar ? 'والجبنة تمتدّ' : 'והגבינה נמתחת'],
  ];

  return (
    <section ref={ref} className="relative h-[280vh] bg-black text-white" aria-label="Hero">
      <div className="sticky top-16 sm:top-20 h-[calc(100svh-4rem)] sm:h-[calc(100svh-5rem)] overflow-hidden isolate">
        {/* The four stages, stacked */}
        <motion.div
          style={{ scale }}
          className="absolute -z-20 top-[2%] left-[-30%] w-[140%] aspect-[3/2] lg:top-0 lg:bottom-0 lg:left-0 lg:w-[72%] lg:aspect-auto"
        >
          {FRAMES.map((src, i) => (
            <motion.div key={src} style={i === 0 ? undefined : { opacity: [o2, o3, o4][i - 1] }} className="absolute inset-0">
              <Image
                src={src}
                alt={i === 0 ? (ar ? 'كنافة ساخنة بالفستق' : 'כנאפה חמה עם פיסטוק') : ''}
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : 'eager'}
                sizes="(min-width: 1024px) 72vw, 140vw"
                className="object-cover lg:-scale-x-100"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Shade: from the bottom on phones, from the reading side on desktop */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#000_0%,#000_38%,rgba(0,0,0,0.5)_50%,transparent_62%)] lg:hidden" />
        <div aria-hidden className="absolute inset-0 -z-10 hidden lg:block bg-[linear-gradient(to_left,#000_0%,#000_30%,rgba(0,0,0,0.55)_45%,transparent_68%)]" />

        <div className="h-full mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-20 pb-24 lg:pb-0 flex items-end lg:items-center">
          <div className="w-full max-w-xl">
            <p className="text-base text-white/85">{t('titleLine1')}</p>
            <h1 className={`${displayFont} mt-1 text-[3.25rem] sm:text-7xl xl:text-[5.5rem] leading-[1.02] !font-bold !tracking-normal`}>
              {t('titleLine2')}
            </h1>

            {/* Stage caption — the lines share one slot and cross-fade */}
            <div className={`${displayFont} relative mt-3 h-10 sm:h-11 text-2xl sm:text-3xl text-white/95`}>
              {captions.map(([opacity, text], i) => (
                <motion.p key={i} style={{ opacity }} className="absolute inset-x-0 top-0" aria-hidden={i > 0}>
                  {text}
                </motion.p>
              ))}
            </div>

            <div className="mt-6 md:mt-9 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-7">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center h-[52px] px-9 rounded-full bg-white text-black text-base font-semibold hover:bg-neutral-200 transition-colors duration-300"
              >
                {ar ? 'الكتالوج والأسعار' : 'לקטלוג ולמחירים'}
              </Link>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-11 text-base font-medium underline underline-offset-[6px] decoration-1 hover:no-underline"
              >
                {t('ctaStory')}
              </a>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: cue }}
          aria-hidden
          className="hidden lg:flex absolute bottom-7 inset-x-0 flex-col items-center gap-2 text-[13px] text-white/80"
        >
          {ar ? 'مرّروا للأسفل' : 'גללו למטה'}
          <span className="block w-px h-8 bg-white/70" />
        </motion.div>
      </div>
    </section>
  );
}
