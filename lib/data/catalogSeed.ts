import type { Product, ProductCategory, PricingUnit, Translated } from '@/lib/mockData';

/**
 * Starter catalog: the owner's product list and prices. It is shown
 * whenever WordPress has no published products yet; as soon as the
 * owner publishes products in WooCommerce, those replace this list.
 *
 * Allergens were filled by product family and should be confirmed by
 * the owner. Images in /public/products are AI restyles of the shop's
 * own product photos (same product, one shared black-studio look).
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
  /** ₪, VAT included. Omitted = "price on request". */
  price?: number;
  unitLabel?: Translated;
};

const FRIDGE: Translated = {
  he: 'לשמור בקופסה סגורה במקרר. מומלץ להוציא כרבע שעה לפני ההגשה.',
  ar: 'يُحفظ في علبة مغلقة في الثلاجة. يُفضَّل إخراجه قبل التقديم بربع ساعة.',
};

const KANAFEH_FRIDGE: Translated = {
  he: 'לשמור במקרר. לחמם דקה במיקרוגל או בתנור לפני ההגשה.',
  ar: 'يُحفظ في الثلاجة. يُسخَّن دقيقة في الميكروويف أو الفرن قبل التقديم.',
};

const FREEZER: Translated = {
  he: 'לשמור במקפיא. להוציא כחצי שעה לפני ההגשה.',
  ar: 'يُحفظ في الفريزر. يُخرَج قبل التقديم بنصف ساعة تقريباً.',
};

const DAIRY_NUTS_GLUTEN = 'חלב, חמאה, אגוזים, גלוטן';
/** Cakes, mousse & choux: eggs added on purpose (better to over-warn).
 *  Owner should confirm. */
const CAKE = 'חלב, חמאה, ביצים, גלוטן · עשוי להכיל אגוזים';

const PORTION_NOTE = {
  he: ' זמין גם במנה אישית ב־40 ₪.',
  ar: ' متوفر أيضاً كحصة فردية بـ40 ₪.',
};

/**
 * The owner's full product list with prices (WhatsApp, Nov 2026).
 * Prices are in ₪ and include VAT. Weight products are sold in
 * whole-kilo packs (1, 2, 3 … kg).
 */
const SEEDS: Seed[] = [
  // ── בקלאווה, 110 ₪ לק״ג ───────────────────────────────────────────
  {
    slug: 'baklava-pistachio',
    category: 'baklava',
    unit: 'per_kg',
    price: 110,
    name: { he: 'בקלאווה פיסטוק חלבי', ar: 'بقلاوة فستق حلبي' },
    note: { he: 'גלילי פילו ירוקים · פיסטוק חלבי', ar: 'لفائف فيلو خضراء · فستق حلبي' },
    description: {
      he: 'גלילי פילו דקים במילוי נדיב של פיסטוק חלבי טחון, אפויים בחמאה ומושרים בסירופ, הקלאסיקה הירוקה של הבית.',
      ar: 'لفائف فيلو رقيقة بحشوة سخية من الفستق الحلبي المطحون، مخبوزة بالزبدة ومسقية بالقطر، الكلاسيكية الخضراء للبيت.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FRIDGE,
  },
  {
    slug: 'bird-nest-baklava',
    category: 'baklava',
    unit: 'per_kg',
    price: 110,
    name: { he: 'קן הציפור', ar: 'عش البلبل' },
    note: { he: 'קדאיף פריך · פיסטוק חלבי שלם', ar: 'قطايف مقرمشة · فستق حلبي كامل' },
    description: {
      he: 'קני קדאיף זהובים ופריכים, ובמרכז כל אחד ערימה של פיסטוק חלבי שלם. מרשים על כל שולחן אירוח.',
      ar: 'أعشاش قطايف ذهبية مقرمشة، في وسط كل منها حفنة من الفستق الحلبي الكامل. لافتة على كل مائدة ضيافة.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FRIDGE,
  },
  {
    slug: 'baklava-cashew',
    category: 'baklava',
    unit: 'per_kg',
    price: 110,
    name: { he: 'בקלאווה קשיו קלוי', ar: 'بقلاوة كاجو محمّص' },
    note: { he: 'שכבות פילו · קשיו קלוי', ar: 'طبقات فيلو · كاجو محمّص' },
    description: {
      he: 'ריבועי בקלאווה עשירים בשכבות פילו פריכות ומילוי קשיו קלוי, חמאתי ועדין.',
      ar: 'مربعات بقلاوة غنية بطبقات فيلو مقرمشة وحشوة كاجو محمّص، زبدية وناعمة.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FRIDGE,
  },
  {
    slug: 'baklava-walnut',
    category: 'baklava',
    unit: 'per_kg',
    price: 110,
    name: { he: 'בקלאווה אגוזים', ar: 'بقلاوة جوز' },
    note: { he: 'אגוזי מלך · פיסטוק מעל', ar: 'جوز · فستق على الوجه' },
    description: {
      he: 'בקלאווה במילוי אגוזי מלך, מעוטרת בפיסטוק חלבי טחון. טעם עמוק וקלאסי.',
      ar: 'بقلاوة محشوة بالجوز ومزيّنة بالفستق الحلبي المطحون. طعم عميق وكلاسيكي.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FRIDGE,
  },
  {
    slug: 'baklava-maadan',
    category: 'baklava',
    unit: 'per_kg',
    price: 110,
    name: { he: 'בקלאווה מעדן', ar: 'بقلاوة معدان' },
    note: { he: 'פילו מקופל · מילוי אגוזים', ar: 'فيلو مطوي · حشوة مكسرات' },
    description: {
      he: 'משולשי פילו מקופלים ביד, זהובים ומבריקים מסירופ, עם מילוי אגוזים נדיב.',
      ar: 'مثلثات فيلو مطوية يدوياً، ذهبية لامعة بالقطر، مع حشوة مكسرات سخية.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FRIDGE,
  },
  {
    slug: 'baklava-lips',
    category: 'baklava',
    unit: 'per_kg',
    price: 110,
    name: { he: 'שפתיים', ar: 'شفايف' },
    note: { he: 'פילו מקומט · אגוזים', ar: 'فيلو مجعّد · مكسرات' },
    description: {
      he: 'מאפה פילו מקומט וקראנצ׳י בצורת שפתיים, במילוי אגוזים ומושרה בסירופ.',
      ar: 'معجنات فيلو مجعّدة ومقرمشة على شكل شفايف، محشوة بالمكسرات ومسقية بالقطر.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FRIDGE,
  },
  {
    slug: 'burma',
    category: 'baklava',
    unit: 'per_kg',
    price: 110,
    name: { he: 'בורמה', ar: 'بورمة' },
    note: { he: 'גלילי קדאיף · פיסטוק', ar: 'لفائف قطايف · فستق' },
    description: {
      he: 'גלילי קדאיף ארוכים וזהובים, במילוי פיסטוק דחוס, נחתכים לפרוסות עבות.',
      ar: 'لفائف قطايف طويلة وذهبية، محشوة بالفستق المضغوط، تُقطَّع إلى شرائح سميكة.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FRIDGE,
  },
  {
    slug: 'kol-wa-shkor',
    category: 'baklava',
    unit: 'per_kg',
    price: 110,
    name: { he: 'קול ושכור', ar: 'كُل واشكُر' },
    note: { he: 'ביס אחד · פילו ואגוזים', ar: 'لقمة واحدة · فيلو ومكسرات' },
    description: {
      he: 'ביסים קטנים של פילו פריך ואגוזים, "אכול והודה". מושלם למגש אירוח מגוון.',
      ar: 'لقيمات صغيرة من الفيلو المقرمش والمكسرات، "كُل واشكُر". مثالية لصينية ضيافة متنوعة.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FRIDGE,
  },
  {
    slug: 'baklava-lotus',
    category: 'baklava',
    unit: 'per_kg',
    price: 110,
    name: { he: 'בקלאווה לוטוס', ar: 'بقلاوة لوتس' },
    note: { he: 'פירורי לוטוס · קרמל', ar: 'فتات لوتس · كراميل' },
    description: {
      he: 'בקלאווה בטוויסט מודרני: שכבות פילו עם קרם לוטוס וציפוי פירורי עוגיות לוטוס.',
      ar: 'بقلاوة بلمسة عصرية: طبقات فيلو مع كريمة اللوتس وتغطية بفتات بسكويت اللوتس.',
    },
    allergens: 'חלב, חמאה, אגוזים, גלוטן, סויה',
    storage: FRIDGE,
  },
  {
    slug: 'awameh',
    category: 'kanafeh',
    unit: 'per_kg',
    price: 110,
    name: { he: 'עוואמה', ar: 'عوّامة' },
    note: { he: 'כדורי בצק מטוגנים · סירופ', ar: 'كرات عجين مقلية · قطر' },
    description: {
      he: 'כדורי בצק אווריריים, מטוגנים עד שהם זהובים ופריכים מבחוץ, וטבולים בסירופ סוכר.',
      ar: 'كرات عجين هشة تُقلى حتى تصبح ذهبية ومقرمشة من الخارج، ثم تُغمس في القطر.',
    },
    allergens: 'גלוטן',
    storage: {
      he: 'הכי טעים ביום הקנייה. לשמור בקופסה סגורה בטמפרטורת החדר.',
      ar: 'ألذّ في يوم الشراء. تُحفظ في علبة مغلقة بحرارة الغرفة.',
    },
  },

  // ── כנאפה, 80 ₪ לק״ג ──────────────────────────────────────────────
  {
    slug: 'red-kanafeh',
    category: 'kanafeh',
    unit: 'per_kg',
    price: 80,
    name: { he: 'כנאפה אדום', ar: 'كنافة حمراء' },
    note: { he: 'קדאיף אדום · פסי פיסטוק', ar: 'قطايف حمراء · خطوط فستق' },
    description: {
      he: 'ריבועי כנאפה בקדאיף אדום ובוהק, עם פסים של פיסטוק חלבי טחון. צבעוני וחגיגי.',
      ar: 'مربعات كنافة بقطايف حمراء لامعة، مع خطوط من الفستق الحلبي المطحون. ملوّنة واحتفالية.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: KANAFEH_FRIDGE,
  },
  {
    slug: 'baklava-kanafeh',
    category: 'kanafeh',
    unit: 'per_kg',
    price: 80,
    name: { he: 'בקלאווה כנאפה', ar: 'بقلاوة كنافة' },
    note: { he: 'פילו · מילוי כנאפה · פיסטוק', ar: 'فيلو · حشوة كنافة · فستق' },
    description: {
      he: 'המפגש בין שני העולמות: כיסי פילו פריכים במילוי כנאפה רכה, עם נקודת פיסטוק חלבי.',
      ar: 'لقاء العالمين: جيوب فيلو مقرمشة بحشوة كنافة طرية، مع لمسة فستق حلبي.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: KANAFEH_FRIDGE,
  },
  {
    slug: 'trabzon',
    category: 'baklava',
    unit: 'per_kg',
    price: 80,
    name: { he: 'טרפזון', ar: 'طرابزون' },
    note: { he: 'גלילי פילו · פיסטוק', ar: 'لفائف فيلو · فستق' },
    description: {
      he: 'גלילי פילו חמאתיים וזהובים, מעוטרים בפס של פיסטוק חלבי טחון.',
      ar: 'لفائف فيلو زبدية وذهبية، مزيّنة بخط من الفستق الحلبي المطحون.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FRIDGE,
  },

  // ── מגשים ──────────────────────────────────────────────────────────
  {
    slug: 'turkish-baklava-tray',
    category: 'trays',
    unit: 'per_box',
    price: 350,
    name: { he: 'מגש בקלאווה טורקית', ar: 'صينية بقلاوة تركية' },
    note: { he: 'מגש עגול · פיסטוק חלבי', ar: 'صينية دائرية · فستق حلبي' },
    description: {
      he: 'מגש עגול ומרשים של בקלאווה טורקית בפרוסות, עם פיסטוק חלבי במרכז ובקצוות. מרכז שולחן לאירוע.',
      ar: 'صينية دائرية لافتة من البقلاوة التركية المقطّعة، مع فستق حلبي في الوسط والأطراف. قطعة مركزية لمائدة المناسبة.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FRIDGE,
  },
  {
    slug: 'layali-beirut-tray',
    category: 'trays',
    unit: 'per_box',
    price: 130,
    name: { he: 'מגש לילות ביירות', ar: 'صينية ليالي بيروت' },
    note: { he: 'קרם סולת · שכבת פיסטוק · קפוא', ar: 'كريمة سميد · طبقة فستق · مجمّدة' },
    description: {
      he: 'שכבת סולת קטיפתית, קרם חלב עשיר ומעל שכבה עבה של פיסטוק חלבי טחון. מוגש קר.' + PORTION_NOTE.he,
      ar: 'طبقة سميد مخملية، كريمة حليب غنية، وفوقها طبقة سميكة من الفستق الحلبي المطحون. تُقدَّم باردة.' + PORTION_NOTE.ar,
    },
    allergens: 'חלב, אגוזים, גלוטן',
    storage: FREEZER,
  },
  {
    slug: 'trilece-tray',
    category: 'trays',
    unit: 'per_box',
    price: 130,
    name: { he: 'מגש טריליצ׳ה', ar: 'صينية تريليتشا' },
    note: { he: 'שלושה חלבים · קרמל · קפוא', ar: 'ثلاثة أنواع حليب · كراميل · مجمّدة' },
    description: {
      he: 'עוגת טריליצ׳ה ספוגית, ספוגה בשלושה סוגי חלב ומכוסה בשכבת קרמל מבריקה.' + PORTION_NOTE.he,
      ar: 'كعكة تريليتشا إسفنجية مشبعة بثلاثة أنواع من الحليب ومغطاة بطبقة كراميل لامعة.' + PORTION_NOTE.ar,
    },
    allergens: CAKE,
    storage: FREEZER,
  },
  {
    slug: 'kremschnitt-tray',
    category: 'trays',
    unit: 'per_box',
    price: 130,
    name: { he: 'מגש קרמשניט', ar: 'صينية كريمشنيت' },
    note: { he: 'בצק עלים · קרם וניל · קפוא', ar: 'عجينة منتفخة · كريمة فانيلا · مجمّدة' },
    description: {
      he: 'שכבות בצק עלים פריך וקרם וניל אוורירי, מכוסות בפתיתי בצק ואבקת סוכר.' + PORTION_NOTE.he,
      ar: 'طبقات من العجينة المنتفخة المقرمشة وكريمة الفانيلا الهشة، مغطاة برقائق العجين والسكر الناعم.' + PORTION_NOTE.ar,
    },
    allergens: CAKE,
    storage: FREEZER,
  },
  {
    slug: 'baklava-mix-4kg',
    category: 'trays',
    unit: 'per_box',
    price: 440,
    unitLabel: { he: 'מארז 4 ק״ג', ar: 'علبة ٤ كغ' },
    name: { he: 'מארז מיקס בקלאוות 4 ק״ג', ar: 'علبة ميكس بقلاوة ٤ كغ' },
    note: { he: 'מיקס מהמובחרים של אבו חסן', ar: 'تشكيلة من أفضل أصناف أبو حسن' },
    description: {
      he: 'מארז חגיגי של 4 ק״ג: מיקס בקלאוות שונות מהמובחרים של אבו חסן. מושלם לאירוח, לאירועים ולמתנה.',
      ar: 'علبة احتفالية وزنها ٤ كغ: تشكيلة بقلاوة متنوعة من أفضل أصناف أبو حسن. مثالية للضيافة والمناسبات والهدايا.',
    },
    allergens: DAIRY_NUTS_GLUTEN,
    storage: FRIDGE,
  },

  // ── קינוחים אישיים, 45 ₪ ──────────────────────────────────────────
  {
    slug: 'dessert-dubai',
    category: 'cakes',
    unit: 'per_piece',
    price: 45,
    name: { he: 'קינוח דובאי', ar: 'حلوى دبي' },
    note: { he: 'פיסטוק · קדאיף · שוקולד לבן', ar: 'فستق · قطايف · شوكولاتة بيضاء' },
    description: {
      he: 'קינוח אישי בהשראת שוקולד דובאי: מוס פיסטוק עם קדאיף פריך, בציפוי שוקולד לבן.',
      ar: 'حلوى فردية مستوحاة من شوكولاتة دبي: موس فستق مع قطايف مقرمشة، بتغطية شوكولاتة بيضاء.',
    },
    allergens: 'חלב, חמאה, ביצים, גלוטן, אגוזים',
    storage: FREEZER,
  },
  {
    slug: 'dessert-mango',
    category: 'cakes',
    unit: 'per_piece',
    price: 45,
    name: { he: 'קינוח מנגו', ar: 'حلوى المانجو' },
    note: { he: 'מוס מנגו · בצורת פרי', ar: 'موس مانجو · على شكل الثمرة' },
    description: {
      he: 'קינוח אישי בצורת מנגו אמיתי: מוס מנגו קטיפתי בציפוי צבעוני בגוני צהוב, כתום ואדום.',
      ar: 'حلوى فردية على شكل ثمرة مانجو حقيقية: موس مانجو مخملي بتغطية ملوّنة بالأصفر والبرتقالي والأحمر.',
    },
    allergens: CAKE,
    storage: FREEZER,
  },
  {
    slug: 'dessert-coffee',
    category: 'cakes',
    unit: 'per_piece',
    price: 45,
    name: { he: 'קינוח קפה', ar: 'حلوى القهوة' },
    note: { he: 'מוס קפה · בצורת פול', ar: 'موس قهوة · على شكل حبة' },
    description: {
      he: 'קינוח אישי בצורת פול קפה: מוס קפה עשיר בציפוי שוקולד חלב מבריק.',
      ar: 'حلوى فردية على شكل حبة قهوة: موس قهوة غني بتغطية شوكولاتة بالحليب لامعة.',
    },
    allergens: CAKE,
    storage: FREEZER,
  },
  {
    slug: 'dessert-lotus',
    category: 'cakes',
    unit: 'per_piece',
    price: 45,
    name: { he: 'קינוח לוטוס', ar: 'حلوى اللوتس' },
    note: { he: 'מוס לוטוס · ציפוי לבן', ar: 'موس لوتس · تغطية بيضاء' },
    description: {
      he: 'קינוח אישי של מוס לוטוס קרמלי, בציפוי שוקולד לבן חלק בצורת ענן.',
      ar: 'حلوى فردية من موس اللوتس بنكهة الكراميل، بتغطية شوكولاتة بيضاء ناعمة على شكل غيمة.',
    },
    allergens: 'חלב, חמאה, ביצים, גלוטן, סויה · עשוי להכיל אגוזים',
    storage: FREEZER,
  },
  {
    slug: 'dessert-berries',
    category: 'cakes',
    unit: 'per_piece',
    price: 45,
    name: { he: 'קינוח פירות יער', ar: 'حلوى فواكه الغابة' },
    note: { he: 'מוס פירות יער · ציפוי ורוד', ar: 'موس فواكه الغابة · تغطية وردية' },
    description: {
      he: 'קינוח אישי של מוס פירות יער רענן וחמצמץ, בציפוי ורוד מבריק.',
      ar: 'حلوى فردية من موس فواكه الغابة المنعش والحامض قليلاً، بتغطية وردية لامعة.',
    },
    allergens: CAKE,
    storage: FREEZER,
  },
  {
    slug: 'profiteroles-box',
    category: 'cakes',
    unit: 'per_box',
    price: 80,
    unitLabel: { he: 'קופסה · 8 יח׳', ar: 'علبة · ٨ حبات' },
    name: { he: 'קופסת פחזניות גדולות', ar: 'علبة بروفيترول كبيرة' },
    note: { he: '8 יחידות גדולות · אבקת סוכר', ar: '٨ حبات كبيرة · سكر ناعم' },
    description: {
      he: 'קופסה של 8 פחזניות גדולות במילוי קרם, מפוזרות באבקת סוכר.',
      ar: 'علبة من ٨ حبات بروفيترول كبيرة محشوة بالكريمة ومرشوشة بالسكر الناعم.',
    },
    allergens: CAKE,
    storage: FREEZER,
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
  price: s.price ?? 0,
  unit: s.unit,
  unitLabel: s.unitLabel,
  category: s.category,
  badges: s.bestseller ? ['bestseller'] : [],
  inStock: true,
  freshnessHours: 24,
  confirmed: true,
  image: `/products/${s.slug}.webp`,
  allergens: s.allergens ? { he: s.allergens, ar: translateAllergens(s.allergens) } : undefined,
  storage: s.storage,
}));

function translateAllergens(he: string): string {
  return he
    .replace('עשוי להכיל אגוזים', 'قد يحتوي على مكسرات')
    .replace('ללא גלוטן', 'خالٍ من الغلوتين')
    .replace('חלב', 'حليب')
    .replace('חמאה', 'زبدة')
    .replace('אגוזים', 'مكسرات')
    .replace('ביצים', 'بيض')
    .replace('גלוטן', 'غلوتين')
    .replace('סויה', 'صويا');
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
