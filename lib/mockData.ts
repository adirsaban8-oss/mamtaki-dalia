/**
 * Mock product catalog — replace with WPGraphQL queries once the
 * WordPress backend is live. The shape mirrors the planned schema so
 * the swap is a single import change in the consumers.
 *
 * --------------------------------------------------------------------
 * PHOTOGRAPHY
 * --------------------------------------------------------------------
 * Every photo URL here is an Unsplash CDN ID that returns HTTP 200
 * (verified during the build). The visual *content* of each photo is
 * not guaranteed to match the product perfectly — Unsplash IDs are
 * placeholders for owned product photography.
 *
 * To swap any single photo for a real shot, drop a JPG at:
 *   /public/images/products/{slug}.jpg
 * and replace the `u('...')` call with `'/images/products/{slug}.jpg'`.
 *
 * Recommended shot list (per the luxury brief):
 *   – 1:1 square aspect ratio
 *   – Dark moody background (charcoal, deep brown, dark wood, marble)
 *   – Copper trays, dark wood boards, or marble surfaces
 *   – Dramatic side lighting with shadows (Bateel / Patchi style)
 *   – Props: pistachios, rose petals, Arabic coffee cup — minimal
 * --------------------------------------------------------------------
 */

export type Locale = 'he' | 'ar';

export type Translated = Record<Locale, string>;

export type ProductCategory =
  | 'kanafeh'
  | 'baklava'
  | 'beirut-nights'
  | 'gift-boxes'
  | 'specialty'
  | 'catering';

export type ProductBadge = 'kosher' | 'bestseller' | 'new' | 'vegan';

export type Product = {
  id: string;
  slug: string;
  name: Translated;
  shortDescription: Translated;
  description: Translated;
  ingredients: Translated;
  pricePerKg: number;
  minWeight: number;
  weightStep: number;
  image: string;
  gallery: string[];
  category: ProductCategory;
  badges: ProductBadge[];
  inStock: boolean;
  freshnessHours: number;
};

const u = (id: string, q = 85) =>
  `https://images.unsplash.com/photo-${id}?w=1600&q=${q}&auto=format&fit=crop`;

export const products: Product[] = [
  {
    id: 'p_kanafeh_classic',
    slug: 'kanafeh-classic',
    name: { he: 'כנאפה קלאסית', ar: 'كنافة كلاسيكية' },
    shortDescription: {
      he: 'גבינה רכה, סירופ ורדים, פיסטוק טחון — המתכון של סבא.',
      ar: 'جبنة طرية، شراب الورد، فستق مطحون — وصفة جدّي.',
    },
    description: {
      he: 'הכנאפה שלנו מוכנה מדי יום מגבינה עיזית טרייה, בצק קדאיף זהוב, וסירופ ורדים מטוגן בחמאה צלולה. זוהי הקלאסיקה שעליה בנינו את שמנו מאז 1985.',
      ar: 'تُحضّر كنافتنا يومياً من جبنة الماعز الطازجة، عجين القطايف الذهبي، وشراب الورد المقلي بالسمن الصافي. هذه هي الكلاسيكية التي بنينا عليها سمعتنا منذ ١٩٨٥.',
    },
    ingredients: {
      he: 'גבינת עיזים, סולת, חמאה צלולה, סוכר, מי ורדים, פיסטוק חלבי.',
      ar: 'جبنة ماعز، سميد، سمن صافي، سكر، ماء ورد، فستق حلبي.',
    },
    pricePerKg: 160,
    minWeight: 0.5,
    weightStep: 0.25,
    // Content-verified: Unsplash kunafa search → delicate pastry with
    // chopped pistachios. The closest match to traditional kanafeh.
    image: 'https://images.unsplash.com/photo-1778447812923-88a9e3e6b567?w=1600&q=85&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1778447812923-88a9e3e6b567?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1778447830669-8fe9626ed738?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1761828122856-8703baac8e86?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1705663106388-6c1c51ff5a8d?w=1600&q=85&auto=format&fit=crop',
    ],
    category: 'kanafeh',
    badges: ['bestseller', 'kosher'],
    inStock: true,
    freshnessHours: 6,
  },
  {
    id: 'p_baklava_pistachio',
    slug: 'baklava-pistachio',
    name: { he: 'בקלאוה פיסטוק', ar: 'بقلاوة بالفستق' },
    shortDescription: {
      he: 'שבעים שכבות פילו, פיסטוק חלבי כתוש, סירופ פרחי הדר.',
      ar: 'سبعون طبقة فيلو، فستق حلبي مكسّر، شراب أزهار الحمضيات.',
    },
    description: {
      he: 'בקלאוה שעוברת עבודה של שלוש שעות לכל מגש. שכבות פילו דקיקות, פיסטוק חלבי טרי שאנחנו מקבלים מסוריה, וסירופ פרחי הדר מדליה. פריכה מבחוץ, רכה ועסיסית בפנים.',
      ar: 'بقلاوة تتطلّب ثلاث ساعات عمل لكل صينية. طبقات فيلو رقيقة، فستق حلبي طازج من سوريا، وشراب أزهار حمضيات من دالية. مقرمشة من الخارج، طريّة وعصرية من الداخل.',
    },
    ingredients: {
      he: 'בצק פילו, פיסטוק חלבי, חמאה צלולה, סוכר, מי פרחי הדר.',
      ar: 'عجين فيلو، فستق حلبي، سمن صافي، سكر، ماء أزهار الحمضيات.',
    },
    pricePerKg: 220,
    minWeight: 0.5,
    weightStep: 0.25,
    image: u('1606312619070-d48b4c652a52'),
    gallery: [
      u('1606312619070-d48b4c652a52'),
      u('1530124566582-a618bc2615dc'),
      u('1604908176997-125f25cc6f3d'),
      u('1488477181946-6428a0291777'),
    ],
    category: 'baklava',
    badges: ['kosher', 'bestseller'],
    inStock: true,
    freshnessHours: 48,
  },
  {
    id: 'p_beirut_nights',
    slug: 'beirut-nights',
    name: { he: 'לילות ביירות', ar: 'ليالي بيروت' },
    shortDescription: {
      he: 'אשתא, פיסטוק וסירופ סוכר ורד — קינוח קר ועדין.',
      ar: 'قشطة، فستق وشراب ورد — حلوى باردة ورقيقة.',
    },
    description: {
      he: 'קרם אשתא לבן ועדין על בסיס סוֹלת, מצופה בשכבת סירופ סוכר וורדים, ומפוזר עם פיסטוקים טריים. מוגש קר, מושלם לאחר ארוחה כבדה.',
      ar: 'كريم قشطة أبيض ورقيق على قاعدة سميد، مغطى بطبقة شراب السكر والورد، ومرشوش بالفستق الطازج. يُقدّم بارداً، مثالي بعد وجبة دسمة.',
    },
    ingredients: {
      he: 'סולת, חלב טרי, סוכר, מי ורדים, פיסטוק חלבי.',
      ar: 'سميد، حليب طازج، سكر، ماء ورد، فستق حلبي.',
    },
    pricePerKg: 180,
    minWeight: 0.5,
    weightStep: 0.25,
    image: u('1571877227200-a0d98ea607e9'),
    gallery: [
      u('1571877227200-a0d98ea607e9'),
      u('1551024506-0bccd828d307'),
      u('1486297678162-eb2a19b0a32d'),
    ],
    category: 'beirut-nights',
    badges: ['new', 'kosher'],
    inStock: true,
    freshnessHours: 24,
  },
  {
    id: 'p_gift_box_signature',
    slug: 'gift-box-signature',
    name: { he: 'מארז שי חתימה', ar: 'علبة هدايا التوقيع' },
    shortDescription: {
      he: 'אסופה של עשרים יצירות פרי המטבח, ארוז בקופסת עץ.',
      ar: 'مجموعة عشرين قطعة من إبداعات المطبخ، معبأة في صندوق خشب.',
    },
    description: {
      he: 'בחירה אישית של אבו חסן — עשרים פיסות ממתקים בקופסת עץ זית מקומית, עטופה בנייר משי וסרט מבד שחור. מתנה מושלמת לאירועים, ראש השנה, או מי שפשוט אוהבים.',
      ar: 'اختيار شخصي من أبو حسن — عشرون قطعة حلوى في صندوق خشب زيتون محلي، مغلّفة بورق حرير وشريط قماش أسود. هدية مثالية للمناسبات، رأس السنة، أو لمن نحبهم.',
    },
    ingredients: {
      he: 'מגוון מיני בקלאוה, מעמול, גרז, פיסטוק, אגוז מלך.',
      ar: 'تشكيلة من البقلاوة، المعمول، الغريبة، الفستق، الجوز.',
    },
    pricePerKg: 280,
    minWeight: 0.5,
    weightStep: 0.25,
    // Content-verified: a collection of various Middle-Eastern desserts
    // arranged on a table — exactly the assortment a signature gift box is.
    image: 'https://plus.unsplash.com/premium_photo-1667545476423-21bd39236df1?w=1600&q=85&auto=format&fit=crop',
    gallery: [
      'https://plus.unsplash.com/premium_photo-1667545476423-21bd39236df1?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1658413380634-e127bbaeeb7b?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1777080841879-c1ab2be3eec6?w=1600&q=85&auto=format&fit=crop',
    ],
    category: 'gift-boxes',
    badges: ['bestseller', 'kosher'],
    inStock: true,
    freshnessHours: 72,
  },
  {
    id: 'p_maamoul_dates',
    slug: 'maamoul-dates',
    name: { he: 'מעמול תמרים', ar: 'معمول التمر' },
    shortDescription: {
      he: 'מאפה סולת בחושה, מילוי תמרים מג׳הול, אבקת סוכר עדינה.',
      ar: 'معجنات سميد، حشوة تمر مجهول، سكر بودرة ناعم.',
    },
    description: {
      he: 'המעמול הוא קלאסיקה של חגים. הבצק שלנו עשוי מסולת בחושה, נדחס ביד לתבניות עץ מסורתיות, וממולא בתמרי מג׳הול שטוחנים אצלנו ברחיים.',
      ar: 'المعمول كلاسيكية الأعياد. عجيننا من سميد مخبوز يدوياً، يُضغط بقوالب خشبية تقليدية، ويُحشى بتمر المجهول الذي نطحنه بأرحائنا.',
    },
    ingredients: { he: 'סולת, סמנה, סוכר, תמרים מג׳הול, ציפורן.', ar: 'سميد، سمنة، سكر، تمر مجهول، قرنفل.' },
    pricePerKg: 140,
    minWeight: 0.5,
    weightStep: 0.25,
    image: u('1601979031925-424e53b6caaa'),
    gallery: [
      u('1601979031925-424e53b6caaa'),
      u('1486297678162-eb2a19b0a32d'),
    ],
    category: 'specialty',
    badges: ['kosher', 'vegan'],
    inStock: true,
    freshnessHours: 96,
  },
  {
    id: 'p_halva_pistachio',
    slug: 'halva-pistachio',
    name: { he: 'חלבה פיסטוק', ar: 'حلاوة فستق' },
    shortDescription: {
      he: 'חלבה איכותית עם פיסטוקים שלמים, רכה ולא מתקתקה.',
      ar: 'حلاوة عالية الجودة مع فستق كامل، طريّة وغير محرمشة.',
    },
    description: {
      he: 'מסורת של ארבעה דורות. החלבה שלנו עשויה מטחינה גולמית, סוכר, ושוב ושוב — חבטות יד עד שהיא מקבלת את המרקם המשי שלה. עם פיסטוקים שלמים שנוסיף ברגע האחרון.',
      ar: 'تراث أربعة أجيال. حلاوتنا من طحينة خام، سكر، ودقّ يدوي متكرر حتى تكتسب ملمسها الحريري. مع فستق كامل نضيفه في اللحظة الأخيرة.',
    },
    ingredients: { he: 'טחינה גולמית, סוכר, פיסטוק חלבי שלם, וניל.', ar: 'طحينة خام، سكر، فستق حلبي كامل، فانيليا.' },
    pricePerKg: 120,
    minWeight: 0.5,
    weightStep: 0.25,
    image: u('1551024601-bec78aea704b'),
    gallery: [
      u('1551024601-bec78aea704b'),
      u('1530124566582-a618bc2615dc'),
    ],
    category: 'specialty',
    badges: ['kosher', 'vegan'],
    inStock: true,
    freshnessHours: 168,
  },
];

export const featuredProductIds = [
  'p_kanafeh_classic',
  'p_baklava_pistachio',
  'p_beirut_nights',
  'p_gift_box_signature',
] as const;

export const featuredProducts = featuredProductIds
  .map((id) => products.find((p) => p.id === id))
  .filter((p): p is Product => Boolean(p));

export function findProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Testimonials shown on the homepage. */
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
