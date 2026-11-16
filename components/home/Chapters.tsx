'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import type { Locale, } from '@/i18n/locales';
import type { Translated } from '@/lib/mockData';
import { Link } from '@/i18n/navigation';
import { useProducts } from '@/lib/data/useProducts';
import { whatsappLink } from '@/lib/site';
import { Steam } from '@/components/fx/Steam';
import { Glisten } from '@/components/fx/Glisten';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

type Chapter = {
  slug: string;
  image: string;
  words: Translated[];
  /** Section look: background, text tone, image side. */
  tone: 'amber' | 'cream' | 'butter';
};

/** Three house desserts, each with its own colour world. */
const CHAPTERS: Chapter[] = [
  {
    slug: 'red-kanafeh',
    image: '/images/signature/red-kanafeh.webp',
    words: [{ he: 'קראנץ׳', ar: 'مقرمشة' }, { he: 'גבינה חמה', ar: 'جبنة ساخنة' }],
    tone: 'amber',
  },
  {
    slug: 'layali-beirut-tray',
    image: '/products/layali-beirut-tray.webp',
    words: [{ he: 'קר ומשיי', ar: 'باردة وناعمة' }, { he: 'פיסטוק', ar: 'فستق' }],
    tone: 'cream',
  },
  {
    slug: 'baklava-pistachio',
    image: '/images/signature/baklava-pistachio.webp',
    words: [{ he: 'נחתך ביד', ar: 'تُقطَّع باليد' }, { he: 'סירופ וחמאה', ar: 'قطر وزبدة' }],
    tone: 'butter',
  },
];

const TONE = {
  amber: { bg: 'bg-[radial-gradient(120%_90%_at_70%_40%,#3A1A06_0%,#0A0806_70%)]', text: 'text-cream', muted: 'text-cream/75', word: 'text-[#E8941A]', title: 'text-gold-metal', line: 'border-cream/20' },
  cream: { bg: 'bg-[#F6EEDC]', text: 'text-[#2A1B12]', muted: 'text-[#5C4A3A]', word: 'text-[#B5506A]', title: 'text-[#2A1B12]', line: 'border-[#2A1B12]/15' },
  butter: { bg: 'bg-[radial-gradient(120%_90%_at_30%_40%,#2E2408_0%,#0A0806_72%)]', text: 'text-cream', muted: 'text-cream/75', word: 'text-gold-light', title: 'text-gold-metal', line: 'border-cream/20' },
} as const;

/**
 * Chapters — three full-screen pages, one per house dessert. A big photo
 * on one side (alternating), the name, two texture words, the real
 * description and price, and the order buttons.
 */
export function Chapters() {
  const locale = useLocale() as Locale;
  const { products } = useProducts();
  return (
    <div>
      {CHAPTERS.map((c, i) => {
        const product = products.find((p) => p.slug === c.slug);
        return product ? <ChapterView key={c.slug} chapter={c} index={i} product={product} locale={locale} /> : null;
      })}
    </div>
  );
}

function ChapterView({ chapter, index, product, locale }: { chapter: Chapter; index: number; product: NonNullable<ReturnType<typeof useProducts>['products'][number]>; locale: Locale }) {
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  const t = TONE[chapter.tone];
  const flip = index % 2 === 1;
  const unit = product.unitLabel?.[locale] ?? (product.unit === 'per_kg' ? (ar ? 'كغ' : 'ק״ג') : product.unit === 'per_piece' ? (ar ? 'قطعة' : 'יחידה') : ar ? 'صينية' : 'מגש');

  return (
    <section className={`relative ${t.bg} ${t.text} lg:min-h-[100svh] flex items-center overflow-hidden`} aria-labelledby={`chapter-${chapter.slug}`}>
      <div className={`w-full mx-auto max-w-[1440px] grid lg:grid-cols-12 items-center gap-0 lg:gap-14 lg:px-10 lg:py-16`}>
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 1.08 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 1.4, ease: easeLuxe }}
          className={`relative lg:col-span-7 h-[72svh] lg:h-[82svh] lg:rounded-[16px] overflow-hidden ${flip ? 'lg:order-2' : ''}`}
        >
          <Image src={chapter.image} alt={product.name[locale]} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
          {chapter.tone !== 'cream' && <Glisten strength={0.34} />}
          {chapter.slug === 'red-kanafeh' && <Steam className="absolute inset-x-[10%] top-0 h-[55%]" />}
          {/* Warm light window + vignette, so every photo sits in the same set */}
          <span aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_60%_at_35%_30%,rgba(255,214,140,0.18),transparent_60%),radial-gradient(120%_100%_at_50%_50%,transparent_55%,rgba(10,8,6,0.55))]" />
          <span aria-hidden className={`${displayFont} absolute top-4 start-5 text-sm font-semibold tracking-wide text-white/85`}>0{index + 1} / 03</span>
        </motion.div>

        {/* Words */}
        <div className={`lg:col-span-5 px-6 sm:px-12 lg:px-0 pt-8 pb-16 lg:py-0 ${flip ? 'lg:order-1' : ''}`}>
          <p className={`text-sm font-semibold ${t.muted}`}>{ar ? 'توقيع البيت' : 'החתימה של הבית'}</p>
          <h2 id={`chapter-${chapter.slug}`} className={`${displayFont} ${t.title} mt-2 text-5xl sm:text-6xl lg:text-7xl leading-[1.02] font-black`}>
            {product.name[locale]}
          </h2>
          <ul className={`${displayFont} mt-5 flex flex-wrap gap-x-5 gap-y-1 text-2xl sm:text-3xl font-bold ${t.word}`}>
            {chapter.words.map((w) => (
              <li key={w.he}>{w[locale]}</li>
            ))}
          </ul>
          <p className={`mt-6 text-base sm:text-lg leading-relaxed ${t.muted} text-pretty max-w-md`}>{product.description[locale]}</p>
          <div className={`mt-8 pt-6 border-t ${t.line} flex flex-wrap items-center gap-x-7 gap-y-3`}>
            <p className="text-2xl font-bold">
              ₪{product.price}
              <span className={`text-base font-normal ${t.muted}`}> / {unit}</span>
            </p>
            <a
              href={whatsappLink(ar ? `مرحباً، أود أن أطلب: ${product.name.ar}` : `שלום, אשמח להזמין: ${product.name.he}`)}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center h-12 px-8 rounded-full text-[15px] font-bold transition ${chapter.tone === 'cream' ? 'bg-[#2A1B12] text-[#F6EEDC] hover:bg-[#4A3526]' : 'bg-gold-metal text-[#0A0806] hover:brightness-110'}`}
            >
              {ar ? 'للطلب' : 'להזמנה'}
            </a>
            <Link href={`/shop/${product.slug}`} className="inline-flex items-center h-11 text-[15px] font-medium underline underline-offset-[6px] decoration-1 hover:no-underline">
              {ar ? 'التفاصيل والوزن' : 'לפרטים ולמשקל'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
