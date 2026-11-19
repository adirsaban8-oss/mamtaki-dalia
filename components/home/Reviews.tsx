'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { MANUAL_REVIEWS } from '@/lib/reviews';

const ease = [0.22, 1, 0.36, 1] as const;
/** Shorter reviews ("מעולה!") are left out. */
const MIN_LENGTH = 150;

type Card = {
  key: string;
  author: string;
  authorUri?: string;
  rating: number;
  text: string;
  time: number;
  dateLabel: string;
  source: string;
  sourceUri?: string;
};
type Google = { enabled: boolean; rating?: number | null; count?: number | null; mapsUri?: string | null; error?: string; reviews?: { author: string; authorUri?: string; rating: number; text: string; publishTime?: string; relativeTime?: string; reviewUri?: string }[] };

/**
 * "What our customers think": Google's live rating, count and reviews
 * (with Google's attribution), plus any owner-approved reviews from
 * lib/reviews.ts. Only 4-5 star reviews with real text, best first.
 * Swipe on phones, arrows on desktop. Shows nothing when there is
 * nothing real to show.
 */
export function Reviews() {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  const ref = useRef<HTMLElement>(null);
  const near = useInView(ref, { once: true, margin: '400px' });
  const [g, setG] = useState<Google | null>(null);

  useEffect(() => {
    if (!near) return;
    let live = true;
    fetch(`/api/reviews?lang=${locale}`)
      .then((r) => r.json())
      .then((j: Google) => live && setG(j))
      .catch(() => live && setG({ enabled: false }));
    return () => { live = false; };
  }, [near, locale]);

  const fmt = useMemo(() => new Intl.DateTimeFormat(ar ? 'ar' : 'he-IL', { day: 'numeric', month: 'long', year: 'numeric' }), [ar]);

  const cards: Card[] = useMemo(() => {
    const fromGoogle: Card[] = (g?.reviews ?? []).map((r, i) => ({
      key: 'g' + i,
      author: r.author,
      authorUri: r.authorUri,
      rating: r.rating,
      text: r.text,
      time: r.publishTime ? Date.parse(r.publishTime) : 0,
      dateLabel: r.publishTime ? fmt.format(new Date(r.publishTime)) : r.relativeTime ?? '',
      source: 'Google',
      sourceUri: r.reviewUri ?? g?.mapsUri ?? undefined,
    }));
    const manual: Card[] = MANUAL_REVIEWS.map((r, i) => ({
      key: 'm' + i,
      author: r.author,
      rating: r.rating,
      text: r.text,
      time: Date.parse(r.date),
      dateLabel: fmt.format(new Date(r.date)),
      source: r.source,
      sourceUri: r.url,
    }));
    // The owner shows good, detailed reviews only: 4 or 5 stars and at least
    // MIN_LENGTH characters, best rating first, then the longer one. The true
    // average, the total count and the link to every review on Google stay next to them.
    return [...fromGoogle, ...manual]
      .filter((c) => c.rating >= 4 && c.text.trim().length >= MIN_LENGTH)
      .sort((a, b) => b.rating - a.rating || b.text.length - a.text.length);
  }, [g, fmt]);

  const loading = near && g === null;
  const hasSummary = !!(g?.enabled && g.rating && g.count);
  if (!loading && !hasSummary && cards.length === 0) return <section ref={ref} aria-hidden className="h-px" />;

  return (
    <section ref={ref} className="bg-[#0A0806] text-cream py-16 md:py-24 overflow-hidden" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.9, ease }} className="text-center">
          <h2 id="reviews-heading" className={`${displayFont} text-gold-metal text-3xl sm:text-5xl md:text-6xl font-black leading-[1.1]`}>
            {ar ? 'ماذا يقول زبائننا عنّا؟' : 'מה הלקוחות שלנו חושבים עלינו?'}
          </h2>

          {hasSummary && (
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="flex items-center gap-3">
                <bdi dir="ltr" className={`${displayFont} text-gold-metal text-5xl font-black leading-none`}>{g!.rating!.toFixed(1)}</bdi>
                <Stars value={g!.rating!} size={22} />
              </div>
              <p className="text-[15px] text-cream/80">
                {ar ? 'من ' : 'מתוך '}
                <bdi dir="ltr" className="font-semibold text-gold-light">{g!.count!.toLocaleString(ar ? 'ar' : 'he-IL')}</bdi>
                {ar ? ' تقييمًا على Google' : ' ביקורות בגוגל'}
              </p>
            </div>
          )}
        </motion.div>

        {loading ? <Skeleton /> : cards.length > 0 && <Carousel cards={cards} ar={ar} displayFont={displayFont} />}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-[13px] text-cream/55">
          {g?.enabled && g.mapsUri && (
            <a href={g.mapsUri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-12 px-7 rounded-full border border-gold/60 text-gold text-[15px] font-semibold hover:bg-gold hover:text-[#0A0806] transition-colors duration-300">
              {ar ? 'لكل التقييمات على Google' : 'לכל הביקורות בגוגל'}
            </a>
          )}
          {g?.enabled && cards.some((c) => c.source === 'Google') && (
            <span>{ar ? 'تُعرض هنا تقييمات مختارة من 4 و5 نجوم من Google.' : 'מוצגות כאן ביקורות נבחרות של 4 ו‑5 כוכבים מ‑Google.'}</span>
          )}
        </div>
      </div>
    </section>
  );
}

function Carousel({ cards, ar, displayFont }: { cards: Card[]; ar: boolean; displayFont: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const x = Math.abs(el.scrollLeft); // RTL scrollLeft runs negative
    setEdge({ start: x < 8, end: x + el.clientWidth >= el.scrollWidth - 8 });
  };
  useEffect(onScroll, [cards.length]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const step = (card?.offsetWidth ?? 320) + 20;
    // In RTL "forward" is to the left.
    el.scrollBy({ left: dir * step * (getComputedStyle(el).direction === 'rtl' ? -1 : 1), behavior: 'smooth' });
  };

  return (
    <div className="relative mt-10 md:mt-14">
      <div
        ref={track}
        onScroll={onScroll}
        className={`flex gap-5 ${cards.length < 3 ? 'md:justify-center' : ''} overflow-x-auto snap-x snap-mandatory scroll-smooth overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
        role="region"
        aria-roledescription="carousel"
        aria-label={ar ? 'تقييمات الزبائن' : 'ביקורות לקוחות'}
        tabIndex={0}
      >
        {cards.map((c, i) => (
          <ReviewCard key={c.key} c={c} i={i} n={cards.length} ar={ar} displayFont={displayFont} />
        ))}
      </div>
      {cards.length > 1 && (
        <div className="hidden md:flex justify-center gap-3 mt-6">
          <Arrow onClick={() => page(-1)} disabled={edge.start} label={ar ? 'السابق' : 'הקודם'} back />
          <Arrow onClick={() => page(1)} disabled={edge.end} label={ar ? 'التالي' : 'הבא'} />
        </div>
      )}
    </div>
  );
}

function ReviewCard({ c, i, n, ar, displayFont }: { c: Card; i: number; n: number; ar: boolean; displayFont: string }) {
  const [open, setOpen] = useState(false);
  const long = c.text.length > 260;
  return (
    <motion.figure
      data-card
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay: Math.min(i, 3) * 0.08, ease }}
      aria-label={`${i + 1} / ${n}`}
      className="snap-start shrink-0 w-[84%] sm:w-[46%] lg:w-[31.5%] flex flex-col rounded-[14px] border border-gold/40 bg-[#110C08] p-6 sm:p-7"
    >
      <Stars value={c.rating} size={17} />
      <blockquote className="mt-4 flex-1">
        <p className={`text-[16px] leading-[1.7] text-cream/90 whitespace-pre-line ${!open && long ? 'line-clamp-6' : ''}`}>{c.text}</p>
        {long && (
          <button type="button" onClick={() => setOpen((v) => !v)} className="mt-2 text-[14px] font-semibold text-gold hover:text-gold-light">
            {open ? (ar ? 'أقل' : 'פחות') : ar ? 'اقرأ المزيد' : 'להמשך קריאה'}
          </button>
        )}
      </blockquote>
      <figcaption className="mt-6 pt-4 border-t border-gold/20 flex items-end justify-between gap-3">
        <div className="min-w-0">
          {c.authorUri ? (
            <a href={c.authorUri} target="_blank" rel="noopener noreferrer" className={`${displayFont} block truncate text-[17px] font-bold text-gold-light hover:underline`}>{c.author}</a>
          ) : (
            <span className={`${displayFont} block truncate text-[17px] font-bold text-gold-light`}>{c.author}</span>
          )}
          {c.dateLabel && <span className="block mt-0.5 text-[13px] text-cream/55">{c.dateLabel}</span>}
        </div>
        {c.sourceUri ? (
          <a href={c.sourceUri} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[12px] font-semibold text-cream/60 hover:text-gold">
            {ar ? 'عبر ' : 'דרך '}{c.source}
          </a>
        ) : (
          <span className="shrink-0 text-[12px] font-semibold text-cream/60">{ar ? 'عبر ' : 'דרך '}{c.source}</span>
        )}
      </figcaption>
    </motion.figure>
  );
}

function Stars({ value, size }: { value: number; size: number }) {
  return (
    <span className="inline-flex gap-1 text-gold" role="img" aria-label={`${value.toFixed(1)} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 16 16" aria-hidden>
            <defs>
              <linearGradient id={`st${size}-${i}-${Math.round(fill * 100)}`}>
                <stop offset={`${fill * 100}%`} stopColor="currentColor" />
                <stop offset={`${fill * 100}%`} stopColor="currentColor" stopOpacity="0.18" />
              </linearGradient>
            </defs>
            <path fill={`url(#st${size}-${i}-${Math.round(fill * 100)})`} d="M8 1.5 9.9 6l4.6.4-3.5 3 1.1 4.6L8 11.4 3.9 14 5 9.4 1.5 6.4 6.1 6Z" />
          </svg>
        );
      })}
    </span>
  );
}

function Arrow({ onClick, disabled, label, back = false }: { onClick: () => void; disabled: boolean; label: string; back?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} className="w-12 h-12 rounded-full border border-gold/60 text-gold inline-flex items-center justify-center hover:bg-gold hover:text-[#0A0806] disabled:opacity-30 disabled:pointer-events-none transition-colors duration-300">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={back ? '' : 'rotate-180'}>
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  );
}

function Skeleton() {
  return (
    <div className="mt-10 md:mt-14 flex gap-5 overflow-hidden" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className="shrink-0 w-[84%] sm:w-[46%] lg:w-[31.5%] h-64 rounded-[14px] border border-gold/20 bg-[#110C08] animate-pulse" />
      ))}
    </div>
  );
}
