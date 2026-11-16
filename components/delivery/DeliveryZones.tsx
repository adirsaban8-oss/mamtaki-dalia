'use client';

import { useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { findPlace, zones, type ZoneId } from '@/lib/deliveryZones';
import { EVENTS_PHONE_DISPLAY, whatsappLink } from '@/lib/site';
import { Link } from '@/i18n/navigation';

/** Simplified outline of Israel north of Be'er Sheva (schematic only). */
const OUTLINE =
  'M170 57 L188 62 L244 51 L259 15 L272 22 L308 11 L319 55 L315 99 L291 136 L266 147 L257 165 L253 209 L253 275 L250 352 L238 418 L229 495 L206 539 L141 539 L47 539 L13 469 L34 425 L54 385 L66 370 L83 341 L94 312 L105 279 L113 253 L122 224 L128 198 L135 165 L143 132 L146 117 L156 108 L163 92 L167 77 Z';

/** Latitude bands (y range in the SVG) for each zone. */
const BANDS: Record<ZoneId | 'south', [number, number]> = {
  north: [0, 209],
  sharon: [209, 264],
  dan: [264, 297],
  center: [297, 374],
  south: [374, 540],
};

const LABEL_Y: Record<ZoneId | 'south', number> = {
  north: 120,
  sharon: 240,
  dan: 284,
  center: 340,
  south: 460,
};

/**
 * Delivery map + "do you deliver to me?" check. Served zones are drawn
 * in gold; the South (not served) is greyed out.
 */
export function DeliveryZones() {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const displayFont = ar ? 'font-display-ar' : 'font-display-he';
  const [query, setQuery] = useState('');
  const [hover, setHover] = useState<ZoneId | null>(null);

  const match = useMemo(() => findPlace(query), [query]);
  const active: ZoneId | null = match.kind === 'served' ? match.zone.id : hover;

  const allPlaces = useMemo(
    () => zones.flatMap((z) => z.places.map((p) => p[ar ? 1 : 0])),
    [ar]
  );

  return (
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      {/* Map */}
      <figure className="order-2 lg:order-1 lg:col-span-5 mx-auto w-full max-w-[360px]">
        <svg
          viewBox="0 0 330 545"
          role="img"
          aria-label={ar ? 'خريطة مناطق التوصيل' : 'מפת אזורי המשלוח'}
          className="w-full h-auto"
        >
          <defs>
            {(Object.keys(BANDS) as (ZoneId | 'south')[]).map((id) => (
              <clipPath key={id} id={`band-${id}`}>
                <rect x="0" y={BANDS[id][0]} width="330" height={BANDS[id][1] - BANDS[id][0]} />
              </clipPath>
            ))}
            <linearGradient id="south-fade" x1="0" y1="374" x2="0" y2="545" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#2B2218" />
              <stop offset="1" stopColor="#2B2218" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* South, not served */}
          <path d={OUTLINE} clipPath="url(#band-south)" fill="url(#south-fade)" />

          {zones.map((z) => (
            <path
              key={z.id}
              d={OUTLINE}
              clipPath={`url(#band-${z.id})`}
              fill="#FFC300"
              fillOpacity={active === z.id ? 0.95 : active ? 0.28 : 0.55}
              onMouseEnter={() => setHover(z.id)}
              onMouseLeave={() => setHover(null)}
              className="transition-[fill-opacity] duration-300 cursor-pointer"
            />
          ))}

          {/* Zone dividers */}
          {[209, 264, 297, 374].map((y) => (
            <line key={y} x1="0" x2="330" y1={y} y2={y} stroke="#0A0806" strokeWidth="2" />
          ))}
          <path d={OUTLINE} fill="none" stroke="#FFE27A" strokeOpacity="0.7" strokeWidth="1.2" />

          {/* Labels */}
          {zones.map((z) => (
            <text
              key={z.id}
              x={z.id === 'north' ? 225 : 190}
              y={LABEL_Y[z.id]}
              textAnchor="middle"
              className="pointer-events-none"
              fill="#0A0806"
              fontSize={z.id === 'dan' ? 15 : 18}
              fontWeight={700}
            >
              {z.name[locale]}
            </text>
          ))}
          <text x="150" y={LABEL_Y.south} textAnchor="middle" fill="#B9A98C" fontSize="15">
            {ar ? 'الجنوب، لا توصيل' : 'דרום, אין משלוחים'}
          </text>

          {/* Home base */}
          <circle cx="160" cy="165" r="5" fill="#0A0806" stroke="#FFE27A" strokeWidth="1.5" />
          <text x="170" y="169" textAnchor="end" fill="#000" fontSize="12" fontWeight={700}>
            {ar ? 'دالية الكرمل' : 'דלית אל כרמל'}
          </text>
        </svg>
        <figcaption className="mt-3 text-center text-xs text-coffee-muted">
          {ar ? 'الخريطة توضيحية' : 'המפה להמחשה בלבד'}
        </figcaption>
      </figure>

      {/* Check + zone list */}
      <div className="order-1 lg:order-2 lg:col-span-7">
        <label htmlFor="place" className={`${displayFont} block text-2xl md:text-3xl font-bold text-heading`}>
          {ar ? 'هل نصل إليكم؟' : 'האם אנחנו מגיעים אליכם?'}
        </label>
        <p className="mt-2 text-coffee-muted">
          {ar ? 'اكتبوا اسم البلدة:' : 'הקלידו את שם היישוב:'}
        </p>
        <input
          id="place"
          list="places"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={ar ? 'مثلاً: حيفا' : 'למשל: נתניה'}
          autoComplete="off"
          className="mt-4 w-full h-14 px-5 bg-cream-card border border-gold-deep/50 rounded-[2px] text-lg text-ivory placeholder:text-coffee-muted/60 focus:border-gold outline-none"
        />
        <datalist id="places">
          {allPlaces.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>

        <div aria-live="polite" className="min-h-[5.5rem] mt-4">
          {query.trim().length >= 2 && match.kind === 'served' && (
            <p className="p-4 border border-gold/60 bg-gold/10 rounded-[2px] text-ivory">
              <strong className="text-gold">{ar ? 'نعم! ' : 'כן! '}</strong>
              {ar
                ? `نوصل إلى ${match.place[1]}, منطقة ${match.zone.name.ar}.`
                : `אנחנו מגיעים ל${match.place[0]}, אזור ${match.zone.name.he}.`}
              {match.zone.days && <> {match.zone.days[locale]}</>}{' '}
              <Link href="/shop" className="text-gold font-bold underline underline-offset-4 whitespace-nowrap">
                {ar ? 'إلى الكتالوج' : 'לקטלוג המוצרים'}
              </Link>
            </p>
          )}
          {query.trim().length >= 2 && match.kind === 'south' && (
            <p className="p-4 border border-hairline rounded-[2px] text-coffee-muted">
              {ar
                ? `للأسف، لا نوصل حالياً إلى ${match.place[1]} (منطقة الجنوب).`
                : `מצטערים, כרגע אין משלוחים ל${match.place[0]} (אזור הדרום).`}
            </p>
          )}
          {query.trim().length >= 3 && match.kind === 'unknown' && (
            <p className="p-4 border border-hairline rounded-[2px] text-coffee-muted">
              {ar ? 'لم نجد البلدة في القائمة، ' : 'לא מצאנו את היישוב ברשימה, '}
              <a
                href={whatsappLink(ar ? `مرحباً، هل توصلون إلى ${query}?` : `שלום, האם יש משלוח ל${query}?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline underline-offset-4"
              >
                {ar ? 'اسألونا في واتساب' : 'שאלו אותנו בוואטסאפ'}
              </a>
            </p>
          )}
        </div>

        <ul className="mt-6 grid sm:grid-cols-2 gap-3">
          {zones.map((z) => (
            <li
              key={z.id}
              onMouseEnter={() => setHover(z.id)}
              onMouseLeave={() => setHover(null)}
              className={`p-4 border rounded-[2px] transition-colors duration-300 ${
                active === z.id ? 'border-gold bg-gold/10' : 'border-hairline'
              }`}
            >
              <p className={`${displayFont} text-lg font-bold text-heading`}>{z.name[locale]}</p>
              <p className="mt-1 text-sm text-coffee-muted">
                {z.days?.[locale] ?? (ar ? 'أيام التوصيل تُعلن قريباً' : 'ימי האספקה יפורסמו בקרוב')}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-coffee-muted leading-relaxed">
          {ar
            ? `للمناسبات والكميات الكبيرة اتصلوا: `
            : `לאירועים ולכמויות גדולות התקשרו: `}
          <a href="tel:+972543910078" className="text-gold font-medium" dir="ltr">
            {EVENTS_PHONE_DISPLAY}
          </a>
        </p>
      </div>
    </div>
  );
}
