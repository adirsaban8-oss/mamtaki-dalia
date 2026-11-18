import { addressDetails, allow, clientIp, placesEnabled } from '@/lib/googlePlaces';

export const dynamic = 'force-dynamic';

/** GET ?id=&session=&lang= : the chosen address split into fields, in English and in the visitor's language. */
export async function GET(req: Request) {
  if (!placesEnabled()) return Response.json({ enabled: false }, { status: 404 });
  if (!allow('pd:' + clientIp(req), 20)) return Response.json({ error: 'busy' }, { status: 429 });
  const q = new URL(req.url).searchParams;
  const id = q.get('id') ?? '';
  const session = q.get('session') ?? '';
  if (!/^[\w-]{10,300}$/.test(id) || !/^[\w-]{8,64}$/.test(session)) return Response.json({ error: 'bad request' }, { status: 400 });
  try {
    return Response.json(await addressDetails(id, session, q.get('lang') === 'ar' ? 'ar' : 'he'), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 502 });
  }
}
