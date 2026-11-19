import { allow, clientIp } from '@/lib/googlePlaces';
import { orderText, parseOrder, sendOrderSms, smsEnabled } from '@/lib/orderNotify';

export const dynamic = 'force-dynamic';

// Site-wide brake on top of the per-visitor one, so a flood cannot run up the SMS bill.
let hour = { n: 0, t: 0 };
const underHourlyCap = () => {
  const now = Date.now();
  if (now - hour.t > 3_600_000) hour = { n: 0, t: now };
  hour.n += 1;
  return hour.n <= 60;
};

/**
 * POST an order from the checkout. Gives it a reference and sends it to the
 * shop by SMS. Always answers with the order as text, so when the SMS is
 * off or fails the browser can hand the same text to the shop's WhatsApp.
 */
export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ error: 'bad request' }, { status: 400 });
  }
  const order = parseOrder(raw);
  if (!order) return Response.json({ error: 'bad order' }, { status: 400 });

  const ref = '#' + Date.now().toString(36).slice(-6).toUpperCase();
  const text = orderText(order, ref);
  if (!smsEnabled()) return Response.json({ ref, text, sent: false, reason: 'off' });
  if (!allow('or:' + clientIp(req), 3) || !underHourlyCap()) return Response.json({ ref, text, sent: false, reason: 'busy' });
  try {
    await sendOrderSms(text);
    return Response.json({ ref, text, sent: true });
  } catch {
    return Response.json({ ref, text, sent: false, reason: 'failed' });
  }
}
