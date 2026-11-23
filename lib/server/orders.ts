/**
 * Orders in the database. The server prices every order from the catalog,
 * so a changed browser cannot change what an order costs. Server only.
 */
import { shippingFor } from '@/lib/ordering';
import { MAX_GRAMS, MIN_GRAMS, STEP_GRAMS, weightLabel } from '@/lib/weight';
import { ORDER_STATUSES, type OrderItem, type OrderRecord, type OrderStatus } from '@/lib/orderStatus';
import { allProducts } from './catalog';
import { q } from './db';

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f]+/g, ' ').trim().slice(0, max) : '');

export type NewOrderInput = { lines: unknown; fulfilment: unknown; address: unknown; addressEn: unknown; date: unknown; window: unknown; notes: unknown };
type Customer = { id: number; phone: string; first_name: string; last_name: string; email: string };

/** Builds the order from the cart lines. Returns a Hebrew reason when it cannot be taken. */
export async function createOrder(input: NewOrderInput, customer: Customer): Promise<{ order: OrderRecord } | { problem: string }> {
  if (!Array.isArray(input.lines) || input.lines.length === 0 || input.lines.length > 40) return { problem: 'הסל ריק.' };
  const catalog = await allProducts();
  const items: OrderItem[] = [];
  for (const raw of input.lines) {
    const l = raw as { productId?: unknown; quantity?: unknown };
    const p = catalog.find((x) => x.id === l.productId && x.visible);
    if (!p) return { problem: 'אחד המוצרים בסל כבר לא נמכר. רעננו את הדף.' };
    if (!p.inStock) return { problem: `${p.name.he} אזל כרגע מהמלאי.` };
    if (!(p.price > 0)) return { problem: `ל${p.name.he} אין מחיר באתר. הזמינו אותו בטלפון.` };
    const n = Number(l.quantity);
    if (!Number.isFinite(n) || n <= 0) return { problem: 'כמות לא תקינה.' };
    if (p.unit === 'per_kg') {
      const grams = Math.round((n * 1000) / STEP_GRAMS) * STEP_GRAMS;
      if (grams < MIN_GRAMS || grams > MAX_GRAMS) return { problem: 'כמות לא תקינה.' };
      items.push({ productId: p.id, name: p.name.he, qtyLabel: weightLabel(grams, 'he'), quantity: grams / 1000, lineTotal: Math.round((p.price * grams) / 1000) });
    } else {
      const count = Math.round(n);
      if (count < 1 || count > 20) return { problem: 'כמות לא תקינה.' };
      items.push({ productId: p.id, name: p.name.he, qtyLabel: `×${count}`, quantity: count, lineTotal: p.price * count });
    }
  }
  const fulfilment = input.fulfilment === 'pickup' ? 'pickup' : 'delivery';
  const address = clean(input.address, 200);
  if (fulfilment === 'delivery' && address.length < 5) return { problem: 'חסרה כתובת למשלוח.' };
  const date = clean(input.date, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { problem: 'חסר תאריך.' };
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const shipping = shippingFor(subtotal, fulfilment);
  const ref = Date.now().toString(36).slice(-6).toUpperCase();
  const order: OrderRecord = {
    ref,
    status: 'new',
    createdAt: new Date().toISOString(),
    customer: { name: `${customer.first_name} ${customer.last_name}`.trim(), phone: customer.phone, email: customer.email },
    items,
    fulfilment,
    address: fulfilment === 'pickup' ? '' : address,
    addressEn: clean(input.addressEn, 200) || undefined,
    date,
    window: clean(input.window, 40),
    notes: clean(input.notes, 300) || undefined,
    subtotal,
    shipping,
    total: subtotal + shipping,
    payment: 'תשלום בקבלת ההזמנה',
  };
  await q('insert into orders (ref, customer_id, data, total, status) values ($1,$2,$3,$4,$5)', [ref, customer.id, JSON.stringify(order), order.total, 'new']);
  return { order };
}

type Row = { ref: string; data: OrderRecord; status: OrderStatus; created_at: Date | string };
const fromRow = (r: Row): OrderRecord => ({ ...r.data, ref: r.ref, status: r.status, createdAt: new Date(r.created_at).toISOString() });

export async function listOrders(limit = 200): Promise<OrderRecord[]> {
  return (await q<Row>('select ref, data, status, created_at from orders order by created_at desc limit $1', [limit])).map(fromRow);
}

export async function setOrderStatus(ref: string, status: string): Promise<boolean> {
  if (!(ORDER_STATUSES as readonly string[]).includes(status)) return false;
  const rows = await q('update orders set status = $1, updated_at = now() where ref = $2 returning ref', [status, ref]);
  return rows.length === 1;
}
