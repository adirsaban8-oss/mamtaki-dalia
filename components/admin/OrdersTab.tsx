'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { statusLabel, type OrderRecord, type OrderStatus } from '@/lib/orderStatus';
import { api, BTN, BTN_DANGER, BTN_PLAIN, BTN_PRIMARY, CARD, Confirm, dateTime, Notice, shekel } from './ui';

const COLOR: Record<OrderStatus, string> = {
  new: 'bg-[#C62828] text-white',
  preparing: 'bg-[#E65100] text-white',
  shipped: 'bg-[#1565C0] text-white',
  done: 'bg-[#1B5E20] text-white',
  cancelled: 'bg-[#5A5347] text-white',
};
const NEXT: Partial<Record<OrderStatus, OrderStatus>> = { new: 'preparing', preparing: 'shipped', shipped: 'done' };
const PREV: Partial<Record<OrderStatus, OrderStatus>> = { preparing: 'new', shipped: 'preparing', done: 'shipped', cancelled: 'new' };
const nextText = (o: OrderRecord) => (o.status === 'new' ? 'התחלנו להכין' : o.status === 'preparing' ? (o.fulfilment === 'pickup' ? 'מוכנה לאיסוף' : 'יצאה למשלוח') : 'נמסרה ללקוח');

/**
 * Orders, newest first. Each order shows who, what, where and when, its
 * step in a coloured label, and one big button for the next step. The
 * list refreshes by itself every 30 seconds.
 */
export function OrdersTab({ onNewCount, onSignedOut }: { onNewCount: (n: number) => void; onSignedOut: () => void }) {
  const [orders, setOrders] = useState<OrderRecord[] | null>(null);
  const [error, setError] = useState('');
  const [picked, setView] = useState<'open' | 'closed' | null>(null);
  const [cancel, setCancel] = useState<OrderRecord | null>(null);
  // The text message to the shop links here with ?o=REF.
  const [focus] = useState(() => (typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('o')?.toUpperCase() ?? ''));
  const scrolled = useRef(false);

  const load = useCallback(async () => {
    const r = await api<{ orders: OrderRecord[] }>('/api/admin/orders');
    if (r.status === 401) return onSignedOut();
    if (!r.ok || !r.data) return setError(r.message || '');
    setError('');
    setOrders(r.data.orders);
    onNewCount(r.data.orders.filter((o) => o.status === 'new').length);
  }, [onNewCount, onSignedOut]);

  useEffect(() => {
    const first = setTimeout(load, 0);
    const t = setInterval(load, 30_000);
    return () => { clearTimeout(first); clearInterval(t); };
  }, [load]);

  useEffect(() => {
    if (!focus || !orders || scrolled.current) return;
    const target = orders.find((o) => o.ref === focus);
    if (!target) return;
    scrolled.current = true;
    setTimeout(() => document.getElementById('order-' + focus)?.scrollIntoView({ block: 'start' }), 100);
  }, [focus, orders]);

  const setStatus = async (o: OrderRecord, status: OrderStatus) => {
    setOrders((list) => list?.map((x) => (x.ref === o.ref ? { ...x, status } : x)) ?? null);
    const r = await api('/api/admin/orders', { method: 'PATCH', body: { ref: o.ref, status } });
    if (!r.ok) setError(r.message || '');
    load();
  };

  if (orders === null) return <p className="text-xl">{error || 'טוען הזמנות…'}</p>;
  const open = orders.filter((o) => o.status !== 'done' && o.status !== 'cancelled');
  const closed = orders.filter((o) => o.status === 'done' || o.status === 'cancelled');
  // Until a list is chosen, show the one that holds the order the text message linked to.
  const view = picked ?? (closed.some((o) => o.ref === focus) ? 'closed' : 'open');
  const shown = view === 'open' ? open : closed;

  return (
    <section aria-label="הזמנות">
      {error && <div className="mb-4"><Notice kind="error">{error}</Notice></div>}
      <div className="grid grid-cols-2 gap-2 mb-5">
        <button type="button" onClick={() => setView('open')} aria-pressed={view === 'open'} className={`${BTN} ${view === 'open' ? 'bg-[#1B1712] text-white border-[#1B1712]' : BTN_PLAIN}`}>פתוחות ({open.length})</button>
        <button type="button" onClick={() => setView('closed')} aria-pressed={view === 'closed'} className={`${BTN} ${view === 'closed' ? 'bg-[#1B1712] text-white border-[#1B1712]' : BTN_PLAIN}`}>הסתיימו ({closed.length})</button>
      </div>

      {shown.length === 0 && <p className={`${CARD} p-8 text-center text-xl`}>{view === 'open' ? 'אין הזמנות פתוחות כרגע.' : 'עוד אין הזמנות שהסתיימו.'}</p>}

      <ul className="space-y-5">
        {shown.map((o) => {
          const pickup = o.fulfilment === 'pickup';
          const next = NEXT[o.status];
          const prev = PREV[o.status];
          return (
            <li key={o.ref} id={'order-' + o.ref} className={`${CARD} overflow-hidden scroll-mt-44 ${o.ref === focus ? 'ring-4 ring-[#1565C0]' : ''}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-3 bg-[#EFEADF] border-b-2 border-[#D9D2C3]">
                <p className="text-xl font-bold">הזמנה <bdi dir="ltr">#{o.ref}</bdi> <span className="font-normal text-[#5A5347]">· {dateTime(o.createdAt)}</span></p>
                <span className={`px-4 py-1.5 rounded-full text-lg font-bold ${COLOR[o.status]}`}>{statusLabel(o.status, pickup)}</span>
              </div>
              <div className="px-4 sm:px-6 py-4 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-2xl font-bold">{o.customer.name}</p>
                  <a href={`tel:${o.customer.phone}`} className="h-12 px-4 inline-flex items-center rounded-lg border-2 border-[#8A8273] text-xl font-bold hover:bg-[#EFEADF]" dir="ltr">{o.customer.phone}</a>
                  <a href={`https://wa.me/972${o.customer.phone.slice(1)}`} target="_blank" rel="noopener noreferrer" className="h-12 px-4 inline-flex items-center rounded-lg border-2 border-[#1B5E20] text-[#1B5E20] text-lg font-bold hover:bg-[#E8F5E9]">וואטסאפ ללקוח</a>
                </div>

                <table className="w-full text-xl">
                  <tbody>
                    {o.items.map((i) => (
                      <tr key={i.productId} className="border-b border-[#E5DFD2]">
                        <td className="py-2 font-semibold">{i.name}</td>
                        <td className="py-2 px-2 whitespace-nowrap font-bold"><bdi>{i.qtyLabel}</bdi></td>
                        <td className="py-2 text-left whitespace-nowrap" dir="ltr">{shekel(i.lineTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-lg">
                  <div>
                    <dt className="font-bold text-[#5A5347]">{pickup ? 'איסוף עצמי מהחנות' : 'משלוח לכתובת'}</dt>
                    <dd className="text-xl">
                      {pickup ? 'הלקוח יגיע לאסוף' : o.address}
                      {!pickup && (
                        <a href={`https://waze.com/ul?q=${encodeURIComponent(o.address)}`} target="_blank" rel="noopener noreferrer" className="ms-3 underline font-semibold text-[#1565C0]">פתיחה ב-Waze</a>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-[#5A5347]">מועד מבוקש</dt>
                    <dd className="text-xl"><bdi dir="ltr">{o.date.split('-').reverse().join('.')}</bdi> · {o.window}</dd>
                  </div>
                  {o.notes && (
                    <div className="sm:col-span-2">
                      <dt className="font-bold text-[#5A5347]">הערות הלקוח</dt>
                      <dd className="text-xl p-3 rounded-lg bg-[#FFF8E1] border-2 border-[#F0C36D]">{o.notes}</dd>
                    </div>
                  )}
                </dl>

                <p className="text-2xl font-bold">
                  לתשלום: <bdi dir="ltr">{shekel(o.total)}</bdi>
                  <span className="text-lg font-normal text-[#5A5347]"> · {o.payment}{o.shipping > 0 ? ` · כולל משלוח ${shekel(o.shipping)}` : ''}</span>
                </p>

                <div className="flex flex-wrap gap-3 pt-1">
                  {next && (
                    <button type="button" onClick={() => setStatus(o, next)} className={`${BTN} ${BTN_PRIMARY} flex-1 min-w-56`}>
                      ✓ {nextText(o)}
                    </button>
                  )}
                  {prev && (
                    <button type="button" onClick={() => setStatus(o, prev)} className={`${BTN} ${BTN_PLAIN} text-lg`}>
                      {o.status === 'cancelled' ? 'החזרת ההזמנה' : 'חזרה שלב אחד'}
                    </button>
                  )}
                  {o.status !== 'cancelled' && o.status !== 'done' && (
                    <button type="button" onClick={() => setCancel(o)} className={`${BTN} ${BTN_DANGER} text-lg`}>ביטול הזמנה</button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {cancel && (
        <Confirm
          title={`לבטל את הזמנה #${cancel.ref}?`}
          text={`${cancel.customer.name}, ${shekel(cancel.total)}.\nהלקוח לא מקבל הודעה אוטומטית. כדאי להתקשר אליו.`}
          yes="כן, לבטל"
          danger
          onNo={() => setCancel(null)}
          onYes={() => { setStatus(cancel, 'cancelled'); setCancel(null); }}
        />
      )}
    </section>
  );
}
