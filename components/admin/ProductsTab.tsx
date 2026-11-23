'use client';

import { useCallback, useEffect, useState } from 'react';
import { categoryLabels, orderedCategories, type PricingUnit, type Product, type ProductCategory } from '@/lib/mockData';
import { api, BTN, BTN_DANGER, BTN_PLAIN, BTN_PRIMARY, CARD, Confirm, INPUT, Notice, shekel } from './ui';

type Managed = Product & { visible: boolean };
const CATEGORIES = [...orderedCategories, ...(Object.keys(categoryLabels) as ProductCategory[]).filter((c) => !orderedCategories.includes(c))];
const UNIT_TEXT: Record<PricingUnit, string> = { per_kg: 'לפי משקל (מחיר לק״ג)', per_piece: 'ליחידה', per_box: 'למגש או למארז' };
const unitShort = (p: Product) => (p.unit === 'per_kg' ? 'לק״ג' : p.unitLabel?.he || (p.unit === 'per_piece' ? 'ליחידה' : 'למגש'));

/**
 * The catalog: a list with a photo, the price and two big buttons per
 * product (in stock or sold out, change price), plus a simple form for
 * adding or editing. Every change is on the site right away.
 */
export function ProductsTab({ onSignedOut }: { onSignedOut: () => void }) {
  const [products, setProducts] = useState<Managed[] | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [editing, setEditing] = useState<Managed | 'new' | null>(null);
  const [pricing, setPricing] = useState<Managed | null>(null);

  const load = useCallback(async () => {
    const r = await api<{ products: Managed[] }>('/api/admin/products');
    if (r.status === 401) return onSignedOut();
    if (!r.ok || !r.data) return setError(r.message || '');
    setProducts(r.data.products);
  }, [onSignedOut]);
  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const flash = (text: string) => { setSaved(text); setTimeout(() => setSaved(''), 4000); };

  const quick = async (p: Managed, patch: { price?: number; inStock?: boolean }, done: string) => {
    setError('');
    setProducts((list) => list?.map((x) => (x.id === p.id ? { ...x, ...patch } : x)) ?? null);
    const r = await api('/api/admin/products', { method: 'PATCH', body: { id: p.id, ...patch } });
    if (r.ok) flash(done);
    else { setError(r.message || ''); load(); }
  };

  if (products === null) return <p className="text-xl">{error || 'טוען מוצרים…'}</p>;
  if (editing) return <ProductForm product={editing === 'new' ? null : editing} onClose={(msg) => { setEditing(null); if (msg) { flash(msg); load(); } }} />;

  return (
    <section aria-label="מוצרים">
      <button type="button" onClick={() => setEditing('new')} className={`${BTN} ${BTN_PRIMARY} w-full`}>+ הוספת מוצר חדש</button>
      <div className="mt-4 min-h-14" aria-live="polite">
        {saved && <Notice kind="ok">✓ {saved}</Notice>}
        {error && <Notice kind="error">{error}</Notice>}
      </div>

      {CATEGORIES.map((cat) => {
        const list = products.filter((p) => p.category === cat);
        if (list.length === 0) return null;
        return (
          <div key={cat} className="mt-6">
            <h2 className="text-2xl font-bold mb-3">{categoryLabels[cat].he}</h2>
            <ul className="space-y-3">
              {list.map((p) => (
                <li key={p.id} className={`${CARD} p-3 sm:p-4 ${!p.visible ? 'opacity-70' : ''}`}>
                  <div className="flex items-center gap-3 sm:gap-4">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt="" className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-[#EFEADF] shrink-0" loading="lazy" />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#EFEADF] shrink-0 flex items-center justify-center text-sm text-[#5A5347] text-center">אין תמונה</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xl sm:text-2xl font-bold">{p.name.he}</p>
                      <p className="text-xl">
                        <bdi dir="ltr" className="font-bold">{p.price > 0 ? shekel(p.price) : 'ללא מחיר'}</bdi> <span className="text-[#5A5347]">{unitShort(p)}</span>
                        {!p.visible && <span className="ms-3 px-2 py-0.5 rounded bg-[#5A5347] text-white text-base">מוסתר מהאתר</span>}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => quick(p, { inStock: !p.inStock }, p.inStock ? `${p.name.he} סומן כאזל` : `${p.name.he} חזר למלאי`)}
                      aria-pressed={p.inStock}
                      className={`${BTN} ${p.inStock ? 'bg-[#E8F5E9] border-[#1B5E20] text-[#1B5E20]' : 'bg-[#C62828] border-[#C62828] text-white'}`}
                    >
                      {p.inStock ? '✓ יש במלאי' : '✗ אזל מהמלאי'}
                    </button>
                    <button type="button" onClick={() => setPricing(p)} className={`${BTN} ${BTN_PLAIN}`}>שינוי מחיר</button>
                    <button type="button" onClick={() => setEditing(p)} className={`${BTN} ${BTN_PLAIN}`}>עריכה ותמונה</button>
                  </div>
                  <p className="mt-2 text-base text-[#5A5347]">{p.inStock ? 'לחיצה על הכפתור הירוק מסמנת שהמוצר אזל.' : 'המוצר מוצג באתר כ"אזל" ואי אפשר להזמין אותו. לחיצה מחזירה אותו למלאי.'}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {pricing && <PriceBox product={pricing} onClose={() => setPricing(null)} onSave={(price) => { quick(pricing, { price }, `המחיר של ${pricing.name.he} עודכן ל-${shekel(price)}`); setPricing(null); }} />}
    </section>
  );
}

function PriceBox({ product, onClose, onSave }: { product: Managed; onClose: () => void; onSave: (price: number) => void }) {
  const [value, setValue] = useState(String(product.price || ''));
  const n = Number(value);
  const valid = value.trim() !== '' && Number.isFinite(n) && n >= 0 && n <= 100000;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <form className="w-full max-w-md bg-white rounded-2xl p-6 border-4 border-[#1B1712]" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); if (valid) onSave(Math.round(n)); }}>
        <h2 className="text-2xl font-bold">מחיר חדש: {product.name.he}</h2>
        <p className="mt-1 text-lg text-[#5A5347]">המחיר היום: <bdi dir="ltr">{shekel(product.price)}</bdi> {unitShort(product)}</p>
        <label className="block mt-5">
          <span className="block mb-2 text-xl font-semibold">מחיר בשקלים {unitShort(product)}</span>
          <input type="number" inputMode="numeric" min={0} step={1} autoFocus required value={value} onChange={(e) => setValue(e.target.value)} className={`${INPUT} text-3xl font-bold text-center`} dir="ltr" />
        </label>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" onClick={onClose} className={`${BTN} ${BTN_PLAIN}`}>ביטול</button>
          <button type="submit" disabled={!valid} className={`${BTN} ${BTN_PRIMARY}`}>שמירה</button>
        </div>
      </form>
    </div>
  );
}

/** Shrinks a phone photo to at most 1600px and re-saves it, so uploads are quick and pages stay light. */
async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/webp', 0.86));
  if (blob && blob.type === 'image/webp') return blob;
  return (await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.88))) ?? file;
}

function ProductForm({ product, onClose }: { product: Managed | null; onClose: (savedMessage?: string) => void }) {
  const [f, setF] = useState({
    nameHe: product?.name.he ?? '',
    nameAr: product?.name.ar ?? '',
    noteHe: product?.tastingNote.he ?? '',
    descriptionHe: product?.description.he ?? '',
    category: product?.category ?? ('baklava' as ProductCategory),
    unit: product?.unit ?? ('per_kg' as PricingUnit),
    unitLabelHe: product?.unitLabel?.he ?? '',
    price: product ? String(product.price) : '',
    image: product?.image ?? '',
    inStock: product?.inStock ?? true,
    visible: product?.visible ?? true,
  });
  const [busy, setBusy] = useState<'' | 'photo' | 'save' | 'delete'>('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));

  const pickPhoto = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setBusy('photo');
    try {
      const r = await api<{ url: string }>('/api/admin/upload', { method: 'POST', raw: await shrink(file) });
      if (r.ok && r.data) set('image', r.data.url);
      else setError(r.message || 'העלאת התמונה נכשלה.');
    } catch {
      setError('לא הצלחנו לקרוא את התמונה. נסו תמונה אחרת.');
    }
    setBusy('');
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy('save');
    const r = await api('/api/admin/products', { method: 'POST', body: { ...f, id: product?.id, price: Number(f.price) } });
    setBusy('');
    if (r.ok) onClose(product ? `${f.nameHe} נשמר` : `${f.nameHe} נוסף לאתר`);
    else setError(r.message || '');
  };

  const label = 'block mb-2 text-xl font-semibold';
  return (
    <form onSubmit={save} className="space-y-6" aria-label={product ? 'עריכת מוצר' : 'מוצר חדש'}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl sm:text-3xl font-bold">{product ? `עריכה: ${product.name.he}` : 'מוצר חדש'}</h2>
        <button type="button" onClick={() => onClose()} className={`${BTN} ${BTN_PLAIN}`}>חזרה לרשימה</button>
      </div>

      <div className={`${CARD} p-4 sm:p-6 space-y-5`}>
        <div>
          <span className={label}>תמונה</span>
          <div className="flex flex-wrap items-center gap-4">
            {f.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.image} alt="התמונה של המוצר" className="w-40 h-40 rounded-xl object-cover bg-[#EFEADF]" />
            ) : (
              <div className="w-40 h-40 rounded-xl bg-[#EFEADF] flex items-center justify-center text-[#5A5347]">אין תמונה</div>
            )}
            <label className={`${BTN} ${BTN_PLAIN} cursor-pointer`}>
              {busy === 'photo' ? 'מעלה תמונה…' : f.image ? 'החלפת תמונה' : 'בחירת תמונה'}
              <input type="file" accept="image/*" className="sr-only" disabled={busy !== ''} onChange={(e) => pickPhoto(e.target.files?.[0])} />
            </label>
          </div>
          <p className="mt-2 text-base text-[#5A5347]">אפשר לצלם בטלפון או לבחור תמונה מהגלריה.</p>
        </div>

        <label className="block">
          <span className={label}>שם המוצר</span>
          <input type="text" required minLength={2} maxLength={80} value={f.nameHe} onChange={(e) => set('nameHe', e.target.value)} className={INPUT} />
        </label>
        <label className="block">
          <span className={label}>שם המוצר בערבית <span className="font-normal text-[#5A5347]">(לא חובה)</span></span>
          <input type="text" maxLength={80} dir="rtl" lang="ar" value={f.nameAr} onChange={(e) => set('nameAr', e.target.value)} className={INPUT} />
        </label>

        <div className="grid sm:grid-cols-2 gap-5">
          <label className="block">
            <span className={label}>קטגוריה</span>
            <select value={f.category} onChange={(e) => set('category', e.target.value as ProductCategory)} className={INPUT}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{categoryLabels[c].he}</option>)}
            </select>
          </label>
          <label className="block">
            <span className={label}>איך מוכרים אותו</span>
            <select value={f.unit} onChange={(e) => set('unit', e.target.value as PricingUnit)} className={INPUT}>
              {(Object.keys(UNIT_TEXT) as PricingUnit[]).map((u) => <option key={u} value={u}>{UNIT_TEXT[u]}</option>)}
            </select>
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <label className="block">
            <span className={label}>מחיר בשקלים {f.unit === 'per_kg' ? 'לק״ג' : ''}</span>
            <input type="number" inputMode="numeric" min={0} step={1} required value={f.price} onChange={(e) => set('price', e.target.value)} className={INPUT} dir="ltr" />
          </label>
          {f.unit !== 'per_kg' && (
            <label className="block">
              <span className={label}>מה מקבלים <span className="font-normal text-[#5A5347]">(לא חובה)</span></span>
              <input type="text" maxLength={40} placeholder="למשל: מגש 1 ק״ג" value={f.unitLabelHe} onChange={(e) => set('unitLabelHe', e.target.value)} className={INPUT} />
            </label>
          )}
        </div>

        <label className="block">
          <span className={label}>שורה קצרה מתחת לשם <span className="font-normal text-[#5A5347]">(לא חובה)</span></span>
          <input type="text" maxLength={120} value={f.noteHe} onChange={(e) => set('noteHe', e.target.value)} className={INPUT} />
        </label>
        <label className="block">
          <span className={label}>תיאור <span className="font-normal text-[#5A5347]">(לא חובה)</span></span>
          <textarea rows={3} maxLength={600} value={f.descriptionHe} onChange={(e) => set('descriptionHe', e.target.value)} className={`${INPUT} py-3`} />
        </label>

        <label className="flex items-center gap-4 text-xl font-semibold">
          <input type="checkbox" checked={f.inStock} onChange={(e) => set('inStock', e.target.checked)} className="w-7 h-7" />
          יש במלאי
        </label>
        <label className="flex items-center gap-4 text-xl font-semibold">
          <input type="checkbox" checked={f.visible} onChange={(e) => set('visible', e.target.checked)} className="w-7 h-7" />
          להציג את המוצר באתר
        </label>
      </div>

      {error && <Notice kind="error">{error}</Notice>}
      <div className="grid sm:grid-cols-2 gap-3">
        <button type="submit" disabled={busy !== ''} className={`${BTN} ${BTN_PRIMARY}`}>{busy === 'save' ? 'שומר…' : product ? 'שמירת השינויים' : 'הוספה לאתר'}</button>
        <button type="button" onClick={() => onClose()} className={`${BTN} ${BTN_PLAIN}`}>ביטול</button>
      </div>
      {product && (
        <button type="button" onClick={() => setConfirmDelete(true)} className={`${BTN} ${BTN_DANGER} w-full`}>מחיקת המוצר מהאתר</button>
      )}
      {confirmDelete && product && (
        <Confirm
          title={`למחוק את ${product.name.he}?`}
          text={'המוצר יימחק מהאתר ואי אפשר לשחזר אותו.\nאם הוא רק אזל, עדיף לסמן "אזל מהמלאי".'}
          yes="כן, למחוק"
          danger
          busy={busy === 'delete'}
          onNo={() => setConfirmDelete(false)}
          onYes={async () => {
            setBusy('delete');
            const r = await api(`/api/admin/products?id=${encodeURIComponent(product.id)}`, { method: 'DELETE' });
            setBusy('');
            if (r.ok) onClose(`${product.name.he} נמחק`);
            else { setConfirmDelete(false); setError(r.message || ''); }
          }}
        />
      )}
    </form>
  );
}
