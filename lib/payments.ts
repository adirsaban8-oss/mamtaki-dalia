/**
 * Payment providers — the hook for connecting online payment later.
 *
 * Today no provider is connected: orders are taken on the site and paid
 * on delivery / pickup ('none'). To connect one (e.g. Meshulam, PayPlus,
 * Tranzila, Cardcom), set NEXT_PUBLIC_PAYMENT_PROVIDER and implement
 * `startPayment` for it: it receives the order and returns where to send
 * the customer (the provider's hosted payment page), or null when the
 * order needs no online payment.
 *
 * The WooCommerce path (NEXT_PUBLIC_DATA_SOURCE=wordpress) already hands
 * off to Meshulam through WordPress; this file is for the non-WP setup.
 */
export type PaymentProvider = 'none' | 'meshulam' | 'payplus' | 'tranzila' | 'cardcom';

export const PAYMENT_PROVIDER: PaymentProvider =
  (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER as PaymentProvider | undefined) ?? 'none';

export const ONLINE_PAYMENT = PAYMENT_PROVIDER !== 'none';

export type PaymentRequest = {
  orderNumber: string;
  amount: number;          // ₪, VAT included
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  description: string;
};

/** Returns the hosted payment page URL, or null when paying on delivery. */
export async function startPayment(req: PaymentRequest): Promise<string | null> {
  if (PAYMENT_PROVIDER === 'none') return null;
  // A provider is chosen but not implemented yet: fail loudly rather than
  // pretend the customer has paid.
  throw new Error(`Payment provider "${PAYMENT_PROVIDER}" is not connected yet (order ${req.orderNumber}).`);
}
