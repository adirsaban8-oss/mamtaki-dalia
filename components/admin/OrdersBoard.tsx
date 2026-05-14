'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Locale } from '@/i18n/locales';
import { useOrders, simulateNewOrder, type Order } from '@/store/orders';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

type FilterMode = 'pending' | 'sent' | 'all';

type Props = { locale: Locale };

/**
 * Orders dashboard.
 *  – Top summary: today count + revenue + total pending.
 *  – Filter tabs (pending / sent / all) + name/phone search.
 *  – Order cards sorted new→old; pending status banner pulses.
 *  – "מוכן" / "ready" button moves an order from pending → sent.
 *  – "סימולציית הזמנה" / "simulate new order" button for the demo.
 *  – Browser Notification + chime when a new order arrives while
 *    the admin is open (relies on the `unseen` counter in the store).
 */
export function OrdersBoard({ locale }: Props) {
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  const orders = useOrders((s) => s.orders);
  const unseen = useOrders((s) => s.unseen);
  const clearUnseen = useOrders((s) => s.clearUnseen);
  const markSent = useOrders((s) => s.markSent);
  const markPending = useOrders((s) => s.markPending);
  const todayCount = useOrders((s) => s.todayCount());
  const todayRevenue = useOrders((s) => s.todayRevenue());
  const pendingCount = useMemo(() => orders.filter((o) => o.status === 'pending').length, [orders]);

  const [filter, setFilter] = useState<FilterMode>('pending');
  const [search, setSearch] = useState('');
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');
  const prevOrderCount = useRef(orders.length);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Request browser notification permission once on mount.
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    setNotifPermission(Notification.permission);
    if (Notification.permission === 'default') {
      Notification.requestPermission().then((p) => setNotifPermission(p));
    }
  }, []);

  // Clear unseen flag when the user opens the board.
  useEffect(() => {
    if (unseen > 0) clearUnseen();
  }, [unseen, clearUnseen]);

  // Watch the orders list — if it grows, fire notification + chime.
  useEffect(() => {
    if (orders.length > prevOrderCount.current) {
      const newest = orders[0];
      // chime
      audioRef.current?.play().catch(() => {});
      // browser notification
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(
            locale === 'ar' ? `طلب جديد · #${newest.orderNumber}` : `הזמנה חדשה · #${newest.orderNumber}`,
            {
              body: `${newest.customerName} · ₪${newest.total.toFixed(0)}`,
              tag: `order-${newest.id}`,
            }
          );
        } catch {}
      }
    }
    prevOrderCount.current = orders.length;
  }, [orders, locale]);

  // Apply filter + search
  const filtered = useMemo(() => {
    let list = [...orders];
    if (filter !== 'all') {
      list = list.filter((o) => o.status === filter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.toLowerCase().includes(q) ||
          String(o.orderNumber).includes(q)
      );
    }
    return list.sort((a, b) => {
      // Pending always at top by createdAt desc; sent at bottom by sentAt desc.
      if (a.status === b.status) {
        if (a.status === 'pending') return b.createdAt - a.createdAt;
        return (b.sentAt ?? b.createdAt) - (a.sentAt ?? a.createdAt);
      }
      return a.status === 'pending' ? -1 : 1;
    });
  }, [orders, filter, search]);

  return (
    <div className="space-y-8">
      {/* Hidden audio element — chime for new orders */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRlIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YS4AAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIA="
        preload="auto"
        aria-hidden
      />

      {/* Summary tiles */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryTile
          label={locale === 'ar' ? 'طلبات اليوم' : 'הזמנות היום'}
          value={String(todayCount)}
          accent="cedar"
          displayFont={displayFont}
        />
        <SummaryTile
          label={locale === 'ar' ? 'إيرادات اليوم' : 'הכנסות היום'}
          value={`₪${todayRevenue.toFixed(0)}`}
          accent="burgundy"
          displayFont={displayFont}
        />
        <SummaryTile
          label={locale === 'ar' ? 'بانتظار التحضير' : 'מחכות להכנה'}
          value={String(pendingCount)}
          accent="gold"
          displayFont={displayFont}
          highlight={pendingCount > 0}
        />
        <SummaryTile
          label={locale === 'ar' ? 'إجمالي الطلبات' : 'סה"כ הזמנות'}
          value={String(orders.length)}
          accent="ink"
          displayFont={displayFont}
        />
      </section>

      {/* Toolbar */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="inline-flex border border-gold-deep/40 rounded-[2px] overflow-hidden bg-cream-card">
          <FilterTab label={locale === 'ar' ? 'بانتظار' : 'ממתינות'} active={filter === 'pending'} count={pendingCount} onClick={() => setFilter('pending')} />
          <FilterTab label={locale === 'ar' ? 'مُرسلة' : 'נשלחו'} active={filter === 'sent'} count={orders.filter((o) => o.status === 'sent').length} onClick={() => setFilter('sent')} />
          <FilterTab label={locale === 'ar' ? 'الكل' : 'הכל'} active={filter === 'all'} count={orders.length} onClick={() => setFilter('all')} />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={locale === 'ar' ? 'بحث: اسم، رقم، هاتف' : 'חיפוש: שם, מספר, טלפון'}
            className="h-11 px-4 bg-cream-card border border-gold-deep/40 text-cedar text-sm focus:outline-none focus:border-gold transition-colors duration-300 rounded-[2px] w-full md:w-72"
          />
          <button
            type="button"
            onClick={() => simulateNewOrder()}
            title={locale === 'ar' ? 'محاكاة طلب جديد (للعرض)' : 'סימולציית הזמנה חדשה (לבדיקה)'}
            className="h-11 px-4 bg-cedar text-ivory font-display-en text-[11px] tracking-eyebrow uppercase rounded-[2px] hover:bg-cedar-light transition-colors duration-500 whitespace-nowrap"
          >
            {locale === 'ar' ? '+ هاتف وهمي' : '+ דמיון הזמנה'}
          </button>
        </div>
      </section>

      {/* Notification permission nudge */}
      {notifPermission === 'denied' && (
        <p className="text-[12px] text-coffee-muted bg-sand/60 border border-gold-deep/30 px-4 py-2 rounded-[2px]">
          {locale === 'ar'
            ? 'إشعارات المتصفح معطلة. لتلقي تنبيه عند وصول طلب جديد، فعّلها من إعدادات المتصفح.'
            : 'הודעות דפדפן כבויות. כדי לקבל התראה כשתגיע הזמנה חדשה, אפשרי אותן בהגדרות הדפדפן.'}
        </p>
      )}

      {/* Orders list */}
      <section className="space-y-5">
        {filtered.length === 0 ? (
          <div className="bg-cream-card border border-gold-deep/30 rounded-[2px] py-16 text-center">
            <p className={`${displayFont} text-xl text-cedar`}>
              {locale === 'ar' ? 'لا توجد طلبات في هذا الفلتر' : 'אין הזמנות במצב זה'}
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                locale={locale}
                onMarkSent={() => markSent(order.id)}
                onMarkPending={() => markPending(order.id)}
              />
            ))}
          </AnimatePresence>
        )}
      </section>
    </div>
  );
}

/* ─── Summary tile ────────────────────────────────────────────────── */

function SummaryTile({
  label,
  value,
  accent,
  displayFont,
  highlight = false,
}: {
  label: string;
  value: string;
  accent: 'cedar' | 'burgundy' | 'gold' | 'ink';
  displayFont: string;
  highlight?: boolean;
}) {
  const accentClass =
    accent === 'cedar'
      ? 'text-cedar'
      : accent === 'burgundy'
        ? 'text-burgundy'
        : accent === 'gold'
          ? 'text-gold-deep'
          : 'text-ink';

  return (
    <motion.div
      animate={highlight ? { boxShadow: ['0 0 0 0 rgba(201,166,107,0.0)', '0 0 0 6px rgba(201,166,107,0.15)', '0 0 0 0 rgba(201,166,107,0.0)'] } : {}}
      transition={{ duration: 2.4, repeat: highlight ? Infinity : 0, ease: 'easeInOut' }}
      className="bg-cream-card border border-gold-deep/40 rounded-[2px] p-5 md:p-6"
    >
      <p className="font-display-en text-[10px] tracking-eyebrow uppercase text-coffee-muted">
        {label}
      </p>
      <p className={`mt-2 ${displayFont} font-black text-3xl md:text-4xl ${accentClass} tabular-nums`}>
        {value}
      </p>
    </motion.div>
  );
}

/* ─── Filter tab ──────────────────────────────────────────────────── */

function FilterTab({ label, active, count, onClick }: { label: string; active: boolean; count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 md:px-5 h-11 inline-flex items-center gap-2 font-display-en text-[11px] tracking-eyebrow uppercase transition-colors duration-500 ${active ? 'bg-cedar text-ivory' : 'text-coffee-muted hover:text-cedar'}`}
    >
      <span>{label}</span>
      <span className={`tabular-nums ${active ? 'text-gold-light' : 'text-gold-deep/60'}`}>
        {count}
      </span>
    </button>
  );
}

/* ─── Order Card ─────────────────────────────────────────────────── */

function OrderCard({
  order,
  locale,
  onMarkSent,
  onMarkPending,
}: {
  order: Order;
  locale: Locale;
  onMarkSent: () => void;
  onMarkPending: () => void;
}) {
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';
  const isSent = order.status === 'sent';

  const statusLabel = isSent
    ? locale === 'ar' ? 'تم الإرسال ✓' : 'נשלחה ✓'
    : locale === 'ar' ? 'لم تُرسل بعد' : 'עדיין לא נשלחה';

  const ago = relativeTime(order.createdAt, locale);
  const deliveryDateLabel = formatDeliveryDate(order.deliveryDate, locale);
  const whatsappUrl = `https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '').replace(/^0/, '972')}`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.6, ease: easeLuxe }}
      className={`relative bg-cream-card border-2 ${isSent ? 'border-pistachio/40' : 'border-burgundy/30'} rounded-[2px] overflow-hidden shadow-card`}
    >
      {/* Status banner — green if sent, red if pending */}
      <div
        className={`px-6 md:px-8 py-3 flex items-center justify-between gap-4 ${isSent ? 'bg-pistachio/15 text-pistachio' : 'bg-burgundy/10 text-burgundy'}`}
      >
        <div className="flex items-center gap-3">
          <span aria-hidden className={`block w-2.5 h-2.5 rounded-full ${isSent ? 'bg-pistachio' : 'bg-burgundy animate-pulse'}`} />
          <span className="font-display-en text-[12px] tracking-eyebrow uppercase font-medium">
            {statusLabel}
          </span>
        </div>
        <span className="font-display-en text-[11px] tracking-eyebrow uppercase opacity-80">
          {ago}
        </span>
      </div>

      <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6 md:gap-8">
        {/* Customer + order number */}
        <div className="md:col-span-1">
          <p className="font-display-en text-[10px] tracking-eyebrow uppercase text-coffee-muted">
            {locale === 'ar' ? 'رقم الطلب' : 'מספר הזמנה'}
          </p>
          <p className={`${displayFont} font-black text-3xl text-cedar tabular-nums mt-1`}>
            #{order.orderNumber}
          </p>
          <p className={`mt-5 ${displayFont} font-black text-xl text-cedar leading-tight`}>
            {order.customerName}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <a
              href={`tel:${order.customerPhone}`}
              className="font-display-en text-[12px] text-ink/75 hover:text-burgundy transition-colors"
            >
              {order.customerPhone}
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-pistachio hover:opacity-75 transition-opacity"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.43 1.27 4.86L2 22l5.27-1.38c1.38.75 2.95 1.18 4.77 1.18 5.52 0 10-4.48 10-10s-4.48-9.8-10-9.8zM16.5 14.81c-.21-.1-1.23-.61-1.42-.68-.19-.07-.33-.1-.47.1-.14.2-.54.68-.66.82-.12.14-.24.16-.45.06-.21-.1-.88-.32-1.68-1.03-.62-.55-1.04-1.24-1.16-1.45-.12-.21-.01-.32.09-.42.09-.09.21-.24.32-.36.1-.12.14-.2.21-.34.07-.14.04-.26-.02-.36-.05-.1-.47-1.14-.65-1.55-.17-.41-.34-.36-.47-.36-.12 0-.26-.02-.4-.02s-.36.05-.55.26c-.19.21-.72.7-.72 1.71 0 1 .74 1.97.84 2.11.1.14 1.45 2.22 3.51 3.11.49.21.87.34 1.17.43.49.16.94.13 1.29.08.39-.06 1.23-.5 1.4-.99.17-.49.17-.91.12-.99-.05-.08-.19-.13-.4-.23z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Items */}
        <div className="md:col-span-1">
          <p className="font-display-en text-[10px] tracking-eyebrow uppercase text-coffee-muted">
            {locale === 'ar' ? 'الطلبية' : 'מה הוזמן'}
          </p>
          <ul className="mt-3 space-y-2">
            {order.items.map((item, idx) => (
              <li key={idx} className="flex items-baseline justify-between gap-3 text-sm">
                <span className={`${displayFont} text-cedar`}>
                  {item.productName}
                  <span className="ms-2 text-coffee-muted">×{item.quantity} {item.unitLabel}</span>
                </span>
                <span className="font-display-en text-ink/65 text-[13px] tabular-nums shrink-0">
                  ₪{item.lineTotal.toFixed(0)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-hairline/50 flex items-baseline justify-between">
            <span className="font-display-en text-[10px] tracking-eyebrow uppercase text-coffee-muted">
              {locale === 'ar' ? 'المجموع' : 'סה"כ'}
            </span>
            <span className={`${displayFont} font-black text-2xl text-burgundy tabular-nums`}>
              ₪{order.total.toFixed(0)}
            </span>
          </div>
          {order.paymentMethod && (
            <p className="mt-2 font-display-en text-[10px] tracking-eyebrow uppercase text-coffee-muted">
              {order.paymentMethod === 'card'
                ? (locale === 'ar' ? 'مدفوع ببطاقة' : 'שולם בכרטיס')
                : (locale === 'ar' ? 'دفع عند الاستلام' : 'מזומן במשלוח')}
            </p>
          )}
        </div>

        {/* Delivery */}
        <div className="md:col-span-1">
          <p className="font-display-en text-[10px] tracking-eyebrow uppercase text-coffee-muted">
            {locale === 'ar' ? 'التوصيل' : 'משלוח'}
          </p>
          <p className={`mt-3 ${displayFont} text-cedar font-medium leading-snug`}>
            {order.deliveryAddress}
          </p>
          <p className="mt-3 font-display-en text-[12px] tracking-eyebrow uppercase text-ink/70">
            {deliveryDateLabel}
          </p>
          <p className="font-display-en text-[12px] tracking-eyebrow uppercase text-ink/70">
            {order.deliveryWindow}
          </p>

          {order.customerNotes && (
            <div className="mt-4 bg-sand/50 border-s-2 border-gold p-3 text-sm text-ink/85 leading-snug">
              <p className="font-display-en text-[10px] tracking-eyebrow uppercase text-coffee-muted mb-1">
                {locale === 'ar' ? 'ملاحظات الزبون' : 'הערות הלקוח'}
              </p>
              {order.customerNotes}
            </div>
          )}
        </div>
      </div>

      {/* Footer action */}
      <div className="px-6 md:px-8 pb-6 md:pb-8">
        {!isSent ? (
          <button
            type="button"
            onClick={onMarkSent}
            className="w-full h-14 bg-pistachio hover:bg-pistachio/85 text-cedar font-display-en text-sm tracking-eyebrow uppercase rounded-[2px] transition-colors duration-500 flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M 4 12 L 10 18 L 20 6" />
            </svg>
            {locale === 'ar' ? 'مُكتمل · إرسال' : 'מוכן · נשלח'}
          </button>
        ) : (
          <button
            type="button"
            onClick={onMarkPending}
            className="font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted hover:text-burgundy transition-colors duration-500"
          >
            {locale === 'ar' ? 'إعادة إلى قائمة الانتظار' : 'החזר לרשימת ההמתנה'}
          </button>
        )}
      </div>
    </motion.article>
  );
}

/* ─── helpers ────────────────────────────────────────────────────── */

function relativeTime(ts: number, locale: Locale): string {
  const diff = Math.max(0, Date.now() - ts);
  const min = Math.floor(diff / 60000);
  if (min < 1) return locale === 'ar' ? 'الآن' : 'הרגע';
  if (min < 60) return locale === 'ar' ? `قبل ${min} د` : `לפני ${min} דק'`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return locale === 'ar' ? `قبل ${hr} س` : `לפני ${hr} שע'`;
  const days = Math.floor(hr / 24);
  return locale === 'ar' ? `قبل ${days} أيام` : `לפני ${days} ימים`;
}

function formatDeliveryDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  if (date.getTime() === today.getTime()) return locale === 'ar' ? 'اليوم' : 'היום';
  if (date.getTime() === tomorrow.getTime()) return locale === 'ar' ? 'غداً' : 'מחר';
  return date.toLocaleDateString(locale === 'ar' ? 'ar' : 'he', { day: 'numeric', month: 'long' });
}
