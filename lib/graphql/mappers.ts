import type {
  Product,
  ProductCategory,
  ProductBadge,
  PricingUnit,
} from '@/lib/mockData';
import { deriveMonogram } from '@/store/catalog';

/**
 * Map a WPGraphQL product node to our internal `Product` type.
 *
 * The Next.js UI was designed around a richer schema (monogram,
 * tastingNote, pricing unit) than vanilla WooCommerce exposes. This
 * mapper bridges the two:
 *  – `monogram` is derived from the product name
 *  – `tastingNote` falls back to `shortDescription`
 *  – `pricingUnit` is derived from product tags ("per-kg", "per-piece",
 *    "per-box") or defaults to per_kg
 *  – `category` reads the first productCategory slug
 *  – `badges` are read from productTags (bestseller / new / kosher / …)
 *
 * Phase 2 (ACF) will replace the derivations with real custom-field
 * reads — at that point this mapper is the single file to update.
 */

type WPImage = { sourceUrl?: string | null; altText?: string | null };

type WPProductNode = {
  databaseId: number;
  slug: string;
  name?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  price?: string | null;
  regularPrice?: string | null;
  stockStatus?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_BACKORDER' | null;
  featuredImage?: { node?: WPImage | null } | null;
  galleryImages?: { nodes?: WPImage[] | null } | null;
  productCategories?: { nodes?: Array<{ slug: string; name: string }> | null } | null;
  productTags?: { nodes?: Array<{ slug: string; name: string }> | null } | null;
};

const CATEGORY_SLUG_MAP: Record<string, ProductCategory> = {
  kanafeh: 'kanafeh',
  knafeh: 'kanafeh',
  כנאפה: 'kanafeh',
  baklava: 'baklava',
  בקלאוה: 'baklava',
  'beirut-nights': 'beirut-nights',
  לילות: 'beirut-nights',
  maamoul: 'maamoul',
  מעמול: 'maamoul',
  halawa: 'halawa',
  חלאוה: 'halawa',
  awameh: 'awameh',
  עוואמה: 'awameh',
  'ice-cream': 'ice-cream',
  גלידה: 'ice-cream',
  'gift-boxes': 'gift-boxes',
  מארזים: 'gift-boxes',
};

const TAG_TO_BADGE: Record<string, ProductBadge> = {
  bestseller: 'bestseller',
  מומלץ: 'bestseller',
  new: 'new',
  חדש: 'new',
  seasonal: 'seasonal',
  עונתי: 'seasonal',
  kosher: 'kosher',
  כשר: 'kosher',
  vegan: 'vegan',
  טבעוני: 'vegan',
};

const TAG_TO_UNIT: Record<string, PricingUnit> = {
  'per-kg': 'per_kg',
  לקילו: 'per_kg',
  'per-piece': 'per_piece',
  'per-portion': 'per_piece',
  למנה: 'per_piece',
  'per-box': 'per_box',
  למארז: 'per_box',
};

export function mapWPProduct(node: WPProductNode): Product {
  const name = (node.name ?? '').trim() || '(ללא שם)';
  const shortDesc = stripHtml(node.shortDescription ?? '');
  const desc = stripHtml(node.description ?? '');
  const price = parseFloat(node.price ?? node.regularPrice ?? '0') || 0;

  const tagSlugs = (node.productTags?.nodes ?? []).map((t) => t.slug.toLowerCase());
  const categorySlugs = (node.productCategories?.nodes ?? []).map((c) => c.slug.toLowerCase());

  const category =
    categorySlugs.map((s) => CATEGORY_SLUG_MAP[s]).find(Boolean) ?? 'kanafeh';

  const unit = tagSlugs.map((t) => TAG_TO_UNIT[t]).find(Boolean) ?? 'per_kg';

  const badges = Array.from(
    new Set(
      tagSlugs
        .map((t) => TAG_TO_BADGE[t])
        .filter((b): b is ProductBadge => Boolean(b))
    )
  );

  const gallery = (node.galleryImages?.nodes ?? [])
    .map((img) => img.sourceUrl)
    .filter((u): u is string => Boolean(u));

  const image = node.featuredImage?.node?.sourceUrl ?? gallery[0] ?? undefined;

  return {
    id: `wp_${node.databaseId}`,
    slug: node.slug,
    monogram: deriveMonogram(name),
    name: { he: name, ar: name },
    tastingNote: { he: shortDesc, ar: shortDesc },
    description: { he: desc, ar: desc },
    ingredients: { he: '', ar: '' },
    price,
    unit,
    minWeight: unit === 'per_kg' ? 0.5 : undefined,
    weightStep: unit === 'per_kg' ? 0.25 : undefined,
    category,
    badges,
    inStock: node.stockStatus !== 'OUT_OF_STOCK',
    freshnessHours: 24,
    confirmed: true,
    image,
    gallery,
  };
}

export function mapWPProducts(nodes: WPProductNode[] = []): Product[] {
  return nodes.map(mapWPProduct);
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}
