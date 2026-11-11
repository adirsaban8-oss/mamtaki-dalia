import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EventsForm } from '@/components/events/EventsForm';
import type { Locale } from '@/i18n/locales';

export const metadata: Metadata = { title: 'אירועים והזמנות גדולות' };

export default async function EventsPage({ params }: PageProps<'/[locale]/events'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';

  return (
    <>
      <Header overHero={false} />
      <main className="flex-1 pt-28 md:pt-36 pb-20 bg-page">
        <div className="mx-auto max-w-3xl px-5">
          <header className="flex flex-col items-center text-center mb-12">
            <span className="text-[13px] font-medium text-gold-deep">
              {ar ? 'لكل مناسبة' : 'לכל אירוע ושמחה'}
            </span>
            <h1 className={`mt-3 ${displayFont} font-bold text-heading text-4xl md:text-5xl text-balance`}>
              {ar ? 'مناسبات وكميات كبيرة' : 'אירועים והזמנות גדולות'}
            </h1>
            <p className="mt-5 text-coffee-muted leading-relaxed text-pretty">
              {ar
                ? 'أعراس، خطوبات، مناسبات عائلية وهدايا للشركات — املؤوا التفاصيل ونعود إليكم بعرض سعر.'
                : 'חתונות, אירוסין, שמחות משפחתיות ומתנות לעסקים — מלאו את הפרטים ונחזור אליכם עם הצעת מחיר.'}
            </p>
            <span aria-hidden className="rule-diamond block w-28 mt-7" />
          </header>
          <EventsForm />
        </div>
      </main>
      <Footer locale={locale as Locale} />
    </>
  );
}
