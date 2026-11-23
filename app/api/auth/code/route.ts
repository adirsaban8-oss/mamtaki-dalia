import { dbEnabled } from '@/lib/server/db';
import { issueCode } from '@/lib/server/customers';
import { allow, clientIp, normalizePhone, sendSms, smsEnabled } from '@/lib/server/sms';

export const dynamic = 'force-dynamic';

/** POST { phone }: texts a sign-in code to an Israeli mobile. */
export async function POST(req: Request) {
  if (!dbEnabled() || !smsEnabled()) return Response.json({ error: 'off' }, { status: 503 });
  const body = (await req.json().catch(() => null)) as { phone?: unknown } | null;
  const phone = normalizePhone(body?.phone);
  if (!phone) return Response.json({ error: 'phone', message: 'מספר הטלפון לא תקין. הקלידו מספר נייד ישראלי, למשל 050-1234567.' }, { status: 400 });
  // Brakes against someone using the form to send texts to strangers.
  if (!allow('code-ip:' + clientIp(req), 8, 3_600_000) || !allow('code-all', 300, 3_600_000)) return Response.json({ error: 'busy', message: 'יותר מדי ניסיונות. נסו שוב מאוחר יותר.' }, { status: 429 });
  const r = await issueCode(phone);
  if ('refused' in r) return Response.json({ error: r.refused, message: r.refused === 'wait' ? 'קוד כבר נשלח. אפשר לבקש קוד חדש בעוד דקה.' : 'נשלחו יותר מדי קודים למספר הזה היום. נסו מחר או התקשרו לחנות.' }, { status: 429 });
  try {
    await sendSms({ to: [phone], body: `קוד הכניסה שלך לממתקי דלית אל כרמל: ${r.code}`, label: 'Sign-in code' });
  } catch {
    return Response.json({ error: 'sms', message: 'לא הצלחנו לשלוח את הקוד. נסו שוב בעוד רגע.' }, { status: 502 });
  }
  return Response.json({ ok: true });
}
