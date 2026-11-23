import { dbEnabled } from '@/lib/server/db';
import { adminConfigured, isAdmin, safeEqual, signInAdmin, signOutAdmin } from '@/lib/server/session';
import { allow, clientIp, smsEnabled } from '@/lib/server/sms';

export const dynamic = 'force-dynamic';

/** GET: is this browser signed in, and is the admin ready to use. */
export async function GET() {
  return Response.json({ signedIn: await isAdmin(), passwordSet: adminConfigured(), database: dbEnabled(), sms: smsEnabled() });
}

/** POST { password }: staff sign-in. Ten tries per quarter hour per address. */
export async function POST(req: Request) {
  if (!adminConfigured()) return Response.json({ error: 'off', message: 'עדיין לא הוגדרה סיסמת ניהול.' }, { status: 503 });
  if (!allow('admin-ip:' + clientIp(req), 10, 900_000)) return Response.json({ error: 'busy', message: 'יותר מדי ניסיונות. נסו שוב בעוד רבע שעה.' }, { status: 429 });
  const body = (await req.json().catch(() => null)) as { password?: unknown } | null;
  const given = typeof body?.password === 'string' ? body.password : '';
  if (!safeEqual(given, process.env.ADMIN_PASSWORD!.trim())) return Response.json({ error: 'password', message: 'הסיסמה לא נכונה.' }, { status: 401 });
  await signInAdmin();
  return Response.json({ ok: true });
}

export async function DELETE() {
  await signOutAdmin();
  return Response.json({ ok: true });
}
