/**
 * SMS through ActiveTrail (operational message API), or Twilio when only
 * its variables are set. Server only. Runtime variables on Railway:
 *
 *   ACTIVETRAIL_API_KEY, ACTIVETRAIL_SMS_FROM, ACTIVETRAIL_SMS_PROFILE_ID (optional)
 *   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM
 *   ORDER_SMS_TO      the shop phone that hears about new orders
 *
 * SMS_DRY_RUN=<file> (tests only): nothing is sent, messages are appended to the file.
 */
import { appendFile } from 'node:fs/promises';

const env = (k: string) => process.env[k]?.trim() || '';

const activeTrail = () => !!(env('ACTIVETRAIL_API_KEY') && env('ACTIVETRAIL_SMS_FROM'));
const twilio = () => !!(env('TWILIO_ACCOUNT_SID') && env('TWILIO_AUTH_TOKEN') && env('TWILIO_FROM'));
export const smsEnabled = () => !!env('SMS_DRY_RUN') || activeTrail() || twilio();
export const shopPhone = () => env('ORDER_SMS_TO');

/** 05X-XXXXXXX in any common spelling → "05XXXXXXXX"; null when it is not an Israeli mobile. */
export function normalizePhone(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  let d = raw.replace(/[^\d+]/g, '');
  if (d.startsWith('+972')) d = '0' + d.slice(4);
  else if (d.startsWith('972')) d = '0' + d.slice(3);
  return /^05\d{8}$/.test(d) ? d : null;
}

type Sms = {
  to: string[];
  body: string;
  /** Shown in the ActiveTrail account as the message name. */
  label: string;
  /** Advertising: ActiveTrail adds its own removal link and honours removals. */
  marketing?: boolean;
};

export async function sendSms(m: Sms): Promise<void> {
  if (m.to.length === 0) return;
  if (env('SMS_DRY_RUN')) {
    await appendFile(env('SMS_DRY_RUN'), JSON.stringify({ to: m.to, body: m.body, marketing: !!m.marketing }) + '\n');
    return;
  }
  if (activeTrail()) {
    const profile = Number(env('ACTIVETRAIL_SMS_PROFILE_ID'));
    const res = await fetch('https://webapi.mymarketing.co.il/api/smscampaign/OperationalMessage', {
      method: 'POST',
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
      headers: { Authorization: env('ACTIVETRAIL_API_KEY'), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        details: {
          name: m.label.slice(0, 80),
          from_name: env('ACTIVETRAIL_SMS_FROM'),
          content: m.body,
          can_unsubscribe: !!m.marketing,
          ...(m.marketing ? { unsubscribe_text: 'להסרה' } : {}),
          ...(profile > 0 ? { sms_sending_profile_id: profile } : {}),
        },
        scheduling: { send_now: true },
        mobiles: m.to.map((phone_number) => ({ phone_number })),
      }),
    });
    if (!res.ok) throw new Error(`sms ${res.status}`);
    return;
  }
  if (twilio()) {
    const sid = env('TWILIO_ACCOUNT_SID');
    for (const to of m.to) {
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
        method: 'POST',
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
        headers: { Authorization: 'Basic ' + Buffer.from(`${sid}:${env('TWILIO_AUTH_TOKEN')}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ To: '+972' + to.slice(1), From: env('TWILIO_FROM'), Body: m.body }),
      });
      if (!res.ok) throw new Error(`sms ${res.status}`);
    }
    return;
  }
  throw new Error('sms off');
}

/* A small in-memory brake, per key (an IP, a phone): at most `max` hits in `ms`. */
const hits = ((globalThis as unknown as { __mdHits?: Map<string, { n: number; t: number }> }).__mdHits ??= new Map());
export function allow(key: string, max: number, ms = 60_000): boolean {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || now - h.t > ms) {
    if (hits.size > 10_000) hits.clear();
    hits.set(key, { n: 1, t: now });
    return true;
  }
  h.n += 1;
  return h.n <= max;
}
export const clientIp = (req: Request) => req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
