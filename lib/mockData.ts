/**
 * Mamtaki Dalia — shared types + static-only data (testimonials,
 * category metadata).
 *
 * The PRODUCT catalog used to live here. It has moved to
 * `store/catalog.ts` (Zustand + localStorage) so the shop owner can
 * edit it via /admin/catalog. This file now exports only:
 *  – Type definitions (Product, ProductCategory, ProductBadge, etc.)
 *  – Category labels & eyebrows used by the catalog UI
 *  – Testimonials (still static)
 *
 * The site ships with an EMPTY catalog. The owner fills it in via the
 * admin panel.
 */

export type Locale = 'he' | 'ar';

export type Translated = Record<Locale, string>;

export type ProductCategory =
  | 'kanafeh'
  | 'baklava'
  | 'beirut-nights'
  | 'maamoul'
  | 'halawa'
  | 'awameh'
  | 'ice-cream'
  | 'gift-boxes';

export type ProductBadge = 'kosher' | 'bestseller' | 'new' | 'vegan' | 'seasonal';

export type PricingUnit = 'per_kg' | 'per_piece' | 'per_box';

export type Product = {
  id: string;
  slug: string;
  monogram: string;
  name: Translated;
  tastingNote: Translated;
  description: Translated;
  ingredients: Translated;
  price: number;
  unit: PricingUnit;
  minWeight?: number;
  weightStep?: number;
  category: ProductCategory;
  badges: ProductBadge[];
  inStock: boolean;
  freshnessHours: number;
  confirmed: boolean;
  image?: string;
  gallery?: string[];
};

/* ─── Category labels & eyebrows ─────────────────────────────────── */

export const categoryLabels: Record<ProductCategory, Translated> = {
  kanafeh: { he: 'כנאפה', ar: 'كنافة' },
  baklava: { he: 'בקלאוה', ar: 'بقلاوة' },
  'beirut-nights': { he: 'לילות ביירות', ar: 'ليالي بيروت' },
  maamoul: { he: 'מעמול וקינוחי חמאה', ar: 'معمول وحلويات الزبدة' },
  halawa: { he: 'חלאוה וקינוחי טחינה', ar: 'حلاوة وحلويات الطحينة' },
  awameh: { he: 'עוואמה ומטוגנים', ar: 'عوامة والمقليات' },
  'ice-cream': { he: 'גלידות מקומיות', ar: 'مثلجات محلية' },
  'gift-boxes': { he: 'מארזי שי', ar: 'علب هدايا' },
};

export const categoryEyebrow: Record<ProductCategory, Translated> = {
  kanafeh: { he: 'הסיגנציה של הבית · מאז 1985', ar: 'توقيع البيت · منذ ١٩٨٥' },
  baklava: { he: 'שכבות פילו, עבודת יד', ar: 'طبقات فيلو، صناعة يدوية' },
  'beirut-nights': { he: 'קינוחים קרים, אשתא ופיסטוק', ar: 'حلويات باردة، قشطة وفستق' },
  maamoul: { he: 'תבניות עץ מסורתיות', ar: 'قوالب خشب تقليدية' },
  halawa: { he: 'טחינה גולמית, חבטות יד', ar: 'طحينة خام، دق يدوي' },
  awameh: { he: 'מטוגנים בחמאה צלולה', ar: 'مقلية بالسمن الصافي' },
  'ice-cream': { he: 'ביתי, יומי, פרי הכרמל', ar: 'بيتي، يومي، من ثمار الكرمل' },
  'gift-boxes': { he: 'נארזים ביד, נשלחים לכל הארץ', ar: 'تُعبَّأ يدوياً، تُشحن لكل البلاد' },
};

export const orderedCategories: ProductCategory[] = [
  'kanafeh',
  'baklava',
  'beirut-nights',
  'maamoul',
  'halawa',
  'awameh',
  'ice-cream',
  'gift-boxes',
];

/* ─── Testimonials ────────────────────────────────────────────────── */

export type Testimonial = {
  id: string;
  quote: Translated;
  author: Translated;
  role: Translated;
  rating: 5;
};

export const testimonials: Testimonial[] = [
  {
    id: 't_yael',
    quote: {
      he: 'הזמנתי לחתונה של אחותי. כל אורח שאל מאיפה זה. הכנאפה הייתה עוד חמה כשהגיעה לתל אביב.',
      ar: 'طلبت لزفاف أختي. كل ضيف سأل من أين هذا. الكنافة كانت لا تزال ساخنة عندما وصلت إلى تل أبيب.',
    },
    author: { he: 'יעל אברהמי', ar: 'يائيل أبراهامي' },
    role: { he: 'תל אביב', ar: 'تل أبيب' },
    rating: 5,
  },
  {
    id: 't_marwan',
    quote: {
      he: 'אבו חסן הוא אגדה אמיתית. מעמול כמו של אמא, רק יותר טוב — אל תספרו לה.',
      ar: 'أبو حسن أسطورة حقيقية. معمول كأنه من صنع أمي، لكن أفضل — لا تخبروها.',
    },
    author: { he: 'מרואן עתאמנה', ar: 'مروان عتامنة' },
    role: { he: 'חיפה', ar: 'حيفا' },
    rating: 5,
  },
  {
    id: 't_orit',
    quote: {
      he: 'הבקלאוה הכי טובה שטעמתי בחיים. כולל ב-Patchi בדובאי. אני עכשיו לקוחה קבועה.',
      ar: 'أفضل بقلاوة تذوقتها في حياتي. بما في ذلك في باتشي بدبي. أنا الآن زبونة دائمة.',
    },
    author: { he: 'אורית כהן', ar: 'أوريت كوهين' },
    role: { he: 'הרצליה', ar: 'هرتسليا' },
    rating: 5,
  },
];

/* ─── Deprecated re-exports (kept for module compatibility) ──────── */
/* The shop now reads from `useCatalog` instead. These exports are
   intentionally empty / no-op so any stale import won't crash. */

export const products: Product[] = [];
export const featuredProducts: Product[] = [];
export function findProductBySlug(_slug: string): Product | undefined {
  return undefined;
}
export function productsByCategory(_category: ProductCategory): Product[] {
  return [];
}
