'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { FAQ, matchFaq, type FaqItem } from '@/lib/faq';
import { whatsappLink } from '@/lib/site';

type Msg = { from: 'me'; text: string } | { from: 'bot'; text: string; item?: FaqItem; more?: FaqItem[]; unknown?: boolean };

const STARTERS = ['order', 'delivery', 'hours', 'kosher', 'who'];

/**
 * The answer bot: a small sweet in the corner that opens a chat window.
 * It answers only from the approved list in lib/faq.ts (word matching,
 * no AI), so it cannot make an answer up. When nothing matches it says
 * so and offers WhatsApp and the phone.
 */
export function FaqBot() {
  const locale = useLocale() as Locale;
  const ar = locale === 'ar';
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const end = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    end.current?.scrollIntoView({ block: 'end' });
  }, [msgs, open]);
  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  if (pathname.startsWith('/admin') || pathname.startsWith('/checkout')) return null;

  const answer = (item: FaqItem, more: FaqItem[] = []): Msg => ({ from: 'bot', text: item.a[locale], item, more });
  const ask = (question: string) => {
    const q = question.trim();
    if (!q) return;
    const found = matchFaq(q);
    const reply: Msg = found.length
      ? answer(found[0], found.slice(1))
      : { from: 'bot', unknown: true, text: ar ? 'لا أملك جوابًا مؤكدًا على هذا. يمكن أن تسألوا المحل مباشرة:' : 'אין לי תשובה בטוחה על זה. אפשר לשאול את החנות ישירות:' };
    setMsgs((m) => [...m, { from: 'me', text: q }, reply]);
    setText('');
  };
  const pick = (item: FaqItem) => setMsgs((m) => [...m, { from: 'me', text: item.q[locale] }, answer(item)]);

  const chip = 'text-start px-3.5 py-2 rounded-full border border-gold/50 text-gold-light text-[15px] hover:bg-gold/10 transition-colors';
  const label = ar ? 'أسئلة وأجوبة' : 'שאלות ותשובות';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? (ar ? 'إغلاق الأسئلة والأجوبة' : 'סגירת שאלות ותשובות') : ar ? 'افتحوا الأسئلة والأجوبة' : 'פתיחת שאלות ותשובות'}
        aria-expanded={open}
        className="fixed start-4 bottom-20 lg:bottom-4 z-[55] w-14 h-14 rounded-full bg-gold-metal text-[#0A0806] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.8)] inline-flex items-center justify-center hover:scale-105 transition-transform duration-300"
      >
        {open ? <CloseIcon /> : <SweetIcon />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={label}
          className="fixed z-[60] start-3 end-3 sm:end-auto sm:start-4 sm:w-[380px] bottom-[9.5rem] lg:bottom-[5.5rem] max-h-[min(70vh,560px)] flex flex-col rounded-[18px] border border-gold/50 bg-[#0F0B08] text-cream shadow-[0_24px_60px_-12px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gold/25 bg-[#15100B]">
            <span className="w-9 h-9 rounded-full bg-gold-metal text-[#0A0806] inline-flex items-center justify-center shrink-0"><SweetIcon small /></span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-gold-light leading-tight">{label}</p>
              <p className="text-[13px] text-cream/60 leading-tight">{ar ? 'حلويات دالية الكرمل · أبو حسن' : 'ממתקי דלית אל כרמל · אבו חסן'}</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label={ar ? 'إغلاق' : 'סגירה'} className="w-10 h-10 rounded-full text-gold hover:bg-gold/10 inline-flex items-center justify-center">
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" aria-live="polite">
            <Bubble bot>{ar ? 'أهلًا! اسألوني عن الكنافة، البقلاوة، التوصيل أو ساعات العمل.' : 'שלום! אפשר לשאול אותי על הכנאפה, הבקלאווה, המשלוחים או שעות הפתיחה.'}</Bubble>
            {msgs.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {STARTERS.map((id) => FAQ.find((f) => f.id === id)!).map((f) => (
                  <button key={f.id} type="button" onClick={() => pick(f)} className={chip}>{f.q[locale]}</button>
                ))}
              </div>
            )}
            {msgs.map((m, i) =>
              m.from === 'me' ? (
                <Bubble key={i}>{m.text}</Bubble>
              ) : (
                <div key={i} className="space-y-2">
                  <Bubble bot>
                    {m.text}
                    {m.item?.link && (
                      <Link href={m.item.link.href} onClick={() => setOpen(false)} className="block mt-2 font-semibold text-gold underline underline-offset-4">
                        {m.item.link[locale]}
                      </Link>
                    )}
                    {m.unknown && (
                      <span className="mt-3 flex flex-wrap gap-2">
                        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center h-10 px-4 rounded-full bg-gold-metal text-[#0A0806] text-[15px] font-bold">WhatsApp</a>
                        <a href="tel:+972525986266" className="inline-flex items-center h-10 px-4 rounded-full border border-gold/60 text-gold text-[15px] font-semibold"><bdi dir="ltr">052-5986266</bdi></a>
                      </span>
                    )}
                  </Bubble>
                  {m.more && m.more.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {m.more.map((f) => (
                        <button key={f.id} type="button" onClick={() => pick(f)} className={chip}>{f.q[locale]}</button>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
            <div ref={end} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); ask(text); }} className="flex items-center gap-2 p-3 border-t border-gold/25 bg-[#15100B]">
            <label className="flex-1">
              <span className="sr-only">{ar ? 'اكتبوا سؤالًا' : 'כתבו שאלה'}</span>
              <input ref={input} type="text" value={text} onChange={(e) => setText(e.target.value)} maxLength={200} placeholder={ar ? 'اكتبوا سؤالًا…' : 'כתבו שאלה…'} className="w-full h-12 px-4 rounded-full bg-[#0A0806] border border-gold/40 text-cream text-base placeholder:text-cream/40 focus:outline-none focus:border-gold" />
            </label>
            <button type="submit" disabled={!text.trim()} aria-label={ar ? 'إرسال' : 'שליחה'} className="w-12 h-12 shrink-0 rounded-full bg-gold-metal text-[#0A0806] inline-flex items-center justify-center disabled:opacity-40">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="rtl:-scale-x-100"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </form>
          <Link href="/faq" onClick={() => setOpen(false)} className="block text-center text-[13px] text-cream/60 hover:text-gold py-2 bg-[#15100B]">
            {ar ? 'كل الأسئلة والأجوبة' : 'לכל השאלות והתשובות'}
          </Link>
        </div>
      )}
    </>
  );
}

function Bubble({ bot = false, children }: { bot?: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex ${bot ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[88%] px-4 py-2.5 rounded-2xl text-[16px] leading-[1.6] ${bot ? 'bg-[#1C150E] border border-gold/25 text-cream/95 rounded-ss-sm' : 'bg-gold-metal text-[#0A0806] font-medium rounded-se-sm'}`}>{children}</div>
    </div>
  );
}

/** A small wrapped sweet: a round candy with a twist of paper on each side. */
function SweetIcon({ small = false }: { small?: boolean }) {
  const s = small ? 22 : 36;
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M9.5 16 3 10.5c-.7-.6-.3-1.7.6-1.7H7l.3-3.2c.1-.9 1.2-1.3 1.8-.6l4 4.6" fill="currentColor" fillOpacity=".55" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M22.5 16 29 21.5c.7.6.3 1.7-.6 1.7H25l-.3 3.2c-.1.9-1.2 1.3-1.8.6l-4-4.6" fill="currentColor" fillOpacity=".55" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="16" cy="16" r="7.2" fill="currentColor" />
      <path d="M12.2 13.4c1.6-2 4.6-2.6 6.8-1.2M11.6 17.2c2.2 2.9 6.3 3.3 8.8.8" stroke="#F7DC93" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
