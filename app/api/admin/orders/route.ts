import { adminRefusal } from '@/lib/server/admin';
import { listOrders, setOrderStatus } from '@/lib/server/orders';

export const dynamic = 'force-dynamic';

export async function GET() {
  const no = await adminRefusal();
  if (no) return no;
  return Response.json({ orders: await listOrders() });
}

/** PATCH { ref, status }: the shop marks where the order stands. */
export async function PATCH(req: Request) {
  const no = await adminRefusal();
  if (no) return no;
  const b = (await req.json().catch(() => null)) as { ref?: unknown; status?: unknown } | null;
  const ok = typeof b?.ref === 'string' && typeof b.status === 'string' && (await setOrderStatus(b.ref, b.status));
  return ok ? Response.json({ ok: true }) : Response.json({ error: 'missing', message: 'ההזמנה לא נמצאה.' }, { status: 404 });
}
