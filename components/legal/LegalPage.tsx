import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { LEGAL_UPDATED, legalDocs, legalSlugs, type LegalSlug } from '@/lib/legal/content';

type Props = { slug: LegalSlug; locale: Locale };

/**
 * One layout for all legal documents: title, last-updated date, numbered
 * sections, and links to the sibling documents and back to the catalog.
 */
export function LegalPage({ slug, locale }: Props) {
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  const doc = legalDocs[locale][slug];

  return (
    <>
      <Header overHero={false} />
      <main className="flex-1 pt-28 md:pt-36 pb-20 bg-page">
        <article className="mx-auto max-w-3xl px-5">
          <header className="flex flex-col items-center text-center mb-10 md:mb-14">
            <span className="text-[13px] font-medium text-gold-deep">
              {ar ? 'معلومات قانونية' : 'מידע משפטי'}
            </span>
            <h1 className={`mt-3 ${displayFont} font-bold text-heading text-4xl md:text-5xl text-balance`}>
              {doc.title}
            </h1>
            <p className="mt-4 text-sm text-coffee-muted">
              {ar ? 'آخر تحديث: ' : 'עדכון אחרון: '}
              <span dir="ltr">{LEGAL_UPDATED}</span>
            </p>
            <span aria-hidden className="rule-diamond block w-28 mt-7" />
          </header>

          <p className="text-base md:text-[17px] leading-[1.8] text-ink/85 text-pretty">{doc.intro}</p>

          {doc.sections.map((section) => (
            <section key={section.h} id={section.id} className="mt-10 scroll-mt-28">
              <h2 className={`${displayFont} font-bold text-heading text-xl md:text-2xl`}>{section.h}</h2>
              {section.p.map((text) => (
                <p key={text} className="mt-3 text-[15px] md:text-base leading-[1.8] text-ink/80 text-pretty">
                  {text}
                </p>
              ))}
            </section>
          ))}

          <nav
            aria-label={ar ? 'صفحات قانونية أخرى' : 'עמודי מידע נוספים'}
            className="mt-14 pt-8 border-t border-hairline flex flex-wrap gap-x-6 gap-y-3 text-[15px]"
          >
            {legalSlugs
              .filter((s) => s !== slug)
              .map((s) => (
                <Link key={s} href={`/${s}`} className="text-gold underline underline-offset-4 hover:text-gold-light">
                  {legalDocs[locale][s].title}
                </Link>
              ))}
            <Link href="/delivery" className="text-gold underline underline-offset-4 hover:text-gold-light">
              {ar ? 'التوصيل' : 'משלוחים'}
            </Link>
            <Link href="/shop" className="text-gold underline underline-offset-4 hover:text-gold-light">
              {ar ? 'إلى الكتالوج' : 'לקטלוג המוצרים'}
            </Link>
          </nav>
        </article>
      </main>
      <Footer locale={locale} />
    </>
  );
}
