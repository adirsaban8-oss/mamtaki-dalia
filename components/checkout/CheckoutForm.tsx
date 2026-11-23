'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { useCart, getProductForItem } from '@/store/cart';
import { CHECKOUT_MUTATION } from '@/lib/graphql/mutations';
import { isWordPressMode } from '@/lib/graphql/client';
import { buttonClasses } from '@/components/ui/Button';
import { ArabesquePattern } from '@/components/ornaments/ArabesquePattern';
import { SHIPPING, PICKUP_ADDRESS, shippingFor, type Fulfilment } from '@/lib/ordering';
import { ONLINE_PAYMENT, startPayment } from '@/lib/payments';
import { lineTotal } from '@/store/cart';
import { useOrders } from '@/store/orders';
import { weightLabel } from '@/lib/weight';
import { AddressSearch, type PickedAddress } from './AddressSearch';
import { CustomerGate, customerReady, type SiteCustomer } from './CustomerGate';
import { addressLine, addressLineEn, looksComplete, type DeliveryAddress } from '@/lib/address';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

type PaymentMethod = 'cod' | 'bacs' | 'meshulam' | 'apple_pay' | 'bit';

/**
 * The WooCommerce checkout can only take products that came from WooCommerce
 * (ids like wp_16). The site sells from its own catalog (seed_...), so those
 * orders go through the site's own path even when a WordPress endpoint is set.
 */
const wooCart = (items: { productId: string }[]) => isWordPressMode() && items.length > 0 && items.every((i) => /^wp_d+$/.test(i.productId));

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  street: string;
  houseNumber: string;
  apartment: string;
  floor: string;
  entrance: string;
  postcode: string;
  deliveryDate: string;
  deliveryWindow: 'morning' | 'noon' | 'evening';
  notes: string;
  paymentMethod: PaymentMethod;
};

const INITIAL: FormState = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  city: '',
  street: '',
  houseNumber: '',
  apartment: '',
  floor: '',
  entrance: '',
  postcode: '',
  deliveryDate: '',
  deliveryWindow: 'noon',
  notes: '',
  paymentMethod: 'meshulam',
};

type Props = { locale: Locale };

/**
 * Custom luxury checkout form. Posts a CHECKOUT_MUTATION to WPGraphQL
 * which creates the order in WooCommerce. The owner sees it in
 * wp-admin → WooCommerce → Orders.
 *
 * Payment methods:
 *   - cod (Cash on Delivery) → order status "processing", owner takes
 *     payment at delivery
 *   - bacs (Bank Transfer) → owner emails account details
 *   - meshulam → returns a redirect URL to Meshulam's hosted page
 *     (Phase 2, needs Meshulam plugin installed in WP)
 */
export function CheckoutForm({ locale }: Props) {
  const t = useTranslations('Checkout');
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';
  const router = useRouter();

  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const close = useCart((s) => s.close);

  const [form, setForm] = useState<FormState>(() => ({ ...INITIAL, paymentMethod: ONLINE_PAYMENT ? 'meshulam' : 'cod' }));
  /** Online payment exists only through WooCommerce or a connected provider. */
  const payOnline = () => wooCart(items) || ONLINE_PAYMENT;
  const [fulfilment, setFulfilment] = useState<Fulfilment>('delivery');
  const addOrder = useOrders((s) => s.addOrder);
  const pickup = fulfilment === 'pickup';
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Accounts: on when the site has its database and SMS. Then a customer signs in before ordering.
  const [acct, setAcct] = useState<{ accounts: boolean; customer: SiteCustomer | null } | null>(null);
  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j: { accounts: boolean; customer: SiteCustomer | null }) => setAcct(j))
      .catch(() => setAcct({ accounts: false, customer: null }));
  }, []);
  const accounts = !!acct?.accounts;
  const customer = acct?.customer && customerReady(acct.customer) ? acct.customer : null;
  const needGate = accounts && !customer;
  const signOut = async () => {
    await fetch('/api/auth/me', { method: 'DELETE' }).catch(() => {});
    setAcct({ accounts: true, customer: null });
  };
  // Set when the address came from Google: its place ID and the English version.
  const [picked, setPicked] = useState<PickedAddress | null>(null);
  const [confirmIncomplete, setConfirmIncomplete] = useState(false);

  const [runCheckout] = useMutation(CHECKOUT_MUTATION);

  // The cart is restored from storage after mount; do it here too, so a
  // visitor who opens /checkout directly still sees their items.
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);

  // Default delivery date = +2 days from today
  useEffect(() => {
    if (!form.deliveryDate) {
      const d = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      setForm((f) => ({ ...f, deliveryDate: d.toISOString().slice(0, 10) }));
    }
  }, [form.deliveryDate]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const lang = locale === 'ar' ? 'ar' : 'he';
  const onPick = (a: PickedAddress) => {
    setPicked(a);
    setConfirmIncomplete(false);
    setForm((f) => ({
      ...f,
      street: a.local.street || a.en.street || f.street,
      houseNumber: a.local.houseNumber || a.en.houseNumber || '',
      city: a.local.city || a.en.city || f.city,
      postcode: a.local.postalCode || a.en.postalCode || '',
    }));
  };
  // Typing over a picked street or city makes it a manual address again;
  // adding a missing house number or postcode keeps Google's match.
  const editAddress = (key: 'street' | 'houseNumber' | 'city' | 'postcode', value: string) => {
    if (picked) {
      if (key === 'street' || key === 'city') setPicked(null);
      else setPicked({ ...picked, en: { ...picked.en, [key === 'houseNumber' ? 'houseNumber' : 'postalCode']: value.trim() } });
    }
    update(key, value);
  };

  const delivery: DeliveryAddress | null = pickup
    ? null
    : {
        local: { street: form.street.trim(), houseNumber: form.houseNumber.trim(), city: form.city.trim(), postalCode: form.postcode.trim(), country: lang === 'ar' ? 'إسرائيل' : 'ישראל', full: '' },
        en: picked?.en,
        placeId: picked?.placeId,
        apartment: form.apartment.trim() || undefined,
        floor: form.floor.trim() || undefined,
        entrance: form.entrance.trim() || undefined,
        via: picked ? 'google' : 'manual',
        confirmedIncomplete: confirmIncomplete || undefined,
      };
  if (delivery) delivery.local.full = addressLine(delivery, lang);
  const incomplete = !!delivery && !looksComplete(delivery.local);

  const shipping = useMemo(() => shippingFor(subtotal, fulfilment), [subtotal, fulfilment]);
  const total = subtotal + shipping;

  // Detail rows for the summary sidebar
  const lineRows = items.map((item) => {
    const product = getProductForItem(item);
    return {
      id: item.productId,
      name: product?.name[locale] ?? '',
      qty: item.quantity,
      unit: product?.unit ?? 'per_kg',
      lineTotal: product ? lineTotal(product, item.quantity) : 0,
      qtyLabel: product?.unit === 'per_kg' ? weightLabel(Math.round(item.quantity * 1000), locale) : `×${item.quantity}`,
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (items.length === 0) {
      setErrorMsg(t('errEmptyCart'));
      return;
    }
    if (incomplete && !confirmIncomplete) {
      setErrorMsg(locale === 'ar' ? 'العنوان يبدو ناقصًا (الشارع، رقم البيت، المدينة). أكملوه أو أكّدوا أنه صحيح.' : 'הכתובת נראית חסרה (רחוב, מספר בית, עיר). השלימו אותה או אשרו שהיא נכונה.');
      return;
    }

    setSubmitting(true);
    try {
      if (accounts) {
        // The server prices the order from the catalog, saves it and tells the shop.
        const r = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lines: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
            fulfilment,
            address: pickup || !delivery ? '' : delivery.local.full,
            addressEn: delivery?.en ? addressLineEn(delivery) : undefined,
            date: form.deliveryDate,
            window: { morning: t('windowMorning'), noon: t('windowNoon'), evening: t('windowEvening') }[form.deliveryWindow],
            notes: form.notes || undefined,
          }),
        });
        const j = (await r.json().catch(() => null)) as { ref?: string; message?: string; error?: string } | null;
        if (r.status === 401) {
          setAcct({ accounts: true, customer: null });
          return;
        }
        if (!r.ok || !j?.ref) {
          setErrorMsg(j?.message || t('errSubmitFailed'));
          return;
        }
        useCart.getState().clear();
        close();
        sessionStorage.setItem('lastOrderNumber', j.ref.replace('#', ''));
        sessionStorage.setItem('lastOrderSent', '1');
        sessionStorage.removeItem('lastOrderText');
        router.push('/checkout/success');
        return;
      }
      if (wooCart(items)) {
        // Real WPGraphQL checkout, send to WordPress
        const lineItems = items.map((item) => ({
          productId: Number(item.productId.replace(/^wp_/, '')),
          quantity: Math.max(1, Math.round(item.quantity)),
        }));

        const billing = {
          firstName: form.firstName,
          lastName: form.lastName,
          address1: [form.street, form.houseNumber].filter(Boolean).join(' '),
          address2: delivery ? [delivery.apartment && `דירה ${delivery.apartment}`, delivery.floor && `קומה ${delivery.floor}`, delivery.entrance && `כניסה ${delivery.entrance}`].filter(Boolean).join(', ') : '',
          city: form.city,
          postcode: form.postcode,
          country: 'IL',
          email: form.email,
          phone: form.phone,
        };

        const result = await runCheckout({
          variables: {
            input: {
              clientMutationId: `co_${Date.now()}`,
              paymentMethod: form.paymentMethod,
              shipToDifferentAddress: false,
              billing,
              shipping: billing,
              customerNote: buildCustomerNote(form, locale, delivery),
              lineItems,
              // Kept on the WooCommerce order for couriers / Zapier: English address and Google place ID.
              metaData: delivery
                ? [
                    { key: '_address_via', value: delivery.via },
                    ...(delivery.placeId ? [{ key: '_google_place_id', value: delivery.placeId }] : []),
                    ...(delivery.en
                      ? [
                          { key: '_address_en_street', value: delivery.en.street },
                          { key: '_address_en_house_number', value: delivery.en.houseNumber },
                          { key: '_address_en_city', value: delivery.en.city },
                          { key: '_address_en_postal_code', value: delivery.en.postalCode },
                          { key: '_address_en_country', value: delivery.en.country },
                          { key: '_address_en_full', value: addressLineEn(delivery) },
                        ]
                      : []),
                    { key: '_address_local_full', value: delivery.local.full },
                    ...(delivery.confirmedIncomplete ? [{ key: '_address_confirmed_incomplete', value: 'yes' }] : []),
                  ]
                : [],
            },
          },
        });

        const data = result.data as
          | { checkout?: { redirect?: string | null; order?: { orderNumber?: string; databaseId?: number } } }
          | null
          | undefined;
        const redirect = data?.checkout?.redirect;
        const orderNumber = data?.checkout?.order?.orderNumber ?? data?.checkout?.order?.databaseId;

        if (redirect && form.paymentMethod === 'meshulam') {
          // Hand off to Meshulam's hosted payment page
          window.location.href = redirect;
          return;
        }

        // For COD / bank transfer: go straight to success
        close();
        sessionStorage.setItem('lastOrderNumber', String(orderNumber ?? ''));
        router.push('/checkout/success');
      } else {
        // Site ordering without WordPress: record the order for the admin
        // board, then hand off to a payment provider when one is connected.
        const ar = locale === 'ar';
        const windowLabel = { morning: t('windowMorning'), noon: t('windowNoon'), evening: t('windowEvening') }[form.deliveryWindow];
        const order = addOrder({
          customerName: `${form.firstName} ${form.lastName}`.trim(),
          customerPhone: form.phone,
          items: lineRows.map((r) => ({ productName: r.name, quantity: r.qty, unitLabel: r.unit === 'per_kg' ? (ar ? 'كغ' : 'ק"ג') : ar ? 'وحدة' : 'יח׳', lineTotal: r.lineTotal })),
          deliveryAddress: pickup || !delivery ? `${ar ? 'استلام ذاتي' : 'איסוף עצמי'} · ${PICKUP_ADDRESS[locale]}` : delivery.local.full,
          address: delivery ?? undefined,
          deliveryDate: form.deliveryDate,
          deliveryWindow: windowLabel,
          customerNotes: form.notes || undefined,
          total,
          paymentMethod: payOnline() ? 'card' : 'cash',
        });
        const payUrl = await startPayment({
          orderNumber: String(order.orderNumber),
          amount: total,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerEmail: form.email || undefined,
          description: lineRows.map((r) => r.name).join(', '),
        });
        if (payUrl) { window.location.href = payUrl; return; }
        // Tell the shop. The server sends an SMS; if that is off or fails, the
        // success page asks the customer to send the same text by WhatsApp.
        const payload = {
          name: order.customerName,
          phone: order.customerPhone,
          items: lineRows.map((r) => ({ name: r.name, qty: r.qtyLabel, total: r.lineTotal })),
          fulfilment,
          address: pickup || !delivery ? '' : delivery.local.full,
          addressEn: delivery?.en ? addressLineEn(delivery) : undefined,
          date: form.deliveryDate,
          window: windowLabel,
          notes: form.notes || undefined,
          shipping,
          total,
          payment: ar ? 'الدفع عند الاستلام' : 'תשלום בקבלת ההזמנה',
        };
        let told: { ref?: string; text?: string; sent?: boolean } = {};
        try {
          const r = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          if (r.ok) told = await r.json();
        } catch {
          /* handled below: not sent */
        }
        const fallbackText = [`הזמנה מהאתר: ${payload.name}, ${payload.phone}`, ...payload.items.map((i) => `• ${i.name}, ${i.qty}, ₪${i.total}`), pickup ? 'איסוף עצמי' : `משלוח: ${payload.address}`, `מועד: ${payload.date} ${payload.window}`, `סה״כ ₪${total}`].join('\n');
        useCart.getState().clear();
        close();
        sessionStorage.setItem('lastOrderNumber', told.ref ? told.ref.replace('#', '') : String(order.orderNumber));
        sessionStorage.setItem('lastOrderSent', told.sent ? '1' : '0');
        sessionStorage.setItem('lastOrderText', told.text ?? fallbackText);
        router.push('/checkout/success');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(`${t('errSubmitFailed')} (${msg})`);
    } finally {
      setSubmitting(false);
    }
  };

  // Min delivery date = today + 2 days
  const minDeliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  return (
    <section className="relative overflow-x-clip pb-20 md:pb-[120px]">
      <div
        aria-hidden
        className="absolute -top-12 -end-24 w-[500px] h-[500px] text-gold pointer-events-none"
      >
        <ArabesquePattern opacity={0.04} className="absolute inset-0" />
      </div>

      {/* Page header */}
      <header className="relative mx-auto max-w-5xl px-5 md:px-10 pt-12 md:pt-16 pb-10 md:pb-12 text-center">
        <div className="flex items-center justify-center gap-5 text-gold-deep">
          <span aria-hidden className="block h-px w-12 bg-gold" />
          <span className="font-display-en text-[12px] tracking-eyebrow uppercase">
            {t('eyebrow')}
          </span>
          <span aria-hidden className="block h-px w-12 bg-gold" />
        </div>
        <h1
          className={`mt-6 ${displayFont} font-black text-[2.5rem] md:text-5xl lg:text-6xl text-heading tracking-display leading-[1.05]`}
        >
          {t('title')}
        </h1>
      </header>

      {needGate && <CustomerGate ar={locale === 'ar'} customer={acct?.customer ?? null} onReady={(c) => setAcct({ accounts: true, customer: c })} />}

      {/* Form + summary grid */}
      <form
        onSubmit={handleSubmit}
        className={needGate || acct === null ? 'hidden' : 'relative mx-auto max-w-7xl px-5 md:px-10 grid lg:grid-cols-[1fr_360px] gap-10 lg:gap-14'}
      >
        {/* LEFT, form fields */}
        <div className="space-y-10">
          {customer ? (
          <Section title={t('customerInfo')} displayFont={displayFont}>
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-[10px] border border-gold/40 bg-gold/5">
              <p className="text-lg text-heading">
                <span className="font-bold">{customer.firstName} {customer.lastName}</span>
                <bdi dir="ltr" className="ms-3 text-coffee-muted">{customer.phone}</bdi>
              </p>
              <button type="button" onClick={signOut} className="text-base underline text-gold">
                {locale === 'ar' ? 'لست أنا، خروج' : 'זה לא אני, יציאה'}
              </button>
            </div>
          </Section>
          ) : (
          <Section title={t('customerInfo')} displayFont={displayFont}>
            <Row>
              <Field label={t('firstName')} required>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label={t('lastName')} required>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  className={inputClass}
                />
              </Field>
            </Row>
            <Row>
              <Field label={t('phone')} required>
                <input
                  type="tel"
                  required
                  placeholder="052-1234567"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label={t('email')} required>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className={inputClass}
                />
              </Field>
            </Row>
          </Section>
          )}

          <Section title={locale === 'ar' ? 'التوصيل أو الاستلام' : 'משלוח או איסוף'} displayFont={displayFont}>
            <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label={locale === 'ar' ? 'طريقة الاستلام' : 'אופן קבלת ההזמנה'}>
              {(['delivery', 'pickup'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={fulfilment === opt}
                  onClick={() => setFulfilment(opt)}
                  className={`text-start p-4 rounded-[10px] border transition-colors ${fulfilment === opt ? 'border-gold bg-gold/10' : 'border-hairline hover:border-gold-deep'}`}
                >
                  <span className="block font-semibold text-heading">
                    {opt === 'delivery' ? (locale === 'ar' ? 'توصيل إلى البيت' : 'משלוח עד הבית') : locale === 'ar' ? 'استلام من المحل' : 'איסוף עצמי מהחנות'}
                  </span>
                  <span className="block mt-1 text-sm text-coffee-muted">
                    {opt === 'delivery'
                      ? locale === 'ar' ? `₪${SHIPPING.fee}، مجاناً من ₪${SHIPPING.freeFrom}` : `₪${SHIPPING.fee}, חינם מ־₪${SHIPPING.freeFrom}`
                      : `${locale === 'ar' ? 'مجاناً' : 'חינם'} · ${PICKUP_ADDRESS[locale]}`}
                  </span>
                </button>
              ))}
            </div>
          </Section>

          {!pickup && (
            <Section title={t('deliveryAddress')} displayFont={displayFont}>
              <AddressSearch lang={lang} inputClass={inputClass} onPick={onPick} />
              <Row>
                <Field label={locale === 'ar' ? 'الشارع' : 'רחוב'} required>
                  <input type="text" required={!pickup} autoComplete="address-line1" value={form.street} onChange={(e) => editAddress('street', e.target.value)} className={inputClass} />
                </Field>
                <Field label={locale === 'ar' ? 'رقم البيت' : 'מספר בית'} required>
                  <input type="text" inputMode="numeric" required={!pickup && !confirmIncomplete} value={form.houseNumber} onChange={(e) => editAddress('houseNumber', e.target.value)} className={inputClass} />
                </Field>
              </Row>
              <Row>
                <Field label={t('city')} required>
                  <input type="text" required={!pickup} autoComplete="address-level2" value={form.city} onChange={(e) => editAddress('city', e.target.value)} className={inputClass} />
                </Field>
                <Field label={t('postcode')}>
                  <input type="text" inputMode="numeric" autoComplete="postal-code" value={form.postcode} onChange={(e) => editAddress('postcode', e.target.value)} className={inputClass} />
                </Field>
              </Row>
              <div className="grid grid-cols-3 gap-4">
                <Field label={locale === 'ar' ? 'شقة' : 'דירה'}>
                  <input type="text" value={form.apartment} onChange={(e) => update('apartment', e.target.value)} className={inputClass} />
                </Field>
                <Field label={locale === 'ar' ? 'طابق' : 'קומה'}>
                  <input type="text" value={form.floor} onChange={(e) => update('floor', e.target.value)} className={inputClass} />
                </Field>
                <Field label={locale === 'ar' ? 'مدخل' : 'כניסה'}>
                  <input type="text" value={form.entrance} onChange={(e) => update('entrance', e.target.value)} className={inputClass} />
                </Field>
              </div>
              {incomplete && (form.street || form.city || form.houseNumber) && (
                <label className="flex items-start gap-3 text-[14px] text-heading">
                  <input type="checkbox" checked={confirmIncomplete} onChange={(e) => setConfirmIncomplete(e.target.checked)} className="mt-1 accent-[#E9B949]" />
                  <span>{locale === 'ar' ? 'العنوان بلا رقم بيت أو مدينة كامل، وأؤكد أنه صحيح.' : 'הכתובת בלי מספר בית או עיר מלאה, ואני מאשר/ת שהיא נכונה.'}</span>
                </label>
              )}
            </Section>
          )}

          <Section title={t('deliveryWindow')} displayFont={displayFont}>
            <Row>
              <Field label={t('deliveryDate')} required>
                <input
                  type="date"
                  required
                  min={minDeliveryDate}
                  value={form.deliveryDate}
                  onChange={(e) => update('deliveryDate', e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label={t('window')}>
                <select
                  value={form.deliveryWindow}
                  onChange={(e) => update('deliveryWindow', e.target.value as FormState['deliveryWindow'])}
                  className={inputClass}
                >
                  <option value="morning">{t('windowMorning')}</option>
                  <option value="noon">{t('windowNoon')}</option>
                  <option value="evening">{t('windowEvening')}</option>
                </select>
              </Field>
            </Row>
            <Field label={t('notes')}>
              <textarea
                rows={3}
                placeholder={t('notesPlaceholder')}
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                className={textareaClass}
              />
            </Field>
          </Section>

          <Section title={t('payment')} displayFont={displayFont}>
            {payOnline() ? (
              <div className="space-y-3">
                {/* Online payment methods, connect a processor account
                    (Meshulam / PayPlus / Tranzila …) to activate all three. */}
                <PaymentOption
                  checked={form.paymentMethod === 'meshulam'}
                  onChange={() => update('paymentMethod', 'meshulam')}
                  title={t('payCard')}
                  subtitle={t('payCardNote')}
                  icon={<CardIcon />}
                />
                <PaymentOption
                  checked={form.paymentMethod === 'apple_pay'}
                  onChange={() => update('paymentMethod', 'apple_pay')}
                  title={t('payApple')}
                  subtitle={t('payAppleNote')}
                  icon={<AppleIcon />}
                />
                <PaymentOption
                  checked={form.paymentMethod === 'bit'}
                  onChange={() => update('paymentMethod', 'bit')}
                  title={t('payBit')}
                  subtitle={t('payBitNote')}
                  icon={<BitIcon />}
                />
              </div>
            ) : (
              <PaymentOption
                checked
                onChange={() => update('paymentMethod', 'cod')}
                title={locale === 'ar' ? 'الدفع عند الاستلام' : 'תשלום בקבלת ההזמנה'}
                subtitle={locale === 'ar' ? 'نقداً أو ببطاقة، عند التوصيل أو الاستلام. الدفع عبر الموقع قريباً.' : 'במזומן או בכרטיס, במשלוח או באיסוף. תשלום באתר יתווסף בקרוב.'}
                icon={<CardIcon />}
              />
            )}
          </Section>
        </div>

        {/* RIGHT, order summary (sticky on desktop) */}
        <aside className="lg:sticky lg:top-28 self-start">
          <div className="bg-cream-card border border-gold-deep/40 rounded-[2px] p-6 md:p-8">
            <h2 className={`${displayFont} font-black text-xl md:text-2xl text-heading tracking-display mb-5`}>
              {t('orderSummary')}
            </h2>

            {items.length === 0 ? (
              <p className="text-sm text-coffee-muted">
                {t('emptyCart')}{' '}
                <Link href="/shop" className="text-burgundy underline underline-offset-4">
                  {t('backToShop')}
                </Link>
              </p>
            ) : (
              <>
                <ul className="divide-y divide-hairline">
                  {lineRows.map((row) => (
                    <li key={row.id} className="py-3 flex items-baseline justify-between gap-3 text-sm">
                      <span className="text-heading leading-tight">
                        {row.name}
                        <span className="ms-2 text-coffee-muted">{row.qtyLabel}</span>
                      </span>
                      <span className="font-display-en text-ink/85 tabular-nums shrink-0">
                        ₪{row.lineTotal.toFixed(0)}
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="mt-5 pt-4 border-t border-hairline space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-coffee-muted">{t('subtotal')}</dt>
                    <dd className="font-display-en text-ink/90 tabular-nums">₪{subtotal.toFixed(0)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-coffee-muted">{t('shipping')}</dt>
                    <dd className="font-display-en text-ink/90 tabular-nums">
                      {shipping === 0 ? t('freeShipping') : `₪${shipping}`}
                    </dd>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[11px] text-coffee-muted/80 italic">
                      {t('freeShippingNote', { remaining: SHIPPING.freeFrom - subtotal })}
                    </p>
                  )}
                  <div className="flex justify-between pt-3 border-t border-hairline mt-3 items-baseline">
                    <dt className={`${displayFont} text-lg text-heading`}>{t('total')}</dt>
                    <dd className={`${displayFont} font-black text-2xl text-burgundy tabular-nums`}>
                      ₪{total.toFixed(0)}
                    </dd>
                  </div>
                </dl>
              </>
            )}

            {errorMsg && (
              <p className="mt-4 text-sm text-burgundy bg-burgundy/10 border border-burgundy/30 px-3 py-2 rounded-[2px]">
                {errorMsg}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={submitting || items.length === 0}
              whileTap={{ scale: 0.98 }}
              className={buttonClasses({
                variant: 'primary',
                size: 'lg',
                className: 'w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed',
              })}
            >
              {submitting ? t('processing') : t('placeOrder')}
            </motion.button>

            <p className="mt-4 font-display-en text-[10px] tracking-eyebrow uppercase text-coffee-muted/80 text-center">
              {t('secureNote')}
            </p>
          </div>
        </aside>
      </form>
    </section>
  );
}

/* ── helpers ──────────────────────────────────────────────────────── */

function buildCustomerNote(form: FormState, locale: Locale, delivery: DeliveryAddress | null): string {
  const window =
    form.deliveryWindow === 'morning'
      ? locale === 'ar' ? 'صباحاً (08:00-11:00)' : 'בוקר (08:00-11:00)'
      : form.deliveryWindow === 'noon'
        ? locale === 'ar' ? 'ظهراً (12:00-15:00)' : 'צהריים (12:00-15:00)'
        : locale === 'ar' ? 'مساءً (16:00-19:00)' : 'ערב (16:00-19:00)';
  const label = locale === 'ar' ? 'موعد التوصيل' : 'מועד משלוח';
  let note = `${label}: ${form.deliveryDate} · ${window}`;
  if (delivery?.en) note += `\nAddress (EN): ${addressLineEn(delivery)}`;
  if (delivery?.confirmedIncomplete) note += locale === 'ar' ? '\nالزبون أكّد عنوانًا ناقصًا.' : '\nהלקוח אישר כתובת חסרה.';
  if (form.notes.trim()) note += `\n${form.notes.trim()}`;
  return note;
}

const inputClass =
  'w-full h-12 px-4 bg-cream-card border border-gold-deep/40 text-heading text-[15px] focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors duration-300 rounded-[2px]';
const textareaClass =
  'w-full px-4 py-3 bg-cream-card border border-gold-deep/40 text-heading text-[15px] focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors duration-300 rounded-[2px] leading-relaxed';

function Section({
  title,
  displayFont,
  children,
}: {
  title: string;
  displayFont: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2
        className={`${displayFont} font-black text-xl md:text-[22px] text-heading tracking-display mb-5 pb-3 border-b border-gold-deep/20`}
      >
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block mb-1.5 font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
        {label} {required && <span className="text-burgundy">*</span>}
      </span>
      {children}
    </label>
  );
}

function PaymentOption({
  checked,
  onChange,
  title,
  subtitle,
  badge,
  disabled,
  icon,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  subtitle: string;
  badge?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <label
      className={`flex items-start gap-4 p-4 border rounded-[2px] cursor-pointer transition-colors duration-300 ${disabled ? 'border-hairline opacity-50 cursor-not-allowed bg-sand/30' : checked ? 'border-gold bg-gold/5' : 'border-gold-deep/40 hover:border-gold/60'}`}
    >
      <input
        type="radio"
        name="payment"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="mt-1 accent-gold"
      />
      {icon && (
        <span className="shrink-0 w-10 h-10 inline-flex items-center justify-center border border-gold-deep/30 rounded-[2px] bg-cream-card text-heading">
          {icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-heading font-medium">{title}</span>
          {badge && (
            <span className="px-2 py-0.5 text-[10px] tracking-eyebrow uppercase font-display-en bg-sand text-coffee-muted rounded-[2px]">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[13px] text-coffee-muted mt-1">{subtitle}</p>
      </div>
    </label>
  );
}

/* ── Payment glyphs ───────────────────────────────────────────────── */

function CashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="6" width="20" height="12" rx="1" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M 5 9 L 5 9.5 M 19 14.5 L 19 15" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M 3 9 L 12 4 L 21 9 L 21 10 L 3 10 Z" />
      <path d="M 5 10 L 5 18 M 9 10 L 9 18 M 15 10 L 15 18 M 19 10 L 19 18" />
      <path d="M 3 19 L 21 19" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M 2 10 L 22 10" />
      <path d="M 5 15 L 9 15" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 12.04c-.03-2.65 2.16-3.92 2.26-3.98-1.23-1.8-3.15-2.05-3.83-2.08-1.63-.17-3.18.96-4.01.96-.84 0-2.11-.94-3.47-.91-1.78.03-3.42 1.04-4.34 2.62-1.85 3.21-.47 7.96 1.33 10.57.88 1.28 1.93 2.71 3.3 2.66 1.33-.05 1.83-.86 3.43-.86 1.6 0 2.05.86 3.45.83 1.43-.03 2.33-1.3 3.2-2.59 1.01-1.48 1.42-2.92 1.44-2.99-.03-.01-2.76-1.06-2.79-4.21M14.6 4.41c.74-.89 1.24-2.13 1.1-3.36-1.07.04-2.36.71-3.12 1.6-.68.79-1.27 2.05-1.11 3.26 1.19.09 2.4-.6 3.13-1.5" />
    </svg>
  );
}

function BitIcon() {
  // Stylized "Bit" mark, circular b inside a rounded square
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor" />
      <path
        d="M 9 7 L 9 17 M 9 8.5 a 2.5 2.5 0 0 1 0 5 L 9 13.5 M 9 12 a 2.5 2.5 0 0 1 0 5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="11.5" cy="11" r="1.5" stroke="white" strokeWidth="1.4" fill="none" />
      <circle cx="11.5" cy="15" r="1.5" stroke="white" strokeWidth="1.4" fill="none" />
    </svg>
  );
}
