/**
 * Tells the shop about a new site order by SMS. Import only from route
 * handlers. Two senders are supported; ActiveTrail is used when its key is
 * set, otherwise Twilio. Runtime variables on Railway:
 *
 *   ORDER_SMS_TO            the shop phone that receives orders, e.g. 0525986266
 *
 *   ActiveTrail (webapi.mymarketing.co.il, operational SMS):
 *   ACTIVETRAIL_API_KEY     Settings > API Apps in ActiveTrail
 *   ACTIVETRAIL_SMS_FROM    the approved sender name of the account
 *   ACTIVETRAIL_SMS_PROFILE_ID   optional, the SMS sending profile id
 *
 *   Twilio:
 *   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM
 *
 * Until a sender is fully set nothing is sent and the checkout falls back to
 * handing the order to the shop's WhatsApp, so an order is never lost silently.
 */
const env = (k: string) => process.env[k]?.trim() || '';

const activeTrail = () => !!(env('ACTIVETRAIL_API_KEY') && env('ACTIVETRAIL_SMS_FROM') && env('ORDER_SMS_TO'));
const twilio = () => !!(env('TWILIO_ACCOUNT_SID') && env('TWILIO_AUTH_TOKEN') && env('TWILIO_FROM') && env('ORDER_SMS_TO'));
export const smsEnabled = () => activeTrail() || twilio();

export async function sendOrderSms(body: string, ref: string): Promise<void> {
  const res = activeTrail() ? await viaActiveTrail(body, ref) : await viaTwilio(body);
  if (!res.ok) throw new Error(`sms ${res.status}`);
}

/** POST api/smscampaign/OperationalMessage: details, scheduling, mobiles. */
function viaActiveTrail(body: string, ref: string): Promise<Response> {
  const profile = Number(env('ACTIVETRAIL_SMS_PROFILE_ID'));
  return fetch('https://webapi.mymarketing.co.il/api/smscampaign/OperationalMessage', {
    method: 'POST',
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
    headers: { Authorization: env('ACTIVETRAIL_API_KEY'), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      details: {
        name: `Site order ${ref}`,
        from_name: env('ACTIVETRAIL_SMS_FROM'),
        content: body,
        can_unsubscribe: false,
        ...(profile > 0 ? { sms_sending_profile_id: profile } : {}),
      },
      scheduling: { send_now: true },
      mobiles: [{ phone_number: env('ORDER_SMS_TO') }],
    }),
  });
}

function viaTwilio(body: string): Promise<Response> {
  const sid = env('TWILIO_ACCOUNT_SID');
  return fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
    method: 'POST',
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${sid}:${env('TWILIO_AUTH_TOKEN')}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: env('ORDER_SMS_TO'), From: env('TWILIO_FROM'), Body: body }),
  });
}

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
