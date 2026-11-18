'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { AddressParts } from '@/lib/address';

type Suggestion = { placeId: string; main: string; secondary: string; full: string };
export type PickedAddress = { placeId: string; en: AddressParts; local: AddressParts; complete: boolean };

const newToken = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

/**
 * One search box for the delivery address, powered by Google Places
 * (through our own /api/places routes, so the key stays on the server).
 * Hebrew, Arabic or English typing; Israel only. Picking a suggestion
 * fills the fields below it. Renders nothing when the service is off,
 * and the form simply keeps its manual fields.
 */
export function AddressSearch({ lang, inputClass, onPick }: { lang: 'he' | 'ar'; inputClass: string; onPick: (a: PickedAddress) => void }) {
  const ar = lang === 'ar';
  const [enabled, setEnabled] = useState(false);
  const [q, setQ] = useState('');
  const [list, setList] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const token = useRef<string>('');
  const reqNo = useRef(0);
  // The box shows the picked address afterwards; that is not a new search.
  const skip = useRef(false);
  const id = useId();

  useEffect(() => {
    let live = true;
    fetch('/api/places/autocomplete')
      .then((r) => r.json())
      .then((j: { enabled?: boolean }) => live && setEnabled(!!j.enabled))
      .catch(() => {});
    return () => { live = false; };
  }, []);

  // Ask Google after a short pause in typing, from the second letter.
  useEffect(() => {
    if (!enabled) return;
    if (skip.current) { skip.current = false; return; }
    const text = q.trim();
    if (text.length < 2) return;
    if (!token.current) token.current = newToken();
    const n = ++reqNo.current;
    const t = setTimeout(async () => {
      try {
        const r = await fetch('/api/places/autocomplete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: text, sessionToken: token.current, lang: /[a-z]/i.test(text) && !/[֐-ۿ]/.test(text) ? 'en' : lang }),
        });
        const j = (await r.json()) as { suggestions?: Suggestion[] };
        if (n !== reqNo.current) return;
        setList(j.suggestions ?? []);
        setActive(-1);
        setOpen(true);
        setNote(r.ok ? null : ar ? 'البحث غير متاح الآن، يمكن الكتابة يدويًا في الحقول أدناه.' : 'החיפוש לא זמין כרגע, אפשר למלא ידנית בשדות למטה.');
      } catch {
        if (n === reqNo.current) setNote(ar ? 'البحث غير متاح الآن، يمكن الكتابة يدويًا في الحقول أدناه.' : 'החיפוש לא זמין כרגע, אפשר למלא ידנית בשדות למטה.');
      }
    }, 260);
    return () => clearTimeout(t);
  }, [q, enabled, lang, ar]);

  const pick = async (s: Suggestion) => {
    setOpen(false);
    skip.current = true;
    reqNo.current += 1; // drop any answer still on its way
    setQ(s.full || `${s.main}, ${s.secondary}`);
    setBusy(true);
    try {
      const r = await fetch(`/api/places/details?id=${encodeURIComponent(s.placeId)}&session=${encodeURIComponent(token.current)}&lang=${lang}`);
      if (!r.ok) throw new Error(String(r.status));
      const d = (await r.json()) as PickedAddress;
      onPick(d);
      setNote(
        d.complete
          ? null
          : ar
            ? 'لم نجد رقم البيت في هذا العنوان. أكملوه في الحقول أدناه.'
            : 'לא מצאנו מספר בית בכתובת הזו. השלימו אותו בשדות למטה.'
      );
    } catch {
      setNote(ar ? 'تعذّر جلب تفاصيل العنوان، أكملوا الحقول يدويًا.' : 'לא הצלחנו להביא את פרטי הכתובת, השלימו את השדות ידנית.');
    } finally {
      token.current = ''; // the details call closes the session; the next search starts a new one
      setBusy(false);
    }
  };

  if (!enabled) return null;
  const listId = `${id}-list`;

  return (
    <div className="relative">
      <label className="block">
        <span className="block mb-1.5 font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
          {ar ? 'ابحثوا عن العنوان' : 'חיפוש כתובת'}
        </span>
        <input
          type="text"
          role="combobox"
          aria-expanded={open && list.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${id}-o${active}` : undefined}
          autoComplete="off"
          placeholder={ar ? 'الشارع ورقم البيت، المدينة' : 'רחוב ומספר בית, עיר'}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            if (e.target.value.trim().length < 2) { setList([]); setOpen(false); }
          }}
          onKeyDown={(e) => {
            if (!open || list.length === 0) return;
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % list.length); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a <= 0 ? list.length - 1 : a - 1)); }
            else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); pick(list[active]); }
            else if (e.key === 'Escape') setOpen(false);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onFocus={() => list.length > 0 && setOpen(true)}
          className={inputClass}
        />
      </label>
      {busy && <p className="mt-1.5 text-[13px] text-coffee-muted">{ar ? 'جارٍ تعبئة العنوان…' : 'ממלאים את הכתובת…'}</p>}
      {note && <p className="mt-1.5 text-[13px] text-burgundy" role="status">{note}</p>}
      {open && list.length > 0 && (
        <ul id={listId} role="listbox" className="absolute z-20 inset-x-0 mt-1 max-h-72 overflow-auto rounded-[10px] border border-gold/50 bg-[#0F0B08] shadow-xl">
          {list.map((s, i) => (
            <li
              key={s.placeId}
              id={`${id}-o${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); pick(s); }}
              className={`px-4 py-3 cursor-pointer border-b border-gold/10 last:border-0 ${i === active ? 'bg-gold/15' : 'hover:bg-gold/10'}`}
            >
              <span className="block text-[15px] text-cream">{s.main}</span>
              {s.secondary && <span className="block text-[13px] text-cream/55">{s.secondary}</span>}
            </li>
          ))}
          <li aria-hidden className="px-4 py-2 text-[11px] text-cream/40 text-end" dir="ltr">powered by Google</li>
        </ul>
      )}
    </div>
  );
}
