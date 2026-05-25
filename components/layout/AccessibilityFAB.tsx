'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const easeLuxe = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Accessibility FAB — Israeli legal-compliance starter widget.
 *
 * Floating button bottom-end, opens a small panel with toggles:
 *   – טקסט גדול / גדול יותר   (font-size scaling)
 *   – ניגודיות גבוהה          (high-contrast palette)
 *   – הדגש קישורים            (underline + bolder link colors)
 *   – עצור אנימציות           (force reduced motion)
 *   – איפוס                   (clear all toggles)
 *
 * State persists in localStorage under `a11y-prefs-v1`. Each preference
 * adds a CSS class to <html> so the corresponding rules in globals.css
 * activate.
 */

type Prefs = {
  textScale: 0 | 1 | 2;
  highContrast: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
};

const DEFAULT_PREFS: Prefs = {
  textScale: 0,
  highContrast: false,
  underlineLinks: false,
  reduceMotion: false,
};

const STORAGE_KEY = 'a11y-prefs-v1';

function loadPrefs(): Prefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

function applyPrefs(p: Prefs) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('a11y-text-larger', p.textScale === 1);
  root.classList.toggle('a11y-text-largest', p.textScale === 2);
  root.classList.toggle('a11y-contrast', p.highContrast);
  root.classList.toggle('a11y-links', p.underlineLinks);
  root.classList.toggle('a11y-no-motion', p.reduceMotion);
}

export function AccessibilityFAB() {
  const t = useTranslations('Accessibility');
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    const loaded = loadPrefs();
    setPrefs(loaded);
    applyPrefs(loaded);
    setHydrated(true);
  }, []);

  const update = (patch: Partial<Prefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    applyPrefs(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const reset = () => {
    setPrefs(DEFAULT_PREFS);
    applyPrefs(DEFAULT_PREFS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  // Hide the FAB until hydrated so SSR markup matches
  if (!hydrated) return null;

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('open')}
        aria-expanded={open}
        className="fixed start-4 bottom-4 z-[55] w-12 h-12 sm:w-14 sm:h-14 inline-flex items-center justify-center bg-cedar text-gold-light hover:bg-burgundy hover:text-ivory transition-colors duration-500 rounded-full shadow-deep border border-gold/40"
      >
        <AccessibilityIcon />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop — closes on click outside */}
            <button
              type="button"
              aria-label={t('close')}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[55] bg-transparent cursor-default"
            />

            {/* Panel */}
            <motion.div
              role="dialog"
              aria-label={t('title')}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.4, ease: easeLuxe }}
              className="fixed start-4 bottom-20 sm:bottom-24 z-[60] w-72 bg-cream-card border border-gold-deep/40 rounded-[2px] shadow-deep p-5"
            >
              <header className="flex items-center justify-between mb-4">
                <h2 className="font-display-en text-[11px] tracking-eyebrow uppercase text-cedar">
                  {t('title')}
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t('close')}
                  className="text-coffee-muted hover:text-burgundy transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
                    <path d="M 2 2 L 12 12" />
                    <path d="M 12 2 L 2 12" />
                  </svg>
                </button>
              </header>

              {/* Text size — 3-step toggle */}
              <div className="mb-4">
                <p className="text-[11px] text-coffee-muted mb-2">{t('textSize')}</p>
                <div className="grid grid-cols-3 gap-1 border border-gold-deep/30 rounded-[2px] overflow-hidden">
                  {([0, 1, 2] as const).map((step) => {
                    const active = prefs.textScale === step;
                    return (
                      <button
                        key={step}
                        type="button"
                        onClick={() => update({ textScale: step })}
                        className={`h-9 inline-flex items-center justify-center transition-colors duration-300 ${active ? 'bg-cedar text-ivory' : 'bg-cream-card text-cedar hover:bg-sand'}`}
                        style={{ fontSize: step === 0 ? '13px' : step === 1 ? '15px' : '17px' }}
                      >
                        A
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-1">
                <Toggle
                  label={t('highContrast')}
                  checked={prefs.highContrast}
                  onChange={(v) => update({ highContrast: v })}
                />
                <Toggle
                  label={t('underlineLinks')}
                  checked={prefs.underlineLinks}
                  onChange={(v) => update({ underlineLinks: v })}
                />
                <Toggle
                  label={t('reduceMotion')}
                  checked={prefs.reduceMotion}
                  onChange={(v) => update({ reduceMotion: v })}
                />
              </div>

              {/* Reset */}
              <button
                type="button"
                onClick={reset}
                className="mt-4 w-full h-9 font-display-en text-[11px] tracking-eyebrow uppercase text-coffee-muted hover:text-burgundy transition-colors duration-500 border-t border-gold-deep/20 pt-3"
              >
                {t('reset')}
              </button>

              <p className="mt-3 text-[10px] text-coffee-muted/70 leading-relaxed text-center">
                {t('legalNote')}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Toggle ────────────────────────────────────────────────────────── */

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer">
      <span className="text-sm text-cedar">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${checked ? 'bg-gold' : 'bg-hairline'}`}
      >
        <span
          aria-hidden
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-cream-card shadow transition-all duration-300 ${checked ? 'start-[22px]' : 'start-0.5'}`}
        />
      </button>
    </label>
  );
}

/* ── Icon — standard accessibility person glyph ───────────────────── */

function AccessibilityIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="4" r="2" />
      <path d="M19 9.5a1 1 0 0 0-1-1h-4.5l-1 0a3 3 0 0 1-1 0L7 8.5a1 1 0 1 0 0 2l3.5 0v3.2L8.4 19.5a1 1 0 1 0 1.83.8L12 16.5l1.77 3.8a1 1 0 1 0 1.83-.8l-2.1-5.8V10.5L18 10.5a1 1 0 0 0 1-1z" />
    </svg>
  );
}
