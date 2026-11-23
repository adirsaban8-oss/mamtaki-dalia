import type { PricingUnit, ProductCategory } from '@/lib/mockData';
import { adminRefusal } from '@/lib/server/admin';
import { allProducts, deleteProduct, saveProduct, slugify, type ManagedProduct } from '@/lib/server/catalog';

export const dynamic = 'force-dynamic';

const CATEGORIES: ProductCategory[] = ['kanafeh', 'baklava', 'trays', 'fruit-desserts', 'cakes', 'frozen'];
const UNITS: PricingUnit[] = ['per_kg', 'per_piece', 'per_box'];
const text = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000b-\u001f<>]+/g, ' ').trim().slice(0, max) : '');
const price = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 100000 ? Math.round(v) : null);
const image = (v: unknown) => (typeof v === 'string' && /^\/(images\/|api\/img\/)[\w\-./]+$/.test(v) ? v : undefined);

export async function GET() {
  const no = await adminRefusal();
  if (no) return no;
  return Response.json({ products: await allProducts() });
}

/**
 * POST: add a product or save an edited one. The shop fills in Hebrew; a
 * missing Arabic name falls back to the Hebrew one so nothing shows empty.
 */
export async function POST(req: Request) {
  const no = await adminRefusal();
  if (no) return no;
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return Response.json({ error: 'bad request' }, { status: 400 });
  const all = await allProducts();
  const existing = typeof b.id === 'string' ? all.find((p) => p.id === b.id) : undefined;
  const nameHe = text(b.nameHe, 80);
  if (nameHe.length < 2) return Response.json({ error: 'name', message: 'חסר שם למוצר.' }, { status: 400 });
  const p = price(b.price);
  if (p === null) return Response.json({ error: 'price', message: 'המחיר צריך להיות מספר.' }, { status: 400 });
  const category = CATEGORIES.includes(b.category as ProductCategory) ? (b.category as ProductCategory) : existing?.category ?? 'baklava';
  const unit = UNITS.includes(b.unit as PricingUnit) ? (b.unit as PricingUnit) : existing?.unit ?? 'per_kg';
  const nameAr = text(b.nameAr, 80) || existing?.name.ar || nameHe;
  const noteHe = text(b.noteHe, 120);
  const descHe = text(b.descriptionHe, 600);
  const unitLabelHe = text(b.unitLabelHe, 40);

  let slug = existing?.slug ?? slugify(text(b.nameEn, 60) || nameHe);
  while (!existing && all.some((x) => x.slug === slug)) slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;

  const product: ManagedProduct = {
    ...(existing ?? { monogram: nameHe.slice(0, 1), ingredients: { he: '', ar: '' }, badges: [], freshnessHours: 24, confirmed: true }),
    id: existing?.id ?? `p_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    slug,
    name: { he: nameHe, ar: nameAr },
    tastingNote: { he: noteHe, ar: existing && existing.tastingNote.he === noteHe ? existing.tastingNote.ar : text(b.noteAr, 120) || noteHe },
    description: { he: descHe, ar: existing && existing.description.he === descHe ? existing.description.ar : text(b.descriptionAr, 600) || descHe },
    unitLabel: unit === 'per_kg' || !unitLabelHe ? undefined : { he: unitLabelHe, ar: existing?.unitLabel?.he === unitLabelHe ? existing.unitLabel.ar : unitLabelHe },
    price: p,
    unit,
    category,
    inStock: b.inStock !== false,
    visible: b.visible !== false,
    image: image(b.image) ?? existing?.image,
    sort: existing?.sort ?? all.length,
  };
  await saveProduct(product);
  return Response.json({ product });
}

/** PATCH { id, price?, inStock?, visible? }: the quick buttons on the product list. */
export async function PATCH(req: Request) {
  const no = await adminRefusal();
  if (no) return no;
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const existing = (await allProducts()).find((p) => p.id === b?.id);
  if (!b || !existing) return Response.json({ error: 'missing', message: 'המוצר לא נמצא.' }, { status: 404 });
  const next = { ...existing };
  if ('price' in b) {
    const p = price(b.price);
    if (p === null) return Response.json({ error: 'price', message: 'המחיר צריך להיות מספר.' }, { status: 400 });
    next.price = p;
  }
  if (typeof b.inStock === 'boolean') next.inStock = b.inStock;
  if (typeof b.visible === 'boolean') next.visible = b.visible;
  await saveProduct(next);
  return Response.json({ product: next });
}

export async function DELETE(req: Request) {
  const no = await adminRefusal();
  if (no) return no;
  const id = new URL(req.url).searchParams.get('id') ?? '';
  await deleteProduct(id);
  return Response.json({ ok: true });
}
