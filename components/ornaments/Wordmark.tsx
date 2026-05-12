import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { BrandMark } from './BrandMark';

type Props = {
  locale: 'he' | 'ar';
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
};

/**
 * Wordmark — brand mark + Hebrew/Arabic name + English tagline.
 *  – On phones the tagline hides and the mark shrinks so the long
 *    brand name fits cleanly on a 320px iPhone SE header.
 */
export function Wordmark({ locale, variant = 'dark', size = 'md' }: Props) {
  const t = useTranslations('Brand');

  const colorMark = variant === 'light' ? 'text-gold-light' : 'text-gold';
  const colorName = variant === 'light' ? 'text-ivory' : 'text-cedar';
  const colorTagline = variant === 'light' ? 'text-gold-light/80' : 'text-coffee-muted';

  const nameSize =
    size === 'lg'
      ? 'text-xl sm:text-2xl md:text-3xl'
      : size === 'sm'
        ? 'text-sm sm:text-base'
        : 'text-[15px] sm:text-lg md:text-xl';

  const markSize = size === 'lg' ? 40 : size === 'sm' ? 22 : 28;

  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 sm:gap-3 group select-none min-w-0"
      aria-label={t('name')}
    >
      <BrandMark
        size={markSize}
        className={`shrink-0 ${colorMark} transition-transform duration-700 group-hover:rotate-[12deg]`}
      />
      <span className="flex flex-col leading-[1.05] min-w-0">
        <span
          className={`${displayFont} ${nameSize} font-bold tracking-display whitespace-nowrap ${colorName}`}
        >
          {t('name')}
        </span>
        {/* Tagline hides on phones — saves vertical space + prevents
            wrapping when the header collapses to 72px after scroll. */}
        <span
          className={`hidden sm:inline font-display-en text-[10px] md:text-[11px] tracking-eyebrow uppercase mt-0.5 whitespace-nowrap ${colorTagline}`}
        >
          {t('tagline')}
        </span>
      </span>
    </Link>
  );
}
