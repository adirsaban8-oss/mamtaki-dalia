'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { Wordmark } from '@/components/ornaments/Wordmark';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CartIcon } from './CartIcon';

type Props = {
  /**
   * When true, the header is rendered as a translucent overlay on top of
   * a dark hero. It becomes solid parchment once the user scrolls.
   */
  overHero?: boolean;
};

export function Header({ overHero = true }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('Nav');
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled(v > 24);
  });

  // When the menu is open on mobile, lock body scroll.
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [menuOpen]);

  const onDark = overHero && !scrolled;

  // Above scroll: translucent cedar with backdrop-blur (per spec).
  // After scroll: parchment-cream with soft shadow; height collapses 96→72px.
  const surface = onDark
    ? 'bg-cedar/55 backdrop-blur-md border-transparent'
    : 'bg-ivory/95 backdrop-blur-md border-hairline/60 shadow-soft';

  const navLinkColor = onDark
    ? 'text-ivory/90 hover:text-gold-light'
    : 'text-coffee hover:text-burgundy';

  const navItems = [
    { href: '/shop', label: t('shop') },
    { href: '/about', label: t('story') },
    { href: '/gallery', label: t('gallery') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-700 ${surface}`}
    >
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-5 md:px-10 flex items-center justify-between gap-3 sm:gap-6 transition-[height] duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${scrolled ? 'h-16 sm:h-[72px]' : 'h-16 sm:h-20 md:h-24'}`}
      >
        {/* Brand */}
        <Wordmark locale={locale} variant={onDark ? 'light' : 'dark'} />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-10" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative font-display-en text-[11px] tracking-eyebrow uppercase transition-colors duration-500 ${navLinkColor} after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:w-0 after:h-px after:bg-gold after:transition-[width] after:duration-500 after:-translate-x-1/2 hover:after:w-6`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Utilities — tighter gap on phones, generous from md+ */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
          <LanguageSwitcher variant={onDark ? 'light' : 'dark'} />
          <span aria-hidden className={`hidden md:block h-5 w-px ${onDark ? 'bg-ivory/30' : 'bg-hairline'}`} />
          <CartIcon variant={onDark ? 'light' : 'dark'} />

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className={`lg:hidden inline-flex items-center justify-center w-10 h-10 transition-colors duration-500 ${onDark ? 'text-ivory' : 'text-cedar'}`}
            aria-label={menuOpen ? t('menuClose') : t('menuOpen')}
            aria-expanded={menuOpen}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
              {menuOpen ? (
                <>
                  <path d="M 5 5 L 19 19" />
                  <path d="M 19 5 L 5 19" />
                </>
              ) : (
                <>
                  <path d="M 4 8 L 20 8" />
                  <path d="M 4 16 L 20 16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <motion.div
        initial={false}
        animate={menuOpen ? 'open' : 'closed'}
        variants={{
          open: { height: 'auto', opacity: 1 },
          closed: { height: 0, opacity: 0 },
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="lg:hidden overflow-hidden bg-ivory border-t border-hairline/60"
      >
        <nav className="px-5 py-8 flex flex-col gap-6" aria-label="Primary mobile">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-display-en text-sm tracking-eyebrow uppercase text-cedar hover:text-burgundy transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </motion.div>
    </motion.header>
  );
}
