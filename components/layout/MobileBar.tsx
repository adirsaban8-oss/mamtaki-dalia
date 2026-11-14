'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { whatsappLink } from '@/lib/site';

/**
 * Phone-only bar pinned to the bottom of every page: one tap to the
 * catalog, one tap to order. Inside the catalog the first button turns
 * into a phone call, so the bar never links to the page you are on.
 */
export function MobileBar() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const ar = locale === 'ar';

  if (pathname.startsWith('/admin') || pathname.startsWith('/checkout')) return null;
  // Product pages render their own order bar; keep only the spacer.
  if (pathname.startsWith('/shop/')) return <div aria-hidden className="h-[4.5rem] lg:hidden" />;
  const inCatalog = pathname === '/shop';

  const cell =
    'flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-[2px] text-[15px] font-bold transition-colors duration-300';

  return (
    <>
      {/* Keeps the footer clear of the fixed bar */}
      <div aria-hidden className="h-[4.5rem] lg:hidden" />
      <nav
        aria-label={ar ? 'طلب سريع' : 'הזמנה מהירה'}
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 flex gap-2 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] bg-cedar/95 backdrop-blur-md border-t border-gold/40"
      >
        {inCatalog ? (
          <a href="tel:+972525986266" className={`${cell} bg-gold text-black hover:bg-gold-light`}>
            <PhoneIcon />
            {ar ? 'اتصلوا للطلب' : 'התקשרו להזמנה'}
          </a>
        ) : (
          <Link href="/shop" className={`${cell} bg-gold text-black hover:bg-gold-light`}>
            <GridIcon />
            {ar ? 'الكتالوج والأسعار' : 'לקטלוג ולמחירים'}
          </Link>
        )}
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className={`${cell} border border-gold/60 text-gold-light hover:bg-gold/10`}
        >
          <WhatsAppIcon />
          {ar ? 'واتساب' : 'וואטסאפ'}
        </a>
      </nav>
    </>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zm8.3-18.1C18.1 1.5 15.1.3 12 .3 5.5.3.3 5.5.3 12c0 2.1.5 4.1 1.6 5.9L.2 23.7l6-1.6c1.7.9 3.7 1.4 5.7 1.4 6.5 0 11.7-5.2 11.7-11.7 0-3.1-1.2-6.1-3.3-8.1z" />
    </svg>
  );
}
