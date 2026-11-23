'use client';

import { useCallback, useEffect, useState } from 'react';
import { OrdersTab } from './OrdersTab';
import { ProductsTab } from './ProductsTab';
import { CustomersTab } from './CustomersTab';
import { api, BTN, BTN_PRIMARY, INPUT } from './ui';

type Session = { signedIn: boolean; passwordSet: boolean; database: boolean; sms: boolean };
type Tab = 'orders' | 'products' | 'customers';

/**
 * The shop's management screen. Built for people who are not at home with
 * computers: light background, large letters, one clear button per action,
 * plain Hebrew, and every change is saved the moment it is made.
 */
export function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState<Tab>('orders');
  const [newOrders, setNewOrders] = useState(0);

  const load = useCallback(() => {
    api<Session>('/api/admin/session').then((r) => setSession(r.data ?? { signedIn: false, passwordSet: false, database: false, sms: false }));
  }, []);
  useEffect(load, [load]);

  return (
    <div dir="rtl" lang="he" className="min-h-screen bg-[#F6F3EC] text-[#1B1712] text-[18px] leading-relaxed font-sans">
      {session === null ? (
        <p className="p-10 text-center text-xl">טוען…</p>
      ) : !session.passwordSet || !session.database ? (
        <Setup session={session} />
      ) : !session.signedIn ? (
        <Login onDone={load} />
      ) : (
        <>
          <header className="sticky top-0 z-30 bg-white border-b-2 border-[#D9D2C3]">
            <div className="mx-auto max-w-5xl px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
              <h1 className="text-xl sm:text-2xl font-bold">ניהול ממתקי דלית אל כרמל</h1>
              <button
                type="button"
                onClick={() => api('/api/admin/session', { method: 'DELETE' }).then(load)}
                className="h-11 px-4 rounded-lg border-2 border-[#8A8273] text-base font-semibold hover:bg-[#EFEADF]"
              >
                יציאה
              </button>
            </div>
            <nav className="mx-auto max-w-5xl px-3 sm:px-6 pb-3 grid grid-cols-3 gap-2" aria-label="חלקי הניהול">
              {([['orders', 'הזמנות'], ['products', 'מוצרים'], ['customers', 'לקוחות והודעות']] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  aria-current={tab === key ? 'page' : undefined}
                  className={`relative h-14 rounded-xl text-lg sm:text-xl font-bold border-2 transition-colors ${tab === key ? 'bg-[#1B1712] text-white border-[#1B1712]' : 'bg-white text-[#1B1712] border-[#8A8273] hover:bg-[#EFEADF]'}`}
                >
                  {label}
                  {key === 'orders' && newOrders > 0 && (
                    <span className="absolute -top-2 -left-2 min-w-8 h-8 px-2 rounded-full bg-[#C62828] text-white text-base font-bold inline-flex items-center justify-center" aria-label={`${newOrders} הזמנות חדשות`}>
                      {newOrders}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </header>
          <main className="mx-auto max-w-5xl px-3 sm:px-6 py-6">
            {/* Orders stay mounted so the "new orders" badge keeps counting on the other tabs. */}
            <div hidden={tab !== 'orders'}>
              <OrdersTab onNewCount={setNewOrders} onSignedOut={load} />
            </div>
            {tab === 'products' && <ProductsTab onSignedOut={load} />}
            {tab === 'customers' && <CustomersTab smsOn={session.sms} onSignedOut={load} />}
          </main>
        </>
      )}
    </div>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="mx-auto max-w-md px-5 pt-16"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const r = await api('/api/admin/session', { method: 'POST', body: { password } });
        setBusy(false);
        if (r.ok) onDone();
        else setError(r.message || 'הכניסה נכשלה.');
      }}
    >
      <h1 className="text-3xl font-bold text-center">כניסה לניהול</h1>
      <p className="mt-2 text-center text-[#5A5347]">ממתקי דלית אל כרמל</p>
      <label className="block mt-8">
        <span className="block mb-2 text-xl font-semibold">סיסמה</span>
        <input type={show ? 'text' : 'password'} autoComplete="current-password" autoFocus required value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} className={INPUT} dir="ltr" />
      </label>
      <label className="mt-3 flex items-center gap-3 text-lg">
        <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="w-6 h-6" />
        להציג את הסיסמה
      </label>
      {error && <p role="alert" className="mt-4 p-3 rounded-lg bg-[#FDECEA] border-2 border-[#C62828] text-[#8E1B1B] text-lg font-semibold">{error}</p>}
      <button type="submit" disabled={busy} className={`${BTN} ${BTN_PRIMARY} w-full mt-6`}>
        {busy ? 'נכנסים…' : 'כניסה'}
      </button>
    </form>
  );
}

/** Shown until the site owner finishes the one-time setup on Railway. */
function Setup({ session }: { session: Session }) {
  return (
    <div className="mx-auto max-w-xl px-5 pt-16">
      <h1 className="text-3xl font-bold">דף הניהול עוד לא מוכן</h1>
      <p className="mt-3">חסרות הגדרות חד-פעמיות ב-Railway. מי שבנה את האתר צריך להשלים אותן:</p>
      <ul className="mt-5 space-y-3 text-lg">
        <li className="p-4 rounded-lg bg-white border-2 border-[#D9D2C3]">{session.database ? '✓ בסיס הנתונים מחובר' : '✗ בסיס נתונים (Postgres) לא מחובר: חסר המשתנה DATABASE_URL'}</li>
        <li className="p-4 rounded-lg bg-white border-2 border-[#D9D2C3]">{session.passwordSet ? '✓ סיסמת ניהול הוגדרה' : '✗ סיסמת ניהול לא הוגדרה: חסר המשתנה ADMIN_PASSWORD'}</li>
        <li className="p-4 rounded-lg bg-white border-2 border-[#D9D2C3]">{session.sms ? '✓ שירות SMS מחובר' : '✗ שירות SMS לא מחובר'}</li>
      </ul>
    </div>
  );
}
