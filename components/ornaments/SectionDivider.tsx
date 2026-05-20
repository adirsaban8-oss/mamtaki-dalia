type Props = {
  className?: string;
  variant?: 'star' | 'crescent' | 'rosette';
  tone?: 'gold' | 'gold-deep' | 'gold-light';
};

/**
 * SectionDivider — a centered gold ornament flanked by hairlines.
 * Used between major sections to create a typographic rhythm beat.
 *
 * Three motif variants:
 *   – star:    8-point geometric star (default)
 *   – crescent: crescent + dot (Druze/Arabesque)
 *   – rosette:  4-petal floral
 *
 * Tone controls which gold shade the ornament uses.
 */
export function SectionDivider({
  className,
  variant = 'star',
  tone = 'gold-deep',
}: Props) {
  const colorClass =
    tone === 'gold'
      ? 'text-gold'
      : tone === 'gold-light'
        ? 'text-gold-light'
        : 'text-gold-deep';

  return (
    <div
      role="presentation"
      aria-hidden
      className={`flex items-center justify-center gap-5 ${colorClass} ${className ?? ''}`}
    >
      <span className="block h-px w-12 sm:w-20 bg-current opacity-50" />
      <span className="inline-flex items-center justify-center opacity-80">
        {variant === 'crescent' && <Crescent />}
        {variant === 'rosette' && <Rosette />}
        {variant === 'star' && <Star />}
      </span>
      <span className="block h-px w-12 sm:w-20 bg-current opacity-50" />
    </div>
  );
}

function Star() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9" aria-hidden>
      <path d="M 12 1 L 14.5 9 L 23 9 L 16 14 L 18.5 22 L 12 17 L 5.5 22 L 8 14 L 1 9 L 9.5 9 Z" />
      <path d="M 12 5 L 13.5 9.5 L 18 9.5 L 14.5 12.5 L 16 17 L 12 14 L 8 17 L 9.5 12.5 L 6 9.5 L 10.5 9.5 Z" opacity="0.55" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

function Crescent() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9" aria-hidden>
      <circle cx="12" cy="12" r="11" opacity="0.4" />
      <path d="M 7 12 a 6 6 0 1 0 12 0 a 4.5 4.5 0 1 1 -9 0 Z" fill="currentColor" />
      <circle cx="19.5" cy="9.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

function Rosette() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" aria-hidden>
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="5" rx="2" ry="4" />
      <ellipse cx="12" cy="19" rx="2" ry="4" />
      <ellipse cx="5" cy="12" rx="4" ry="2" />
      <ellipse cx="19" cy="12" rx="4" ry="2" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" />
    </svg>
  );
}
