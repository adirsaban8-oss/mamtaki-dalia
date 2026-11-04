import type { Product, ProductCategory, PricingUnit, Translated } from '@/lib/mockData';

/**
 * Starter catalog, transcribed from the owner's product sheet
 * ("מוצרים – ממתקי דלית אל כרמל"). It is shown whenever WordPress has
 * no published products yet; as soon as the owner publishes products
 * in WooCommerce, those replace this list entirely.
 *
 * Prices are not set yet (0 = "price on request"). Allergen info is
 * only filled where the owner supplied it — never guessed.
 *
 * Images live in /public/products and are illustrative stock photos
 * (see /public/products/CREDITS.md for sources and licenses).
 */

type Seed = {
  slug: string;
  category: ProductCategory;
  unit: PricingUnit;
  name: Translated;
  note: Translated;
  description?: Translated;
  allergens?: string;
  storage?: Translated;
  bestseller?: boolean;
};

/** Slugs that have a photo in /public/products (<slug>.webp). */
const WITH_IMAGE = new Set([
  'baklava-pistachio',
  'bird-nest-baklava',
  'birthday-cake',
  'cake-26cm',
  'fatir-by-weight',
  'fruit-dessert-mango',
  'fruit-dessert-pistachio',
  'fruit-dessert-raspberry',
  'fruit-dessert-strawberry',
  'harissa-semolina-cake',
  'ice-cream-popsicles',
  'kanafeh-by-weight',
  'kanafeh-for-grill',
  'kremschnitt-tray',
  'lava-cake-milk-chocolate',
  'lava-cake-white-chocolate',
  'layali-beirut-tray',
  'profiteroles',
  'trabzon-by-weight',
  'trabzon-pistachio-malabi',
  'trilece-tray',
  'turkish-baklava-pistachio',
]);

const FRIDGE: Translated = {
  he: 'לשמור במקרר. לחמם דקה במיקרוגל או בתנור לפני ההגשה.',
  ar: 'يُحفظ في الثلاجة. يُسخَّن دقيقة في الميكروويف أو الفرن قبل التقديم.',
};

const FREEZER: Translated = {
  he: 'לשמור במקפיא. להוציא כחצי שעה לפני ההגשה.',
  ar: 'يُحفظ في الفريزر. يُخرَج قبل التقديم بنصف ساعة تقريباً.',
};

const DAIRY_NUTS_GLUTEN = 'חלב, חמאה, אגוזים, גלוטן';

const SEEDS: Seed[] = [
  // ── כנאפה ──────────────────────────────────────────────────────────
  {
    slug: 'kanafeh-by-weight',
    category: 'kanafeh',
    unit: 'per_kg',
    bestseller: true,
    name: { he: 'כנאפה במשקל', ar: 'كنافة بالوزن' },
    note: { he: 'קדאיף זהוב · גבינה נמתחת · פיסטוק חלבי', ar: 'قطايف ذهبية · جبنة مطاطية · فستق حلبي' },
    description: {
      he: 'כנאפה שמימית: שערות קדאיף עם גבינה, סמנה, פיסטוק חלבי וסירופ סוכר.',
      ar: 'كنافة سماوية: شعيرات القطايف مع الجبنة والسمنة والفستق الحلبي وقطر السكر.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FRIDGE,
  },
  {
    slug: 'kanafeh-for-grill',
    category: 'kanafeh',
    unit: 'per_piece',
    name: { he: 'כנאפה למנגל', ar: 'كنافة للشواء' },
    note: { he: 'מוכנה לחימום על הגחלים', ar: 'جاهزة للتسخين على الفحم' },
    description: {
      he: 'כנאפה בתבנית אישית, מוכנה לחימום על המנגל או בתנור — חמה, נמתחת ומוגשת ישר מהאש.',
      ar: 'كنافة في صينية فردية، جاهزة للتسخين على الشواية أو في الفرن — ساخنة ومطاطية وتُقدَّم مباشرة من النار.',
    },
  },

  // ── בקלאווה ומאפי פילו ─────────────────────────────────────────────
  {
    slug: 'baklava-pistachio',
    category: 'baklava',
    unit: 'per_kg',
    bestseller: true,
    name: { he: 'בקלאווה פיסטוק חלבי', ar: 'بقلاوة فستق حلبي' },
    note: { he: 'שכבות פילו פריכות · פיסטוק חלבי', ar: 'طبقات فيلو مقرمشة · فستق حلبي' },
    description: {
      he: 'בקלאווה תורכית מלאה בפיסטוק חלבי.',
      ar: 'بقلاوة تركية محشوة بالفستق الحلبي.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FRIDGE,
  },
  {
    slug: 'turkish-baklava-pistachio',
    category: 'baklava',
    unit: 'per_kg',
    name: { he: 'בקלאווה טורקית פיסטוק חלבי', ar: 'بقلاوة تركية بالفستق الحلبي' },
    note: { he: 'בסגנון גזיאנטפ · ירוקה ועשירה', ar: 'على طريقة غازي عنتاب · خضراء وغنية' },
    description: {
      he: 'בקלאווה בסגנון טורקי, דקה ופריכה, עם שכבה נדיבה של פיסטוק חלבי.',
      ar: 'بقلاوة على الطريقة التركية، رقيقة ومقرمشة، مع طبقة سخية من الفستق الحلبي.',
    },
  },
  {
    slug: 'bird-nest-baklava',
    category: 'baklava',
    unit: 'per_kg',
    bestseller: true,
    name: { he: 'בקלאווה קן הציפור', ar: 'بقلاوة عش البلبل' },
    note: { he: 'קדאיף · פיסטוק חלבי שלם', ar: 'قطايف · فستق حلبي كامل' },
    description: {
      he: 'קן הציפור הוא בצק קדאיף ממולא בפיסטוק חלבי שלם.',
      ar: 'عش البلبل هو عجينة قطايف محشوة بالفستق الحلبي الكامل.',
    },
  },
  {
    slug: 'fatir-by-weight',
    category: 'baklava',
    unit: 'per_kg',
    name: { he: 'פטיר במשקל', ar: 'فطير بالوزن' },
    note: { he: 'משולשי בקלאווה · מלבי · מי סוכר', ar: 'مثلثات بقلاوة · مهلبية · قطر' },
    description: {
      he: 'משולשי פטיר מבצק בקלאווה, ממולאים במלבי וספוגים במי סוכר.',
      ar: 'مثلثات فطير من عجينة البقلاوة، محشوة بالمهلبية ومنقوعة بالقطر.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FRIDGE,
  },
  {
    slug: 'trabzon-by-weight',
    category: 'baklava',
    unit: 'per_kg',
    name: { he: 'טרבזון במשקל', ar: 'طرابزون بالوزن' },
    note: { he: 'בצק בקלאווה · פיסטוק חלבי · גבינה', ar: 'عجينة بقلاوة · فستق حلبي · جبنة' },
    description: {
      he: 'טרבזון חלום — בצק בקלאווה ממולא בפיסטוק חלבי וגבינה.',
      ar: 'طرابزون الأحلام — عجينة بقلاوة محشوة بالفستق الحلبي والجبنة.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FRIDGE,
  },
  {
    slug: 'trabzon-pistachio-malabi',
    category: 'baklava',
    unit: 'per_kg',
    name: { he: 'טרבזון במילוי פיסטוק חלבי ומלבי', ar: 'طرابزون محشو بالفستق الحلبي والمهلبية' },
    note: { he: 'פיסטוק חלבי · קרם מלבי', ar: 'فستق حلبي · كريمة مهلبية' },
    description: {
      he: 'רולדות בצק בקלאווה במילוי כפול של פיסטוק חלבי וקרם מלבי.',
      ar: 'لفائف من عجينة البقلاوة بحشوة مزدوجة من الفستق الحلبي وكريمة المهلبية.',
    },
  },

  // ── מגשי קינוחים ───────────────────────────────────────────────────
  {
    slug: 'layali-beirut-tray',
    category: 'trays',
    unit: 'per_box',
    bestseller: true,
    name: { he: 'מגש לילות ביירות', ar: 'صينية ليالي بيروت' },
    note: { he: 'סולת · קציפת שמנת · פיסטוק חלבי', ar: 'سميد · كريمة مخفوقة · فستق حلبي' },
    description: {
      he: 'לילות ביירות: עוגת סולת עם קציפת שמנת, פיסטוק חלבי וסירופ סוכר.',
      ar: 'ليالي بيروت: كعكة سميد مع الكريمة المخفوقة والفستق الحلبي وقطر السكر.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FREEZER,
  },
  {
    slug: 'trilece-tray',
    category: 'trays',
    unit: 'per_box',
    name: { he: 'מגש טרליצ׳ה', ar: 'صينية تريليتشة' },
    note: { he: 'ספוג בחלב · קציפה · קרמל', ar: 'منقوعة بالحليب · كريمة · كراميل' },
    description: {
      he: 'עוגת טרליצ׳ה — בצק נימוח ספוג בחלב, ומעליו קציפת שמנת וקרמל.',
      ar: 'كعكة تريليتشة — عجينة طرية منقوعة بالحليب، تعلوها الكريمة المخفوقة والكراميل.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FREEZER,
  },
  {
    slug: 'kremschnitt-tray',
    category: 'trays',
    unit: 'per_box',
    name: { he: 'מגש קרם שניט', ar: 'صينية كريم شنيت' },
    note: { he: 'בצק פריך · קרם וניל עשיר', ar: 'عجينة مقرمشة · كريمة فانيليا غنية' },
    description: {
      he: 'קרם שניט היא עוגת שכבות קלאסית ואהובה, המשלבת בצק בקלאווה פריך וקרם וניל עשיר.',
      ar: 'الكريم شنيت كعكة طبقات كلاسيكية ومحبوبة تجمع بين عجينة البقلاوة المقرمشة وكريمة الفانيليا الغنية.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FREEZER,
  },
  {
    slug: 'harissa-semolina-cake',
    category: 'trays',
    unit: 'per_box',
    name: { he: 'הריסה — עוגת סולת', ar: 'هريسة — كعكة السميد' },
    note: { he: 'סולת זהובה · מי סוכר', ar: 'سميد ذهبي · قطر' },
    description: {
      he: 'עוגת סולת ספוגה במי סוכר.',
      ar: 'كعكة سميد منقوعة بالقطر.',
    },
  },

  // ── קינוחי פירות ───────────────────────────────────────────────────
  {
    slug: 'fruit-dessert-strawberry',
    category: 'fruit-desserts',
    unit: 'per_piece',
    name: { he: 'קינוח פירות — תות', ar: 'حلوى الفواكه — فراولة' },
    note: { he: 'תותים טריים · קרם קטיפתי', ar: 'فراولة طازجة · كريمة مخملية' },
    description: {
      he: 'קינוח פירות מרענן המבוסס על תותים טריים וקרם.',
      ar: 'حلوى فواكه منعشة أساسها الفراولة الطازجة والكريمة.',
    },
    allergens: 'חלב, חמאה, אגוזים · ללא גלוטן',
    storage: FREEZER,
  },
  {
    slug: 'fruit-dessert-mango',
    category: 'fruit-desserts',
    unit: 'per_piece',
    name: { he: 'קינוח פירות — מנגו', ar: 'حلوى الفواكه — مانجو' },
    note: { he: 'מנגו בשל · קרם קטיפתי', ar: 'مانجو ناضجة · كريمة مخملية' },
    description: {
      he: 'קינוח פירות מרענן המבוסס על מנגו וקרם.',
      ar: 'حلوى فواكه منعشة أساسها المانجو والكريمة.',
    },
    storage: FREEZER,
  },
  {
    slug: 'fruit-dessert-raspberry',
    category: 'fruit-desserts',
    unit: 'per_piece',
    name: { he: 'קינוח פירות — פטל', ar: 'حلوى الفواكه — توت العليق' },
    note: { he: 'פטל חמצמץ · קרם קטיפתי', ar: 'توت عليق حامض · كريمة مخملية' },
    description: {
      he: 'קינוח פירות מרענן המבוסס על פטל וקרם.',
      ar: 'حلوى فواكه منعشة أساسها توت العليق والكريمة.',
    },
    storage: FREEZER,
  },
  {
    slug: 'fruit-dessert-pistachio',
    category: 'fruit-desserts',
    unit: 'per_piece',
    name: { he: 'קינוח פיסטוק חלבי', ar: 'حلوى الفستق الحلبي' },
    note: { he: 'קרם פיסטוק חלבי עשיר', ar: 'كريمة فستق حلبي غنية' },
    description: {
      he: 'קינוח אישי של קרם פיסטוק חלבי עשיר וקטיפתי.',
      ar: 'حلوى فردية من كريمة الفستق الحلبي الغنية والمخملية.',
    },
    storage: FREEZER,
  },

  // ── עוגות וקינוחים אישיים ─────────────────────────────────────────
  {
    slug: 'lava-cake-milk-chocolate',
    category: 'cakes',
    unit: 'per_piece',
    name: { he: 'עוגה חמה — שוקולד חלב', ar: 'كعكة ساخنة — شوكولاتة بالحليب' },
    note: { he: 'לב נימוח של שוקולד חלב', ar: 'قلب ذائب من شوكولاتة الحليب' },
    description: {
      he: 'עוגת שוקולד אישית, מלאה בשוקולד חלב נימוח.',
      ar: 'كعكة شوكولاتة فردية محشوة بشوكولاتة الحليب الذائبة.',
    },
    storage: FREEZER,
  },
  {
    slug: 'lava-cake-white-chocolate',
    category: 'cakes',
    unit: 'per_piece',
    name: { he: 'עוגה חמה — שוקולד לבן', ar: 'كعكة ساخنة — شوكولاتة بيضاء' },
    note: { he: 'לב נימוח של שוקולד לבן', ar: 'قلب ذائب من الشوكولاتة البيضاء' },
    description: {
      he: 'עוגת שוקולד אישית, מלאה בשוקולד לבן נימוח.',
      ar: 'كعكة شوكولاتة فردية محشوة بالشوكولاتة البيضاء الذائبة.',
    },
    storage: FREEZER,
  },
  {
    slug: 'profiteroles',
    category: 'cakes',
    unit: 'per_box',
    name: { he: 'פחזניות במילוי קרם פטיסייר', ar: 'بروفيترول بحشوة كريمة الباتسيير' },
    note: { he: 'בצק רבוך · קרם פטיסייר', ar: 'عجينة شو · كريمة باتسيير' },
    description: {
      he: 'פחזניות אווריריות במילוי נדיב של קרם פטיסייר.',
      ar: 'بروفيترول هشة بحشوة سخية من كريمة الباتسيير.',
    },
    storage: FREEZER,
  },
  {
    slug: 'birthday-cake',
    category: 'cakes',
    unit: 'per_piece',
    name: { he: 'עוגת יום הולדת', ar: 'كعكة عيد ميلاد' },
    note: { he: 'עוגה מלבנית חגיגית', ar: 'كعكة مستطيلة احتفالية' },
    description: {
      he: 'עוגת יום הולדת מלבנית וחגיגית. גדלים ועיצוב לפי הזמנה.',
      ar: 'كعكة عيد ميلاد مستطيلة واحتفالية. الأحجام والتصميم حسب الطلب.',
    },
    storage: FREEZER,
  },
  {
    slug: 'cake-26cm',
    category: 'cakes',
    unit: 'per_piece',
    name: { he: 'עוגה בקוטר 26 ס״מ', ar: 'كعكة بقطر ٢٦ سم' },
    note: { he: 'עוגה עגולה לאירוח', ar: 'كعكة دائرية للضيافة' },
    description: {
      he: 'עוגת שכבות עגולה בקוטר 26 ס״מ — מתאימה לאירוח ולשמחות.',
      ar: 'كعكة طبقات دائرية بقطر ٢٦ سم — مناسبة للضيافة والمناسبات.',
    },
    storage: FREEZER,
  },

  // ── ארטיקים וקפואים ───────────────────────────────────────────────
  {
    slug: 'ice-cream-popsicles',
    category: 'frozen',
    unit: 'per_piece',
    name: { he: 'ארטיקים', ar: 'بوظة على عصا' },
    note: { he: 'מרעננים לימים החמים', ar: 'منعشة للأيام الحارة' },
    description: {
      he: 'ארטיקים מרעננים במגוון טעמים.',
      ar: 'بوظة منعشة على عصا بنكهات متنوعة.',
    },
    storage: { he: 'לשמור במקפיא.', ar: 'تُحفظ في الفريزر.' },
  },
];

const EMPTY: Translated = { he: '', ar: '' };

export const seedCatalog: Product[] = SEEDS.map((s) => ({
  id: `seed_${s.slug}`,
  slug: s.slug,
  monogram: monogramFromSlug(s.slug),
  name: s.name,
  tastingNote: s.note,
  description: s.description ?? EMPTY,
  ingredients: EMPTY,
  price: 0,
  unit: s.unit,
  category: s.category,
  badges: s.bestseller ? ['bestseller'] : [],
  inStock: true,
  freshnessHours: 24,
  confirmed: true,
  image: WITH_IMAGE.has(s.slug) ? `/products/${s.slug}.webp` : undefined,
  allergens: s.allergens ? { he: s.allergens, ar: translateAllergens(s.allergens) } : undefined,
  storage: s.storage,
}));

function translateAllergens(he: string): string {
  return he
    .replace('חלב', 'حليب')
    .replace('חמאה', 'زبدة')
    .replace('אגוזים', 'مكسرات')
    .replace('ללא גלוטן', 'خالٍ من الغلوتين')
    .replace('גלוטן', 'غلوتين');
}

/** "kanafeh-by-weight" → "K · B · W". (store/catalog's deriveMonogram is
 *  client-only, and this module is also used by server pages.) */
function monogramFromSlug(slug: string): string {
  return slug
    .split('-')
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join(' · ');
}
