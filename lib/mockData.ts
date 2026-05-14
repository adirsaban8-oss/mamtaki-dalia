/**
 * Mamtaki Dalia — product catalog.
 *
 * ─────────────────────────────────────────────────────────────────
 * SOURCING NOTES
 * ─────────────────────────────────────────────────────────────────
 * Products marked `confirmed: true` have at least one verifiable
 * public reference (Facebook/Instagram post, tourism listing, or
 * Tabit business page).
 *
 * Products marked `confirmed: false` are reasonable inferences for a
 * traditional Druze confectionery of this scale (Mamtaki Dalia, est.
 * 1985, Daliyat al-Karmel). The shop's full menu is not published in
 * a structured source online; until the owner provides the canonical
 * list, these stand in as plausible Druze-region staples (ma'amoul,
 * halawa, awameh, etc.) so the catalog feels real.
 *
 * Phase 1 ships WITHOUT product photography by design — see
 * `<MenuCard />`. Each product carries a 3-letter Latin monogram
 * that doubles as its visual signature.
 * ─────────────────────────────────────────────────────────────────
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
  /** 3-letter Latin monogram, e.g. "K · N · F" — used as the visual
   *  identity in place of a product photo. */
  monogram: string;
  name: Translated;
  /** Single poetic line, restaurant-menu register: 3–5 flavor cues
   *  separated by middle dots. Always shorter than the description. */
  tastingNote: Translated;
  /** Full product narrative — 2–3 sentences. */
  description: Translated;
  /** Comma-separated ingredient list. */
  ingredients: Translated;
  /** Numeric price; interpretation depends on `unit`. */
  price: number;
  unit: PricingUnit;
  /** Only used when unit === 'per_kg'. */
  minWeight?: number;
  weightStep?: number;
  category: ProductCategory;
  badges: ProductBadge[];
  inStock: boolean;
  freshnessHours: number;
  /** True if a public-internet reference confirms this product exists
   *  at Mamtaki Dalia. False if it's a reasonable Druze-staple stand-in. */
  confirmed: boolean;
  /** Optional photo URL — left undefined in catalog mode. */
  image?: string;
  gallery?: string[];
};

/* ─── Category labels ────────────────────────────────────────────── */

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

/* ─── Products ───────────────────────────────────────────────────── */

export const products: Product[] = [
  // ─── KANAFEH ────────────────────────────────────────────────────
  {
    id: 'p_kanafeh_classic',
    slug: 'kanafeh-classic',
    monogram: 'K · N · F',
    name: { he: 'כנאפה גבינה קלאסית', ar: 'كنافة جبنة كلاسيكية' },
    tastingNote: {
      he: 'גבינה רכה · סירופ ורדים · פיסטוק חלבי',
      ar: 'جبنة طرية · شراب الورد · فستق حلبي',
    },
    description: {
      he: 'הכנאפה שעליה בנינו את שמנו מאז 1985. גבינה עיזית טרייה מהמחלבה השכנה, בצק קדאיף זהוב, וסירופ ורדים שמטוגן בחמאה צלולה. מוגשת חמה — בדיוק כמו שסבא לימד.',
      ar: 'الكنافة التي بنينا عليها سمعتنا منذ ١٩٨٥. جبنة ماعز طازجة من الألبان المجاورة، عجين قطايف ذهبي، وشراب ورد مقلي بالسمن الصافي. تُقدَّم ساخنة — كما علّمنا الجد.',
    },
    ingredients: {
      he: 'גבינת עיזים, סולת, חמאה צלולה, סוכר, מי ורדים, פיסטוק חלבי.',
      ar: 'جبنة ماعز، سميد، سمن صافي، سكر، ماء ورد، فستق حلبي.',
    },
    price: 160,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category: 'kanafeh',
    badges: ['bestseller', 'kosher'],
    inStock: true,
    freshnessHours: 6,
    confirmed: true,
  },
  {
    id: 'p_kanafeh_personal',
    slug: 'kanafeh-personal',
    monogram: 'K · P · R',
    name: { he: 'כנאפה אישית', ar: 'كنافة فردية' },
    tastingNote: {
      he: 'אישית · נאפית במקום · מוגשת חמה',
      ar: 'فردية · تُخبز في المكان · تُقدَّم ساخنة',
    },
    description: {
      he: 'המנה החתימה לאוכלים בחנות. כל מנה נאפית טרייה במגש נפרד, ומוגשת מיד מהתנור. אופציה להוסיף גלידה ביתית מצופה — בקשו את "כנאפה עם גלידה".',
      ar: 'الطبق التوقيع للأكل في المحل. كل حصة تُخبز طازجة في صينية منفصلة، وتُقدَّم فوراً من الفرن. خيار إضافة مثلجات بيتية — اطلبوا "كنافة مع مثلجات".',
    },
    ingredients: { he: 'כפי שבכנאפה גבינה קלאסית.', ar: 'كما في الكنافة الكلاسيكية.' },
    price: 38,
    unit: 'per_piece',
    category: 'kanafeh',
    badges: ['bestseller'],
    inStock: true,
    freshnessHours: 1,
    confirmed: true,
  },
  {
    id: 'p_kanafeh_ice_cream',
    slug: 'kanafeh-ice-cream',
    monogram: 'K · I · C',
    name: { he: 'כנאפה עם גלידה', ar: 'كنافة مع مثلجات' },
    tastingNote: {
      he: 'חם פוגש קר · ליבה גבינה · גלידה ביתית',
      ar: 'حار يلتقي بارد · قلب جبنة · مثلجات بيتية',
    },
    description: {
      he: 'הקלאסיקה הביתית פוגשת את הגלידה הביתית שלנו. כנאפה חמה, גלידה קרירה מעל, פיסטוקים קצוצים והרבה סירופ. הגרסה האהובה ביותר על משפחות.',
      ar: 'الكلاسيكية البيتية تلتقي بمثلجاتنا البيتية. كنافة ساخنة، مثلجات باردة فوقها، فستق مفروم وشراب وفير. النسخة الأكثر محبوبة من العائلات.',
    },
    ingredients: {
      he: 'כפי שבכנאפה גבינה + גלידה ביתית, פיסטוק חלבי.',
      ar: 'كما في الكنافة + مثلجات بيتية، فستق حلبي.',
    },
    price: 48,
    unit: 'per_piece',
    category: 'kanafeh',
    badges: ['bestseller', 'new'],
    inStock: true,
    freshnessHours: 1,
    confirmed: true,
  },
  {
    id: 'p_kanafeh_nablusi',
    slug: 'kanafeh-nablusi',
    monogram: 'K · N · B',
    name: { he: 'כנאפה נאבלסיה', ar: 'كنافة نابلسية' },
    tastingNote: {
      he: 'גבינה לבנה כפרית · סירופ סוכר זהוב · עבה',
      ar: 'جبنة بيضاء قروية · شراب سكر ذهبي · سميكة',
    },
    description: {
      he: 'הסגנון של נאבלוס — שכבת גבינה לבנה עבה (חצי מהמגש), בצק קדאיף דק יותר, וסירופ סוכר קלאסי במקום ורדים. עבה, רכה, מסורתית.',
      ar: 'أسلوب نابلس — طبقة جبنة بيضاء سميكة (نصف الصينية)، عجين قطايف أرفع، وشراب سكر كلاسيكي بدلاً من الورد. سميكة، طريّة، تقليدية.',
    },
    ingredients: {
      he: 'גבינה לבנה כפרית, סולת, חמאה צלולה, סוכר, פיסטוק חלבי.',
      ar: 'جبنة بيضاء قروية، سميد، سمن صافي، سكر، فستق حلبي.',
    },
    price: 150,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category: 'kanafeh',
    badges: ['kosher'],
    inStock: true,
    freshnessHours: 6,
    confirmed: false,
  },

  // ─── BAKLAVA ────────────────────────────────────────────────────
  {
    id: 'p_baklava_pistachio',
    slug: 'baklava-pistachio',
    monogram: 'B · K · L',
    name: { he: 'בקלאוה פיסטוק חלבי', ar: 'بقلاوة فستق حلبي' },
    tastingNote: {
      he: 'שבעים שכבות פילו · פיסטוק חלבי · פרחי הדר',
      ar: 'سبعون طبقة فيلو · فستق حلبي · أزهار الحمضيات',
    },
    description: {
      he: 'שלוש שעות עבודה לכל מגש. שכבות פילו דקיקות שמרוחות בחמאה ידנית, פיסטוק חלבי שטוחנים אצלנו, וסירופ פרחי הדר מדליה. פריכה מבחוץ, עסיסית בפנים.',
      ar: 'ثلاث ساعات عمل لكل صينية. طبقات فيلو رقيقة مدهونة بالسمن يدوياً، فستق حلبي نطحنه عندنا، وشراب أزهار حمضيات من دالية. مقرمشة من الخارج، عصرية من الداخل.',
    },
    ingredients: {
      he: 'בצק פילו, פיסטוק חלבי, חמאה צלולה, סוכר, מי פרחי הדר.',
      ar: 'عجين فيلو، فستق حلبي، سمن صافي، سكر، ماء أزهار الحمضيات.',
    },
    price: 220,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category: 'baklava',
    badges: ['bestseller', 'kosher'],
    inStock: true,
    freshnessHours: 48,
    confirmed: true,
  },
  {
    id: 'p_baklava_walnut',
    slug: 'baklava-walnut',
    monogram: 'B · W · L',
    name: { he: 'בקלאוה אגוז מלך', ar: 'بقلاوة جوز' },
    tastingNote: {
      he: 'אגוז מלך טרי · קינמון · סירופ ורדים',
      ar: 'جوز طازج · قرفة · شراب ورد',
    },
    description: {
      he: 'אותו פילו, אותה עבודה — אבל עם אגוזי מלך גסים ונגיעה של קינמון. גרסה כפרית יותר, פחות מתוקה, מצוינת עם קפה הל.',
      ar: 'نفس الفيلو، نفس العمل — لكن مع جوز خشن ولمسة قرفة. نسخة قروية أكثر، أقل حلاوة، رائعة مع قهوة الهيل.',
    },
    ingredients: { he: 'בצק פילו, אגוז מלך, חמאה צלולה, סוכר, קינמון, מי ורדים.', ar: 'عجين فيلو، جوز، سمن صافي، سكر، قرفة، ماء ورد.' },
    price: 190,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category: 'baklava',
    badges: ['kosher'],
    inStock: true,
    freshnessHours: 48,
    confirmed: false,
  },
  {
    id: 'p_baklava_turkish',
    slug: 'baklava-turkish',
    monogram: 'B · T · K',
    name: { he: 'בקלאוה טורקית', ar: 'بقلاوة تركية' },
    tastingNote: {
      he: 'שכבות עדינות · גלידה לפי בקשה · חוויה איסטנבולית',
      ar: 'طبقات رقيقة · مثلجات حسب الطلب · تجربة إسطنبولية',
    },
    description: {
      he: 'גרסה איסטנבולית — שכבות עדינות יותר, פחות סירופ, יותר פילו. הוסיפו גלידה ביתית מצופה ותקבלו את החוויה שלקוחות אומרים עליה "הכי חו"ל בארץ".',
      ar: 'نسخة إسطنبولية — طبقات أرق، شراب أقل، فيلو أكثر. أضيفوا مثلجات بيتية وتحصلون على التجربة التي يصفها الزبائن بـ"الأكثر عالمية في البلاد".',
    },
    ingredients: { he: 'בצק פילו, פיסטוק חלבי, חמאה צלולה, סוכר.', ar: 'عجين فيلو، فستق حلبي، سمن صافي، سكر.' },
    price: 240,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category: 'baklava',
    badges: ['bestseller'],
    inStock: true,
    freshnessHours: 48,
    confirmed: true,
  },
  {
    id: 'p_mabroumeh',
    slug: 'mabroumeh',
    monogram: 'M · B · R',
    name: { he: 'מברומה', ar: 'مبرومة' },
    tastingNote: {
      he: 'פילו מגולגל · פיסטוק שלם · סירופ אגוזי',
      ar: 'فيلو ملفوف · فستق كامل · شراب جوزي',
    },
    description: {
      he: 'גלגלות פילו דקות סביב גרעין פיסטוק שלם, חתוכות לאצבעות אורכיות. הגרסה ה"ארוכה" של הבקלאוה — קל יותר לאכול ביד.',
      ar: 'لفائف فيلو رقيقة حول حبة فستق كاملة، مقطعة إلى أصابع طويلة. النسخة "الطويلة" من البقلاوة — أسهل للأكل باليد.',
    },
    ingredients: { he: 'בצק פילו, פיסטוק חלבי שלם, חמאה צלולה, סוכר.', ar: 'عجين فيلو، فستق حلبي كامل، سمن صافي، سكر.' },
    price: 210,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category: 'baklava',
    badges: ['kosher'],
    inStock: true,
    freshnessHours: 48,
    confirmed: false,
  },

  // ─── BEIRUT NIGHTS ─────────────────────────────────────────────
  {
    id: 'p_beirut_nights_classic',
    slug: 'beirut-nights',
    monogram: 'L · Y · L',
    name: { he: 'לילות ביירות', ar: 'ليالي بيروت' },
    tastingNote: {
      he: 'אשתא קרירה · סוכר ורדים · פיסטוק מעל',
      ar: 'قشطة باردة · سكر الورد · فستق فوقها',
    },
    description: {
      he: 'קרם אשתא לבן ועדין על בסיס סולת, מצופה בשכבת סירופ סוכר וורדים, ומפוזר עם פיסטוקים טריים. מוגש קר, מושלם לאחר ארוחה כבדה.',
      ar: 'كريم قشطة أبيض ورقيق على قاعدة سميد، مغطى بطبقة شراب السكر والورد، ومرشوش بالفستق الطازج. يُقدّم بارداً، مثالي بعد وجبة دسمة.',
    },
    ingredients: { he: 'סולת, חלב טרי, סוכר, מי ורדים, פיסטוק חלבי.', ar: 'سميد، حليب طازج، سكر، ماء ورد، فستق حلبي.' },
    price: 180,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category: 'beirut-nights',
    badges: ['kosher'],
    inStock: true,
    freshnessHours: 24,
    confirmed: true,
  },
  {
    id: 'p_mahalabia',
    slug: 'mahalabia',
    monogram: 'M · H · L',
    name: { he: 'מהלביה ורד', ar: 'مهلبية ورد' },
    tastingNote: {
      he: 'חלב עם מי ורדים · ז\'לטין עדין · שקדים',
      ar: 'حليب بماء الورد · جلاتين ناعم · لوز',
    },
    description: {
      he: 'הקינוח הקליל ביותר במגש — חלב מבושל עם מי ורדים, מקבל מרקם פודינג עדין מקמח אורז. מצופה בשקדים פרוסים ותמצית סירופ.',
      ar: 'الحلوى الأخف في الصينية — حليب مغلي بماء الورد، يكتسب قواماً ناعماً من دقيق الأرز. مغطى بشرائح اللوز وقطرات شراب.',
    },
    ingredients: { he: 'חלב, סוכר, קמח אורז, מי ורדים, שקדים.', ar: 'حليب، سكر، دقيق أرز، ماء ورد، لوز.' },
    price: 95,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category: 'beirut-nights',
    badges: ['kosher', 'new'],
    inStock: true,
    freshnessHours: 24,
    confirmed: false,
  },

  // ─── MA'AMOUL & BUTTER COOKIES ─────────────────────────────────
  {
    id: 'p_maamoul_dates',
    slug: 'maamoul-dates',
    monogram: 'M · A · D',
    name: { he: 'מעמול תמרים', ar: 'معمول التمر' },
    tastingNote: {
      he: 'סולת בחושה · תמרי מג\'הול · אבקת סוכר',
      ar: 'سميد مخبوز · تمر مجهول · سكر بودرة',
    },
    description: {
      he: 'הבצק שלנו מסולת בחושה, נדחס ביד לתבניות עץ מסורתיות, וממולא בתמרי מג\'הול שטוחנים אצלנו ברחיים. הקלאסיקה של חגי הקיץ.',
      ar: 'عجيننا من سميد مخبوز يدوياً، يُضغط بقوالب خشبية تقليدية، ويُحشى بتمر المجهول الذي نطحنه بأرحائنا. كلاسيكية أعياد الصيف.',
    },
    ingredients: { he: 'סולת, סמנה, סוכר, תמרים מג\'הול, ציפורן.', ar: 'سميد، سمنة، سكر، تمر مجهول، قرنفل.' },
    price: 140,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category: 'maamoul',
    badges: ['kosher', 'vegan'],
    inStock: true,
    freshnessHours: 96,
    confirmed: false,
  },
  {
    id: 'p_maamoul_pistachio',
    slug: 'maamoul-pistachio',
    monogram: 'M · A · P',
    name: { he: 'מעמול פיסטוק', ar: 'معمول الفستق' },
    tastingNote: {
      he: 'מילוי פיסטוק חלבי · קונדיטוריה דרוזית · עבודת יד',
      ar: 'حشوة فستق حلبي · حلواني درزي · صناعة يدوية',
    },
    description: {
      he: 'הגרסה היוקרתית של המעמול — מילוי פיסטוק חלבי טחון עם מעט סוכר וסירופ פרחי הדר. הצורה מובחנת בתבנית עץ מיוחדת.',
      ar: 'النسخة الفاخرة من المعمول — حشوة فستق حلبي مطحون مع قليل من السكر وشراب أزهار الحمضيات. الشكل مميز بقالب خشب خاص.',
    },
    ingredients: { he: 'סולת, סמנה, סוכר, פיסטוק חלבי, מי פרחי הדר.', ar: 'سميد، سمنة، سكر، فستق حلبي، ماء أزهار الحمضيات.' },
    price: 220,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category: 'maamoul',
    badges: ['kosher'],
    inStock: true,
    freshnessHours: 96,
    confirmed: false,
  },
  {
    id: 'p_graybeh',
    slug: 'graybeh',
    monogram: 'G · R · B',
    name: { he: 'גרז (עוגיות חמאה)', ar: 'غريبة' },
    tastingNote: {
      he: 'נימוחה בפה · שלוש מרכיבים · שקד יחיד',
      ar: 'تذوب في الفم · ثلاثة مكونات · لوزة واحدة',
    },
    description: {
      he: 'עוגיית חמאה נימוחה במרקם שלוש-המרכיבים: סמנה, סוכר, קמח. עליה שקד אחד באמצע — בדיוק כמו שאמא הייתה עושה לליל שבת.',
      ar: 'بسكويت زبدة يذوب في الفم بقوام الثلاثة مكونات: سمنة، سكر، طحين. فوقها لوزة واحدة في المنتصف — تماماً كما كانت أمي تصنع لليلة الجمعة.',
    },
    ingredients: { he: 'סמנה, סוכר, קמח חיטה, שקדים.', ar: 'سمنة، سكر، دقيق قمح، لوز.' },
    price: 110,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category: 'maamoul',
    badges: ['kosher', 'vegan'],
    inStock: true,
    freshnessHours: 120,
    confirmed: false,
  },

  // ─── HALAWA ─────────────────────────────────────────────────────
  {
    id: 'p_halawa_pistachio',
    slug: 'halawa-pistachio',
    monogram: 'H · L · P',
    name: { he: 'חלאוה פיסטוק', ar: 'حلاوة فستق' },
    tastingNote: {
      he: 'טחינה גולמית · פיסטוקים שלמים · חבטות יד',
      ar: 'طحينة خام · فستق كامل · دق يدوي',
    },
    description: {
      he: 'מסורת של ארבעה דורות. החלאוה שלנו עשויה מטחינה גולמית, סוכר, וחבטות יד עד שהיא מקבלת את המרקם המשי. עם פיסטוקים שלמים שמוסיפים ברגע האחרון.',
      ar: 'تراث أربعة أجيال. حلاوتنا من طحينة خام، سكر، ودقّ يدوي حتى تكتسب ملمسها الحريري. مع فستق كامل نضيفه في اللحظة الأخيرة.',
    },
    ingredients: { he: 'טחינה גולמית, סוכר, פיסטוק חלבי שלם, וניל.', ar: 'طحينة خام، سكر، فستق حلبي كامل، فانيليا.' },
    price: 120,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category: 'halawa',
    badges: ['kosher', 'vegan'],
    inStock: true,
    freshnessHours: 168,
    confirmed: false,
  },
  {
    id: 'p_halawa_vanilla',
    slug: 'halawa-vanilla',
    monogram: 'H · L · V',
    name: { he: 'חלאוה וניל', ar: 'حلاوة فانيليا' },
    tastingNote: {
      he: 'הקלאסיקה · פרוסה דקה · וניל בורבון',
      ar: 'الكلاسيكية · شريحة رفيعة · فانيليا بوربون',
    },
    description: {
      he: 'הגרסה הבסיסית של החלאוה — בלי תוספות, עם וניל בורבון אמיתי. נחתכת לפרוסות דקות ומוגשת עם קפה ערבי.',
      ar: 'النسخة الأساسية من الحلاوة — بدون إضافات، مع فانيليا بوربون حقيقية. تُقطع إلى شرائح رفيعة وتُقدَّم مع القهوة العربية.',
    },
    ingredients: { he: 'טחינה גולמית, סוכר, וניל בורבון.', ar: 'طحينة خام، سكر، فانيليا بوربون.' },
    price: 95,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category: 'halawa',
    badges: ['kosher', 'vegan'],
    inStock: true,
    freshnessHours: 168,
    confirmed: false,
  },

  // ─── AWAMEH / FRIED ─────────────────────────────────────────────
  {
    id: 'p_awameh',
    slug: 'awameh',
    monogram: 'A · W · M',
    name: { he: 'עוואמה', ar: 'عوامة' },
    tastingNote: {
      he: 'כדורי בצק זהובים · סירופ סוכר · מיני-תוצרת',
      ar: 'كرات عجين ذهبية · شراب سكر · صناعة فورية',
    },
    description: {
      he: 'כדורים קטנים של בצק שמרים שמטוגנים בחמאה צלולה עד זהוב, וטובלים בסירופ סוכר חם. נמכרים חמים, נאכלים ביד.',
      ar: 'كرات صغيرة من عجين الخميرة تُقلى بالسمن الصافي حتى الذهبي، وتُغمس بشراب السكر الساخن. تُباع ساخنة، تُؤكل باليد.',
    },
    ingredients: { he: 'קמח, שמרים, חמאה צלולה, סוכר, מי ורדים.', ar: 'دقيق، خميرة، سمن صافي، سكر، ماء ورد.' },
    price: 80,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category: 'awameh',
    badges: ['kosher', 'vegan'],
    inStock: true,
    freshnessHours: 8,
    confirmed: false,
  },
  {
    id: 'p_katayef',
    slug: 'katayef',
    monogram: 'Q · T · F',
    name: { he: 'אטאיף ממולא', ar: 'قطايف محشية' },
    tastingNote: {
      he: 'חצי-סהר עדין · גבינה או אגוז · רמאדאן וחגים',
      ar: 'هلال رقيق · جبنة أو جوز · رمضان والأعياد',
    },
    description: {
      he: 'פנקייקים קטנים מקופלים לחצאי-סהר, ממולאים בגבינה רכה או באגוז מלך טחון, ומוגשים עם סירופ פרחי הדר. עונתי — בעיקר ברמאדאן ובחגים דרוזיים.',
      ar: 'فطائر صغيرة مطوية إلى أنصاف أهلة، محشوة بجبنة طرية أو جوز مطحون، تُقدَّم مع شراب أزهار الحمضيات. موسمية — في رمضان والأعياد الدرزية بشكل خاص.',
    },
    ingredients: { he: 'קמח, סולת, שמרים, גבינה / אגוז מלך, סירופ פרחי הדר.', ar: 'دقيق، سميد، خميرة، جبنة / جوز، شراب أزهار الحمضيات.' },
    price: 110,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category: 'awameh',
    badges: ['kosher', 'seasonal'],
    inStock: true,
    freshnessHours: 24,
    confirmed: false,
  },

  // ─── ICE CREAM ───────────────────────────────────────────────────
  {
    id: 'p_ice_cream_pistachio',
    slug: 'ice-cream-pistachio',
    monogram: 'I · C · P',
    name: { he: 'גלידת פיסטוק ביתית', ar: 'مثلجات الفستق البيتية' },
    tastingNote: {
      he: 'פיסטוק חלבי · חלב הכרמל · בלי צבע',
      ar: 'فستق حلبي · حليب الكرمل · بلا تلوين',
    },
    description: {
      he: 'גלידה ביתית שמיוצרת בחנות מדי בוקר. פיסטוקים חלביים שאנחנו טוחנים, חלב מקומי מהכרמל, ומעט סוכר. הצבע הירוק הוא הצבע של הפיסטוק האמיתי — לא צבעי מאכל.',
      ar: 'مثلجات بيتية تُصنع في المحل كل صباح. فستق حلبي نطحنه، حليب محلي من الكرمل، وقليل من السكر. اللون الأخضر هو لون الفستق الحقيقي — وليس تلويناً غذائياً.',
    },
    ingredients: { he: 'חלב, פיסטוק חלבי, סוכר, חלמון ביצה.', ar: 'حليب، فستق حلبي، سكر، صفار بيض.' },
    price: 130,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category: 'ice-cream',
    badges: ['kosher', 'new'],
    inStock: true,
    freshnessHours: 168,
    confirmed: true,
  },
  {
    id: 'p_ice_cream_rosewater',
    slug: 'ice-cream-rosewater',
    monogram: 'I · C · R',
    name: { he: 'גלידת מי ורדים', ar: 'مثلجات ماء الورد' },
    tastingNote: {
      he: 'עדינה · שמנת מקומית · עלי ורדים',
      ar: 'رقيقة · قشدة محلية · بتلات ورد',
    },
    description: {
      he: 'גלידה לבנה עדינה עם תמצית מי ורדים אמיתית, מקושטת בעלי ורדים יבשים. מצוינת לבד או לצד כנאפה חמה.',
      ar: 'مثلجات بيضاء رقيقة بخلاصة ماء الورد الحقيقي، مزيّنة ببتلات ورد مجففة. ممتازة وحدها أو إلى جانب كنافة ساخنة.',
    },
    ingredients: { he: 'חלב, שמנת, סוכר, מי ורדים, חלמון ביצה.', ar: 'حليب، قشدة، سكر، ماء ورد، صفار بيض.' },
    price: 130,
    unit: 'per_kg',
    minWeight: 0.5,
    weightStep: 0.25,
    category: 'ice-cream',
    badges: ['kosher'],
    inStock: true,
    freshnessHours: 168,
    confirmed: false,
  },

  // ─── GIFT BOXES ─────────────────────────────────────────────────
  {
    id: 'p_gift_box_signature',
    slug: 'gift-box-signature',
    monogram: 'G · F · T',
    name: { he: 'מארז שי חתימה', ar: 'علبة هدايا التوقيع' },
    tastingNote: {
      he: 'עשרים יצירות · קופסת עץ זית · משלוח לכל הארץ',
      ar: 'عشرون قطعة · صندوق خشب زيتون · شحن لكل البلاد',
    },
    description: {
      he: 'בחירה אישית של אבו חסן — עשרים פיסות ממתקים בקופסת עץ זית מקומית, עטופה בנייר משי וסרט בד שחור. מתנה מושלמת לאירועים, חגים, או מי שפשוט אוהבים.',
      ar: 'اختيار شخصي من أبو حسن — عشرون قطعة حلوى في صندوق خشب زيتون محلي، مغلّفة بورق حرير وشريط قماش أسود. هدية مثالية للمناسبات، الأعياد، أو لمن نحبهم.',
    },
    ingredients: { he: 'מגוון: בקלאוה, מעמול, גרז, מברומה, פיסטוק.', ar: 'تشكيلة: بقلاوة، معمول، غريبة، مبرومة، فستق.' },
    price: 320,
    unit: 'per_box',
    category: 'gift-boxes',
    badges: ['bestseller', 'kosher'],
    inStock: true,
    freshnessHours: 72,
    confirmed: true,
  },
  {
    id: 'p_gift_box_family',
    slug: 'gift-box-family',
    monogram: 'G · F · M',
    name: { he: 'מארז משפחתי', ar: 'علبة عائلية' },
    tastingNote: {
      he: 'ארבעים יצירות · לאירוחים · כשר למהדרין',
      ar: 'أربعون قطعة · للضيافات · كوشير للمهدرين',
    },
    description: {
      he: 'הגרסה המורחבת — ארבעים פיסות, מבחר רחב יותר, מארז כפול. מומלץ לאירוחי שבת, חתונות מצומצמות, או יום הולדת של מי שאוהב מתוקים.',
      ar: 'النسخة الموسعة — أربعون قطعة، تشكيلة أوسع، علبة مزدوجة. موصى به لضيافات السبت، الأعراس الصغيرة، أو أعياد ميلاد من يحب الحلويات.',
    },
    ingredients: { he: 'כפי שבמארז חתימה, בכמות כפולה.', ar: 'كما في علبة التوقيع، بكمية مضاعفة.' },
    price: 580,
    unit: 'per_box',
    category: 'gift-boxes',
    badges: ['kosher'],
    inStock: true,
    freshnessHours: 72,
    confirmed: true,
  },
  {
    id: 'p_gift_box_ramadan',
    slug: 'gift-box-ramadan',
    monogram: 'G · F · R',
    name: { he: 'מארז רמאדאן', ar: 'علبة رمضان' },
    tastingNote: {
      he: 'אטאיף · מעמול · תמרי מג\'הול · עונתי',
      ar: 'قطايف · معمول · تمر مجهول · موسمي',
    },
    description: {
      he: 'מארז עונתי שמורכב במיוחד לחודש רמאדאן: אטאיף ממולא, מעמול תמרים, ותמרי מג\'הול בודדים. זמין רק במהלך החודש הקדוש.',
      ar: 'علبة موسمية مخصصة لشهر رمضان: قطايف محشية، معمول التمر، وتمر مجهول مفرد. متوفرة فقط خلال الشهر الفضيل.',
    },
    ingredients: { he: 'אטאיף, מעמול תמרים, תמרי מג\'הול.', ar: 'قطايف، معمول التمر، تمر مجهول.' },
    price: 380,
    unit: 'per_box',
    category: 'gift-boxes',
    badges: ['kosher', 'seasonal', 'new'],
    inStock: true,
    freshnessHours: 48,
    confirmed: false,
  },
];

/* ─── Featured selection (homepage) ──────────────────────────────── */

export const featuredProductIds = [
  'p_kanafeh_classic',
  'p_baklava_pistachio',
  'p_beirut_nights_classic',
  'p_gift_box_signature',
] as const;

export const featuredProducts = featuredProductIds
  .map((id) => products.find((p) => p.id === id))
  .filter((p): p is Product => Boolean(p));

export function findProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function productsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

/** Ordered list of categories for the catalog page. */
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
