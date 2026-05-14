'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type OrderStatus = 'pending' | 'sent';

export type OrderItem = {
  productName: string;       // Snapshot at order time — survives catalog edits
  quantity: number;          // kg / pieces / boxes depending on unit
  unitLabel: string;         // 'ק"ג' | 'מנה' | 'מארז'
  lineTotal: number;
};

export type Order = {
  id: string;
  orderNumber: number;       // sequential, human-friendly (#1024)
  customerName: string;
  customerPhone: string;     // Israeli format, e.g. "052-1234567"
  items: OrderItem[];
  deliveryAddress: string;   // free text
  deliveryDate: string;      // ISO yyyy-mm-dd
  deliveryWindow: string;    // 'בוקר' | 'צהריים' | 'ערב'
  customerNotes?: string;
  total: number;
  paymentMethod?: 'card' | 'cash';
  status: OrderStatus;
  createdAt: number;         // epoch ms — for sorting
  sentAt?: number;
};

type OrdersState = {
  orders: Order[];
  nextOrderNumber: number;

  /** Notification flag: when true, the admin Orders tab pulses + plays
   *  a chime. The Orders page clears this on mount. */
  unseen: number;

  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
  markSent: (id: string) => void;
  markPending: (id: string) => void;
  clearUnseen: () => void;

  // selectors
  pending: () => Order[];
  sent: () => Order[];
  todayCount: () => number;
  todayRevenue: () => number;
};

function generateId(): string {
  return `o_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

/* ── Seeded mock orders so the admin demo is never empty ─────────── */

const NOW = Date.now();

const seed: Order[] = [
  {
    id: 'o_seed_1024',
    orderNumber: 1024,
    customerName: 'יעל אברהמי',
    customerPhone: '052-1234567',
    items: [
      { productName: 'כנאפה גבינה קלאסית', quantity: 1.0, unitLabel: 'ק"ג', lineTotal: 160 },
      { productName: 'מארז שי חתימה', quantity: 1, unitLabel: 'מארז', lineTotal: 320 },
    ],
    deliveryAddress: 'רוטשילד 25, תל אביב · קומה 4, דירה 12',
    deliveryDate: new Date(NOW + DAY_MS).toISOString().slice(0, 10),
    deliveryWindow: 'צהריים (12:00-15:00)',
    customerNotes: 'בלי אגוזי מלך — אלרגיה במשפחה.',
    total: 480,
    paymentMethod: 'card',
    status: 'pending',
    createdAt: NOW - 12 * 60 * 1000, // 12 min ago
  },
  {
    id: 'o_seed_1023',
    orderNumber: 1023,
    customerName: 'מרואן עתאמנה',
    customerPhone: '054-9876543',
    items: [
      { productName: 'בקלאוה פיסטוק חלבי', quantity: 2.0, unitLabel: 'ק"ג', lineTotal: 440 },
    ],
    deliveryAddress: 'שדרות הנשיא 88, חיפה',
    deliveryDate: new Date(NOW).toISOString().slice(0, 10),
    deliveryWindow: 'ערב (16:00-19:00)',
    total: 440,
    paymentMethod: 'cash',
    status: 'pending',
    createdAt: NOW - 2 * HOUR_MS, // 2 hours ago
  },
  {
    id: 'o_seed_1022',
    orderNumber: 1022,
    customerName: 'אורית כהן',
    customerPhone: '050-5555555',
    items: [
      { productName: 'גלידת פיסטוק ביתית', quantity: 0.5, unitLabel: 'ק"ג', lineTotal: 65 },
      { productName: 'לילות ביירות', quantity: 1.0, unitLabel: 'ק"ג', lineTotal: 180 },
    ],
    deliveryAddress: 'סוקולוב 8, הרצליה פיתוח',
    deliveryDate: new Date(NOW - DAY_MS).toISOString().slice(0, 10),
    deliveryWindow: 'בוקר (08:00-11:00)',
    customerNotes: 'להשאיר בקירור — אישור משכן.',
    total: 245,
    paymentMethod: 'card',
    status: 'sent',
    createdAt: NOW - DAY_MS - 6 * HOUR_MS,
    sentAt: NOW - DAY_MS - 30 * 60 * 1000,
  },
  {
    id: 'o_seed_1021',
    orderNumber: 1021,
    customerName: 'אבי לוי',
    customerPhone: '053-7654321',
    items: [
      { productName: 'מארז משפחתי', quantity: 1, unitLabel: 'מארז', lineTotal: 580 },
    ],
    deliveryAddress: 'הירקון 5, רמת גן',
    deliveryDate: new Date(NOW - 2 * DAY_MS).toISOString().slice(0, 10),
    deliveryWindow: 'צהריים (12:00-15:00)',
    total: 580,
    paymentMethod: 'card',
    status: 'sent',
    createdAt: NOW - 2 * DAY_MS - 3 * HOUR_MS,
    sentAt: NOW - 2 * DAY_MS - 1 * HOUR_MS,
  },
];

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: seed,
      nextOrderNumber: 1025,
      unseen: 0,

      addOrder: (order) => {
        const newOrder: Order = {
          ...order,
          id: generateId(),
          orderNumber: get().nextOrderNumber,
          createdAt: Date.now(),
          status: 'pending',
        };
        set((state) => ({
          orders: [newOrder, ...state.orders],
          nextOrderNumber: state.nextOrderNumber + 1,
          unseen: state.unseen + 1,
        }));
        return newOrder;
      },

      markSent: (id) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status: 'sent' as const, sentAt: Date.now() } : o
          ),
        })),

      markPending: (id) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status: 'pending' as const, sentAt: undefined } : o
          ),
        })),

      clearUnseen: () => set({ unseen: 0 }),

      pending: () =>
        get()
          .orders.filter((o) => o.status === 'pending')
          .sort((a, b) => b.createdAt - a.createdAt),
      sent: () =>
        get()
          .orders.filter((o) => o.status === 'sent')
          .sort((a, b) => (b.sentAt ?? b.createdAt) - (a.sentAt ?? a.createdAt)),
      todayCount: () => {
        const todayKey = new Date().toISOString().slice(0, 10);
        return get().orders.filter(
          (o) => new Date(o.createdAt).toISOString().slice(0, 10) === todayKey
        ).length;
      },
      todayRevenue: () => {
        const todayKey = new Date().toISOString().slice(0, 10);
        return get()
          .orders.filter((o) => new Date(o.createdAt).toISOString().slice(0, 10) === todayKey)
          .reduce((sum, o) => sum + o.total, 0);
      },
    }),
    {
      name: 'mamtaki-dalia-orders-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/* ── Demo helper: simulate a new order arriving (for the admin demo) */

const RANDOM_CUSTOMERS = [
  { name: 'דנה רוזנברג', phone: '054-1112233', city: 'תל אביב, אבן גבירול 50' },
  { name: 'איאד חליל', phone: '052-2223344', city: 'אום אל פחם, הראשי 12' },
  { name: 'מאיה שטיין', phone: '050-3334455', city: 'גבעתיים, סירקין 18' },
  { name: 'סלים נצאר', phone: '053-4445566', city: 'נצרת, פאולוס השישי 22' },
  { name: 'תמר ענברי', phone: '054-5556677', city: 'מודיעין, התומר 7' },
] as const;

const RANDOM_ITEMS = [
  { productName: 'כנאפה גבינה קלאסית', quantity: 1.0, unitLabel: 'ק"ג', lineTotal: 160 },
  { productName: 'בקלאוה פיסטוק חלבי', quantity: 0.5, unitLabel: 'ק"ג', lineTotal: 110 },
  { productName: 'לילות ביירות', quantity: 1.0, unitLabel: 'ק"ג', lineTotal: 180 },
  { productName: 'מארז שי חתימה', quantity: 1, unitLabel: 'מארז', lineTotal: 320 },
  { productName: 'גלידת פיסטוק ביתית', quantity: 0.5, unitLabel: 'ק"ג', lineTotal: 65 },
  { productName: 'מעמול תמרים', quantity: 0.5, unitLabel: 'ק"ג', lineTotal: 70 },
] as const;

const WINDOWS = ['בוקר (08:00-11:00)', 'צהריים (12:00-15:00)', 'ערב (16:00-19:00)'] as const;

export function simulateNewOrder(): Order {
  const customer = RANDOM_CUSTOMERS[Math.floor(Math.random() * RANDOM_CUSTOMERS.length)];
  const itemCount = 1 + Math.floor(Math.random() * 2);
  const items: OrderItem[] = [];
  const pool = [...RANDOM_ITEMS];
  for (let i = 0; i < itemCount && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    items.push(pool.splice(idx, 1)[0]);
  }
  const total = items.reduce((sum, it) => sum + it.lineTotal, 0);
  const window = WINDOWS[Math.floor(Math.random() * WINDOWS.length)];
  const tomorrow = new Date(Date.now() + DAY_MS).toISOString().slice(0, 10);

  return useOrders.getState().addOrder({
    customerName: customer.name,
    customerPhone: customer.phone,
    items,
    deliveryAddress: customer.city,
    deliveryDate: tomorrow,
    deliveryWindow: window,
    total,
    paymentMethod: Math.random() > 0.4 ? 'card' : 'cash',
  });
}
