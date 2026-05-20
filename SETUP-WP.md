# מדריך הקמת WordPress + WooCommerce

מסמך זה מסביר איך להקים את הסביבה הניהולית של Mamtaki Dalia ב-WordPress
מקומי (Local by Flywheel) ולחבר אותה ל-Next.js שכבר רץ.

האתר הציבורי תמיד נשאר ב-Next.js — Vercel/Railway. WordPress הוא
**ה-Admin בלבד**: שם הבעלים מנהל מוצרים, מחירים, תמונות, ומקבל הזמנות.

---

## תוכן עניינים

1. [התקנת Local by Flywheel](#1-התקנת-local-by-flywheel)
2. [יצירת אתר WordPress חדש](#2-יצירת-אתר-wordpress-חדש)
3. [התקנת WooCommerce + הגדרה ראשונית](#3-התקנת-woocommerce--הגדרה-ראשונית)
4. [התקנת WPGraphQL + WPGraphQL for WooCommerce](#4-התקנת-wpgraphql--wpgraphql-for-woocommerce)
5. [הוספת מוצרים ראשונים (3 דוגמאות)](#5-הוספת-מוצרים-ראשונים-3-דוגמאות)
6. [הגדרת CORS להרשאת ה-Next.js](#6-הגדרת-cors)
7. [חיבור ה-Next.js ל-WordPress](#7-חיבור-ה-nextjs-ל-wordpress)
8. [Phase 2 (אופציונלי): תרגומים + ACF + מארחים בענן](#8-phase-2)

---

## 1. התקנת Local by Flywheel

1. הורד את ההתקנה: <https://localwp.com/>
2. הפעל את ה-installer (~150MB, חינמי).
3. בסיום ההתקנה, פתח את **Local**.

ההתקנה היא single-installer בלי תלות ב-Docker או WSL.

---

## 2. יצירת אתר WordPress חדש

1. פתח את Local → **+ Create a new site**
2. בחר **Preferred** (PHP 8.2, MySQL 8, Nginx) — הגדרות ברירת מחדל.
3. **Site name**: `mamtaki-dalia`
4. בחר שם משתמש/סיסמה לאדמין — שמור!
5. לחץ **Add Site**. ההתקנה לוקחת ~30 שניות.
6. אחרי שהאתר רץ, ב-Local יופיע **Site domain** — בדרך כלל
   `http://mamtaki-dalia.local`. **רשום את הכתובת הזו** — נחבר אליה את ה-Next.js.

לחץ **WP Admin** כדי להיכנס לדשבורד.

---

## 3. התקנת WooCommerce + הגדרה ראשונית

ב-wp-admin:

1. **Plugins → Add New** → חפש **WooCommerce** → Install → Activate.
2. ב-Setup Wizard ש-WooCommerce מציע:
   - **Store details**: כתובת = `דליה 10, דלית אל כרמל`, מטבע = `ILS`, סוג עסק = `Food`.
   - **דלג** על כל שאר השלבים (תשלומים, משלוחים, מיסים) — נגדיר אחרי.

3. **WooCommerce → Settings → General**:
   - Currency: `Israeli new shekel (₪)`
   - Currency position: `Right`
4. **WooCommerce → Settings → Products → Inventory**: דאג ש-`Stock management` מסומן ✓.

---

## 4. התקנת WPGraphQL + WPGraphQL for WooCommerce

ב-wp-admin → **Plugins → Add New**:

### א. WPGraphQL

- חפש **WPGraphQL** (יוצר: WPGraphQL, Jason Bahl).
- Install → Activate.
- אחרי הפעלה: **GraphQL → Settings** נוסף בתפריט. אמת ש-`Endpoint URL` הוא
  `graphql` (זה ברירת מחדל).

### ב. WPGraphQL for WooCommerce

תוסף חיצוני (לא ב-WordPress.org Repository הראשי בגלל policy).
מתקינים מ-GitHub:

1. הורד את ה-ZIP: <https://github.com/wp-graphql/wp-graphql-woocommerce/releases/latest>
2. ב-wp-admin → **Plugins → Add New → Upload Plugin** → בחר את ה-ZIP.
3. Install → Activate.

### בדיקה

פתח בדפדפן: `http://mamtaki-dalia.local/graphql`

צריך לחזור JSON שמתחיל ב-`{ "errors": [...]"` (זה תקין — זה GraphQL endpoint
שדורש query). ב-wp-admin → **GraphQL → GraphiQL IDE** יש playground לבדיקות.

הדבק את ה-query הבא ב-GraphiQL ולחץ ▶:

```graphql
{
  products(first: 10) {
    nodes {
      databaseId
      name
      slug
      ... on SimpleProduct {
        price
      }
    }
  }
}
```

אחרי שתוסיף מוצרים בשלב הבא, ה-query יחזיר אותם.

---

## 5. הוספת מוצרים ראשונים (3 דוגמאות)

ב-wp-admin → **Products → Add New**.

### מוצר 1: כנאפה גבינה קלאסית

| שדה | ערך |
|---|---|
| Name | `כנאפה גבינה קלאסית` |
| Slug (Permalink) | `kanafeh-classic` |
| Short description | `גבינה רכה · סירופ ורדים · פיסטוק חלבי` |
| Description | `הכנאפה שעליה בנינו את שמנו מאז 1985. גבינה עיזית טרייה, בצק קדאיף זהוב, וסירופ ורדים שמטוגן בחמאה צלולה. מוגשת חמה.` |
| Product data | `Simple product` |
| Regular price (₪) | `160` |
| Stock status | `In stock` |
| Categories | `כנאפה` (צור אם לא קיים) |
| Tags | `bestseller`, `kosher`, `per-kg` |

לחץ **Publish**.

### מוצר 2: בקלאוה פיסטוק חלבי

| שדה | ערך |
|---|---|
| Name | `בקלאוה פיסטוק חלבי` |
| Slug | `baklava-pistachio` |
| Short description | `שבעים שכבות פילו · פיסטוק חלבי · פרחי הדר` |
| Description | `שלוש שעות עבודה לכל מגש. שכבות פילו דקיקות שמרוחות בחמאה ידנית, פיסטוק חלבי, וסירופ פרחי הדר.` |
| Regular price (₪) | `220` |
| Categories | `בקלאוה` |
| Tags | `bestseller`, `kosher`, `per-kg` |

### מוצר 3: מארז שי חתימה

| שדה | ערך |
|---|---|
| Name | `מארז שי חתימה` |
| Slug | `gift-box-signature` |
| Short description | `עשרים יצירות · קופסת עץ זית · משלוח לכל הארץ` |
| Description | `בחירה אישית של אבו חסן — עשרים פיסות ממתקים בקופסת עץ זית מקומית, עטופה בנייר משי וסרט בד שחור.` |
| Regular price (₪) | `320` |
| Categories | `מארזים` |
| Tags | `bestseller`, `kosher`, `per-box` |

### מוסכמות התיוג

ה-Next.js מצפה לתגיות מסוימות שמומפות לשפת ה-frontend:

| תג ב-WordPress | תפקיד |
|---|---|
| `bestseller` / `מומלץ` | מסומן כ-"מומלץ" באתר + מופיע ב-Featured |
| `new` / `חדש` | תג "חדש" |
| `seasonal` / `עונתי` | תג "עונתי" |
| `kosher` / `כשר` | תג "כשר" |
| `vegan` / `טבעוני` | תג "טבעוני" |
| `per-kg` / `לקילו` | יחידת מחיר (ברירת מחדל) |
| `per-piece` / `למנה` | יחידת מחיר — מנה |
| `per-box` / `למארז` | יחידת מחיר — מארז |

### קטגוריות

צור את הקטגוריות הבאות (Products → Categories) עם ה-slugs המדויקים:

| Slug | שם תצוגה |
|---|---|
| `kanafeh` | כנאפה |
| `baklava` | בקלאוה |
| `beirut-nights` | לילות ביירות |
| `maamoul` | מעמול וקינוחי חמאה |
| `halawa` | חלאוה וקינוחי טחינה |
| `awameh` | עוואמה ומטוגנים |
| `ice-cream` | גלידות מקומיות |
| `gift-boxes` | מארזי שי |

ה-Slug חייב להיות באנגלית כפי שלמעלה — ה-mapper של ה-Next.js בודק לפי זה.

### תמונות

ב-Product editor → **Product image** → העלה תמונה. WooCommerce ייצור thumbnails
אוטומטית. ב-Next.js התמונה תופיע דרך `featuredImage.node.sourceUrl`.

---

## 6. הגדרת CORS

WordPress צריך לאשר בקשות מה-Next.js (`http://localhost:3000` בפיתוח).

ב-Local → לחץ ימני על האתר → **Open Site Folder** → נווט ל-`app/public`.
פתח את `functions.php` של ה-theme הפעיל (ברירת מחדל
`wp-content/themes/twentytwentyfive/functions.php`) והוסף בסוף:

```php
add_action( 'init', function () {
  header( 'Access-Control-Allow-Origin: http://localhost:3000' );
  header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
  header( 'Access-Control-Allow-Headers: Content-Type, Authorization' );
  if ( $_SERVER['REQUEST_METHOD'] === 'OPTIONS' ) {
    status_header( 200 );
    exit();
  }
} );
```

לפרודקשן נחליף `http://localhost:3000` לדומיין האמיתי של ה-Next.js.

---

## 7. חיבור ה-Next.js ל-WordPress

### א. הגדר env

צור קובץ `.env.local` בשורש הפרויקט (אם לא קיים):

```bash
NEXT_PUBLIC_DATA_SOURCE=wordpress
NEXT_PUBLIC_WP_GRAPHQL_URL=http://mamtaki-dalia.local/graphql
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### ב. הפעל מחדש את ה-dev server

```bash
# ב-c:\Users\adirs\candys\mamtaki-dalia
npm run dev
```

### ג. בדוק

פתח <http://localhost:3000/he/shop> — אמורים להופיע 3 המוצרים שיצרת ב-WordPress.

אם רואים `התפריט בהכנה`:
- בדוק שה-env נכון (פתח את DevTools Console: `process.env.NEXT_PUBLIC_DATA_SOURCE`)
- בדוק שה-WordPress רץ ב-Local
- בדוק את ה-Network tab: בקשה אמורה ללכת ל-`http://mamtaki-dalia.local/graphql`
- בדוק את ה-Console — שגיאת CORS? חזור לסעיף 6

### ד. החזרה למצב Local

כדי לחזור לעבוד עם הקטלוג המקומי (Zustand) — שנה ב-`.env.local`:

```bash
NEXT_PUBLIC_DATA_SOURCE=local
```

המעבר חסר-חיכוך — שני המקורות חיים זה לצד זה.

---

## 8. Phase 2

### א. תרגומים עברית/ערבית — Polylang

1. התקן **Polylang** + **Polylang for WooCommerce**.
2. **Languages → Settings**: Hebrew (`he_IL`) + Arabic (`ar`). Default = Hebrew.
3. בכל מוצר תופיע חוויה דו-לשונית — תרגם שם, short description, description.
4. ה-WPGraphQL חושף `translations { language slug ... }` על כל מוצר. נעדכן את
   ה-mapper כדי לבחור לפי locale.

### ב. שדות מותאמים — ACF + WPGraphQL for ACF

לטעימה (`tastingNote`), מונוגרמה (`monogram`), יחידת מחיר מדויקת:

1. התקן **ACF** (Advanced Custom Fields, חינמי) + **WPGraphQL for ACF**.
2. צור Field Group "Product Details" → Show in GraphQL ✓.
3. שדות:
   - `monogram` (Text)
   - `tasting_note` (Text)
   - `pricing_unit` (Select: `per_kg`, `per_piece`, `per_box`)
   - `min_weight` (Number, default 0.5)
   - `weight_step` (Number, default 0.25)
   - `freshness_hours` (Number, default 24)
4. עדכן את `lib/graphql/queries.ts` להוסיף `productDetails { ... }` לפרגמנט.
5. עדכן את `lib/graphql/mappers.ts` לקרוא מ-`productDetails` במקום לגזור.

### ג. הזמנות + התראות

WooCommerce כבר מנהל הזמנות (`wp-admin → WooCommerce → Orders`). להוספת
התראות פוש בטלפון לאבו חסן:
- אפליקציית **WooCommerce Mobile** (iOS+Android) — מתחברת לאתר ב-OAuth, push
  אוטומטי על כל הזמנה.
- חיבור Checkout של ה-Next.js ל-WooCommerce: דרך WPGraphQL מוטציית `checkout`
  (Phase 2.5).

### ד. מארח ענן

לפרודקשן — להעלות את ה-WordPress לאחד מאלה:
- **Hostinger Business** (~10$/חודש, מומלץ לעסקים קטנים)
- **Cloudways** (~14$/חודש, ניהול קל יותר)
- **Kinsta** (~35$/חודש, פרימיום)

תת-דומיין: `admin.mamtaki-dalia.co.il`. אתה צריך SSL (Let's Encrypt דרך
המארח). ה-Next.js ב-Railway / Vercel מתחבר ל-HTTPS.

---

## תקלות נפוצות

### ה-GraphQL מחזיר `Bad query` או 404

ודא שה-WPGraphQL פעיל וש-URL הוא `/graphql` בדיוק (לא `/graphql/`, לא
`/wp-json/graphql`).

### תוצאות ריקות גם אחרי הוספת מוצרים

- ה-status של המוצרים חייב להיות `Published`, לא `Draft`.
- בדוק ב-GraphiQL ידנית עם ה-query מסעיף 4.

### CORS error בקונסול

ראה סעיף 6. ייתכן שצריך לרענן את ה-permalinks: **Settings → Permalinks → Save**.

### תמונות לא נטענות

הוסף את הדומיין של ה-WordPress המקומי ל-`next.config.ts`:

```ts
images: {
  remotePatterns: [
    { protocol: 'http', hostname: 'mamtaki-dalia.local' },
    // ...existing patterns
  ],
}
```

---

**מוכן?** התחל מסעיף 1. כל שלב לוקח 1-5 דקות. סה"כ ~30 דק' לסביבה מלאה.
