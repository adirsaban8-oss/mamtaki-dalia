'use client';

import { useEffect, useRef } from 'react';

/** Shared looks: large, high contrast, easy to hit with a finger. */
export const BTN = 'inline-flex items-center justify-center gap-2 min-h-14 px-6 rounded-xl text-xl font-bold border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#1565C0]';
export const BTN_PRIMARY = 'bg-[#1B5E20] border-[#1B5E20] text-white hover:bg-[#154a19]';
export const BTN_PLAIN = 'bg-white border-[#8A8273] text-[#1B1712] hover:bg-[#EFEADF]';
export const BTN_DANGER = 'bg-white border-[#C62828] text-[#8E1B1B] hover:bg-[#FDECEA]';
export const INPUT = 'w-full min-h-14 px-4 rounded-xl border-2 border-[#8A8273] bg-white text-xl text-[#1B1712] focus:outline-none focus:border-[#1565C0] focus:ring-4 focus:ring-[#1565C0]/25';
export const CARD = 'bg-white border-2 border-[#D9D2C3] rounded-2xl';

type Result<T> = { ok: boolean; status: number; data?: T; message?: string };

/** One way to call the server: JSON in, JSON out, and a Hebrew message when it fails. */
export async function api<T = unknown>(url: string, init: { method?: string; body?: unknown; raw?: Blob } = {}): Promise<Result<T>> {
  try {
    const res = await fetch(url, {
      method: init.method ?? 'GET',
      headers: init.raw ? { 'Content-Type': init.raw.type || 'application/octet-stream' } : init.body ? { 'Content-Type': 'application/json' } : undefined,
      body: init.raw ?? (init.body ? JSON.stringify(init.body) : undefined),
      cache: 'no-store',
    });
    const data = (await res.json().catch(() => null)) as (T & { message?: string }) | null;
    return { ok: res.ok, status: res.status, data: data ?? undefined, message: res.ok ? undefined : data?.message || 'משהו השתבש. נסו שוב.' };
  } catch {
    return { ok: false, status: 0, message: 'אין חיבור לאינטרנט. בדקו את החיבור ונסו שוב.' };
  }
}

/** "Are you sure?" in a large, plain box. */
export function Confirm({ title, text, yes, danger = false, busy = false, onYes, onNo }: { title: string; text?: string; yes: string; danger?: boolean; busy?: boolean; onYes: () => void; onNo: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onNo();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onNo]);
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onNo}>
      <div ref={ref} tabIndex={-1} role="alertdialog" aria-modal="true" aria-label={title} className="w-full max-w-lg bg-white rounded-2xl p-6 border-4 border-[#1B1712] outline-none" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold">{title}</h2>
        {text && <p className="mt-3 text-xl whitespace-pre-line">{text}</p>}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" onClick={onNo} className={`${BTN} ${BTN_PLAIN}`}>לא, חזרה</button>
          <button type="button" disabled={busy} onClick={onYes} className={`${BTN} ${danger ? 'bg-[#C62828] border-[#C62828] text-white hover:bg-[#a52020]' : BTN_PRIMARY}`}>
            {busy ? 'רגע…' : yes}
          </button>
        </div>
      </div>
    </div>
  );
}

/** A short "saved" / error line that screen readers announce. */
export function Notice({ kind, children }: { kind: 'ok' | 'error'; children: React.ReactNode }) {
  return (
    <p role={kind === 'error' ? 'alert' : 'status'} className={`p-3 rounded-xl border-2 text-lg font-semibold ${kind === 'ok' ? 'bg-[#E8F5E9] border-[#1B5E20] text-[#1B5E20]' : 'bg-[#FDECEA] border-[#C62828] text-[#8E1B1B]'}`}>
      {children}
    </p>
  );
}

export const shekel = (n: number) => `₪${n.toLocaleString('he-IL')}`;
export const dateTime = (iso: string) => new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
