'use client';

import { useRef } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { useScrollProgress } from '@/lib/useScrollProgress';

const TEXT = {
  he: 'כל מגש יוצא טרי מהמטבח שלנו בדלית אל כרמל — בקלאווה, כנאפה ומגשי אירוח, בהזמנה מראש ובמשלוח לצפון, לשרון, לגוש דן ולמרכז.',
  ar: 'كل صينية تخرج طازجة من مطبخنا في دالية الكرمل — بقلاوة وكنافة وصواني ضيافة، بالطلب المسبق وبالتوصيل إلى الشمال والشارون وغوش دان والمركز.',
};

/**
 * The bridge between the dark hero and the ivory page: one sentence about
 * the handwork, set very large. Its words light up one by one as the
 * visitor scrolls — the page "reads itself" in their rhythm.
 */
export function Statement() {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  const ref = useRef<HTMLElement>(null);
  const p = useScrollProgress(ref, 0.8, 0.45);
  const words = TEXT[locale].split(' ');

  return (
    <section ref={ref} className="relative bg-[#15100B] text-cream py-24 md:py-40" aria-label={ar ? 'عن عملنا' : 'על העבודה שלנו'}>
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <p className="flex items-center gap-4 text-[13px] md:text-sm font-medium text-gold">
          <span aria-hidden className="block h-px w-10 bg-gold" />
          {ar ? 'دالية 10 · دالية الكرمل' : 'דליה 10 · דלית אל כרמל'}
        </p>
        <p className={`${displayFont} mt-8 text-[2rem] sm:text-5xl lg:text-[4rem] leading-[1.28] font-bold text-balance`}>
          <span className="sr-only">{TEXT[locale]}</span>
          <span aria-hidden>
            {words.map((w, i) => (
              <Word key={i} p={p} from={i / words.length} to={(i + 1) / words.length}>
                {w}
              </Word>
            ))}
          </span>
        </p>
      </div>
    </section>
  );
}

function Word({ p, from, to, children }: { p: MotionValue<number>; from: number; to: number; children: string }) {
  const opacity = useTransform(p, [from, to], [0.16, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{' '}
    </>
  );
}
