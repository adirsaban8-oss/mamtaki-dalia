import type { Locale } from '@/i18n/locales';
import type { Product } from '@/lib/mockData';

/**
 * Ordering by weight — one source for the product page and the shop-window
 * sheet: 200 g steps, 200 g – 10 kg, total rounded to whole shekels.
 */
export const STEP_GRAMS = 200;
export const MIN_GRAMS = 200;
export const MAX_GRAMS = 10000;
export const QUICK_GRAMS = [1000, 2000, 3000];
export const DEFAULT_GRAMS = 1000;

export function weightLabel(g: number, locale: Locale): string {
  return g < 1000
    ? locale === 'ar' ? `${g} غرام` : `${g} גרם`
    : locale === 'ar' ? `${g / 1000} كغ` : `${g / 1000} ק״ג`;
}

export function totalFor(product: Product, grams: number): number {
  return Math.round((product.price * grams) / 1000);
}

/** The WhatsApp order message (with the weight for per-kg products). */
export function orderMessage(product: Product, locale: Locale, grams?: number): string {
  const pack = product.unit === 'per_kg' && grams ? ` — ${weightLabel(grams, locale)}` : '';
  return locale === 'ar'
    ? `مرحباً، أود أن أطلب: ${product.name.ar}${pack}`
    : `שלום, אשמח להזמין: ${product.name.he}${pack}`;
}
