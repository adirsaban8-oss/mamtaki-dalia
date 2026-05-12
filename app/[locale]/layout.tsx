import type { Metadata } from 'next';
import {
  Frank_Ruhl_Libre,
  Heebo,
  Reem_Kufi,
  Tajawal,
  Cormorant_Garamond,
  Inter,
} from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import '../globals.css';
import { locales, type Locale } from '@/i18n/locales';
import { CartDrawer } from '@/components/cart/CartDrawer';

const frank = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-frank',
  display: 'swap',
});

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-heebo',
  display: 'swap',
});

const reem = Reem_Kufi({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-reem',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700'],
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
    'מורשת של ארבעה דורות. כנאפה, בקלאוה ולילות ביירות, מעשה ידי המשפחה בלב הכרמל הדרוזי. משלוחים לכל הארץ.',
  applicationName: 'Mamtaki Dalia',
  authors: [{ name: 'Abu Hassan & Family' }],
  openGraph: {
    type: 'website',
    siteName: 'ממתקי דלית אל כרמל',
    locale: 'he_IL',
    alternateLocale: ['ar_IL'],
  },
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
        heebo.variable,
        reem.variable,
        tajawal.variable,
        cormorant.variable,
        inter.variable,
        'h-full antialiased',
      ].join(' ')}
    >
      <body className="min-h-full flex flex-col bg-ivory text-coffee">
        <NextIntlClientProvider locale={locale as Locale}>
          {children}
          <CartDrawer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
