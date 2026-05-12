import { useTranslations } from 'next-intl';

/**
 * Trust ticker — slow scrolling marquee on cedar. 40s loop.
 *  – Height: 56px desktop / 48px mobile per spec.
 *  – Text: gold, 14px, tracking 0.15em, single line.
 *  – The list is duplicated so the animation seam is invisible.
 */
export function Ticker() {
  const t = useTranslations('Ticker');
  const items = [
    t('delivery'),
    t('kosher'),
    t('fresh'),
    t('handmade'),
    t('generations'),
  ];

  // Render the items twice for seamless loop
  const sequence = [...items, ...items];

  return (
    <div
      className="relative bg-cedar text-gold-light/95 border-y border-gold/20 h-12 md:h-14 flex items-center overflow-hidden"
      role="region"
      aria-label="Trust badges"
    >
      {/* Edge fades */}
      <span
        aria-hidden
        className="absolute inset-y-0 start-0 w-24 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, var(--color-cedar) 0%, transparent 100%)',
        }}
      />
      <span
        aria-hidden
        className="absolute inset-y-0 end-0 w-24 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to left, var(--color-cedar) 0%, transparent 100%)',
        }}
      />

      {/* Marquee track — animate-ticker for LTR, animate-ticker-rtl for RTL */}
      <div className="animate-ticker rtl:animate-ticker-rtl flex items-center gap-12 whitespace-nowrap will-change-transform motion-reduce:animate-none">
        {sequence.map((label, idx) => (
          <div key={`${label}-${idx}`} className="flex items-center gap-12 shrink-0">
            <span className="font-display-en text-[13px] md:text-sm tracking-[0.15em] uppercase">
              {label}
            </span>
            <span
              aria-hidden
              className="inline-block w-1 h-1 rounded-full bg-gold/60"
            />
          </div>
        ))}
      </div>

    </div>
  );
}
