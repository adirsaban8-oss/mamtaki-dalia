'use client';

import { useEffect, useRef } from 'react';

/**
 * Glisten — a soft specular highlight that slides across a syrupy photo
 * as the page scrolls, as if the light moved over the syrup. Place it
 * inside a positioned image box. Static under prefers-reduced-motion.
 */
export function Glisten({ strength = 0.32 }: { strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the box enters from below, 1 when it leaves at the top
      const t = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      el.style.setProperty('--gx', `${15 + t * 70}%`);
      el.style.setProperty('--gy', `${70 - t * 45}%`);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-soft-light"
      style={{
        background: `radial-gradient(28% 22% at var(--gx, 40%) var(--gy, 45%), rgba(255,246,220,${strength}), transparent 70%)`,
      }}
    />
  );
}
