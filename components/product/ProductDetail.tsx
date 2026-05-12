'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { products, type Product } from '@/lib/mockData';
import { useCart } from '@/store/cart';
import { Link } from '@/i18n/navigation';
import { WeightSelector } from './WeightSelector';
import { ProductCard } from './ProductCard';
import { buttonClasses } from '@/components/ui/Button';
import { ArabesquePattern } from '@/components/ornaments/ArabesquePattern';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

type Props = { product: Product; locale: Locale };

export function ProductDetail({ product, locale }: Props) {
  const t = useTranslations('Product');
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  const [weight, setWeight] = useState(product.minWeight);
  const [activeImage, setActiveImage] = useState(product.image);
  const [openSection, setOpenSection] = useState<string | null>('ingredients');

  const add = useCart((s) => s.add);

  const total = useMemo(() => product.pricePerKg * weight, [product.pricePerKg, weight]);

  const related = useMemo(
    () =>
      products
        .filter((p) => p.id !== product.id && (p.category === product.category || p.badges.includes('bestseller')))
        .slice(0, 4),
    [product]
  );

  const gallery = product.gallery.length > 0 ? product.gallery : [product.image];

  const sections = [
    { key: 'ingredients', title: t('ingredients'), body: product.ingredients[locale] },
    { key: 'allergens', title: t('allergens'), body: t('allergensBody') },
    { key: 'storage', title: t('storage'), body: t('storageBody') },
    { key: 'prepTime', title: t('prepTime'), body: t('prepTimeBody') },
  ] as const;

  return (
    <article className="relative bg-ivory">
      {/* Decorative top-end arabesque */}
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
              {locale === 'ar' ? 'المتجر' : 'החנות'}
            </Link>
          </li>
          <li aria-hidden>·</li>
          <li className="text-cedar">{product.name[locale]}</li>
        </ol>
      </nav>

      {/* Hero — 2 column desktop */}
      <div className="relative mx-auto max-w-7xl px-5 md:px-10 pt-10 md:pt-14 pb-16 md:pb-24 grid lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="lg:col-span-7 order-1">
          <Gallery
            images={gallery}
            activeImage={activeImage}
            onSelect={setActiveImage}
            alt={product.name[locale]}
          />
        </div>

        {/* Details panel */}
        <div className="lg:col-span-5 order-2 flex flex-col">
          {/* Badges row */}
          <div className="flex flex-wrap gap-2 mb-5">
            {product.badges.includes('bestseller') && (
              <Pill>{t('bestsellerBadge')}</Pill>
            )}
            {product.badges.includes('kosher') && <Pill>{t('kosherBadge')}</Pill>}
            <Pill>{t('freshBadge')}</Pill>
            {product.badges.includes('vegan') && <Pill>{t('veganBadge')}</Pill>}
          </div>

          <h1
            className={`${displayFont} font-black tracking-display leading-[1.05] text-cedar text-4xl md:text-5xl text-balance`}
          >
            {product.name[locale]}
          </h1>

          <p className="mt-5 text-base md:text-lg leading-relaxed text-coffee-muted text-pretty">
            {product.shortDescription[locale]}
          </p>

          {/* Price per kg */}
          <div className="mt-8 flex items-baseline gap-3">
            <span className="font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
              {t('priceKgNote')}
            </span>
            <span className={`${displayFont} text-2xl text-burgundy font-medium`}>
              ₪{product.pricePerKg}
            </span>
          </div>

          <span aria-hidden className="block h-px w-full bg-hairline mt-8 mb-8" />

          {/* Weight selector */}
          <WeightSelector
            weight={weight}
            onChange={setWeight}
            min={product.minWeight}
            max={5}
            step={product.weightStep}
          />

          {/* Live total */}
          <div className="mt-8 flex items-baseline justify-between">
            <div>
              <p className="font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
                {t('totalLabel')}
              </p>
              <p className="font-display-en text-[10px] tracking-eyebrow uppercase text-coffee-muted/70 mt-1">
                {t('totalNote')}
              </p>
            </div>
            <motion.span
              key={total}
              initial={{ scale: 1.08, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: easeLuxe }}
              className={`${displayFont} font-black text-4xl text-burgundy tabular-nums`}
            >
              ₪{total.toFixed(0)}
            </motion.span>
          </div>

          {/* Add to cart */}
          <button
            type="button"
            onClick={() => add(product.id, weight)}
            className={buttonClasses({ variant: 'primary', size: 'lg', className: 'w-full mt-8 h-16' })}
          >
            {t('addToCart')}
            <CartBagIcon />
          </button>

          {/* Freshness note */}
          <p className="mt-6 font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted text-center">
            {t('freshness', { hours: product.freshnessHours })}
          </p>

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

      {/* Story block — colored panel with product narrative */}
      <section className="relative bg-sand py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-10">
          <div className="flex items-center justify-center gap-5 text-gold-deep">
            <span aria-hidden className="block h-px w-12 bg-gold" />
            <span className="font-display-en text-[12px] tracking-eyebrow uppercase">
              {locale === 'ar' ? 'القصة' : 'הסיפור'}
            </span>
            <span aria-hidden className="block h-px w-12 bg-gold" />
          </div>
          <p className={`mt-8 ${displayFont} text-xl md:text-2xl leading-[1.55] text-cedar text-pretty text-center`}>
            {product.description[locale]}
          </p>
        </div>
      </section>

      {/* Related products */}
      <section className="relative bg-ivory py-16 md:py-[120px]">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <header className="flex flex-col items-center text-center mb-12 md:mb-16">
            <div className="flex items-center gap-5 text-gold-deep">
              <span aria-hidden className="block h-px w-12 bg-gold" />
              <span className="font-display-en text-[12px] tracking-eyebrow uppercase">
                {locale === 'ar' ? 'مقترحات' : 'מומלץ'}
              </span>
              <span aria-hidden className="block h-px w-12 bg-gold" />
            </div>
            <h2 className={`mt-6 ${displayFont} font-black text-3xl md:text-5xl text-cedar tracking-display leading-[1.05] text-balance`}>
              {t('relatedHeading')}
            </h2>
          </header>

          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {related.map((p, idx) => (
              <ProductCard key={p.id} product={p} index={idx} />
            ))}
          </div>
          <div className="md:hidden -mx-5 px-5 overflow-x-auto snap-x snap-mandatory flex gap-5 pb-4 scrollbar-hide">
            {related.map((p, idx) => (
              <div key={p.id} className="snap-start shrink-0 w-[82%]">
                <ProductCard product={p} index={idx} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

/* ── Gallery ──────────────────────────────────────────────────────── */

function Gallery({
  images,
  activeImage,
  onSelect,
  alt,
}: {
  images: string[];
  activeImage: string;
  onSelect: (src: string) => void;
  alt: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden bg-cream-card border border-hairline shadow-card rounded-[2px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: easeLuxe }}
            className="absolute inset-0"
          >
            <Image
              src={activeImage}
              alt={alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="object-cover"
              quality={85}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbs */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((src, idx) => {
            const active = src === activeImage;
            return (
              <button
                key={`${src}-${idx}`}
                type="button"
                onClick={() => onSelect(src)}
                aria-label={`Image ${idx + 1}`}
                className={`relative aspect-square overflow-hidden bg-cream-card border transition-colors duration-500 rounded-[2px] ${active ? 'border-gold' : 'border-hairline hover:border-gold-deep'}`}
              >
                <Image src={src} alt="" fill sizes="(min-width: 1024px) 12vw, 25vw" className="object-cover" />
                {active && (
                  <span aria-hidden className="absolute inset-0 border-2 border-gold pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
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
        <span className="font-display-en text-[12px] tracking-eyebrow uppercase text-cedar group-hover:text-burgundy transition-colors duration-500">
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
        <p className="pb-5 text-[15px] leading-relaxed text-coffee-muted text-pretty">
          {body}
        </p>
      </motion.div>
    </div>
  );
}

/* ── Pill / icons ─────────────────────────────────────────────────── */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 h-7 inline-flex items-center font-display-en text-[11px] tracking-eyebrow uppercase border border-gold-deep/60 text-gold-deep rounded-[2px]">
      {children}
    </span>
  );
}

function CartBagIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M 3 5 L 13 5 L 12 14 L 4 14 Z" />
      <path d="M 5 5 L 5 3 a 3 3 0 0 1 6 0 L 11 5" />
    </svg>
  );
}
