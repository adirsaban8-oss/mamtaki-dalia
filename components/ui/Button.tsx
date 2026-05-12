import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';
export type ButtonSize = 'md' | 'lg';

const sizeMap: Record<ButtonSize, string> = {
  md: 'h-11 px-7 text-xs',
  lg: 'h-14 px-9 text-sm',
};

const variantMap: Record<ButtonVariant, string> = {
  primary:
    'bg-burgundy text-ivory border border-burgundy hover:bg-burgundy-deep hover:border-gold focus-visible:bg-burgundy-deep',
  outline:
    'bg-transparent text-ivory border border-gold-light/70 hover:border-gold hover:bg-gold/10 focus-visible:border-gold',
  ghost:
    'bg-transparent text-cedar border border-transparent hover:text-burgundy',
};

const baseClasses =
  'inline-flex items-center justify-center gap-3 font-display-en tracking-eyebrow uppercase rounded-xs transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] select-none whitespace-nowrap';

/**
 * Returns the brand button classes. Apply directly to <Link> from
 * `i18n/navigation` to avoid <a> within <a> when a link is needed.
 */
export function buttonClasses(opts: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  const { variant = 'primary', size = 'lg', className } = opts;
  return cn(baseClasses, sizeMap[size], variantMap[variant], className);
}

type Props = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'lg', className, children, ...rest },
  ref
) {
  return (
    <button ref={ref} className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
    </button>
  );
});
