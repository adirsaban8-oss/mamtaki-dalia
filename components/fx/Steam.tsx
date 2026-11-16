'use client';

import { useEffect, useRef } from 'react';

/**
 * Soft steam rising over a hot dessert: ~28 blurred particles on a small
 * canvas, very low opacity. Runs only while on screen and the tab is
 * visible; off entirely under prefers-reduced-motion.
 */
export function Steam({ className = '', density = 28 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, raf = 0, visible = false;
    const resize = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width; h = r.height;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    type P = { x: number; y: number; r: number; vy: number; drift: number; life: number; max: number };
    const spawn = (): P => ({
      x: w * (0.25 + Math.random() * 0.5), y: h * (0.85 + Math.random() * 0.15),
      r: 10 + Math.random() * 22, vy: 0.25 + Math.random() * 0.45, drift: Math.random() * Math.PI * 2,
      life: 0, max: 180 + Math.random() * 160,
    });
    const ps: P[] = Array.from({ length: density }, () => { const p = spawn(); p.life = Math.random() * p.max; return p; });

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.life++; p.y -= p.vy; p.drift += 0.012; p.x += Math.sin(p.drift) * 0.35; p.r += 0.06;
        if (p.life > p.max || p.y < -p.r) Object.assign(p, spawn());
        const t = p.life / p.max;
        const a = Math.sin(Math.PI * t) * 0.085;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(255,248,235,${a})`);
        g.addColorStop(1, 'rgba(255,248,235,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); });
    io.observe(c);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', resize);
    return () => { stop(); io.disconnect(); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', resize); };
  }, [density]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className}`} />;
}
