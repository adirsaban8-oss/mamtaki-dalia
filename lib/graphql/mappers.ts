import {
  categoryLabels,
  type Product,
  type ProductCategory,
  type ProductBadge,
  type PricingUnit,
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
  menuOrder?: number | null;
  price?: string | null;
  regularPrice?: string | null;
  attributes?: { nodes?: Array<{ name?: string | null; label?: string | null; options?: string[] | null }> | null } | null;
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
  בקלאווה: 'baklava',
  בקלאוה: 'baklava',
  trays: 'trays',
  מגשים: 'trays',
  'fruit-desserts': 'fruit-desserts',
  'קינוחי-פירות': 'fruit-desserts',
  cakes: 'cakes',
  עוגות: 'cakes',
  frozen: 'frozen',
  'ice-cream': 'frozen',
  קפואים: 'frozen',
};

/** Categories may also be matched by their display name (he / ar), so
 *  the owner can create them in WordPress without typing English slugs. */
const CATEGORY_BY_NAME: Record<string, ProductCategory> = Object.fromEntries(
  (Object.entries(categoryLabels) as [ProductCategory, { he: string; ar: string }][]).flatMap(
    ([cat, label]) => [
      [label.he, cat],
      [label.ar, cat],
    ]
  )
);

/** WooCommerce attribute names (any language) that feed the product page. */
const ALLERGEN_ATTRS = ['allergens', 'אלרגנים', 'מידע על אלרגנים'];
const STORAGE_ATTRS = ['storage', 'אחסנה', 'דרך אחסנה'];

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

  const categoryNames = (node.productCategories?.nodes ?? []).map((c) => c.name.trim());
  const category =
    categorySlugs.map((s) => CATEGORY_SLUG_MAP[decodeSlug(s)]).find(Boolean) ??
    categoryNames.map((n) => CATEGORY_BY_NAME[n]).find(Boolean) ??
    'kanafeh';

  const allergens = readAttribute(node, ALLERGEN_ATTRS);
  const storage = readAttribute(node, STORAGE_ATTRS);

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
    allergens: allergens ? { he: allergens, ar: allergens } : undefined,
    storage: storage ? { he: storage, ar: storage } : undefined,
  };
}

/** WordPress percent-encodes non-Latin slugs (e.g. Hebrew category slugs). */
function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function readAttribute(node: WPProductNode, names: string[]): string {
  const attr = (node.attributes?.nodes ?? []).find((a) =>
    [a.name, a.label].some((n) => n && names.includes(n.trim().toLowerCase()))
  );
  return (attr?.options ?? []).map((o) => o.trim()).filter(Boolean).join(', ');
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
