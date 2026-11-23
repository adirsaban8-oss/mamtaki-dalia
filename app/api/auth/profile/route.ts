import { q } from '@/lib/server/db';
import { customerById, publicCustomer } from '@/lib/server/customers';
import { customerId } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f<>]+/g, ' ').trim().slice(0, max) : '');

/**
 * POST { firstName, lastName, email, terms, marketing }: the customer's
 * details and choices. Accepting the terms is required and its time is kept;
 * agreeing to advertising texts is the customer's free choice, kept with its
 * time, and cleared when they turn it off.
 */
export async function POST(req: Request) {
  const id = await customerId();
  if (!id) return Response.json({ error: 'signin', message: 'צריך להתחבר קודם.' }, { status: 401 });
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const first = clean(b?.firstName, 40);
  const last = clean(b?.lastName, 40);
  const email = clean(b?.email, 120);
  if (first.length < 2 || last.length < 2) return Response.json({ error: 'name', message: 'נא למלא שם פרטי ושם משפחה.' }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: 'email', message: 'כתובת האימייל לא תקינה.' }, { status: 400 });
  const current = await customerById(id);
  if (!current) return Response.json({ error: 'signin', message: 'צריך להתחבר קודם.' }, { status: 401 });
  if (!current.terms_at && b?.terms !== true) return Response.json({ error: 'terms', message: 'כדי להזמין צריך לאשר את התקנון.' }, { status: 400 });
  const marketing = b?.marketing === true;
  await q(
    `update customers set first_name = $2, last_name = $3, email = $4,
       terms_at = coalesce(terms_at, now()),
       marketing_at = case when $5::boolean then coalesce(marketing_at, now()) else null end
     where id = $1`,
    [id, first, last, email, marketing]
  );
  const c = await customerById(id);
  return Response.json({ customer: c && publicCustomer(c) });
}
