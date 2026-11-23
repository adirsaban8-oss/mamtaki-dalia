'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, BTN, BTN_PRIMARY, CARD, Confirm, dateTime, INPUT, Notice, shekel } from './ui';

type Customer = { phone: string; name: string; marketing: boolean; since: string; orders: number; spent: number };
type Data = { customers: Customer[]; broadcasts: { body: string; recipients: number; created_at: string }[] };

/**
 * Registered customers, and a box for sending one text message (a sale, a
 * holiday greeting) to those of them who agreed to receive messages.
 */
export function CustomersTab({ smsOn, onSignedOut }: { smsOn: boolean; onSignedOut: () => void }) {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState('');

  const load = useCallback(async () => {
    const r = await api<Data>('/api/admin/customers');
    if (r.status === 401) return onSignedOut();
    if (!r.ok || !r.data) return setError(r.message || '');
    setData(r.data);
  }, [onSignedOut]);
  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  if (data === null) return <p className="text-xl">{error || 'טוען לקוחות…'}</p>;
  const agreed = data.customers.filter((c) => c.marketing).length;
  const body = text.trim();
  const valid = body.length >= 5 && body.length <= 400;

  const send = async () => {
    setBusy(true);
    setError('');
    const r = await api<{ recipients: number }>('/api/admin/broadcast', { method: 'POST', body: { body, expect: agreed } });
    setBusy(false);
    setConfirm(false);
    if (r.ok && r.data) {
      setSent(`ההודעה נשלחה ל-${r.data.recipients} לקוחות.`);
      setText('');
    } else setError(r.message || '');
    load();
  };

  return (
    <section aria-label="לקוחות והודעות" className="space-y-8">
      <div className="grid grid-cols-2 gap-3">
        <div className={`${CARD} p-5 text-center`}>
          <p className="text-4xl font-bold" dir="ltr">{data.customers.length}</p>
          <p className="text-lg">לקוחות רשומים</p>
        </div>
        <div className={`${CARD} p-5 text-center`}>
          <p className="text-4xl font-bold" dir="ltr">{agreed}</p>
          <p className="text-lg">הסכימו לקבל הודעות</p>
        </div>
      </div>

      <div className={`${CARD} p-4 sm:p-6`}>
        <h2 className="text-2xl font-bold">שליחת הודעה ללקוחות</h2>
        <p className="mt-1 text-lg text-[#5A5347]">ההודעה נשלחת ב-SMS רק ללקוחות שהסכימו לקבל הודעות. בסוף כל הודעה מתווסף קישור להסרה.</p>
        <label className="block mt-4">
          <span className="block mb-2 text-xl font-semibold">מה לכתוב בהודעה</span>
          <textarea rows={4} maxLength={400} value={text} onChange={(e) => { setText(e.target.value); setSent(''); }} placeholder="למשל: מבצע לסוף השבוע, 10% הנחה על כל מגשי הבקלאווה. ממתקי דלית אל כרמל" className={`${INPUT} py-3`} />
        </label>
        <p className="mt-1 text-base text-[#5A5347]">{body.length} מתוך 400 תווים. הודעה ארוכה נספרת אצל ספק ה-SMS כמה הודעות.</p>
        <div className="mt-4 space-y-3" aria-live="polite">
          {sent && <Notice kind="ok">✓ {sent}</Notice>}
          {error && <Notice kind="error">{error}</Notice>}
          {!smsOn && <Notice kind="error">שירות ה-SMS לא מחובר, אי אפשר לשלוח.</Notice>}
        </div>
        <button type="button" disabled={!valid || agreed === 0 || !smsOn} onClick={() => setConfirm(true)} className={`${BTN} ${BTN_PRIMARY} w-full mt-4`}>
          {agreed === 0 ? 'אין עדיין למי לשלוח' : `שליחה ל-${agreed} לקוחות`}
        </button>
      </div>

      {data.broadcasts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-3">הודעות שנשלחו</h2>
          <ul className="space-y-3">
            {data.broadcasts.map((b, i) => (
              <li key={i} className={`${CARD} p-4`}>
                <p className="text-base text-[#5A5347]">{dateTime(b.created_at)} · נשלחה ל-{b.recipients} לקוחות</p>
                <p className="mt-1 text-xl whitespace-pre-line">{b.body}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-3">רשימת הלקוחות</h2>
        {data.customers.length === 0 ? (
          <p className={`${CARD} p-6 text-xl text-center`}>עוד אין לקוחות רשומים. לקוח נרשם כשהוא מזמין באתר בפעם הראשונה.</p>
        ) : (
          <ul className="space-y-2">
            {data.customers.map((c) => (
              <li key={c.phone} className={`${CARD} p-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1`}>
                <div>
                  <p className="text-xl font-bold">{c.name}</p>
                  <a href={`tel:${c.phone}`} className="text-xl underline" dir="ltr">{c.phone}</a>
                </div>
                <div className="text-lg text-left">
                  <p>{c.orders} הזמנות · <bdi dir="ltr">{shekel(c.spent)}</bdi></p>
                  <p className={c.marketing ? 'font-bold text-[#1B5E20]' : 'text-[#5A5347]'}>{c.marketing ? '✓ מקבל הודעות' : 'לא מקבל הודעות'}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {confirm && <Confirm title={`לשלוח את ההודעה ל-${agreed} לקוחות?`} text={`"${body}"\n\nאי אפשר לבטל אחרי השליחה.`} yes="כן, לשלוח" busy={busy} onNo={() => setConfirm(false)} onYes={send} />}
    </section>
  );
}
