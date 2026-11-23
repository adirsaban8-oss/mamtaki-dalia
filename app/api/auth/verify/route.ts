import { dbEnabled } from '@/lib/server/db';
import { checkCode, customerForPhone, publicCustomer } from '@/lib/server/customers';
import { signInCustomer } from '@/lib/server/session';
import { allow, clientIp, normalizePhone } from '@/lib/server/sms';

export const dynamic = 'force-dynamic';

/** POST { phone, code }: signs the customer in when the code is right. */
export async function POST(req: Request) {
  if (!dbEnabled()) return Response.json({ error: 'off' }, { status: 503 });
  const body = (await req.json().catch(() => null)) as { phone?: unknown; code?: unknown } | null;
  const phone = normalizePhone(body?.phone);
  const code = typeof body?.code === 'string' ? body.code.replace(/\D/g, '') : '';
  if (!phone || code.length !== 6) return Response.json({ error: 'code', message: 'הקוד צריך להיות 6 ספרות.' }, { status: 400 });
  if (!allow('verify-ip:' + clientIp(req), 20, 600_000)) return Response.json({ error: 'busy', message: 'יותר מדי ניסיונות. נסו שוב מאוחר יותר.' }, { status: 429 });
  if (!(await checkCode(phone, code))) return Response.json({ error: 'code', message: 'הקוד שגוי או שפג תוקפו. בקשו קוד חדש.' }, { status: 400 });
  const customer = await customerForPhone(phone);
  await signInCustomer(customer.id);
  return Response.json({ customer: publicCustomer(customer) });
}
