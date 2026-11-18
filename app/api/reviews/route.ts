import { allow, clientIp, placesEnabled, shopReviews } from '@/lib/googlePlaces';

export const dynamic = 'force-dynamic';

/**
 * The shop's Google rating, review count and the reviews Google returns
 * (the API gives at most five). Fetched live each time the reviews section
 * comes into view; nothing is stored. { enabled: false } until the key is set.
 */
export async function GET(req: Request) {
  if (!placesEnabled()) return Response.json({ enabled: false });
  if (!allow('rv:' + clientIp(req), 10)) return Response.json({ enabled: true, error: 'busy' }, { status: 429 });
  const lang = new URL(req.url).searchParams.get('lang') === 'ar' ? 'ar' : 'he';
  try {
    const data = await shopReviews(lang);
    return Response.json({ enabled: true, ...data }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ enabled: true, error: 'unavailable' }, { status: 502 });
  }
}
