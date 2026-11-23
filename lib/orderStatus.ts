/** Order steps as the shop marks them in /admin. Shared by the server and the admin screen. */
export const ORDER_STATUSES = ['new', 'preparing', 'shipped', 'done', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'חדשה',
  preparing: 'בהכנה',
  shipped: 'יצאה למשלוח',
  done: 'נמסרה ללקוח',
  cancelled: 'בוטלה',
};
/** For pickup orders the third step reads differently. */
export const statusLabel = (s: OrderStatus, pickup: boolean) => (s === 'shipped' && pickup ? 'מוכנה לאיסוף' : STATUS_LABEL[s]);

export type OrderItem = { productId: string; name: string; qtyLabel: string; quantity: number; lineTotal: number };
export type OrderRecord = {
  ref: string;
  status: OrderStatus;
  createdAt: string;
  customer: { name: string; phone: string; email: string };
  items: OrderItem[];
  fulfilment: 'delivery' | 'pickup';
  address: string;
  addressEn?: string;
  date: string;
  window: string;
  notes?: string;
  subtotal: number;
  shipping: number;
  total: number;
  payment: string;
};
