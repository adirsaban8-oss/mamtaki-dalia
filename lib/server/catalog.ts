/**
 * The product catalog as the shop manages it in /admin. Server only.
 * Without a database the starter catalog is returned, so the site always
 * has something to show.
 */
import { seedCatalog } from '@/lib/data/catalogSeed';
import type { Product } from '@/lib/mockData';
import { dbEnabled, q } from './db';

export type ManagedProduct = Product & { visible: boolean; sort: number };

type Row = { id: string; slug: string; data: Product; price: number; in_stock: boolean; visible: boolean; sort: number };
const fromRow = (r: Row): ManagedProduct => ({ ...r.data, id: r.id, slug: r.slug, price: r.price, inStock: r.in_stock, visible: r.visible, sort: r.sort });

// Kept on globalThis: pages and API routes are bundled separately, and a
// change made through the admin API must reach the pages at once.
const mem = globalThis as unknown as { __mdCatalog?: { at: number; all: ManagedProduct[] } | null };
export const bustCatalog = () => { mem.__mdCatalog = null; };

/** Every product, hidden ones too, in the shop's order. */
export async function allProducts(): Promise<ManagedProduct[]> {
  if (!dbEnabled()) return seedCatalog.map((p, i) => ({ ...p, visible: true, sort: i }));
  const cache = mem.__mdCatalog;
  if (cache && Date.now() - cache.at < 20_000) return cache.all;
  try {
    const rows = await q<Row>('select id, slug, data, price, in_stock, visible, sort from products order by sort, slug');
    const all = rows.map(fromRow);
    mem.__mdCatalog = { at: Date.now(), all };
    return all;
  } catch (e) {
    console.error('catalog: database unavailable, showing the starter catalog', e instanceof Error ? e.message : e);
    return seedCatalog.map((p, i) => ({ ...p, visible: true, sort: i }));
  }
}

/** What customers see. */
export async function publicCatalog(): Promise<Product[]> {
  return (await allProducts()).filter((p) => p.visible);
}

export async function findProduct(slug: string): Promise<Product | undefined> {
  const s = decodeURIComponent(slug);
  return (await publicCatalog()).find((p) => p.slug === s);
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function slugify(name: string): string {
  const latin = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return SLUG.test(latin) && latin.length >= 3 ? latin.slice(0, 60) : 'item-' + Date.now().toString(36);
}

export async function saveProduct(p: ManagedProduct): Promise<void> {
  const { visible, sort, ...data } = p;
  await q(
    `insert into products (id, slug, data, price, in_stock, visible, sort, updated_at) values ($1,$2,$3,$4,$5,$6,$7, now())
     on conflict (id) do update set slug = excluded.slug, data = excluded.data, price = excluded.price, in_stock = excluded.in_stock, visible = excluded.visible, sort = excluded.sort, updated_at = now()`,
    [p.id, p.slug, JSON.stringify(data), p.price, p.inStock, visible, sort]
  );
  bustCatalog();
}

export async function deleteProduct(id: string): Promise<void> {
  await q('delete from products where id = $1', [id]);
  bustCatalog();
}
