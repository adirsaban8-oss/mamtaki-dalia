import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { CheckoutSuccess } from '@/components/checkout/CheckoutSuccess';
import { Footer } from '@/components/layout/Footer';
import type { Locale } from '@/i18n/locales';

export const dynamic = 'force-dynamic';

export default async function CheckoutSuccessPage({
  params,
}: PageProps<'/[locale]/checkout/success'>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header overHero={false} />
      <main className="flex-1 pt-24 md:pt-28 bg-ivory">
        <CheckoutSuccess locale={locale as Locale} />
      </main>
      <Footer locale={locale as Locale} />
    </>
  );
}
