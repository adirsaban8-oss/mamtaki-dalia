'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { whatsappLink } from '@/lib/site';
import { Link } from '@/i18n/navigation';

/**
 * Closing banner: one of the shop's own photos under a soft grey veil,
 * a single large word and an outlined button to the events form.
 */
export function OrderBand() {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';

  return (
    <section className="relative isolate overflow-hidden bg-[#15100B] text-white">
      <Image src="/images/order-band.webp" alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[#0A0806]/60" />
      <div className="mx-auto max-w-3xl px-5 py-28 md:py-52 flex flex-col items-center text-center">
        <p className="text-[15px] font-medium">
          {ar ? 'مناسبات خاصة حسب الطلب' : 'אירועים פרטיים בהזמנה אישית'}
        </p>
        <h2 className="mt-2 text-6xl md:text-8xl leading-[1] !font-medium !tracking-normal">
          {ar ? 'مناسبات' : 'אירועים'}
        </h2>
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
          <Link
            href="/events"
            className="inline-flex items-center justify-center h-14 px-7 border border-white text-[17px] font-medium hover:bg-white hover:text-black transition-colors duration-300"
          >
            {ar ? 'طلب عرض سعر' : 'לקבלת הצעת מחיר'}
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-14 px-7 border border-white/0 text-[17px] font-medium underline underline-offset-[6px] hover:no-underline"
          >
            {ar ? 'راسلونا على واتساب' : 'כתבו לנו בוואטסאפ'}
          </a>
        </div>
      </div>
    </section>
  );
}
