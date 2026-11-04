/**
 * Builds a WooCommerce product-import CSV from the starter catalog.
 *
 *   npx tsx scripts/export-woocommerce-csv.ts > woocommerce-products.csv
 *
 * In wp-admin: Products → Import → choose the file → "Run the importer".
 * Images are pulled from the live site's /products folder, so deploy the
 * site first. Allergens and storage become product attributes, which the
 * storefront reads back (see lib/graphql/mappers.ts).
 */
import { seedCatalog } from '../lib/data/catalogSeed';
import { categoryLabels } from '../lib/mockData';

const SITE = process.env.SITE_URL ?? 'https://mamtaki-dalia-production.up.railway.app';

const UNIT_TAG = { per_kg: 'per-kg', per_piece: 'per-piece', per_box: 'per-box' } as const;

const header = [
  'Type',
  'SKU',
  'Name',
  'Published',
  'Is featured?',
  'Visibility in catalog',
  'Short description',
  'Description',
  'In stock?',
  'Regular price',
  'Categories',
  'Tags',
  'Images',
  'Position',
  'Attribute 1 name',
  'Attribute 1 value(s)',
  'Attribute 1 visible',
  'Attribute 1 global',
  'Attribute 2 name',
  'Attribute 2 value(s)',
  'Attribute 2 visible',
  'Attribute 2 global',
];

const csvCell = (v: string | number) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const rows = seedCatalog.map((p, i) => {
  const tags = [UNIT_TAG[p.unit], ...p.badges].join(', ');
  return [
    'simple',
    p.slug,
    p.name.he,
    1,
    p.badges.includes('bestseller') ? 1 : 0,
    'visible',
    p.tastingNote.he,
    p.description.he,
    1,
    p.price || '',
    categoryLabels[p.category].he,
    tags,
    p.image ? `${SITE}${p.image}` : '',
    i,
    p.allergens ? 'אלרגנים' : '',
    p.allergens?.he ?? '',
    p.allergens ? 1 : '',
    p.allergens ? 0 : '',
    p.storage ? 'אחסנה' : '',
    // A comma would split the text into several attribute values.
    p.storage?.he.replace(/,/g, ' ·') ?? '',
    p.storage ? 1 : '',
    p.storage ? 0 : '',
  ];
});

// BOM so Excel / Sheets open the Hebrew text correctly.
process.stdout.write(
  '﻿' + [header, ...rows].map((r) => r.map(csvCell).join(',')).join('\n') + '\n'
);
