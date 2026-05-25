import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { Footer } from '@/components/layout/Footer';
import type { Locale } from '@/i18n/locales';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({
  params,
}: PageProps<'/[locale]/checkout'>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header overHero={false} />
      <main className="flex-1 pt-24 md:pt-28 bg-ivory">
        <CheckoutForm locale={locale as Locale} />
      </main>
      <Footer locale={locale as Locale} />
    </>
  );
}
