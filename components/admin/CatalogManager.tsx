'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Locale } from '@/i18n/locales';
import {
  categoryLabels,
  orderedCategories,
  type ProductCategory,
  type ProductBadge,
  type PricingUnit,
} from '@/lib/mockData';
import {
  useCatalog,
  blankProduct,
  deriveMonogram,
  deriveSlug,
  type CatalogProduct,
} from '@/store/catalog';
import { Link } from '@/i18n/navigation';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

const ALL_BADGES: ProductBadge[] = ['bestseller', 'new', 'seasonal', 'kosher', 'vegan'];
const ALL_UNITS: PricingUnit[] = ['per_kg', 'per_piece', 'per_box'];

type Props = { locale: Locale };

/**
 * Catalog manager — the shop owner's editorial control over the public
 * shop. Group by category, in-line toggles for stock/visibility, plus
 * a full product form modal for create / edit.
 */
export function CatalogManager({ locale }: Props) {
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';
  const products = useCatalog((s) => s.products);
  const removeProduct = useCatalog((s) => s.removeProduct);
  const duplicateProduct = useCatalog((s) => s.duplicateProduct);
  const setVisible = useCatalog((s) => s.setVisible);
  const setInStock = useCatalog((s) => s.setInStock);

  const [editing, setEditing] = useState<CatalogProduct | null>(null);
  const [creatingFor, setCreatingFor] = useState<ProductCategory | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.name.he.toLowerCase().includes(q) ||
        p.name.ar.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    );
  }, [products, search]);

  const grouped = useMemo(() => {
    const map = new Map<ProductCategory, CatalogProduct[]>();
    for (const cat of orderedCategories) {
      map.set(cat, filtered.filter((p) => p.category === cat));
    }
    return map;
  }, [filtered]);

  return (
    <div className="space-y-8">
      {/* Toolbar */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="font-display-en text-[10px] tracking-eyebrow uppercase text-coffee-muted">
            {locale === 'ar' ? 'إدارة الكتالوج' : 'ניהול הקטלוג'}
          </p>
          <h2 className={`${displayFont} font-black text-2xl md:text-3xl text-cedar tracking-display mt-1`}>
            {locale === 'ar' ? `${products.length} منتج في القائمة` : `${products.length} מוצרים בתפריט`}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={locale === 'ar' ? 'بحث' : 'חיפוש'}
            className="h-11 px-4 bg-cream-card border border-gold-deep/40 text-cedar text-sm focus:outline-none focus:border-gold transition-colors duration-300 rounded-[2px] w-full md:w-56"
          />
        </div>
      </section>

      {/* Empty state */}
      {products.length === 0 && (
        <div className="bg-cream-card border border-gold-deep/30 rounded-[2px] py-16 px-8 text-center">
          <p className={`${displayFont} font-black text-2xl md:text-3xl text-cedar`}>
            {locale === 'ar' ? 'القائمة فارغة' : 'התפריט ריק'}
          </p>
          <p className="mt-3 text-base text-ink/70 leading-relaxed max-w-md mx-auto">
            {locale === 'ar'
              ? 'ابدأ بإضافة منتجك الأول إلى أي فئة أدناه.'
              : 'התחילו להוסיף את המוצר הראשון לאחת מהקטגוריות למטה.'}
          </p>
        </div>
      )}

      {/* Category sections */}
      <section className="space-y-12">
        {Array.from(grouped.entries()).map(([category, items]) => (
          <div key={category}>
            <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-gold-deep/20">
              <h3 className={`${displayFont} font-black text-xl md:text-2xl text-cedar tracking-display`}>
                {categoryLabels[category][locale]}
                <span className="ms-3 font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
                  · {items.length}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setCreatingFor(category)}
                className="font-display-en text-[11px] tracking-eyebrow uppercase text-cedar hover:text-burgundy transition-colors duration-500"
              >
                {locale === 'ar' ? '+ منتج جديد' : '+ מוצר חדש'}
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-coffee-muted italic py-4">
                {locale === 'ar' ? 'لا توجد منتجات في هذه الفئة بعد.' : 'אין מוצרים בקטגוריה זו עדיין.'}
              </p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    locale={locale}
                    onEdit={() => setEditing(product)}
                    onDuplicate={() => duplicateProduct(product.id)}
                    onDelete={() => {
                      if (confirm(locale === 'ar' ? 'حذف المنتج؟' : 'למחוק את המוצר?')) {
                        removeProduct(product.id);
                      }
                    }}
                    onToggleVisible={() => setVisible(product.id, product.visible === false ? true : false)}
                    onToggleStock={() => setInStock(product.id, !product.inStock)}
                  />
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      {/* Modal — edit or create */}
      <AnimatePresence>
        {(editing || creatingFor) && (
          <ProductFormModal
            locale={locale}
            initial={editing ?? { ...blankProduct(creatingFor!), id: '' }}
            isNew={!editing}
            onClose={() => {
              setEditing(null);
              setCreatingFor(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Product row ─────────────────────────────────────────────────── */

function ProductRow({
  product,
  locale,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleVisible,
  onToggleStock,
}: {
  product: CatalogProduct;
  locale: Locale;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleVisible: () => void;
  onToggleStock: () => void;
}) {
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';
  const isVisible = product.visible !== false;

  return (
    <li className={`bg-cream-card border border-gold-deep/30 rounded-[2px] p-4 md:p-5 flex gap-4 ${!isVisible ? 'opacity-60' : ''}`}>
      {/* Image or monogram */}
      <div className="shrink-0 w-20 h-20 bg-ivory border border-gold-deep/30 rounded-[2px] flex items-center justify-center overflow-hidden">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="font-display-en text-[10px] tracking-[0.3em] text-gold leading-tight text-center px-1">
            {product.monogram || 'M · D'}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h4 className={`${displayFont} font-black text-cedar text-base leading-tight truncate`}>
            {product.name[locale] || product.name.he || product.name.ar || '(unnamed)'}
          </h4>
          <span className="font-display-en text-sm text-burgundy tabular-nums shrink-0">
            ₪{product.price}
          </span>
        </div>
        <p className="mt-1 text-[12px] text-ink/65 line-clamp-1">
          {product.tastingNote[locale] || ''}
        </p>

        {/* Toggles + actions row */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-display-en tracking-eyebrow uppercase">
          <ToggleChip
            label={product.inStock ? (locale === 'ar' ? 'متوفر' : 'במלאי') : (locale === 'ar' ? 'نفد' : 'אזל')}
            active={product.inStock}
            activeClass="bg-pistachio/20 text-pistachio border-pistachio/40"
            inactiveClass="bg-burgundy/10 text-burgundy border-burgundy/40"
            onClick={onToggleStock}
          />
          <ToggleChip
            label={isVisible ? (locale === 'ar' ? 'ظاهر' : 'גלוי') : (locale === 'ar' ? 'مخفي' : 'מוסתר')}
            active={isVisible}
            activeClass="bg-cedar/10 text-cedar border-cedar/30"
            inactiveClass="bg-sand/60 text-coffee-muted border-gold-deep/30"
            onClick={onToggleVisible}
          />
          <div className="ms-auto flex items-center gap-3">
            <Link
              href={`/shop/${product.slug}`}
              target="_blank"
              className="text-coffee-muted hover:text-cedar transition-colors duration-300"
              aria-label="Preview"
            >
              ↗
            </Link>
            <button type="button" onClick={onDuplicate} className="text-coffee-muted hover:text-cedar transition-colors duration-300" aria-label="Duplicate">
              ⎘
            </button>
            <button type="button" onClick={onEdit} className="text-cedar hover:text-burgundy transition-colors duration-300 underline underline-offset-4">
              {locale === 'ar' ? 'تحرير' : 'עריכה'}
            </button>
            <button type="button" onClick={onDelete} className="text-coffee-muted hover:text-burgundy transition-colors duration-300" aria-label="Delete">
              ✕
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

function ToggleChip({
  label,
  active,
  activeClass,
  inactiveClass,
  onClick,
}: {
  label: string;
  active: boolean;
  activeClass: string;
  inactiveClass: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 border rounded-[2px] transition-colors duration-300 ${active ? activeClass : inactiveClass}`}
    >
      {label}
    </button>
  );
}

/* ─── Product form modal ─────────────────────────────────────────── */

function ProductFormModal({
  locale,
  initial,
  isNew,
  onClose,
}: {
  locale: Locale;
  initial: CatalogProduct;
  isNew: boolean;
  onClose: () => void;
}) {
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';
  const addProduct = useCatalog((s) => s.addProduct);
  const updateProduct = useCatalog((s) => s.updateProduct);

  const [form, setForm] = useState<CatalogProduct>({ ...initial });

  const set = <K extends keyof CatalogProduct>(key: K, value: CatalogProduct[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setName = (lang: 'he' | 'ar', val: string) => {
    setForm((f) => {
      const next = { ...f, name: { ...f.name, [lang]: val } };
      // Auto-fill slug + monogram on Hebrew name change (only when creating)
      if (lang === 'he' && isNew) {
        if (!f.slug) next.slug = deriveSlug(val);
        if (!f.monogram) next.monogram = deriveMonogram(val);
      }
      return next;
    });
  };

  const setTransField = (
    field: 'tastingNote' | 'description' | 'ingredients',
    lang: 'he' | 'ar',
    val: string
  ) => setForm((f) => ({ ...f, [field]: { ...f[field], [lang]: val } }));

  const toggleBadge = (badge: ProductBadge) =>
    setForm((f) => ({
      ...f,
      badges: f.badges.includes(badge)
        ? f.badges.filter((b) => b !== badge)
        : [...f.badges, badge],
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.he && !form.name.ar) {
      alert(locale === 'ar' ? 'يجب إدخال اسم بالعربية أو العبرية' : 'חובה להזין שם בעברית או ערבית');
      return;
    }
    if (!form.slug) {
      set('slug', deriveSlug(form.name.he || form.name.ar) || `p-${Date.now().toString(36)}`);
    }
    if (!form.monogram) {
      set('monogram', deriveMonogram(form.name.he || form.name.ar));
    }
    if (isNew) {
      const { id: _id, ...payload } = form;
      addProduct(payload);
    } else {
      updateProduct(form.id, form);
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[80] bg-cedar/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.5, ease: easeLuxe }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-ivory rounded-[2px] shadow-deep my-8"
      >
        <header className="px-6 md:px-10 py-5 border-b border-gold-deep/30 flex items-center justify-between">
          <h3 className={`${displayFont} font-black text-xl md:text-2xl text-cedar tracking-display`}>
            {isNew
              ? (locale === 'ar' ? 'منتج جديد' : 'מוצר חדש')
              : (locale === 'ar' ? 'تحرير المنتج' : 'עריכת מוצר')}
          </h3>
          <button type="button" onClick={onClose} className="text-coffee-muted hover:text-burgundy transition-colors" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M 5 5 L 19 19" /><path d="M 19 5 L 5 19" />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
          {/* Image */}
          <Field label={locale === 'ar' ? 'صورة المنتج' : 'תמונת מוצר'}>
            <ImageUploader value={form.image} onChange={(v) => set('image', v)} locale={locale} />
          </Field>

          {/* Names */}
          <div className="grid md:grid-cols-2 gap-4">
            <Field label={locale === 'ar' ? 'الاسم (عبرية)' : 'שם (עברית)'} required>
              <input
                type="text"
                value={form.name.he}
                onChange={(e) => setName('he', e.target.value)}
                className={inputClass}
                required
              />
            </Field>
            <Field label={locale === 'ar' ? 'الاسم (عربية)' : 'שם (ערבית)'}>
              <input
                type="text"
                value={form.name.ar}
                onChange={(e) => setName('ar', e.target.value)}
                className={inputClass}
                dir="rtl"
              />
            </Field>
          </div>

          {/* Tasting notes */}
          <div className="grid md:grid-cols-2 gap-4">
            <Field label={locale === 'ar' ? 'ملاحظة التذوق (عبرية)' : 'תיאור קצר (עברית)'}>
              <input
                type="text"
                value={form.tastingNote.he}
                onChange={(e) => setTransField('tastingNote', 'he', e.target.value)}
                className={inputClass}
                placeholder="גבינה רכה · סירופ ורדים · פיסטוק"
              />
            </Field>
            <Field label={locale === 'ar' ? 'ملاحظة التذوق (عربية)' : 'תיאור קצר (ערבית)'}>
              <input
                type="text"
                value={form.tastingNote.ar}
                onChange={(e) => setTransField('tastingNote', 'ar', e.target.value)}
                className={inputClass}
                dir="rtl"
              />
            </Field>
          </div>

          {/* Descriptions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Field label={locale === 'ar' ? 'الوصف (عبرية)' : 'תיאור מלא (עברית)'}>
              <textarea
                value={form.description.he}
                onChange={(e) => setTransField('description', 'he', e.target.value)}
                rows={3}
                className={textareaClass}
              />
            </Field>
            <Field label={locale === 'ar' ? 'الوصف (عربية)' : 'תיאור מלא (ערבית)'}>
              <textarea
                value={form.description.ar}
                onChange={(e) => setTransField('description', 'ar', e.target.value)}
                rows={3}
                className={textareaClass}
                dir="rtl"
              />
            </Field>
          </div>

          {/* Ingredients */}
          <div className="grid md:grid-cols-2 gap-4">
            <Field label={locale === 'ar' ? 'المكونات (عبرية)' : 'מרכיבים (עברית)'}>
              <input
                type="text"
                value={form.ingredients.he}
                onChange={(e) => setTransField('ingredients', 'he', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label={locale === 'ar' ? 'المكونات (عربية)' : 'מרכיבים (ערבית)'}>
              <input
                type="text"
                value={form.ingredients.ar}
                onChange={(e) => setTransField('ingredients', 'ar', e.target.value)}
                className={inputClass}
                dir="rtl"
              />
            </Field>
          </div>

          {/* Price + unit + category */}
          <div className="grid md:grid-cols-3 gap-4">
            <Field label={locale === 'ar' ? 'السعر (₪)' : 'מחיר (₪)'} required>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set('price', Number(e.target.value))}
                className={inputClass}
                min={0}
                step={0.5}
                required
              />
            </Field>
            <Field label={locale === 'ar' ? 'الوحدة' : 'יחידת מחיר'}>
              <select
                value={form.unit}
                onChange={(e) => set('unit', e.target.value as PricingUnit)}
                className={inputClass}
              >
                {ALL_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u === 'per_kg' ? (locale === 'ar' ? 'للكيلو' : 'לקילו') : u === 'per_piece' ? (locale === 'ar' ? 'للوحدة' : 'למנה') : (locale === 'ar' ? 'للعلبة' : 'למארז')}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={locale === 'ar' ? 'الفئة' : 'קטגוריה'}>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value as ProductCategory)}
                className={inputClass}
              >
                {orderedCategories.map((c) => (
                  <option key={c} value={c}>{categoryLabels[c][locale]}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Slug + monogram + freshness */}
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Slug (URL)">
              <input
                type="text"
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                className={inputClass}
                placeholder="kanafeh-classic"
              />
            </Field>
            <Field label={locale === 'ar' ? 'الرمز' : 'מונוגרם'}>
              <input
                type="text"
                value={form.monogram}
                onChange={(e) => set('monogram', e.target.value)}
                className={inputClass}
                placeholder="K · N · F"
              />
            </Field>
            <Field label={locale === 'ar' ? 'مدة الطزاجة (ساعة)' : 'טריות (שעות)'}>
              <input
                type="number"
                value={form.freshnessHours}
                onChange={(e) => set('freshnessHours', Number(e.target.value))}
                className={inputClass}
                min={1}
              />
            </Field>
          </div>

          {/* Badges */}
          <Field label={locale === 'ar' ? 'الميزات' : 'תיוגים'}>
            <div className="flex flex-wrap gap-2">
              {ALL_BADGES.map((badge) => {
                const active = form.badges.includes(badge);
                return (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => toggleBadge(badge)}
                    className={`px-3 h-9 inline-flex items-center font-display-en text-[11px] tracking-eyebrow uppercase border transition-colors duration-300 rounded-[2px] ${active ? 'border-gold bg-gold text-ivory' : 'border-gold-deep/40 text-coffee-muted hover:border-gold hover:text-cedar'}`}
                  >
                    {badge === 'bestseller' && (locale === 'ar' ? 'الأكثر مبيعاً' : 'מומלץ')}
                    {badge === 'new' && (locale === 'ar' ? 'جديد' : 'חדש')}
                    {badge === 'seasonal' && (locale === 'ar' ? 'موسمي' : 'עונתי')}
                    {badge === 'kosher' && (locale === 'ar' ? 'كوشير' : 'כשר')}
                    {badge === 'vegan' && (locale === 'ar' ? 'نباتي' : 'טבעוני')}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Toggles */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => set('inStock', e.target.checked)}
                className="w-4 h-4 accent-gold"
              />
              <span className="text-sm text-cedar">{locale === 'ar' ? 'متوفر في المخزون' : 'במלאי'}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.visible !== false}
                onChange={(e) => set('visible', e.target.checked)}
                className="w-4 h-4 accent-gold"
              />
              <span className="text-sm text-cedar">{locale === 'ar' ? 'ظاهر في الموقع' : 'גלוי באתר'}</span>
            </label>
          </div>

          {/* Submit row */}
          <div className="pt-6 border-t border-hairline/50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="font-display-en text-[12px] tracking-eyebrow uppercase text-coffee-muted hover:text-cedar transition-colors duration-500 px-4 h-12"
            >
              {locale === 'ar' ? 'إلغاء' : 'ביטול'}
            </button>
            <button
              type="submit"
              className="h-12 px-8 bg-burgundy hover:bg-burgundy-deep text-ivory font-display-en text-[12px] tracking-eyebrow uppercase rounded-[2px] transition-colors duration-500"
            >
              {isNew
                ? (locale === 'ar' ? 'إضافة المنتج' : 'הוסף מוצר')
                : (locale === 'ar' ? 'حفظ التغييرات' : 'שמור שינויים')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

const inputClass =
  'w-full h-11 px-3 bg-cream-card border border-gold-deep/40 text-cedar text-sm focus:outline-none focus:border-gold transition-colors duration-300 rounded-[2px]';
const textareaClass =
  'w-full px-3 py-2.5 bg-cream-card border border-gold-deep/40 text-cedar text-sm focus:outline-none focus:border-gold transition-colors duration-300 rounded-[2px] leading-relaxed';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block mb-1.5 font-display-en text-[10px] tracking-eyebrow uppercase text-coffee-muted">
        {label} {required && <span className="text-burgundy">*</span>}
      </span>
      {children}
    </label>
  );
}

/* ─── Image uploader ─────────────────────────────────────────────── */

function ImageUploader({
  value,
  onChange,
  locale,
}: {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  locale: Locale;
}) {
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    setBusy(true);
    try {
      const dataUrl = await resizeImage(file, 1600, 0.85);
      onChange(dataUrl);
    } catch (err) {
      console.error(err);
      alert(locale === 'ar' ? 'فشل تحميل الصورة' : 'טעינת התמונה נכשלה');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-24 h-24 bg-cream-card border border-gold-deep/40 rounded-[2px] overflow-hidden flex items-center justify-center">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="font-display-en text-[10px] tracking-[0.2em] uppercase text-coffee-muted/60">
            {locale === 'ar' ? 'لا توجد صورة' : 'בלי תמונה'}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="inline-flex items-center justify-center h-10 px-5 bg-cedar text-ivory font-display-en text-[11px] tracking-eyebrow uppercase rounded-[2px] hover:bg-cedar-light transition-colors duration-500 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = ''; // reset
            }}
          />
          {busy
            ? (locale === 'ar' ? 'جارٍ التحميل...' : 'מעלה...')
            : value
              ? (locale === 'ar' ? 'تغيير الصورة' : 'החלף תמונה')
              : (locale === 'ar' ? 'تحميل صورة' : 'העלאת תמונה')}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted hover:text-burgundy transition-colors duration-300"
          >
            {locale === 'ar' ? 'إزالة' : 'הסר'}
          </button>
        )}
      </div>
    </div>
  );
}

/** Resize an image file to a maxDim square and return a JPEG data URL. */
function resizeImage(file: File, maxDim: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('no canvas ctx'));
        ctx.drawImage(img, 0, 0, w, h);
        try {
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (err) {
          reject(err);
        }
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
