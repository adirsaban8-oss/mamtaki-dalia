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
  | 'trays'
  | 'fruit-desserts'
  | 'cakes'
  | 'frozen';

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
  /** Allergen list as shown to the customer, e.g. "חלב, חמאה, אגוזים, גלוטן". */
  allergens?: Translated;
  /** Storage & serving instructions. */
  storage?: Translated;
  /** Overrides the "/ ק״ג" style price suffix, e.g. "מארז 4 ק״ג". */
  unitLabel?: Translated;
};

/* ─── Category labels & eyebrows ─────────────────────────────────── */

export const categoryLabels: Record<ProductCategory, Translated> = {
  kanafeh: { he: 'כנאפה', ar: 'كنافة' },
  baklava: { he: 'בקלאווה ומאפי פילו', ar: 'بقلاوة ومعجنات الفيلو' },
  trays: { he: 'מגשי קינוחים', ar: 'صواني الحلويات' },
  'fruit-desserts': { he: 'קינוחי פירות', ar: 'حلويات الفواكه' },
  cakes: { he: 'עוגות וקינוחים אישיים', ar: 'كعكات وحلويات فردية' },
  frozen: { he: 'ארטיקים וקפואים', ar: 'مثلجات' },
};

export const categoryEyebrow: Record<ProductCategory, Translated> = {
  kanafeh: { he: 'הסיגנציה של הבית', ar: 'توقيع البيت' },
  baklava: { he: 'שכבות פילו, פיסטוק חלבי, עבודת יד', ar: 'طبقات فيلو، فستق حلبي، صناعة يدوية' },
  trays: { he: 'מגשים לאירוח ולשמחות', ar: 'صواني للضيافة والمناسبات' },
  'fruit-desserts': { he: 'קרם קטיפתי ופירות טריים', ar: 'كريمة مخملية وفواكه طازجة' },
  cakes: { he: 'לרגעים המתוקים של החיים', ar: 'للحظات الحلوة في الحياة' },
  frozen: { he: 'מרעננים, ביתיים, מהמקפיא', ar: 'منعشة، بيتية، من الثلاجة' },
};

export const orderedCategories: ProductCategory[] = [
  'kanafeh',
  'baklava',
  'trays',
  'fruit-desserts',
  'cakes',
  'frozen',
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
