'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import type { Product } from '@/lib/mockData';
import { whatsappLink } from '@/lib/site';
import { useProducts } from '@/lib/data/useProducts';
import { Link } from '@/i18n/navigation';
import { MenuCard } from './MenuCard';
import { buttonClasses } from '@/components/ui/Button';
import { categoryLabels } from '@/lib/mockData';
import { ArabesquePattern } from '@/components/ornaments/ArabesquePattern';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

const PACK_SIZES = [1, 2, 3, 4, 5];

type Props = { product: Product; locale: Locale };

/**
 * Product Detail — text-led, no gallery. The product's identity is
 * carried by:
 *  – the SKU monogram, displayed as a typographic seal at large scale
 *  – an arabesque rosette ornament centered behind the monogram
 *  – the tasting note and full description
 *
 * The right-hand panel keeps the WeightSelector / price / add-to-cart.
 */
export function ProductDetail({ product, locale }: Props) {
  const t = useTranslations('Product');
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  const [openSection, setOpenSection] = useState<string | null>('allergens');
  /** Packs sold by weight come in whole kilos: 1, 2, 3 … */
  const [packKg, setPackKg] = useState(1);

  const { products: allProducts } = useProducts();
  const related = useMemo(
    () =>
      allProducts
        .filter(
          (p) =>
            p.id !== product.id &&
            (p.category === product.category || p.badges.includes('bestseller'))
        )
        .slice(0, 4),
    [product, allProducts]
  );

  const sections = [
    product.allergens?.[locale] && {
      key: 'allergens',
      title: t('allergens'),
      body: product.allergens[locale],
    },
    product.storage?.[locale] && {
      key: 'storage',
      title: t('storage'),
      body: product.storage[locale],
    },
    {
      key: 'order',
      title: locale === 'ar' ? 'التوصيل' : 'משלוחים',
      body:
        locale === 'ar'
          ? 'نوصل إلى الشمال وغوش دان والمركز والشارون، في أيام توصيل ثابتة لكل منطقة. للمناسبات والكميات الكبيرة: 054-3910078.'
          : 'משלוחים לצפון, לגוש דן, למרכז ולשרון, בימי אספקה קבועים לכל אזור. לאירועים ולכמויות גדולות: 054-3910078.',
    },
  ].filter((x): x is { key: string; title: string; body: string } => Boolean(x));

  const hasPrice = product.price > 0;
  const byKg = product.unit === 'per_kg';
  const kgLabel = (n: number) => (locale === 'ar' ? `${n} كغ` : `${n} ק״ג`);
  const priceSuffix = product.unitLabel
    ? `/ ${product.unitLabel[locale]}`
    : product.unit === 'per_kg'
      ? locale === 'ar' ? '/ كغ' : '/ ק״ג'
      : product.unit === 'per_piece'
        ? locale === 'ar' ? '/ قطعة' : '/ יחידה'
        : locale === 'ar' ? '/ صينية' : '/ מגש';

  const packText = byKg ? ` — ${locale === 'ar' ? 'علبة' : 'מארז'} ${kgLabel(packKg)}` : '';
  const orderMessage =
    locale === 'ar'
      ? `مرحباً، أود أن أطلب: ${product.name.ar}${packText}`
      : `שלום, אשמח להזמין: ${product.name.he}${packText}`;

  return (
    <article className="relative overflow-x-clip bg-page">
      <div
        aria-hidden
        className="absolute -top-12 -end-24 w-[500px] h-[500px] text-gold pointer-events-none"
      >
        <ArabesquePattern opacity={0.04} className="absolute inset-0" />
      </div>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="relative mx-auto max-w-7xl px-5 md:px-10 pt-8 md:pt-10">
        <ol className="flex items-center gap-3 font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
          <li>
            <Link href="/" className="hover:text-burgundy transition-colors duration-500">
              {locale === 'ar' ? 'الرئيسية' : 'בית'}
            </Link>
          </li>
          <li aria-hidden>·</li>
          <li>
            <Link href="/shop" className="hover:text-burgundy transition-colors duration-500">
              {locale === 'ar' ? 'القائمة' : 'הקטלוג'}
            </Link>
          </li>
          <li aria-hidden>·</li>
          <li className="text-heading truncate">{product.name[locale]}</li>
        </ol>
      </nav>

      {/* Hero — 2 column desktop */}
      <div className="relative mx-auto max-w-7xl px-5 md:px-10 pt-10 md:pt-14 pb-16 md:pb-24 grid lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Left — Monogram seal in place of a photo */}
        <div className="lg:col-span-6 order-1">
          <MonogramSeal product={product} label={categoryLabels[product.category]?.[locale] ?? ''} />
        </div>

        {/* Right — details panel */}
        <div className="lg:col-span-6 order-2 flex flex-col">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            {product.badges.includes('bestseller') && <Pill>{t('bestsellerBadge')}</Pill>}
            {product.badges.includes('kosher') && <Pill>{t('kosherBadge')}</Pill>}
            <Pill>{categoryLabels[product.category]?.[locale]}</Pill>
            {product.badges.includes('vegan') && <Pill>{t('veganBadge')}</Pill>}
            {product.badges.includes('seasonal') && (
              <Pill>{locale === 'ar' ? 'موسمي' : 'עונתי'}</Pill>
            )}
          </div>

          <h1
            className={`${displayFont} font-bold leading-[1.1] text-heading text-4xl md:text-5xl text-balance`}
          >
            {product.name[locale]}
          </h1>

          {/* Tasting note — italic gold-deep, the poetic line */}
          <p
            className="mt-4 text-[15px] md:text-base font-medium leading-[1.5] text-gold-deep text-pretty"
          >
            {product.tastingNote[locale]}
          </p>

          {/* Full description */}
          <p className="mt-6 text-base md:text-[17px] leading-relaxed text-ink/80 text-pretty">
            {product.description[locale]}
          </p>

          {/* Price */}
          <div className="mt-8 flex items-center gap-4">
            <span aria-hidden className="rule-diamond block w-16" />
            <p className={`${displayFont} text-2xl md:text-3xl text-gold-deep font-bold`}>
              {hasPrice ? (
                <>
                  ₪{product.price}
                  <span className="text-base text-coffee-muted font-normal"> {priceSuffix}</span>
                </>
              ) : locale === 'ar' ? (
                'السعر حسب الطلب'
              ) : (
                'מחיר לפי הזמנה'
              )}
            </p>
          </div>

          {/* Pack size — weight products are sold in whole-kilo packs */}
          {byKg && (
            <fieldset className="mt-8">
              <legend className="text-[13px] font-medium text-gold-deep mb-3">
                {locale === 'ar' ? 'حجم العلبة' : 'גודל המארז'}
              </legend>
              <div className="flex flex-wrap gap-2">
                {PACK_SIZES.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPackKg(n)}
                    aria-pressed={packKg === n}
                    className={`h-11 min-w-[4.5rem] px-4 border rounded-[2px] text-[15px] font-medium transition-colors duration-300 ${
                      packKg === n
                        ? 'bg-gold border-gold text-black'
                        : 'border-gold-deep/50 text-heading hover:border-gold'
                    }`}
                  >
                    {kgLabel(n)}
                  </button>
                ))}
              </div>
              {hasPrice && (
                <p className="mt-4 text-[15px] text-coffee-muted">
                  {locale === 'ar' ? 'المجموع: ' : 'סה״כ: '}
                  <span className={`${displayFont} text-xl font-bold text-gold`}>₪{product.price * packKg}</span>
                </p>
              )}
            </fieldset>
          )}

          {/* Order CTA — catalog site: orders go through WhatsApp */}
          <a
            href={whatsappLink(orderMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: 'primary', size: 'lg', className: 'w-full mt-8 h-14 text-[15px] normal-case tracking-normal' })}
          >
            <WhatsAppIcon />
            {locale === 'ar' ? 'للطلب عبر واتساب' : 'להזמנה בוואטסאפ'}
          </a>
          <a
            href="tel:+972525986266"
            className="mt-3 text-center text-sm text-coffee-muted hover:text-heading transition-colors duration-500"
          >
            {locale === 'ar' ? 'أو اتصلوا: ' : 'או בטלפון: '}
            <span dir="ltr" className="font-medium">052-5986266</span>
          </a>

          {/* Accordion */}
          <div className="mt-10 border-t border-hairline">
            {sections.map((section) => (
              <AccordionItem
                key={section.key}
                title={section.title}
                body={section.body}
                isOpen={openSection === section.key}
                onToggle={() =>
                  setOpenSection((c) => (c === section.key ? null : section.key))
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="relative bg-page py-12 md:py-20 border-t border-hairline/60">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <header className="flex flex-col items-center text-center mb-10 md:mb-12">
            <div className="flex items-center gap-5 text-gold-deep">
              <span aria-hidden className="block h-px w-12 bg-gold" />
              <span className="font-display-en text-[12px] tracking-eyebrow uppercase">
                {locale === 'ar' ? 'مقترحات' : 'מומלץ'}
              </span>
              <span aria-hidden className="block h-px w-12 bg-gold" />
            </div>
            <h2 className={`mt-6 ${displayFont} font-black text-3xl md:text-5xl text-heading tracking-display leading-[1.05] text-balance`}>
              {t('relatedHeading')}
            </h2>
          </header>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {related.map((p, idx) => (
              <MenuCard key={p.id} product={p} index={idx} />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

/* ── Monogram seal — the photo-less product identity ─────────────── */

function MonogramSeal({ product, label }: { product: Product; label: string }) {
  // Photo inside a keyhole arch on a sand stage, with a gold hairline
  // arch set just outside it. Falls back to the typographic seal.
  if (product.image) {
    return (
      <div className="relative mx-auto w-full max-w-[520px] bg-sand rounded-[4px] p-6 sm:p-10">
        <div className="relative">
          <span aria-hidden className="absolute -inset-2 sm:-inset-3 arch border border-gold/70 pointer-events-none" />
          <div className="relative aspect-[4/5] arch overflow-hidden bg-sand">
            <Image
              src={product.image}
              alt={product.name.he}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
              quality={85}
            />
          </div>
        </div>
        {label && (
          <p className="mt-5 text-center text-[13px] font-medium text-gold-deep">{label}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
      <div className="absolute inset-0 bg-cream-card border border-gold-deep/40 rounded-[2px] shadow-soft" />
      <span aria-hidden className="absolute inset-4 border border-gold/30 rounded-[2px] pointer-events-none" />
      <div className="absolute inset-12 flex items-center justify-center pointer-events-none">
        <Rosette />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <span className="font-display-en text-[10px] tracking-[0.4em] uppercase text-gold-deep/70">
          Maison Dalia · Est. 1985
        </span>
        <span className="mt-6 font-display-en text-[26px] md:text-[32px] tracking-[0.45em] text-gold uppercase">
          {product.monogram}
        </span>
        <span className="mt-6 block h-px w-16 bg-gold-deep/50" aria-hidden />
        <span className="mt-6 font-display-en text-[10px] tracking-[0.4em] uppercase text-gold-deep/70">
          {label}
        </span>
      </div>
    </div>
  );
}

function Rosette() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 240 240"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.7"
      className="text-gold-deep/30"
      aria-hidden
    >
      {/* Eight-pointed star */}
      <path d="M 120 20 L 145 95 L 220 95 L 160 140 L 185 215 L 120 170 L 55 215 L 80 140 L 20 95 L 95 95 Z" />
      <path d="M 120 50 L 138 100 L 190 100 L 148 132 L 165 185 L 120 154 L 75 185 L 92 132 L 50 100 L 102 100 Z" />
      <circle cx="120" cy="120" r="30" />
      <circle cx="120" cy="120" r="6" fill="currentColor" />
      <path d="M 120 90 L 120 150 M 90 120 L 150 120" opacity="0.4" />
    </svg>
  );
}

/* ── Accordion ────────────────────────────────────────────────────── */

function AccordionItem({
  title,
  body,
  isOpen,
  onToggle,
}: {
  title: string;
  body: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-hairline">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between py-5 text-start group"
      >
        <span className="text-[15px] font-medium text-heading group-hover:text-gold-deep transition-colors duration-500">
          {title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.5, ease: easeLuxe }}
          className="text-gold-deep"
          aria-hidden
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M 0 7 L 14 7 M 7 0 L 7 14" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.6, ease: easeLuxe }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-[15px] leading-relaxed text-ink/70 text-pretty">{body}</p>
      </motion.div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 h-7 inline-flex items-center text-[12px] font-medium border border-gold-deep/50 text-gold-deep rounded-full">
      {children}
    </span>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zm8.3-18.1C18.1 1.5 15.1.3 12 .3 5.5.3.3 5.5.3 12c0 2.1.5 4.1 1.6 5.9L.2 23.7l6-1.6c1.7.9 3.7 1.4 5.7 1.4 6.5 0 11.7-5.2 11.7-11.7 0-3.1-1.2-6.1-3.3-8.1z" />
    </svg>
  );
}
