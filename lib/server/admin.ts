/** Guard for the /api/admin routes. Server only. */
import { dbEnabled } from './db';
import { isAdmin } from './session';

/** Null when the request comes from signed-in staff and the database is on; otherwise the refusal to return. */
export async function adminRefusal(): Promise<Response | null> {
  if (!(await isAdmin())) return Response.json({ error: 'signin', message: 'צריך להיכנס מחדש.' }, { status: 401 });
  if (!dbEnabled()) return Response.json({ error: 'db', message: 'בסיס הנתונים עדיין לא מחובר.' }, { status: 503 });
  return null;
}
