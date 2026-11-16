'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { Link } from '@/i18n/navigation';
import { useProducts } from '@/lib/data/useProducts';
import { whatsappLink } from '@/lib/site';

const SIGNATURE = ['red-kanafeh', 'baklava-pistachio', 'bird-nest-baklava'];
const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * "The house signature" — three desserts the shop is known for. A large
 * macro photo on one side; on the reading side a numbered list. Choosing
 * a name swaps the photo and opens that dessert's story and order button.
 */
export function Signature() {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  const { products } = useProducts();
  const items = SIGNATURE.map((slug) => products.find((p) => p.slug === slug)).filter((p) => !!p);
  const [active, setActive] = useState(0);

  if (items.length === 0) return null;
  const current = items[Math.min(active, items.length - 1)];

  return (
    <section className="bg-page py-20 md:py-28" aria-labelledby="signature-heading">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Words — reading side */}
        <div className="order-2 lg:order-1 lg:col-span-5">
          <p className="text-sm font-medium text-gold-deep">{ar ? 'توقيع البيت' : 'החתימה של הבית'}</p>
          <h2 id="signature-heading" className={`${displayFont} mt-2 text-4xl md:text-[3.4rem] leading-[1.08] font-bold text-heading text-balance`}>
            {ar ? 'ثلاث حلويات، توقيع واحد' : 'שלושה מעדנים, חתימה אחת'}
          </h2>

          <ol className="mt-8 md:mt-10 border-t border-hairline">
            {items.map((p, i) => {
              const on = i === active;
              return (
                <li key={p.slug} className="border-b border-hairline">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    aria-expanded={on}
                    className="w-full flex items-baseline gap-4 py-5 text-start"
                  >
                    <span className={`text-sm tabular-nums transition-colors duration-500 ${on ? 'text-gold-deep' : 'text-coffee-muted/60'}`}>
                      0{i + 1}
                    </span>
                    <span className={`${displayFont} flex-1 text-2xl md:text-[2rem] font-bold leading-tight transition-colors duration-500 ${on ? 'text-heading' : 'text-coffee-muted/70 hover:text-heading'}`}>
                      {p.name[locale]}
                    </span>
                    <span className={`text-base font-semibold transition-colors duration-500 ${on ? 'text-heading' : 'text-coffee-muted/60'}`}>
                      ₪{p.price}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: easeLuxe }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 ps-9">
                          <p className="text-[15px] md:text-base leading-relaxed text-coffee text-pretty">{p.description[locale]}</p>
                          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                            <a
                              href={whatsappLink(ar ? `مرحباً، أود أن أطلب: ${p.name.ar}` : `שלום, אשמח להזמין: ${p.name.he}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center h-12 px-7 rounded-full bg-gold text-white text-[15px] font-semibold hover:bg-[#333D1C] transition-colors duration-300"
                            >
                              {ar ? 'للطلب عبر واتساب' : 'להזמנה בוואטסאפ'}
                            </a>
                            <Link href={`/shop/${p.slug}`} className="inline-flex items-center h-11 text-[15px] font-medium text-heading underline underline-offset-[6px] decoration-1 hover:no-underline">
                              {ar ? 'التفاصيل' : 'לפרטים ולמשקל'}
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Macro photo */}
        <div className="order-1 lg:order-2 lg:col-span-7">
          <div className="relative overflow-hidden rounded-[14px] bg-cedar aspect-[4/5] lg:aspect-auto lg:h-[min(84vh,820px)] shadow-[0_30px_70px_-35px_rgba(42,27,18,0.75)]">
            <AnimatePresence initial={false}>
              <motion.div
                key={current.slug}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: easeLuxe }}
                className="absolute inset-0"
              >
                <Image
                  src={`/images/signature/${current.slug}.webp`}
                  alt={current.name[locale]}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <span aria-hidden className={`${displayFont} pointer-events-none absolute bottom-3 end-5 text-[7rem] md:text-[10rem] leading-none font-bold text-white/85 mix-blend-overlay`}>
              0{Math.min(active, items.length - 1) + 1}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
