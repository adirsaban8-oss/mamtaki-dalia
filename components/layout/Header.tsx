'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { Wordmark } from '@/components/ornaments/Wordmark';
import { LanguageSwitcher } from './LanguageSwitcher';
import { whatsappLink } from '@/lib/site';

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
    : 'bg-page/95 backdrop-blur-md border-hairline/60 shadow-soft';

  const navLinkColor = onDark
    ? 'text-ivory/90 hover:text-gold-light'
    : 'text-coffee hover:text-burgundy';

  const navItems = [
    { href: '/#story', label: t('story') },
    { href: '/delivery', label: t('delivery') },
    { href: '/events', label: t('events') },
    { href: '#contact', label: t('contact') },
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
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10" aria-label="Primary">
          <Link
            href="/shop"
            className="inline-flex items-center h-10 px-6 rounded-[2px] bg-gold text-black text-[15px] font-bold hover:bg-gold-light transition-colors duration-500"
          >
            {locale === 'ar' ? 'الكتالوج والأسعار' : 'לקטלוג ולמחירים'}
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative text-[15px] font-medium transition-colors duration-500 ${navLinkColor} after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:w-0 after:h-px after:bg-gold after:transition-[width] after:duration-500 after:-translate-x-1/2 hover:after:w-6`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Utilities — tighter gap on phones, generous from md+ */}
        <div className="flex items-center gap-1 sm:gap-4 md:gap-6 shrink-0">
          <LanguageSwitcher variant={onDark ? 'light' : 'dark'} />
          <span aria-hidden className={`hidden md:block h-5 w-px ${onDark ? 'bg-gold/30' : 'bg-hairline'}`} />
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 h-9 sm:h-10 px-3 sm:px-4 border rounded-[2px] text-[12px] sm:text-[13px] font-medium transition-colors duration-500 ${onDark ? 'border-gold/60 text-gold-light hover:bg-gold hover:text-black' : 'border-gold/50 text-gold-light hover:bg-gold hover:text-black'}`}
          >
            <WhatsAppIcon />
            <span className="hidden sm:inline">{locale === 'ar' ? 'للطلبات' : 'להזמנות'}</span>
          </a>

          {/* Mobile menu trigger — slightly smaller on phone */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className={`lg:hidden inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 transition-colors duration-500 ${onDark ? 'text-ivory' : 'text-heading'}`}
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
        className="lg:hidden overflow-hidden bg-page border-t border-hairline/60"
      >
        <nav className="px-5 py-8 flex flex-col gap-6" aria-label="Primary mobile">
          <Link
            href="/shop"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center h-12 rounded-[2px] bg-gold text-black text-lg font-bold"
          >
            {locale === 'ar' ? 'الكتالوج والأسعار' : 'לקטלוג ולמחירים'}
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-lg font-medium text-heading hover:text-gold-deep transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </motion.div>
    </motion.header>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zm8.3-18.1C18.1 1.5 15.1.3 12 .3 5.5.3.3 5.5.3 12c0 2.1.5 4.1 1.6 5.9L.2 23.7l6-1.6c1.7.9 3.7 1.4 5.7 1.4 6.5 0 11.7-5.2 11.7-11.7 0-3.1-1.2-6.1-3.3-8.1z" />
    </svg>
  );
}
