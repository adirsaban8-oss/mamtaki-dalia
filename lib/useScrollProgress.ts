'use client';

import { useEffect, type RefObject } from 'react';
import { useMotionValue, type MotionValue } from 'framer-motion';

/**
 * Scroll progress of an element through the viewport, 0 → 1.
 * 0 when the element's top reaches `start` (fraction of the viewport
 * height, from the top), 1 when its bottom reaches `end`.
 * A plain scroll listener — reliable with the sticky/clip layouts here.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  start = 0.85,
  end = 0.35
): MotionValue<number> {
  const p = useMotionValue(0);
  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = r.height + (start - end) * vh;
      p.set(span > 0 ? Math.min(1, Math.max(0, (start * vh - r.top) / span)) : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [ref, p, start, end]);
  return p;
}
