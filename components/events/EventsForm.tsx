'use client';

import { Link } from '@/i18n/navigation';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/locales';
import { buttonClasses } from '@/components/ui/Button';
import { EVENTS_PHONE_DISPLAY, eventsWhatsappLink } from '@/lib/site';

type Fields = {
  name: string;
  phone: string;
  eventType: string;
  date: string;
  guests: string;
  city: string;
  notes: string;
};

const EMPTY: Fields = { name: '', phone: '', eventType: '', date: '', guests: '', city: '', notes: '' };

/**
 * Quote request for events and large orders. There is no mail backend
 * yet, so submitting opens WhatsApp to the events line with the details
 * filled in — the customer just presses send.
 */
export function EventsForm() {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const [f, setF] = useState<Fields>(EMPTY);
  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  const L = ar
    ? {
        name: 'الاسم الكامل', phone: 'رقم الهاتف', eventType: 'نوع المناسبة', date: 'تاريخ المناسبة',
        guests: 'عدد الضيوف / الكمية التقريبية', city: 'البلدة', notes: 'ماذا تريدون أن نحضّر؟',
        submit: 'إرسال الطلب عبر واتساب', types: ['عرس', 'خطوبة', 'عيد ميلاد', 'مناسبة عمل', 'أخرى'],
        choose: 'اختاروا', intro: 'طلب عرض سعر للمناسبة',
      }
    : {
        name: 'שם מלא', phone: 'טלפון', eventType: 'סוג האירוע', date: 'תאריך האירוע',
        guests: 'מספר אורחים / כמות משוערת', city: 'יישוב', notes: 'מה תרצו שנכין?',
        submit: 'שליחת הבקשה בוואטסאפ', types: ['חתונה', 'אירוסין', 'יום הולדת', 'אירוע עסקי', 'אחר'],
        choose: 'בחרו', intro: 'בקשה להצעת מחיר לאירוע',
      };

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const lines = [
      `${L.intro}:`,
      `${L.name}: ${f.name}`,
      `${L.phone}: ${f.phone}`,
      f.eventType && `${L.eventType}: ${f.eventType}`,
      f.date && `${L.date}: ${f.date}`,
      f.guests && `${L.guests}: ${f.guests}`,
      f.city && `${L.city}: ${f.city}`,
      f.notes && `${L.notes} ${f.notes}`,
    ].filter(Boolean);
    window.open(eventsWhatsappLink(lines.join('\n')), '_blank', 'noopener,noreferrer');
  }

  const input =
    'mt-2 w-full h-12 px-4 bg-cream-card border border-gold-deep/40 rounded-[2px] text-ivory placeholder:text-coffee-muted/60 focus:border-gold outline-none';
  const label = 'block text-[14px] font-medium text-heading';

  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-5">
      <div>
        <label htmlFor="ev-name" className={label}>{L.name} *</label>
        <input id="ev-name" required value={f.name} onChange={set('name')} autoComplete="name" className={input} />
      </div>
      <div>
        <label htmlFor="ev-phone" className={label}>{L.phone} *</label>
        <input id="ev-phone" required type="tel" dir="ltr" value={f.phone} onChange={set('phone')} autoComplete="tel" className={`${input} text-end`} />
      </div>
      <div>
        <label htmlFor="ev-type" className={label}>{L.eventType}</label>
        <select id="ev-type" value={f.eventType} onChange={set('eventType')} className={input}>
          <option value="">{L.choose}</option>
          {L.types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="ev-date" className={label}>{L.date}</label>
        <input id="ev-date" type="date" value={f.date} onChange={set('date')} className={`${input} [color-scheme:dark]`} />
      </div>
      <div>
        <label htmlFor="ev-guests" className={label}>{L.guests}</label>
        <input id="ev-guests" value={f.guests} onChange={set('guests')} className={input} />
      </div>
      <div>
        <label htmlFor="ev-city" className={label}>{L.city}</label>
        <input id="ev-city" value={f.city} onChange={set('city')} autoComplete="address-level2" className={input} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="ev-notes" className={label}>{L.notes}</label>
        <textarea id="ev-notes" rows={4} value={f.notes} onChange={set('notes')} className={`${input} h-auto py-3 leading-relaxed`} />
      </div>
      <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4">
        <button type="submit" className={buttonClasses({ variant: 'gold', size: 'lg', className: 'normal-case tracking-normal text-[15px]' })}>
          {L.submit}
        </button>
        <a href="tel:+972543910078" className="text-sm text-coffee-muted hover:text-gold transition-colors">
          {ar ? 'أو اتصلوا: ' : 'או התקשרו: '}
          <span dir="ltr" className="font-medium text-gold">{EVENTS_PHONE_DISPLAY}</span>
        </a>
      </div>
      <p className="sm:col-span-2 text-xs text-coffee-muted leading-relaxed">
        {ar ? 'التفاصيل تُرسل عبر واتساب ولا تُحفظ في الموقع. ' : 'הפרטים נשלחים בוואטסאפ ואינם נשמרים באתר. '}
        <Link href="/privacy" className="text-gold underline underline-offset-4">
          {ar ? 'سياسة الخصوصية' : 'מדיניות הפרטיות'}
        </Link>
      </p>
    </form>
  );
}
