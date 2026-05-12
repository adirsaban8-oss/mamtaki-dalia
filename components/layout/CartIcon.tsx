'use client';

import { useTranslations } from 'next-intl';
import { useCart } from '@/store/cart';

type Props = {
  variant?: 'light' | 'dark';
};

export function CartIcon({ variant = 'dark' }: Props) {
  const t = useTranslations('Nav');
  const open = useCart((s) => s.open);
  const count = useCart((s) => s.items.length);

  const color = variant === 'light' ? 'text-ivory' : 'text-cedar';
  const hover = variant === 'light' ? 'hover:text-gold-light' : 'hover:text-burgundy';

  return (
    <button
      type="button"
      onClick={open}
      aria-label={t('openCart')}
      className={`relative inline-flex items-center justify-center w-10 h-10 transition-colors duration-500 ${color} ${hover}`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {/* Hand-drawn copper tray with handles */}
        <path d="M 3 8 L 21 8 L 19 18 a 2 2 0 0 1 -2 1.5 L 7 19.5 a 2 2 0 0 1 -2 -1.5 Z" />
        <path d="M 3 8 L 6 4 L 18 4 L 21 8" />
        <path d="M 9 12 L 9 16" opacity="0.5" />
        <path d="M 12 12 L 12 16" opacity="0.5" />
        <path d="M 15 12 L 15 16" opacity="0.5" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -end-1 min-w-[1rem] h-4 px-1 rounded-full bg-burgundy text-ivory text-[10px] font-bold inline-flex items-center justify-center font-display-en">
          {count}
        </span>
      )}
    </button>
  );
}
