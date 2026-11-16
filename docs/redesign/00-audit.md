# 00 — Audit (Phase 0)

Branch `redesign/sensory`, safety tag `pre-sensory-redesign` (= `main` at 4deb121, the live site).

## Stack
- Next.js 16 (app router, Turbopack), `output: standalone`, Dockerfile deployed on Railway from `main`.
- next-intl, locales **he** and **ar** (both RTL, `localePrefix: 'always'`). No English locale — none is added.
- Tailwind v4 tokens in `app/globals.css` (`@theme`), framer-motion, zustand stores, Apollo/WPGraphQL client.

## Routes
`/[locale]` home · `/shop` catalog · `/shop/[slug]` product · `/delivery` · `/events` · `/terms` `/returns` `/privacy` `/accessibility` · `/checkout` + `/checkout/success` · `/admin` + `/admin/catalog`. Plus `sitemap.xml`, `robots.txt`.

## Products and prices
- Source of truth: `lib/data/catalogSeed.ts` (24 products) → `store/catalog.ts` (zustand, editable from `/admin/catalog`, kept in the browser). WordPress is only used when `NEXT_PUBLIC_DATA_SOURCE=wordpress` (not set in production).
- Units: `per_kg` (price per kg), `per_box`, `per_piece`; optional `unitLabel` (e.g. "מארז 4 ק״ג").
- Weight pricing on the product page (`components/product/ProductDetail.tsx`): 200 g steps, 200 g – 10 kg, total = `round(price × grams / 1000)`. The chosen weight goes into the WhatsApp message.

## Ordering today
- **Catalog mode**: every order button opens WhatsApp `972525986266` with the product (and weight). Phone 052-5986266. Events line 054-3910078 + form on `/events` (opens WhatsApp, nothing stored).
- **Cart / checkout** (`store/cart.ts`, `components/cart/CartDrawer.tsx`, `components/checkout/CheckoutForm.tsx`) exist but are **dormant**: no add-to-cart button is mounted anywhere, so the cart is always empty. Checkout logic: shipping ₪35, free from ₪300; GraphQL `CHECKOUT_MUTATION` to WooCommerce. No payment provider is connected (owners have not chosen one).
- Pickup from the shop: stated in the terms; there is no pickup option in code.

## Admin
`/admin` (orders board) and `/admin/catalog` (catalog manager), local zustand state.

## Baseline (`docs/redesign/baseline.json`, screenshots in `before/`)
Recorded with `tests/redesign-baseline.cjs`: 24 products — card price = page price for all; per-kg totals at 1 / 1.2 / 2 kg and the WhatsApp message for each; checkout loads with an empty cart; admin loads.

## Needs approval (not done — touches business logic)
1. Turning the cart on (an add-to-cart button, the cart icon and drawer in the header). The design is ready for it; the flow is the owners' decision together with a payment provider.
2. The cart clamps per-kg quantities to 0.25 kg steps with a 0.5 kg minimum, while the product page sells in 200 g steps from 200 g. They must be aligned before the cart goes live.
3. A pickup option in checkout (today only in the terms text).
