import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/locales';

type Props = {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  locale: Locale;
  align?: 'start' | 'center';
  tone?: 'dark' | 'light';
  className?: string;
  id?: string;
};

/**
 * Spec-grade luxury section heading.
 *  – Eyebrow: 12px gold, tracking 0.20em, flanked by two 48px gold lines.
 *  – Title:   Display font, weight 900, tracking -0.02em, line-height 1.05.
 *  – Body:    18px, line-height 1.7, max-width ~2xl, balanced wrap.
 */
export function SectionHeading({
  eyebrow,
  title,
  body,
  locale,
  align = 'center',
  tone = 'dark',
  className,
  id,
}: Props) {
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';
  const isCenter = align === 'center';
  const onLight = tone === 'dark'; // 'dark' tone = dark text on light bg

  const eyebrowColor = onLight ? 'text-gold-deep' : 'text-gold-light/95';
  const titleColor = onLight ? 'text-cedar' : 'text-ivory';
  const bodyColor = onLight ? 'text-coffee-muted' : 'text-ivory/80';

  return (
    <header
      className={`flex flex-col ${isCenter ? 'items-center text-center' : 'items-start text-start'} ${className ?? ''}`}
    >
      {/* Eyebrow with twin gold lines */}
      <div className={`flex items-center gap-5 ${eyebrowColor}`}>
        <span aria-hidden className="block h-px w-12 bg-gold" />
        <span className="font-display-en text-[12px] tracking-eyebrow uppercase">
          {eyebrow}
        </span>
        {isCenter && <span aria-hidden className="block h-px w-12 bg-gold" />}
      </div>

      {/* Display headline — weight 900, dramatic scale */}
      <h2
        id={id}
        className={`mt-6 md:mt-8 ${displayFont} font-black tracking-display leading-[1.05] text-balance ${titleColor} text-4xl md:text-5xl lg:text-6xl`}
      >
        {title}
      </h2>

      {body && (
        <p className={`mt-6 md:mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-pretty ${bodyColor}`}>
          {body}
        </p>
      )}
    </header>
  );
}
