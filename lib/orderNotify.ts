/**
 * The guest order path, used only while the site has no database: the
 * browser sends the finished order and it is passed on to the shop as text
 * (SMS, or WhatsApp from the success page). With a database the order goes
 * through lib/server/orders.ts instead, where the server prices it.
 */
export type OrderPayload = {
  name: string;
  phone: string;
  items: { name: string; qty: string; total: number }[];
  fulfilment: 'delivery' | 'pickup';
  address: string;
  addressEn?: string;
  date: string;
  window: string;
  notes?: string;
  shipping: number;
  total: number;
  payment: string;
};

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f]+/g, ' ').trim().slice(0, max) : '');
const money = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 && v < 100000 ? Math.round(v) : null);

/** Checks and trims what the browser sent; null when it is not a usable order. */
export function parseOrder(raw: unknown): OrderPayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const name = clean(o.name, 60);
  const phone = clean(o.phone, 20);
  const total = money(o.total);
  const shipping = money(o.shipping);
  if (!name || !/^[\d+\-() ]{9,20}$/.test(phone) || total === null || shipping === null) return null;
  if (!Array.isArray(o.items) || o.items.length === 0 || o.items.length > 30) return null;
  const items: OrderPayload['items'] = [];
  for (const it of o.items) {
    const i = it as Record<string, unknown>;
    const t = money(i?.total);
    const n = clean(i?.name, 60);
    if (!n || t === null) return null;
    items.push({ name: n, qty: clean(i.qty, 20), total: t });
  }
  const fulfilment = o.fulfilment === 'pickup' ? 'pickup' : 'delivery';
  const address = clean(o.address, 160);
  if (fulfilment === 'delivery' && !address) return null;
  return { name, phone, items, fulfilment, address, addressEn: clean(o.addressEn, 160) || undefined, date: clean(o.date, 10), window: clean(o.window, 30), notes: clean(o.notes, 200) || undefined, shipping, total, payment: clean(o.payment, 30) };
}

/** The order as one message, for the SMS and for the WhatsApp fallback. Hebrew: the shop reads Hebrew. */
export function orderText(o: OrderPayload, ref: string): string {
  return [
    `הזמנה חדשה מהאתר ${ref}`,
    `${o.name}, ${o.phone}`,
    ...o.items.map((i) => `• ${i.name}, ${i.qty}, ₪${i.total}`),
    o.fulfilment === 'pickup' ? 'איסוף עצמי מהחנות' : `משלוח: ${o.address}`,
    o.addressEn && `EN: ${o.addressEn}`,
    `מועד: ${o.date} ${o.window}`,
    o.notes && `הערות: ${o.notes}`,
    o.shipping > 0 && `משלוח ₪${o.shipping}`,
    `סה״כ ₪${o.total}, ${o.payment}`,
  ]
    .filter(Boolean)
    .join('\n');
}
