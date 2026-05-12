'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';

type Variant = 'light' | 'dark';

type Props = {
  variant?: Variant;
  className?: string;
};

export function LanguageSwitcher({ variant = 'dark', className }: Props) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('Nav');

  const next: Locale = locale === 'he' ? 'ar' : 'he';

  const handleSwitch = () => {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  const base =
    'font-display-en text-xs tracking-eyebrow uppercase inline-flex items-center gap-2 transition-colors duration-500';
  const tone =
    variant === 'light'
      ? 'text-ivory/85 hover:text-gold-light'
      : 'text-coffee-muted hover:text-burgundy';

  return (
    <button
      type="button"
      onClick={handleSwitch}
      disabled={isPending}
      aria-label={t('languageSwitch')}
      className={`${base} ${tone} ${className ?? ''}`}
    >
      <span className={locale === 'ar' ? 'font-display-ar text-base text-gold' : 'font-display-ar text-base opacity-70'}>
        ع
      </span>
      <span aria-hidden className="h-3 w-px bg-current opacity-40" />
      <span className={locale === 'he' ? 'font-display-he text-base text-gold' : 'font-display-he text-base opacity-70'}>
        ע
      </span>
    </button>
  );
}
