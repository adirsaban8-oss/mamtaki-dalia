'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';

export type SiteCustomer = { phone: string; firstName: string; lastName: string; email: string; acceptedTerms: boolean; marketing: boolean };
export const customerReady = (c: SiteCustomer | null): boolean => !!c && c.acceptedTerms && c.firstName.length > 0;

const input = 'w-full h-14 px-4 bg-cream-card border border-gold-deep/50 text-heading text-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold rounded-[6px]';
const button = 'w-full h-14 rounded-full bg-gold-metal text-[#0A0806] text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed';

async function post<T>(url: string, body: unknown): Promise<{ ok: boolean; data: (T & { message?: string }) | null }> {
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return { ok: r.ok, data: await r.json().catch(() => null) };
  } catch {
    return { ok: false, data: null };
  }
}

/**
 * Signing in before an order, in three short steps: phone number, the code
 * from the text message, and (first time only) name, the terms, and the
 * customer's own choice about advertising messages.
 */
export function CustomerGate({ ar, customer, onReady }: { ar: boolean; customer: SiteCustomer | null; onReady: (c: SiteCustomer) => void }) {
  const [step, setStep] = useState<'phone' | 'code' | 'details'>(customer ? 'details' : 'phone');
  const [phone, setPhone] = useState(customer?.phone ?? '');
  const [code, setCode] = useState('');
  const [first, setFirst] = useState(customer?.firstName ?? '');
  const [last, setLast] = useState(customer?.lastName ?? '');
  const [email, setEmail] = useState(customer?.email ?? '');
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const offline = ar ? 'لا يوجد اتصال. حاولوا مرة أخرى.' : 'אין חיבור. נסו שוב.';

  const sendCode = async () => {
    setBusy(true);
    setError('');
    const r = await post('/api/auth/code', { phone });
    setBusy(false);
    if (r.ok) { setCode(''); setStep('code'); }
    else setError(r.data?.message || offline);
  };

  const verify = async () => {
    setBusy(true);
    setError('');
    const r = await post<{ customer: SiteCustomer }>('/api/auth/verify', { phone, code });
    setBusy(false);
    if (!r.ok || !r.data?.customer) return setError(r.data?.message || offline);
    const c = r.data.customer;
    if (customerReady(c)) return onReady(c);
    setFirst(c.firstName); setLast(c.lastName); setEmail(c.email);
    setStep('details');
  };

  const saveDetails = async () => {
    setBusy(true);
    setError('');
    const r = await post<{ customer: SiteCustomer }>('/api/auth/profile', { firstName: first, lastName: last, email, terms, marketing });
    setBusy(false);
    if (r.ok && r.data?.customer) onReady(r.data.customer);
    else setError(r.data?.message || offline);
  };

  const label = 'block mb-2 text-base font-semibold text-heading';
  return (
    <div className="relative mx-auto max-w-md px-5 pb-10">
      <div className="p-6 sm:p-8 rounded-[14px] border border-gold/45 bg-[#110C08]">
        {step === 'phone' && (
          <form onSubmit={(e) => { e.preventDefault(); sendCode(); }}>
            <h2 className="text-2xl font-bold text-heading">{ar ? 'تسجيل الدخول للطلب' : 'התחברות להזמנה'}</h2>
            <p className="mt-2 text-coffee-muted">{ar ? 'اكتبوا رقم الهاتف وسنرسل لكم رمزًا برسالة SMS.' : 'הקלידו את מספר הטלפון ונשלח לכם קוד ב-SMS.'}</p>
            <label className="block mt-6">
              <span className={label}>{ar ? 'رقم الهاتف المحمول' : 'מספר טלפון נייד'}</span>
              <input type="tel" inputMode="tel" autoComplete="tel" required autoFocus dir="ltr" placeholder="050-1234567" value={phone} onChange={(e) => setPhone(e.target.value)} className={input} />
            </label>
            <button type="submit" disabled={busy} className={`${button} mt-5`}>{busy ? (ar ? 'يُرسل…' : 'שולחים…') : ar ? 'أرسلوا لي الرمز' : 'שלחו לי קוד'}</button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={(e) => { e.preventDefault(); verify(); }}>
            <h2 className="text-2xl font-bold text-heading">{ar ? 'أدخلوا الرمز' : 'הקלידו את הקוד'}</h2>
            <p className="mt-2 text-coffee-muted">
              {ar ? 'أرسلنا رمزًا من 6 أرقام إلى ' : 'שלחנו קוד בן 6 ספרות למספר '}
              <bdi dir="ltr" className="font-semibold text-heading">{phone}</bdi>
            </p>
            <label className="block mt-6">
              <span className={label}>{ar ? 'الرمز من الرسالة' : 'הקוד מההודעה'}</span>
              <input type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required autoFocus dir="ltr" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} className={`${input} text-center text-3xl tracking-[0.4em] font-bold`} />
            </label>
            <button type="submit" disabled={busy || code.length !== 6} className={`${button} mt-5`}>{busy ? (ar ? 'يتحقق…' : 'בודקים…') : ar ? 'متابعة' : 'המשך'}</button>
            <div className="mt-4 flex justify-between text-base">
              <button type="button" onClick={() => { setStep('phone'); setError(''); }} className="underline text-gold">{ar ? 'تغيير الرقم' : 'החלפת מספר'}</button>
              <button type="button" onClick={sendCode} disabled={busy} className="underline text-gold">{ar ? 'أرسلوا رمزًا جديدًا' : 'שלחו קוד חדש'}</button>
            </div>
          </form>
        )}

        {step === 'details' && (
          <form onSubmit={(e) => { e.preventDefault(); saveDetails(); }}>
            <h2 className="text-2xl font-bold text-heading">{ar ? 'بعض التفاصيل' : 'כמה פרטים'}</h2>
            <p className="mt-2 text-coffee-muted">{ar ? 'مرة واحدة فقط. في المرة القادمة يكفي رقم الهاتف.' : 'פעם אחת בלבד. בפעם הבאה מספיק מספר הטלפון.'}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <label className="block">
                <span className={label}>{ar ? 'الاسم' : 'שם פרטי'}</span>
                <input type="text" autoComplete="given-name" required minLength={2} maxLength={40} autoFocus value={first} onChange={(e) => setFirst(e.target.value)} className={input} />
              </label>
              <label className="block">
                <span className={label}>{ar ? 'اسم العائلة' : 'שם משפחה'}</span>
                <input type="text" autoComplete="family-name" required minLength={2} maxLength={40} value={last} onChange={(e) => setLast(e.target.value)} className={input} />
              </label>
            </div>
            <label className="block mt-4">
              <span className={label}>{ar ? 'البريد الإلكتروني (اختياري)' : 'אימייל (לא חובה)'}</span>
              <input type="email" autoComplete="email" dir="ltr" maxLength={120} value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
            </label>

            <label className="mt-6 flex items-start gap-3 text-base text-heading">
              <input type="checkbox" required checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1 w-6 h-6 shrink-0 accent-[#E9B949]" />
              <span>
                {ar ? 'قرأت وأوافق على ' : 'קראתי ואני מאשר/ת את '}
                <Link href="/terms" target="_blank" className="underline text-gold">{ar ? 'شروط الاستخدام' : 'התקנון'}</Link>
                {ar ? ' و' : ' ואת '}
                <Link href="/privacy" target="_blank" className="underline text-gold">{ar ? 'سياسة الخصوصية' : 'מדיניות הפרטיות'}</Link>
                {ar ? '. (إلزامي)' : '. (חובה)'}
              </span>
            </label>
            <label className="mt-4 flex items-start gap-3 text-base text-heading">
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1 w-6 h-6 shrink-0 accent-[#E9B949]" />
              <span>
                {ar
                  ? 'أوافق على تلقي عروض وتحديثات من حلويات دالية الكرمل برسائل SMS. يمكن إلغاء ذلك في أي وقت. (اختياري)'
                  : 'אני מסכים/ה לקבל מממתקי דלית אל כרמל מבצעים ועדכונים בהודעות SMS. אפשר להסיר את עצמך בכל עת. (לא חובה)'}
              </span>
            </label>
            <button type="submit" disabled={busy} className={`${button} mt-6`}>{busy ? (ar ? 'يحفظ…' : 'שומרים…') : ar ? 'متابعة إلى الطلب' : 'המשך להזמנה'}</button>
          </form>
        )}

        <div aria-live="assertive" className="min-h-6 mt-4">
          {error && <p role="alert" className="p-3 rounded-[8px] border border-burgundy text-burgundy font-semibold">{error}</p>}
        </div>
      </div>
    </div>
  );
}
