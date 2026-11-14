'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { buttonClasses } from '@/components/ui/Button';
import { whatsappLink } from '@/lib/site';
import { Link } from '@/i18n/navigation';

/**
 * Closing call-to-action for the catalog: order by WhatsApp or phone.
 * Ink field with the khatam tile, gold hairlines top and bottom.
 */
export function OrderBand() {
  const locale = useLocale() as Locale;
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';
  const ar = locale === 'ar';

  return (
    <section className="relative isolate overflow-hidden bg-cedar text-ivory py-20 md:py-32">
      {/* The shop's own tartlets in the branded box, under a deep scrim */}
      <Image
        src="/images/order-band.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/70 to-black/85" />
      <div aria-hidden className="absolute inset-0 -z-10 pattern-khatam opacity-[0.06]" />
      <span aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="mx-auto max-w-3xl px-5 flex flex-col items-center text-center">
        <span className="text-[13px] font-medium text-gold-light">
          {ar ? 'لكل مناسبة' : 'לכל אירוע ושמחה'}
        </span>
        <h2 className={`mt-3 ${displayFont} font-bold text-3xl md:text-5xl leading-[1.1] text-balance`}>
          {ar ? 'نحضّر طلبكم طازجاً' : 'נכין לכם את ההזמנה טרייה'}
        </h2>
        <p className="mt-5 text-base md:text-lg text-ivory/80 leading-relaxed text-pretty">
          {ar
            ? 'صواني للضيافة، كنافة ساخنة وكعكات حسب الطلب — راسلونا وسنعود إليكم بسرعة.'
            : 'מגשי אירוח, כנאפה חמה ועוגות בהזמנה אישית — כתבו לנו ונחזור אליכם במהירות.'}
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-sm sm:max-w-none sm:w-auto">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: 'gold', size: 'lg', className: 'normal-case tracking-normal text-[15px]' })}
          >
            {ar ? 'راسلونا على واتساب' : 'כתבו לנו בוואטסאפ'}
          </a>
          <a
            href="tel:+972525986266"
            className={buttonClasses({ variant: 'outline', size: 'lg', className: 'normal-case tracking-normal text-[15px]' })}
          >
            <span dir="ltr">052-5986266</span>
          </a>
          <Link
            href="/events"
            className={buttonClasses({ variant: 'outline', size: 'lg', className: 'normal-case tracking-normal text-[15px]' })}
          >
            {ar ? 'طلب عرض سعر لمناسبة' : 'הצעת מחיר לאירוע'}
          </Link>
        </div>
      </div>
    </section>
  );
}
