import { dbEnabled } from '@/lib/server/db';
import { customerById, publicCustomer } from '@/lib/server/customers';
import { customerId, signOutCustomer } from '@/lib/server/session';
import { smsEnabled } from '@/lib/server/sms';

export const dynamic = 'force-dynamic';

/** GET: who is signed in, and whether the site asks customers to sign in at all. DELETE: sign out. */
export async function GET() {
  const accounts = dbEnabled() && smsEnabled();
  if (!accounts) return Response.json({ accounts: false, customer: null });
  const id = await customerId();
  const c = id ? await customerById(id).catch(() => null) : null;
  return Response.json({ accounts: true, customer: c ? publicCustomer(c) : null });
}

export async function DELETE() {
  await signOutCustomer();
  return Response.json({ ok: true });
}
