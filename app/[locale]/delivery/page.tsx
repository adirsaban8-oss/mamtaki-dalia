import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DeliveryZones } from '@/components/delivery/DeliveryZones';
import type { Locale } from '@/i18n/locales';

export const metadata: Metadata = { title: 'משלוחים ואזורי חלוקה' };

export default async function DeliveryPage({ params }: PageProps<'/[locale]/delivery'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';

  return (
    <>
      <Header overHero={false} />
      <main className="flex-1 pt-28 md:pt-36 pb-20 bg-page">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <header className="flex flex-col items-center text-center mb-12 md:mb-16">
            <span className="text-[13px] font-medium text-gold-deep">
              {ar ? 'التوصيل' : 'משלוחים'}
            </span>
            <h1 className={`mt-3 ${displayFont} font-bold text-heading text-4xl md:text-5xl`}>
              {ar ? 'مناطق التوصيل' : 'אזורי המשלוח שלנו'}
            </h1>
            <p className="mt-5 max-w-2xl text-coffee-muted leading-relaxed text-pretty">
              {ar
                ? 'نوصل إلى الشمال وغوش دان والمركز والشارون. لكل منطقة أيام توصيل ثابتة، والطلبية تصلكم في يوم التوصيل القريب.'
                : 'אנחנו מגיעים לצפון, לגוש דן, למרכז ולשרון. לכל אזור ימי אספקה קבועים, וההזמנה מגיעה אליכם ביום האספקה הקרוב.'}
            </p>
            <span aria-hidden className="rule-diamond block w-28 mt-7" />
          </header>
          <DeliveryZones />
        </div>
      </main>
      <Footer locale={locale as Locale} />
    </>
  );
}
