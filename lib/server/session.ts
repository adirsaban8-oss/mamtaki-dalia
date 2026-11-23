/**
 * Signed, http-only cookies for the two kinds of sign-in: a customer
 * (after the SMS code) and the shop staff (after the admin password).
 * Server only.
 *
 *   ADMIN_PASSWORD    the staff password for /admin
 *   SESSION_SECRET    optional; signs the cookies. When empty it is derived
 *                     from ADMIN_PASSWORD + DATABASE_URL, so changing the
 *                     password also signs everyone out.
 */
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const secret = () => process.env.SESSION_SECRET?.trim() || createHash('sha256').update(`${process.env.ADMIN_PASSWORD ?? ''}|${process.env.DATABASE_URL ?? process.env.LOCAL_DB ?? ''}|md`).digest('hex');
const sign = (v: string) => createHmac('sha256', secret()).update(v).digest('base64url');

export const hash = (v: string) => createHmac('sha256', secret()).update('h:' + v).digest('hex');

export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(createHash('sha256').update(a).digest());
  const y = Buffer.from(createHash('sha256').update(b).digest());
  return timingSafeEqual(x, y);
}

type Kind = 'c' | 'a';
const NAME: Record<Kind, string> = { c: 'md_customer', a: 'md_admin' };
const DAYS: Record<Kind, number> = { c: 90, a: 30 };

function pack(kind: Kind, id: string): string {
  const body = `${kind}.${id}.${Date.now() + DAYS[kind] * 86_400_000}`;
  return `${body}.${sign(body)}`;
}
function unpack(kind: Kind, token: string | undefined): string | null {
  if (!token) return null;
  const i = token.lastIndexOf('.');
  const body = token.slice(0, i);
  if (i < 0 || !safeEqual(sign(body), token.slice(i + 1))) return null;
  const [k, id, exp] = body.split('.');
  return k === kind && Number(exp) > Date.now() ? id : null;
}

async function put(kind: Kind, id: string) {
  (await cookies()).set(NAME[kind], pack(kind, id), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: DAYS[kind] * 86_400 });
}
async function read(kind: Kind): Promise<string | null> {
  return unpack(kind, (await cookies()).get(NAME[kind])?.value);
}

export const signInCustomer = (customerId: number) => put('c', String(customerId));
export const signOutCustomer = async () => void (await cookies()).delete(NAME.c);
export const customerId = async (): Promise<number | null> => {
  const v = await read('c');
  return v ? Number(v) : null;
};

export const adminConfigured = () => !!process.env.ADMIN_PASSWORD?.trim();
export const signInAdmin = () => put('a', 'staff');
export const signOutAdmin = async () => void (await cookies()).delete(NAME.a);
export const isAdmin = async (): Promise<boolean> => adminConfigured() && (await read('a')) === 'staff';
