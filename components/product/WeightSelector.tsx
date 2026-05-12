'use client';

import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/locales';

type Props = {
  weight: number;
  onChange: (weight: number) => void;
  min?: number;
  max?: number;
  step?: number;
  quickValues?: number[];
};

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;
const DEFAULT_QUICK = [0.5, 1, 1.5, 2] as const;

/**
 * Weight selector — segmented quick-select + stepper, per the
 * ultra-luxury spec. Min 0.5kg, step 0.25kg, max 5kg by default.
 */
export function WeightSelector({
  weight,
  onChange,
  min = 0.5,
  max = 5,
  step = 0.25,
  quickValues,
}: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('Product');
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';
  const quick = quickValues ?? [...DEFAULT_QUICK];

  const clamp = (n: number) => Math.max(min, Math.min(max, Math.round(n * 4) / 4));

  const dec = () => onChange(clamp(weight - step));
  const inc = () => onChange(clamp(weight + step));
  const setQuick = (v: number) => onChange(clamp(v));

  return (
    <div className="space-y-4">
      {/* Label */}
      <div className="flex items-baseline justify-between">
        <label className={`${displayFont} font-black text-base text-cedar`}>
          {t('weightLabel')}
        </label>
        <span className="font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
          {t('weightMin')}
        </span>
      </div>

      {/* Segmented quick-select */}
      <div
        role="radiogroup"
        aria-label={t('weightLabel')}
        className="grid grid-cols-4 border border-gold-deep/50 rounded-[2px] overflow-hidden"
      >
        {quick.map((v, idx) => {
          const active = Math.abs(weight - v) < 0.001;
          const isLast = idx === quick.length - 1;
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setQuick(v)}
              className={`relative h-12 inline-flex items-center justify-center transition-colors duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${active ? 'bg-cedar text-ivory' : 'bg-cream-card text-cedar hover:bg-sand'} ${!isLast ? 'border-e border-gold-deep/30' : ''}`}
            >
              <span className="font-display-en text-[13px] tabular-nums">
                {v.toFixed(v % 1 === 0 ? 0 : 2).replace(/0$/, '')}
              </span>
              <span className="font-display-en text-[10px] tracking-eyebrow uppercase ms-1 opacity-80">
                {t('weightKg')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stepper for custom values */}
      <div className="flex items-stretch gap-3">
        <div className="flex-1 inline-flex items-stretch border border-gold-deep/50 rounded-[2px]">
          <button
            type="button"
            onClick={dec}
            disabled={weight <= min}
            aria-label="−"
            className="w-12 inline-flex items-center justify-center text-cedar hover:bg-sand disabled:opacity-30 transition-colors duration-300 border-e border-gold-deep/30"
          >
            <svg width="14" height="2" viewBox="0 0 14 2" aria-hidden><path d="M 0 1 L 14 1" stroke="currentColor" strokeWidth="1.4" /></svg>
          </button>

          <motion.div
            key={weight}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.35, ease: easeLuxe }}
            className="flex-1 inline-flex items-baseline justify-center gap-1 px-4"
          >
            <span className={`${displayFont} font-black text-2xl text-cedar tabular-nums`}>
              {weight.toFixed(2)}
            </span>
            <span className="font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
              {t('weightKg')}
            </span>
          </motion.div>

          <button
            type="button"
            onClick={inc}
            disabled={weight >= max}
            aria-label="+"
            className="w-12 inline-flex items-center justify-center text-cedar hover:bg-sand disabled:opacity-30 transition-colors duration-300 border-s border-gold-deep/30"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M 0 7 L 14 7 M 7 0 L 7 14" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
