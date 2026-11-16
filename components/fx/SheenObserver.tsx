'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';

/**
 * Gold Sheen — gives every metallic-gold heading and button one diagonal
 * glint when it first enters the screen (the hover glint is pure CSS).
 * Adds `is-sheen` to `.text-gold-metal` / `.bg-gold-metal` elements.
 */
export function SheenObserver() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-sheen'); io.unobserve(e.target); }
      }),
      { threshold: 0.6 }
    );
    const scan = () => document.querySelectorAll('.text-gold-metal:not(.is-sheen), .bg-gold-metal:not(.is-sheen)').forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname]);
  return null;
}
