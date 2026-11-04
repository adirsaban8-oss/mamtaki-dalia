import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { photoCredits } from '@/lib/data/photoCredits';
import { seedCatalog } from '@/lib/data/catalogSeed';
import type { Locale } from '@/i18n/locales';

export const metadata: Metadata = { title: 'קרדיט לתמונות' };

/** Sources of the illustrative product photos (Pexels License). */
export default async function CreditsPage({ params }: PageProps<'/[locale]/credits'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  const nameOf = (slug: string) =>
    slug === 'hero'
      ? ar ? 'الصورة الرئيسية' : 'תמונה ראשית'
      : seedCatalog.find((p) => p.slug === slug)?.name[locale as Locale] ?? slug;

  return (
    <>
      <Header overHero={false} />
      <main className="flex-1 pt-28 md:pt-36 pb-20 bg-ivory">
        <div className="mx-auto max-w-3xl px-5">
          <h1 className={`${displayFont} font-bold text-cedar text-4xl md:text-5xl`}>
            {ar ? 'حقوق الصور' : 'קרדיט לתמונות'}
          </h1>
          <p className="mt-5 text-ink/75 leading-relaxed">
            {ar
              ? 'صور المنتجات في الموقع للتوضيح فقط، ومصدرها مكتبة الصور Pexels.'
              : 'תמונות המוצרים באתר הן להמחשה בלבד, ממאגר התמונות Pexels.'}
          </p>
          <ul className="mt-10 divide-y divide-hairline border-y border-hairline">
            {photoCredits.map((c) => (
              <li key={c.slug} className="py-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <span className="font-medium text-cedar">{nameOf(c.slug)}</span>
                <span className="text-sm text-coffee-muted" dir="ltr">
                  {c.creator ? `${c.creator} · ` : ''}
                  <a href={c.source} target="_blank" rel="noopener noreferrer" className="underline hover:text-cedar">
                    {c.license}
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer locale={locale as Locale} />
    </>
  );
}
