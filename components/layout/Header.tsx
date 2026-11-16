'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import Image from 'next/image';
import { LanguageSwitcher } from './LanguageSwitcher';
import { whatsappLink } from '@/lib/site';

type Props = {
  /** Kept for existing call sites; the bar is always solid black. */
  overHero?: boolean;
};

const WAZE = 'https://waze.com/ul?q=דליה%2010%20דלית%20אל%20כרמל';

/**
 * Header, black bar in three parts: the menu on the reading side, the
 * logo in the centre, and two round buttons on the far side, WhatsApp
 * and Waze.
 */
export function Header(_props: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('Nav');
  const [menuOpen, setMenuOpen] = useState(false);
  const ar = locale === 'ar';

  // When the menu is open, lock body scroll.
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [menuOpen]);

  const navItems = [
    { href: '/shop', label: ar ? 'الكتالوج والأسعار' : 'קטלוג ומחירים' },
    { href: '/#story', label: t('story') },
    { href: '/delivery', label: t('delivery') },
    { href: '/events', label: t('events') },
    { href: '#contact', label: t('contact') },
  ];

  const roundButton =
    'inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/40 text-white hover:bg-white hover:text-black transition-colors duration-300';

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#0A0806]/95 backdrop-blur-md text-white border-b border-gold/20">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 md:px-10 h-16 sm:h-20 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        {/* Menu, reading side */}
        <div className="flex items-center justify-self-start">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center gap-3 h-11 px-2 text-white"
            aria-label={menuOpen ? t('menuClose') : t('menuOpen')}
            aria-expanded={menuOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              {menuOpen ? (
                <>
                  <path d="M 5 5 L 19 19" />
                  <path d="M 19 5 L 5 19" />
                </>
              ) : (
                <>
                  <path d="M 3 7 L 21 7" />
                  <path d="M 3 12 L 21 12" />
                  <path d="M 3 17 L 21 17" />
                </>
              )}
            </svg>
            <span className="hidden sm:inline text-[15px] font-medium">{ar ? 'القائمة' : 'תפריט'}</span>
          </button>
        </div>

        {/* Logo, centre */}
        <div className="justify-self-center min-w-0">
          <Link href="/" className="block" aria-label={ar ? 'حلويات دالية الكرمل، الصفحة الرئيسية' : 'ממתקי דלית אל כרמל, דף הבית'}>
            <Image src="/images/logo-192.webp" alt="" width={64} height={64} priority className="w-12 h-12 sm:w-16 sm:h-16 rounded-full" />
          </Link>
        </div>

        {/* WhatsApp + Waze, far side */}
        <div className="flex items-center justify-self-end gap-2 sm:gap-3">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={roundButton}>
            <WhatsAppIcon />
          </a>
          <a href={WAZE} target="_blank" rel="noopener noreferrer" aria-label={ar ? 'التنقل عبر Waze' : 'ניווט ב-Waze'} className={roundButton}>
            <WazeIcon />
          </a>
        </div>
      </div>

      {/* Menu sheet */}
      <motion.div
        initial={false}
        animate={menuOpen ? 'open' : 'closed'}
        variants={{
          open: { height: 'auto', opacity: 1 },
          closed: { height: 0, opacity: 0 },
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden bg-[#0A0806] border-t border-white/15 max-h-[calc(100dvh-4rem)]"
      >
        <nav className="mx-auto max-w-[1440px] px-5 sm:px-8 md:px-12 py-5 flex flex-col" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="py-3.5 text-xl font-medium text-white hover:text-white/70 transition-colors border-b border-white/15"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 flex items-center justify-between">
            <span className="text-sm text-white/60">{ar ? 'اللغة' : 'שפה'}</span>
            <LanguageSwitcher variant="light" className="h-11 px-2" />
          </div>
        </nav>
      </motion.div>
    </header>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zm8.3-18.1C18.1 1.5 15.1.3 12 .3 5.5.3.3 5.5.3 12c0 2.1.5 4.1 1.6 5.9L.2 23.7l6-1.6c1.7.9 3.7 1.4 5.7 1.4 6.5 0 11.7-5.2 11.7-11.7 0-3.1-1.2-6.1-3.3-8.1z" />
    </svg>
  );
}

function WazeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21 12c0 5-4 9-9 9-1.8 0-3.5-.5-5-1.4L2 21l1.5-4.5C2.6 15 2 13.6 2 12 2 7 6 3 12 3s9 4 9 9zm-12-1a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2zm-7 4c1 1.5 2.5 2 4 2s3-.5 4-2H8z" />
    </svg>
  );
}
