'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { whatsappLink } from '@/lib/site';

/**
 * Phone bar pinned to the bottom: call · order (gold, centre) · WhatsApp.
 * On the home page it slides in only after the hero, so the kanafeh
 * scene has the whole screen. Product pages bring their own order bar.
 * (No cart button: the cart is not active in catalog mode.)
 */
export function MobileBar() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const ar = locale === 'ar';
  const onHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!onHome) return;
    const update = () => setScrolled(window.scrollY > window.innerHeight * 1.5);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [onHome]);

  if (pathname.startsWith('/admin') || pathname.startsWith('/checkout')) return null;
  if (pathname.startsWith('/shop/')) return <div aria-hidden className="h-[4.5rem] lg:hidden" />;
  const shown = !onHome || scrolled;

  const side = 'flex-1 h-12 inline-flex flex-col items-center justify-center gap-0.5 rounded-full text-[12px] font-semibold text-cream';

  return (
    <>
      <div aria-hidden className="h-[4.5rem] lg:hidden" />
      <nav
        aria-label={ar ? 'طلب سريع' : 'הזמנה מהירה'}
        className={`lg:hidden fixed bottom-0 inset-x-0 z-50 flex items-center gap-2 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] bg-[#0A0806]/95 backdrop-blur-md border-t border-gold/30 transition-transform duration-500 ${shown ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <a href="tel:+972525986266" className={side}>
          <PhoneIcon />
          {ar ? 'اتصال' : 'חיוג'}
        </a>
        <Link href="/shop" className="flex-[1.6] h-12 inline-flex items-center justify-center rounded-full bg-gold-metal text-[#0A0806] text-base font-bold">
          {ar ? 'للطلب' : 'להזמנה'}
        </Link>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={side}>
          <WhatsAppIcon />
          WhatsApp
        </a>
      </nav>
    </>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zm8.3-18.1C18.1 1.5 15.1.3 12 .3 5.5.3.3 5.5.3 12c0 2.1.5 4.1 1.6 5.9L.2 23.7l6-1.6c1.7.9 3.7 1.4 5.7 1.4 6.5 0 11.7-5.2 11.7-11.7 0-3.1-1.2-6.1-3.3-8.1z" />
    </svg>
  );
}
