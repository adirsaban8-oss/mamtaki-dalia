import { adminRefusal } from '@/lib/server/admin';
import { q } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

type Row = { phone: string; first_name: string; last_name: string; marketing_at: string | null; created_at: string; orders: number; spent: number };

/** Registered customers (those who finished sign-up), newest first, with their order count, and past broadcasts. */
export async function GET() {
  const no = await adminRefusal();
  if (no) return no;
  const rows = await q<Row>(
    `select c.phone, c.first_name, c.last_name, c.marketing_at, c.created_at,
            count(o.id)::int as orders, coalesce(sum(o.total) filter (where o.status <> 'cancelled'), 0)::int as spent
       from customers c left join orders o on o.customer_id = c.id
      where c.terms_at is not null
      group by c.id order by c.created_at desc limit 2000`
  );
  const broadcasts = await q<{ body: string; recipients: number; created_at: string }>('select body, recipients, created_at from broadcasts order by created_at desc limit 20');
  return Response.json({
    customers: rows.map((r) => ({ phone: r.phone, name: `${r.first_name} ${r.last_name}`.trim(), marketing: !!r.marketing_at, since: r.created_at, orders: r.orders, spent: r.spent })),
    broadcasts,
  });
}
