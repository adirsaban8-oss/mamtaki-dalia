import { allow, clientIp, placesEnabled, shopReviews } from '@/lib/googlePlaces';

export const dynamic = 'force-dynamic';

/**
 * The shop's Google rating, review count and the reviews Google returns
 * (the API gives at most five per language; two languages are joined). Fetched live each time the reviews section
 * comes into view; nothing is stored. { enabled: false } until the key is set.
 */
export async function GET(req: Request) {
  if (!placesEnabled()) return Response.json({ enabled: false });
  if (!allow('rv:' + clientIp(req), 10)) return Response.json({ enabled: true, error: 'busy' }, { status: 429 });
  const lang = new URL(req.url).searchParams.get('lang') === 'ar' ? 'ar' : 'he';
  try {
    // Google returns a different handful of reviews per language, so ask in
    // both of the site's languages and join them (the visitor's language first).
    const other = lang === 'he' ? 'ar' : 'he';
    const [data, more] = await Promise.all([shopReviews(lang), shopReviews(other).catch(() => null)]);
    const seen = new Set(data.reviews.map((r) => r.author + '|' + r.publishTime));
    const extra = (more?.reviews ?? []).filter((r) => !seen.has(r.author + '|' + r.publishTime));
    return Response.json({ enabled: true, ...data, reviews: [...data.reviews, ...extra] }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ enabled: true, error: 'unavailable' }, { status: 502 });
  }
}
