import type { Metadata, Viewport } from 'next';
import { Bellefair, David_Libre, Amiri } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import '../globals.css';
import { locales, type Locale } from '@/i18n/locales';
import { ApolloProvider } from '@/components/providers/ApolloProvider';
import { AccessibilityFAB } from '@/components/layout/AccessibilityFAB';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { SheenObserver } from '@/components/fx/SheenObserver';
import { MobileBar } from '@/components/layout/MobileBar';

// Display: Bellefair — a classic, high-contrast Hebrew serif.
const frank = Bellefair({
  subsets: ['hebrew', 'latin'],
  weight: ['400'],
  variable: '--font-frank',
  display: 'swap',
});

// Text: David Libre — the classic Hebrew book face.
const plexHebrew = David_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '700'],
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'ממתקי דלית אל כרמל · Daliyat al-Karmel Sweets',
    template: '%s · ממתקי דלית אל כרמל',
  },
  description:
    'קטלוג ממתקי דלית אל כרמל: כנאפה, בקלאווה ופיסטוק חלבי, מגשי לילות ביירות, קינוחים ועוגות, מעשה ידי המשפחה בלב הכרמל.',
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
  themeColor: '#0A0806',
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
        'h-full antialiased',
      ].join(' ')}
    >
      <body className="min-h-full flex flex-col bg-page text-coffee">
        <NextIntlClientProvider locale={locale as Locale}>
          <ApolloProvider>
            <MotionProvider>
            {children}
            <MobileBar />
            <AccessibilityFAB />
            <SheenObserver />
            </MotionProvider>
          </ApolloProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
