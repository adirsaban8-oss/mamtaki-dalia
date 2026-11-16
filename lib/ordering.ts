/**
 * How the site takes orders.
 *
 *  - 'whatsapp' (default, live today): every order button opens WhatsApp
 *    with the product and weight filled in.
 *  - 'site': order buttons add to the cart; checkout on the site with
 *    delivery or pickup. Payment is connected later (lib/payments.ts).
 *
 * Switch with the build variable NEXT_PUBLIC_ORDERING=site (Railway →
 * Variables; it is passed to the Docker build as a build arg).
 */
export type OrderingMode = 'whatsapp' | 'site';
export const ORDERING_MODE: OrderingMode = process.env.NEXT_PUBLIC_ORDERING === 'site' ? 'site' : 'whatsapp';

export type Fulfilment = 'delivery' | 'pickup';

/**
 * Delivery fee rules. PLACEHOLDER values until the owners set per-zone
 * prices and days (see lib/deliveryZones.ts).
 */
export const SHIPPING = { fee: 35, freeFrom: 300 } as const;

export function shippingFor(subtotal: number, fulfilment: Fulfilment): number {
  if (fulfilment === 'pickup') return 0;
  return subtotal >= SHIPPING.freeFrom ? 0 : SHIPPING.fee;
}

export const PICKUP_ADDRESS = { he: 'רחוב דליה 10, דלית אל כרמל', ar: 'شارع دالية 10، دالية الكرمل' } as const;
