/**
 * Google Places API (New). Import only from route handlers (server side), so the key never reaches the
 * browser. Set on Railway (runtime variables, not build args):
 *
 *   GOOGLE_PLACES_API_KEY   key restricted to "Places API (New)"
 *   GOOGLE_PLACE_ID         optional; the shop's place ID. When empty it is
 *                           looked up once by text search and kept in memory
 *                           (a place ID is the one Places value that may be stored).
 *
 * Google's terms: review text, ratings and author names are shown live with
 * attribution and are not stored, so nothing here is written to disk or to
 * a long cache. Docs: developers.google.com/maps/documentation/places/web-service
 */
import type { AddressParts } from './address';

const BASE = 'https://places.googleapis.com/v1';
const SHOP_QUERY = 'ממתקי דלית אל כרמל, דליה 10, דלית אל כרמל';

export const placesKey = () => process.env.GOOGLE_PLACES_API_KEY?.trim() || '';
export const placesEnabled = () => placesKey().length > 0;

async function call<T>(path: string, init: RequestInit & { fieldMask: string }): Promise<T> {
  const { fieldMask, headers, ...rest } = init;
  const res = await fetch(BASE + path, {
    ...rest,
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': placesKey(), 'X-Goog-FieldMask': fieldMask, ...headers },
  });
  if (!res.ok) throw new Error(`places ${res.status}`);
  return (await res.json()) as T;
}

let shopPlaceId: string | null = process.env.GOOGLE_PLACE_ID?.trim() || null;
async function shopId(): Promise<string> {
  if (shopPlaceId) return shopPlaceId;
  const r = await call<{ places?: { id: string }[] }>('/places:searchText', {
    method: 'POST',
    fieldMask: 'places.id',
    body: JSON.stringify({ textQuery: SHOP_QUERY, languageCode: 'he', regionCode: 'IL', pageSize: 1 }),
  });
  const id = r.places?.[0]?.id;
  if (!id) throw new Error('shop not found');
  shopPlaceId = id;
  return id;
}

/* ── Reviews ─────────────────────────────────────────────────────────── */

export type PlaceReview = {
  author: string;
  authorUri?: string;
  authorPhoto?: string;
  rating: number;
  text: string;
  lang?: string;
  publishTime?: string;
  relativeTime?: string;
  reviewUri?: string;
};
export type ShopReviews = { rating: number | null; count: number | null; mapsUri: string | null; reviews: PlaceReview[]; fetchedAt: string };

type RawReview = {
  rating?: number;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  publishTime?: string;
  relativePublishTimeDescription?: string;
  googleMapsUri?: string;
};

export async function shopReviews(lang: 'he' | 'ar'): Promise<ShopReviews> {
  const id = await shopId();
  const r = await call<{ rating?: number; userRatingCount?: number; googleMapsUri?: string; reviews?: RawReview[] }>(
    `/places/${encodeURIComponent(id)}?languageCode=${lang}&regionCode=IL`,
    { method: 'GET', fieldMask: 'rating,userRatingCount,googleMapsUri,reviews' }
  );
  const reviews: PlaceReview[] = (r.reviews ?? [])
    .map((x) => ({
      author: x.authorAttribution?.displayName ?? '',
      authorUri: x.authorAttribution?.uri,
      authorPhoto: x.authorAttribution?.photoUri,
      rating: x.rating ?? 0,
      // The reviewer's own words first; Google's translation only if there is no original.
      text: x.originalText?.text ?? x.text?.text ?? '',
      lang: x.originalText?.languageCode ?? x.text?.languageCode,
      publishTime: x.publishTime,
      relativeTime: x.relativePublishTimeDescription,
      reviewUri: x.googleMapsUri,
    }))
    .filter((x) => x.rating > 0);
  return { rating: r.rating ?? null, count: r.userRatingCount ?? null, mapsUri: r.googleMapsUri ?? null, reviews, fetchedAt: new Date().toISOString() };
}

/* ── Address autocomplete ───────────────────────────────────────────── */

export type AddressSuggestion = { placeId: string; main: string; secondary: string; full: string };

export async function autocomplete(input: string, sessionToken: string, lang: 'he' | 'ar' | 'en'): Promise<AddressSuggestion[]> {
  const r = await call<{ suggestions?: { placePrediction?: { placeId: string; text?: { text: string }; structuredFormat?: { mainText?: { text: string }; secondaryText?: { text: string } } } }[] }>(
    '/places:autocomplete',
    {
      method: 'POST',
      fieldMask: 'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat',
      body: JSON.stringify({ input, sessionToken, languageCode: lang, regionCode: 'IL', includedRegionCodes: ['il'], includedPrimaryTypes: ['street_address', 'premise', 'subpremise', 'route'] }),
    }
  );
  return (r.suggestions ?? [])
    .map((s) => s.placePrediction)
    .filter((p): p is NonNullable<typeof p> => !!p?.placeId)
    .map((p) => ({
      placeId: p.placeId,
      main: p.structuredFormat?.mainText?.text ?? p.text?.text ?? '',
      secondary: p.structuredFormat?.secondaryText?.text ?? '',
      full: p.text?.text ?? '',
    }));
}

export type AddressDetails = { placeId: string; en: AddressParts; local: AddressParts; complete: boolean };

type Comp = { longText?: string; shortText?: string; types?: string[] };
function parts(comps: Comp[] = [], full = ''): AddressParts {
  const get = (t: string) => comps.find((c) => c.types?.includes(t))?.longText ?? '';
  return {
    street: get('route'),
    houseNumber: get('street_number'),
    city: get('locality') || get('postal_town') || get('administrative_area_level_2'),
    postalCode: get('postal_code'),
    country: get('country'),
    full,
  };
}

/**
 * Details for the chosen suggestion: English (for couriers and exports) and
 * the visitor's language. The English call carries the session token and
 * closes the autocomplete session; the second is a plain Essentials lookup.
 */
export async function addressDetails(placeId: string, sessionToken: string, lang: 'he' | 'ar'): Promise<AddressDetails> {
  const mask = 'id,formattedAddress,addressComponents';
  const path = (l: string, s?: string) => `/places/${encodeURIComponent(placeId)}?languageCode=${l}&regionCode=IL${s ? `&sessionToken=${encodeURIComponent(s)}` : ''}`;
  type D = { id: string; formattedAddress?: string; addressComponents?: Comp[] };
  const en = await call<D>(path('en', sessionToken), { method: 'GET', fieldMask: mask });
  const local = await call<D>(path(lang), { method: 'GET', fieldMask: mask }).catch(() => en);
  const e = parts(en.addressComponents, en.formattedAddress);
  return { placeId: en.id, en: e, local: parts(local.addressComponents, local.formattedAddress), complete: !!(e.street && e.houseNumber && e.city) };
}

/* ── A small per-visitor brake so a stuck key or a bot cannot run up the bill ── */

const hits = new Map<string, { n: number; t: number }>();
export function allow(ip: string, perMinute: number): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 60_000) {
    hits.set(ip, { n: 1, t: now });
    if (hits.size > 5000) hits.clear();
    return true;
  }
  h.n += 1;
  return h.n <= perMinute;
}
export const clientIp = (req: Request) => req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
