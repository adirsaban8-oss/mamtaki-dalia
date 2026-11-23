/** Customers and their SMS sign-in codes. Server only. */
import { randomInt } from 'node:crypto';
import { q } from './db';
import { hash, safeEqual } from './session';

export type CustomerRow = { id: number; phone: string; first_name: string; last_name: string; email: string; terms_at: string | null; marketing_at: string | null; created_at: string };

/** What the browser may know about the signed-in customer. */
export const publicCustomer = (c: CustomerRow) => ({ phone: c.phone, firstName: c.first_name, lastName: c.last_name, email: c.email, acceptedTerms: !!c.terms_at, marketing: !!c.marketing_at });

export async function customerById(id: number): Promise<CustomerRow | null> {
  return (await q<CustomerRow>('select * from customers where id = $1', [id]))[0] ?? null;
}

/** Makes a 6-digit code for the phone. 'wait' when one was sent under a minute ago, 'limit' after 6 in a day. */
export async function issueCode(phone: string): Promise<{ code: string } | { refused: 'wait' | 'limit' }> {
  const prev = (await q<{ sent_at: string; sent_today: number }>('select sent_at, sent_today from otps where phone = $1', [phone]))[0];
  let today = 1;
  if (prev) {
    const age = Date.now() - new Date(prev.sent_at).getTime();
    if (age < 55_000) return { refused: 'wait' };
    today = age < 86_400_000 ? prev.sent_today + 1 : 1;
    if (today > 6) return { refused: 'limit' };
  }
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  await q(
    `insert into otps (phone, code_hash, expires_at, attempts, sent_at, sent_today) values ($1, $2, now() + interval '5 minutes', 0, now(), $3)
     on conflict (phone) do update set code_hash = excluded.code_hash, expires_at = excluded.expires_at, attempts = 0, sent_at = now(), sent_today = excluded.sent_today`,
    [phone, hash(phone + ':' + code), today]
  );
  return { code };
}

/** True once, for the right code, within five minutes and five tries. */
export async function checkCode(phone: string, code: string): Promise<boolean> {
  const row = (await q<{ code_hash: string; attempts: number; fresh: boolean }>('update otps set attempts = attempts + 1 where phone = $1 returning code_hash, attempts, (expires_at > now()) as fresh', [phone]))[0];
  if (!row || !row.fresh || row.attempts > 5) return false;
  if (!safeEqual(row.code_hash, hash(phone + ':' + code))) return false;
  await q("update otps set expires_at = now() - interval '1 second' where phone = $1", [phone]);
  return true;
}

export async function customerForPhone(phone: string): Promise<CustomerRow> {
  const rows = await q<CustomerRow>('insert into customers (phone) values ($1) on conflict (phone) do update set phone = excluded.phone returning *', [phone]);
  return rows[0];
}
