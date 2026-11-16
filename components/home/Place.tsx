'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { whatsappLink } from '@/lib/site';

const WAZE = 'https://waze.com/ul?q=דליה%2010%20דלית%20אל%20כרמל';
const MAPS = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('דליה 10, דלית אל כרמל');

/**
 * The village and the Carmel, the shop's place, with verified facts only
 * (address, fresh baking, parking, kosher factory, delivery areas, hours),
 * and every way to reach it: Waze, Maps, call, WhatsApp.
 */
export function Place() {
  const locale = useLocale() as Locale;
  const f = useTranslations('Footer');
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';

  const facts = ar
    ? ['خَبز طازج كل يوم', 'موقف سيارات بجانب المحل', 'يُصنع في مصنع حاصل على شهادة كشروت', 'توصيل إلى الشمال والشارون وغوش دان والمركز']
    : ['אפייה טרייה מדי יום', 'חניה ליד החנות', 'מיוצר במפעל בעל תעודת כשרות', 'משלוחים לצפון, לשרון, לגוש דן ולמרכז'];

  const btn = 'inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full text-[15px] font-semibold transition-colors duration-300';

  return (
    <section id="story" className="relative bg-sand scroll-mt-20" aria-labelledby="place-heading">
      <div className="mx-auto max-w-[1440px] grid lg:grid-cols-2">
        <div className="relative min-h-[420px] lg:min-h-[640px]">
          <Image src="/images/story.webp" alt={ar ? 'من مطبخنا في دالية الكرمل' : 'מהמטבח שלנו בדלית אל כרמל'} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          <span aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_55%,rgba(10,8,6,0.6))]" />
        </div>
        <div className="px-6 sm:px-12 lg:px-16 py-14 lg:py-20 flex flex-col justify-center">
          <p className="text-sm font-semibold text-gold-deep">{ar ? 'القرية والكرمل' : 'הכפר והכרמל'}</p>
          <h2 id="place-heading" className={`${displayFont} text-gold-metal mt-2 text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-black`}>
            {ar ? 'شارع دالية 10، دالية الكرمل' : 'רחוב דליה 10, דלית אל כרמל'}
          </h2>
          <ul className="mt-8 space-y-3">
            {facts.map((x) => (
              <li key={x} className="flex items-center gap-3 text-lg text-cream">
                <span aria-hidden className="block w-1.5 h-1.5 rotate-45 bg-gold" />
                {x}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[15px] text-coffee-muted">{f('hoursValue')}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href={WAZE} target="_blank" rel="noopener noreferrer" className={`${btn} bg-gold text-[#0A0806] hover:bg-gold-light`}>Waze</a>
            <a href={MAPS} target="_blank" rel="noopener noreferrer" className={`${btn} border border-gold/60 text-gold hover:bg-gold/10`}>
              {ar ? 'خرائط Google' : 'Google Maps'}
            </a>
            <a href="tel:+972525986266" className={`${btn} border border-gold/60 text-gold hover:bg-gold/10`}>
              <bdi dir="ltr">052-5986266</bdi>
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={`${btn} border border-gold/60 text-gold hover:bg-gold/10`}>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
