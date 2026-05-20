import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { Link } from '@/i18n/navigation';
import { BrandMark } from '@/components/ornaments/BrandMark';
import { ArabesquePattern } from '@/components/ornaments/ArabesquePattern';
import { categoryLabels, orderedCategories } from '@/lib/mockData';

type Props = { locale: Locale };

/**
 * Footer — cedar dark, 4-column desktop, single-column mobile.
 * Final breath of the page; large wordmark, navigation, categories,
 * info, contact card. Bottom bar holds social + credit.
 */
export function Footer({ locale }: Props) {
  const t = useTranslations('Footer');
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  const navLinks = [
    { href: '/' as const, label: t('home') },
    { href: '/shop' as const, label: t('shop') },
    { href: '/about' as const, label: t('story') },
    { href: '/gallery' as const, label: t('gallery') },
    { href: '/contact' as const, label: t('contact') },
  ];

  const infoLinks = [
    { label: t('shippingPolicy'), href: '#' },
    { label: t('returns'), href: '#' },
    { label: t('kosher'), href: '#' },
    { label: t('terms'), href: '#' },
    { label: t('privacy'), href: '#' },
  ];

  return (
    <footer className="relative bg-cedar text-ivory pt-14 md:pt-20 pb-10 overflow-hidden">
      {/* Subtle arabesque corners */}
      <div aria-hidden className="absolute -top-24 -start-24 w-[500px] h-[500px] text-gold-light pointer-events-none">
        <ArabesquePattern opacity={0.04} className="absolute inset-0" />
      </div>
      <div aria-hidden className="absolute -bottom-24 -end-24 w-[500px] h-[500px] text-gold-light pointer-events-none">
        <ArabesquePattern opacity={0.04} className="absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        {/* Brand mark */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <BrandMark size={56} className="text-gold" />
          <h2 className={`mt-6 ${displayFont} font-black text-3xl md:text-4xl lg:text-5xl text-ivory tracking-display text-balance`}>
            {t('brandLine')}
          </h2>
          <p className="mt-4 max-w-xl text-base md:text-[17px] leading-[1.7] text-ivory/65 text-pretty">
            {t('brandTagline')}
          </p>
        </div>

        {/* Hairline above columns */}
        <div aria-hidden className="h-px w-full bg-gold-light/15 mb-10 md:mb-12" />

        {/* 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
          {/* Navigation */}
          <FooterColumn title={t('navigation')} displayFont={displayFont}>
            <ul className="space-y-3">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ivory/70 hover:text-gold-light transition-colors duration-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Categories */}
          <FooterColumn title={t('categories')} displayFont={displayFont}>
            <ul className="space-y-3">
              {orderedCategories.map((cat) => (
                <li key={cat}>
                  <Link
                    href="/shop"
                    className="text-sm text-ivory/70 hover:text-gold-light transition-colors duration-500"
                  >
                    {categoryLabels[cat][locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Info */}
          <FooterColumn title={t('info')} displayFont={displayFont}>
            <ul className="space-y-3">
              {infoLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-ivory/70 hover:text-gold-light transition-colors duration-500"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Contact */}
          <FooterColumn title={t('contact')} displayFont={displayFont}>
            <address className="not-italic space-y-3 text-sm text-ivory/70 leading-[1.7]">
              <p className={`${displayFont} text-ivory text-base font-bold`}>
                {locale === 'ar' ? 'دالية ١٠، دالية الكرمل' : 'דליה 10, דלית אל כרמל'}
              </p>
              <p>
                <a href="tel:+972525986266" className="hover:text-gold-light transition-colors duration-500 block">
                  052-5986266
                </a>
                <a href="tel:+97246263309" className="hover:text-gold-light transition-colors duration-500 block">
                  04-6263309
                </a>
              </p>
              <p>
                <a href="mailto:amal3591@gmail.com" className="hover:text-gold-light transition-colors duration-500">
                  amal3591@gmail.com
                </a>
              </p>
              <p className="font-display-en text-[11px] tracking-eyebrow uppercase text-gold-light/80 pt-2">
                {t('hours')}
              </p>
              <p className="text-xs text-ivory/60">{t('hoursValue')}</p>

              <a
                href="https://waze.com/ul?q=דליה%2010%20דלית%20אל%20כרמל"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 px-3 h-9 border border-gold-light/30 text-gold-light font-display-en text-[11px] tracking-eyebrow uppercase hover:border-gold transition-colors duration-500 rounded-[2px]"
              >
                <WazeIcon /> {t('waze')}
              </a>
            </address>
          </FooterColumn>
        </div>

        {/* Bottom hairline */}
        <div aria-hidden className="h-px w-full bg-gold-light/15 mt-12 md:mt-14 mb-8" />

        {/* Bottom bar: social + copyright + credit */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start">
          <div className="flex items-center gap-4">
            <SocialIcon href="https://www.instagram.com/mamtaki_dalia/" label="Instagram">
              <InstagramIcon />
            </SocialIcon>
            <SocialIcon
              href="https://www.facebook.com/p/%D7%9E%D7%9E%D7%AA%D7%A7%D7%99-%D7%93%D7%9C%D7%99%D7%AA-%D7%90%D7%9C-%D7%9B%D7%A8%D7%9E%D7%9C-100063478060834/"
              label="Facebook"
            >
              <FacebookIcon />
            </SocialIcon>
            <SocialIcon href="https://wa.me/972525986266" label="WhatsApp">
              <WhatsAppIcon />
            </SocialIcon>
          </div>

          <p className="font-display-en text-[11px] tracking-eyebrow uppercase text-ivory/50">
            © {new Date().getFullYear()} Maison Dalia · {t('rights')}
          </p>

          <p className="font-display-en text-[10px] tracking-eyebrow uppercase text-ivory/40">
            {t('craftedBy')}
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── helpers ──────────────────────────────────────────────────────── */

function FooterColumn({
  title,
  displayFont,
  children,
}: {
  title: string;
  displayFont: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className={`${displayFont} font-black text-base text-gold-light mb-5 tracking-display`}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 inline-flex items-center justify-center border border-gold-light/30 text-gold-light hover:border-gold hover:text-gold transition-colors duration-500 rounded-[2px]"
    >
      {children}
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M 18 2 L 15 2 a 4 4 0 0 0 -4 4 v 3 H 8 v 4 h 3 v 9 h 4 v -9 h 3 l 1 -4 h -4 V 7 a 1 1 0 0 1 1 -1 h 2 Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.43 1.27 4.86L2 22l5.27-1.38c1.38.75 2.95 1.18 4.77 1.18 5.52 0 10-4.48 10-10s-4.48-9.8-10-9.8zM16.5 14.81c-.21-.1-1.23-.61-1.42-.68-.19-.07-.33-.1-.47.1-.14.2-.54.68-.66.82-.12.14-.24.16-.45.06-.21-.1-.88-.32-1.68-1.03-.62-.55-1.04-1.24-1.16-1.45-.12-.21-.01-.32.09-.42.09-.09.21-.24.32-.36.1-.12.14-.2.21-.34.07-.14.04-.26-.02-.36-.05-.1-.47-1.14-.65-1.55-.17-.41-.34-.36-.47-.36-.12 0-.26-.02-.4-.02s-.36.05-.55.26c-.19.21-.72.7-.72 1.71 0 1 .74 1.97.84 2.11.1.14 1.45 2.22 3.51 3.11.49.21.87.34 1.17.43.49.16.94.13 1.29.08.39-.06 1.23-.5 1.4-.99.17-.49.17-.91.12-.99-.05-.08-.19-.13-.4-.23z" />
    </svg>
  );
}

function WazeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21 12c0 5-4 9-9 9-1.8 0-3.5-.5-5-1.4L2 21l1.5-4.5C2.6 15 2 13.6 2 12 2 7 6 3 12 3s9 4 9 9zm-12-1a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2zm-7 4c1 1.5 2.5 2 4 2s3-.5 4-2H8z" />
    </svg>
  );
}
