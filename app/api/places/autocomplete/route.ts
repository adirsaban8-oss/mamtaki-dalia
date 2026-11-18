import { allow, autocomplete, clientIp, placesEnabled } from '@/lib/googlePlaces';

export const dynamic = 'force-dynamic';

/** GET: is address search available? POST { input, sessionToken, lang }: suggestions in Israel. */
export async function GET() {
  return Response.json({ enabled: placesEnabled() });
}

export async function POST(req: Request) {
  if (!placesEnabled()) return Response.json({ enabled: false, suggestions: [] });
  if (!allow('ac:' + clientIp(req), 60)) return Response.json({ suggestions: [], error: 'busy' }, { status: 429 });
  let body: { input?: unknown; sessionToken?: unknown; lang?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ suggestions: [], error: 'bad request' }, { status: 400 });
  }
  const input = typeof body.input === 'string' ? body.input.trim().slice(0, 120) : '';
  const token = typeof body.sessionToken === 'string' && /^[\w-]{8,64}$/.test(body.sessionToken) ? body.sessionToken : '';
  const lang = body.lang === 'ar' ? 'ar' : body.lang === 'en' ? 'en' : 'he';
  if (input.length < 2 || !token) return Response.json({ suggestions: [] });
  try {
    return Response.json({ suggestions: await autocomplete(input, token, lang) });
  } catch {
    return Response.json({ suggestions: [], error: 'unavailable' }, { status: 502 });
  }
}
