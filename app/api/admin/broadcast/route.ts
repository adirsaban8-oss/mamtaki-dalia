import { adminRefusal } from '@/lib/server/admin';
import { q } from '@/lib/server/db';
import { allow, sendSms, smsEnabled } from '@/lib/server/sms';

export const dynamic = 'force-dynamic';

/**
 * POST { body, expect }: one advertising text to every customer who agreed
 * to receive them, and to nobody else. `expect` is the number of recipients
 * the screen showed; when it no longer matches, nothing is sent and the
 * screen asks again. ActiveTrail adds the removal link. Three sends an hour.
 */
export async function POST(req: Request) {
  const no = await adminRefusal();
  if (no) return no;
  if (!smsEnabled()) return Response.json({ error: 'sms', message: 'שירות ה-SMS לא מחובר.' }, { status: 503 });
  const b = (await req.json().catch(() => null)) as { body?: unknown; expect?: unknown } | null;
  const body = typeof b?.body === 'string' ? b.body.replace(/[\u0000-\u0009\u000b-\u001f]+/g, ' ').trim() : '';
  if (body.length < 5 || body.length > 400) return Response.json({ error: 'body', message: 'ההודעה צריכה להיות בין 5 ל-400 תווים.' }, { status: 400 });
  const phones = (await q<{ phone: string }>('select phone from customers where marketing_at is not null and terms_at is not null')).map((r) => r.phone);
  if (phones.length === 0) return Response.json({ error: 'none', message: 'אין עדיין לקוחות שהסכימו לקבל הודעות.' }, { status: 400 });
  if (b?.expect !== phones.length) return Response.json({ error: 'changed', recipients: phones.length, message: 'מספר הנמענים השתנה. בדקו ושלחו שוב.' }, { status: 409 });
  if (!allow('broadcast', 3, 3_600_000)) return Response.json({ error: 'busy', message: 'אפשר לשלוח עד 3 הודעות בשעה.' }, { status: 429 });
  try {
    await sendSms({ to: phones, body, label: `Broadcast ${new Date().toISOString().slice(0, 16)}`, marketing: true });
  } catch (e) {
    return Response.json({ error: 'failed', message: 'השליחה נכשלה. ההודעה לא נשלחה.', detail: e instanceof Error ? e.message.slice(0, 40) : '' }, { status: 502 });
  }
  await q('insert into broadcasts (body, recipients) values ($1, $2)', [body, phones.length]);
  return Response.json({ ok: true, recipients: phones.length });
}
