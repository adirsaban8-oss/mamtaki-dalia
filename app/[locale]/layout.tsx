import type { Metadata, Viewport } from 'next';
import {
  Frank_Ruhl_Libre,
  IBM_Plex_Sans_Hebrew,
  Amiri,
  IBM_Plex_Sans_Arabic,
  Cormorant_Garamond,
  Inter,
} from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import '../globals.css';
import { locales, type Locale } from '@/i18n/locales';
import { ApolloProvider } from '@/components/providers/ApolloProvider';
import { AccessibilityFAB } from '@/components/layout/AccessibilityFAB';
import { MobileBar } from '@/components/layout/MobileBar';

const frank = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-frank',
  display: 'swap',
});

// Body: IBM Plex Sans Hebrew + Arabic share one design, so mixed
// Hebrew/Arabic text keeps the same colour and rhythm.
const plexHebrew = IBM_Plex_Sans_Hebrew({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-heebo',
  display: 'swap',
});

// Arabic display: classical Naskh, the Arabic counterpart of Frank Ruhl.
const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-reem',
  display: 'swap',
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-tajawal',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'ממתקי דלית אל כרמל · Daliyat al-Karmel Sweets',
    template: '%s · ממתקי דלית אל כרמל',
  },
  description:
    'קטלוג ממתקי דלית אל כרמל: כנאפה, בקלאווה ופיסטוק חלבי, מגשי לילות ביירות, קינוחים ועוגות — מעשה ידי המשפחה בלב הכרמל.',
  applicationName: 'Mamtaki Dalia',
  authors: [{ name: 'Abu Hassan & Family' }],
  openGraph: {
    type: 'website',
    siteName: 'ממתקי דלית אל כרמל',
    locale: 'he_IL',
    alternateLocale: ['ar_IL'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0C0A08',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      dir="rtl"
      className={[
        frank.variable,
        plexHebrew.variable,
        amiri.variable,
        plexArabic.variable,
        cormorant.variable,
        inter.variable,
        'h-full antialiased',
      ].join(' ')}
    >
      <body className="min-h-full flex flex-col bg-page text-coffee">
        <NextIntlClientProvider locale={locale as Locale}>
          <ApolloProvider>
            {children}
            <MobileBar />
            <AccessibilityFAB />
          </ApolloProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
