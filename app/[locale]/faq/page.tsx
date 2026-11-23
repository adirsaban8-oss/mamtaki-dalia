import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { FAQ } from '@/lib/faq';
import { whatsappLink } from '@/lib/site';

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://mamtaki-dalia-production.up.railway.app';

export async function generateMetadata({ params }: PageProps<'/[locale]/faq'>): Promise<Metadata> {
  const { locale } = await params;
  const ar = locale === 'ar';
  return {
    title: ar ? 'أسئلة وأجوبة · كنافة وبقلاوة أبو حسن' : 'שאלות ותשובות · כנאפה ובקלאווה של אבו חסן',
    description: ar
      ? 'كل ما يُسأل عن حلويات دالية الكرمل (أبو حسن): الكنافة والبقلاوة، ساعات العمل، التوصيل، الكشروت، مسببات الحساسية وطريقة الطلب.'
      : 'כל מה ששואלים על ממתקי דלית אל כרמל (אבו חסן): כנאפה ובקלאווה, שעות פתיחה, משלוחים, כשרות, אלרגנים ואיך מזמינים.',
    alternates: { canonical: `${BASE}/${ar ? 'ar' : 'he'}/faq` },
  };
}

/**
 * Questions and answers. Plain HTML that opens without JavaScript
 * (<details>), and the same text as FAQPage structured data for search
 * engines. The answer bot on every page reads the same list (lib/faq.ts).
 */
export default async function FaqPage({ params }: PageProps<'/[locale]/faq'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l: Locale = locale === 'ar' ? 'ar' : 'he';
  const ar = l === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: l,
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q[l], acceptedAnswer: { '@type': 'Answer', text: f.a[l] } })),
  };

  return (
    <>
      <Header overHero={false} />
      <main className="flex-1 pt-28 md:pt-36 pb-20 bg-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
        <article className="mx-auto max-w-3xl px-5">
          <header className="text-center mb-10 md:mb-14">
            <h1 className={`${displayFont} text-gold-metal font-black text-4xl md:text-6xl leading-[1.1] text-balance`}>
              {ar ? 'أسئلة وأجوبة' : 'שאלות ותשובות'}
            </h1>
            <p className="mt-5 text-lg text-ink/85 text-pretty">
              {ar
                ? 'كل ما يُسأل عن حلويات دالية الكرمل، المحل الذي أسّسه أبو حسن: الكنافة، البقلاوة، التوصيل وطريقة الطلب.'
                : 'כל מה ששואלים על ממתקי דלית אל כרמל, העסק שהקים אבו חסן: הכנאפה, הבקלאווה, המשלוחים ואיך מזמינים.'}
            </p>
          </header>

          <div className="space-y-3">
            {FAQ.map((f) => (
              <details key={f.id} id={f.id} className="group rounded-[14px] border border-gold/40 bg-[#110C08] open:border-gold scroll-mt-28">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 md:p-6 [&::-webkit-details-marker]:hidden">
                  <h2 className={`${displayFont} text-xl md:text-2xl font-bold text-gold-light`}>{f.q[l]}</h2>
                  <span aria-hidden className="shrink-0 w-9 h-9 rounded-full border border-gold/60 text-gold inline-flex items-center justify-center text-2xl leading-none transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <div className="px-5 md:px-6 pb-6 -mt-1">
                  <p className="text-[17px] leading-[1.8] text-cream/90 text-pretty">{f.a[l]}</p>
                  {f.link && (
                    <Link href={f.link.href} className="inline-block mt-3 text-base font-semibold text-gold underline underline-offset-4 hover:text-gold-light">
                      {f.link[l]}
                    </Link>
                  )}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 p-6 md:p-8 rounded-[14px] border border-gold/40 text-center">
            <p className={`${displayFont} text-2xl font-bold text-gold-light`}>{ar ? 'لم تجدوا جوابًا؟' : 'לא מצאתם תשובה?'}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-gold-metal text-[#0A0806] text-base font-bold">
                {ar ? 'اكتبوا لنا على واتساب' : 'כתבו לנו בוואטסאפ'}
              </a>
              <a href="tel:+972525986266" className="inline-flex items-center justify-center h-12 px-7 rounded-full border border-gold/60 text-gold text-base font-semibold hover:bg-gold/10">
                <bdi dir="ltr">052-5986266</bdi>
              </a>
            </div>
          </div>
        </article>
      </main>
      <Footer locale={l} />
    </>
  );
}
