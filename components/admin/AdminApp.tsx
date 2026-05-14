'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { OrdersBoard } from './OrdersBoard';
import { CatalogManager } from './CatalogManager';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

const ADMIN_PIN = '1985';
const STORAGE_KEY = 'mamtaki-dalia-admin-session-v1';

type Props = {
  tab: 'orders' | 'catalog';
  locale: Locale;
};

export function AdminApp({ tab, locale }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setAuthed(typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'ok');
  }, []);

  const onLogin = () => {
    localStorage.setItem(STORAGE_KEY, 'ok');
    setAuthed(true);
  };

  const onLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
  };

  if (!hydrated) {
    return <div className="min-h-screen bg-ivory" />;
  }

  if (!authed) {
    return <AdminGate locale={locale} onSuccess={onLogin} />;
  }

  return (
    <div className="min-h-screen bg-ivory">
      <AdminHeader locale={locale} active={tab} onLogout={onLogout} />
      <main className="mx-auto max-w-7xl px-5 md:px-10 py-10 md:py-14">
        <AnimatePresence mode="wait">
          {tab === 'orders' ? (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: easeLuxe }}
            >
              <OrdersBoard locale={locale} />
            </motion.div>
          ) : (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: easeLuxe }}
            >
              <CatalogManager locale={locale} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ─── PIN gate ─────────────────────────────────────────────────────── */

function AdminGate({ locale, onSuccess }: { locale: Locale; onSuccess: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-cedar flex items-center justify-center px-5">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: easeLuxe }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <span className="font-display-en text-[11px] tracking-[0.3em] uppercase text-gold-light/80">
            Maison Dalia · Admin
          </span>
          <h1 className={`mt-5 ${displayFont} font-black text-4xl md:text-5xl text-ivory tracking-display`}>
            {locale === 'ar' ? 'لوحة الإدارة' : 'ניהול האתר'}
          </h1>
          <p className="mt-3 text-sm text-ivory/65">
            {locale === 'ar' ? 'أدخل الرمز السري للمتابعة' : 'הקלידו את הקוד הסודי כדי להמשיך'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-cream-card border border-gold-deep/40 rounded-[2px] p-8 md:p-10">
          <label className="block mb-3 font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted">
            PIN
          </label>
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            className={`w-full h-14 px-4 bg-ivory border ${error ? 'border-burgundy' : 'border-gold-deep/40'} text-cedar font-display-en text-2xl tracking-[0.5em] text-center focus:outline-none focus:border-gold transition-colors duration-300 rounded-[2px]`}
            maxLength={6}
            placeholder="••••"
          />
          {error && (
            <p className="mt-3 text-sm text-burgundy">
              {locale === 'ar' ? 'الرمز غير صحيح' : 'הקוד שגוי'}
            </p>
          )}
          <button
            type="submit"
            className="mt-6 w-full h-14 bg-burgundy hover:bg-burgundy-deep text-ivory font-display-en text-xs tracking-eyebrow uppercase rounded-[2px] transition-colors duration-500"
          >
            {locale === 'ar' ? 'دخول' : 'כניסה'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-ivory/40 font-display-en tracking-[0.15em] uppercase">
          {locale === 'ar' ? 'للمالك فقط' : 'גישה לבעלים בלבד'}
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Admin Header / Tab Nav ─────────────────────────────────────── */

function AdminHeader({
  locale,
  active,
  onLogout,
}: {
  locale: Locale;
  active: 'orders' | 'catalog';
  onLogout: () => void;
}) {
  const displayFont = locale === 'ar' ? 'font-display-ar' : 'font-display-he';

  return (
    <header className="bg-cedar text-ivory">
      <div className="mx-auto max-w-7xl px-5 md:px-10 py-6 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="font-display-en text-[10px] tracking-[0.3em] uppercase text-gold-light/80">
            Maison Dalia · Admin
          </span>
          <h1 className={`mt-1 ${displayFont} font-black text-2xl md:text-3xl tracking-display text-ivory`}>
            {locale === 'ar' ? 'لوحة الإدارة' : 'ניהול האתר'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-display-en text-[11px] tracking-eyebrow uppercase text-ivory/65 hover:text-gold-light transition-colors duration-500"
          >
            {locale === 'ar' ? 'عرض الموقع' : 'הצג את האתר'}
          </Link>
          <span aria-hidden className="h-4 w-px bg-ivory/20" />
          <button
            type="button"
            onClick={onLogout}
            className="font-display-en text-[11px] tracking-eyebrow uppercase text-ivory/65 hover:text-burgundy transition-colors duration-500"
          >
            {locale === 'ar' ? 'خروج' : 'התנתק'}
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <nav className="mx-auto max-w-7xl px-5 md:px-10 flex items-center gap-1 border-t border-ivory/10">
        <TabLink locale={locale} href="/admin" label={locale === 'ar' ? 'الطلبات' : 'הזמנות'} active={active === 'orders'} />
        <TabLink locale={locale} href="/admin/catalog" label={locale === 'ar' ? 'الكتالوج' : 'קטלוג'} active={active === 'catalog'} />
      </nav>
    </header>
  );
}

function TabLink({ locale, href, label, active }: { locale: Locale; href: '/admin' | '/admin/catalog'; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`relative px-5 py-4 font-display-en text-[12px] tracking-eyebrow uppercase transition-colors duration-500 ${active ? 'text-gold-light' : 'text-ivory/65 hover:text-ivory'}`}
    >
      {label}
      {active && (
        <span aria-hidden className="absolute -bottom-px inset-x-5 h-px bg-gold" />
      )}
    </Link>
  );
}
