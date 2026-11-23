import { orderText, parseOrder } from '@/lib/orderNotify';
import { dbEnabled } from '@/lib/server/db';
import { customerById } from '@/lib/server/customers';
import { createOrder, type NewOrderInput } from '@/lib/server/orders';
import { customerId } from '@/lib/server/session';
import { allow, clientIp, sendSms, shopPhone, smsEnabled } from '@/lib/server/sms';

export const dynamic = 'force-dynamic';

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://mamtaki-dalia-production.up.railway.app';

/**
 * POST an order from the checkout.
 *
 * With the database: the customer must be signed in and have accepted the
 * terms. The server prices the order from the catalog, saves it, and texts
 * the shop a short note with a link to the order in /admin. The order is
 * safe in the database even if that text fails.
 *
 * Without a database (fallback): the order is passed on as text, by SMS or,
 * failing that, by WhatsApp from the success page.
 */
export async function POST(req: Request) {
  const raw = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!raw) return Response.json({ error: 'bad request' }, { status: 400 });
  if (!allow('order-ip:' + clientIp(req), 6) || !allow('order-all', 120, 3_600_000)) return Response.json({ error: 'busy', message: 'יותר מדי ניסיונות. נסו שוב בעוד דקה.' }, { status: 429 });

  if (dbEnabled() && smsEnabled()) {
    const id = await customerId();
    const customer = id ? await customerById(id) : null;
    if (!customer) return Response.json({ error: 'signin', message: 'כדי להזמין צריך להתחבר.' }, { status: 401 });
    if (!customer.terms_at || !customer.first_name) return Response.json({ error: 'profile', message: 'חסרים פרטים או אישור התקנון.' }, { status: 400 });
    const made = await createOrder(raw as unknown as NewOrderInput, customer);
    if ('problem' in made) return Response.json({ error: 'order', message: made.problem }, { status: 400 });
    const o = made.order;
    let told = false;
    if (shopPhone()) {
      try {
        await sendSms({ to: [shopPhone()], body: `הזמנה חדשה #${o.ref}\n${o.customer.name}, ₪${o.total}\nלצפייה: ${BASE}/he/admin?o=${o.ref}`, label: `Site order ${o.ref}` });
        told = true;
      } catch {
        console.error('order saved, shop text failed', o.ref);
      }
    }
    return Response.json({ ref: '#' + o.ref, sent: true, saved: true, shopTexted: told, total: o.total });
  }

  const order = parseOrder(raw);
  if (!order) return Response.json({ error: 'bad order' }, { status: 400 });
  const ref = '#' + Date.now().toString(36).slice(-6).toUpperCase();
  const text = orderText(order, ref);
  if (!smsEnabled() || !shopPhone()) return Response.json({ ref, text, sent: false, reason: 'off' });
  try {
    await sendSms({ to: [shopPhone()], body: text, label: `Site order ${ref}` });
    return Response.json({ ref, text, sent: true });
  } catch (e) {
    return Response.json({ ref, text, sent: false, reason: 'failed', detail: e instanceof Error ? e.message.slice(0, 40) : '' });
  }
}
