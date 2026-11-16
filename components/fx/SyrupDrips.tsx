'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';

/** Drip x-positions (0–100) and how far each one runs. */
const DRIPS: [number, number][] = [
  [4, 0.55], [11, 0.9], [19, 0.35], [27, 1], [36, 0.6], [44, 0.8], [52, 0.4],
  [60, 0.95], [68, 0.5], [76, 0.75], [84, 0.3], [92, 0.85], [98, 0.45],
];

/**
 * Syrup Reveal — a gold syrup curtain that runs down from the top edge.
 * `progress` 0→1 drives it: the band and its drips lengthen until they
 * cover the frame. Used as the hand-off at the end of the Pull hero.
 */
export function SyrupDrips({ progress, className = '' }: { progress: MotionValue<number>; className?: string }) {
  const band = useTransform(progress, [0, 1], ['0%', '100%']);
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="syrup-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#C98A00" />
            <stop offset="0.38" stopColor="#FFC300" />
            <stop offset="0.5" stopColor="#FFE27A" />
            <stop offset="0.62" stopColor="#FFC300" />
            <stop offset="1" stopColor="#C98A00" />
          </linearGradient>
        </defs>
      </svg>
      <motion.div style={{ height: band }} className="absolute inset-x-0 top-0 bg-gold-metal" />
      {DRIPS.map(([x, run], i) => (
        <Drip key={i} x={x} run={run} progress={progress} band={band} />
      ))}
    </div>
  );
}

function Drip({ x, run, progress, band }: { x: number; run: number; progress: MotionValue<number>; band: MotionValue<string> }) {
  const len = useTransform(progress, [0, 0.8], [0, 34 * run]);
  const height = useTransform(len, (v) => `${v}vh`);
  return (
    <motion.div style={{ top: band, height, left: `${x}%` }} className="absolute w-[clamp(14px,2.4vw,34px)] -translate-x-1/2">
      <svg viewBox="0 0 20 100" preserveAspectRatio="none" className="w-full h-full">
        <path d="M0 0 H20 V82 C20 94 14 100 10 100 C6 100 0 94 0 82 Z" fill="url(#syrup-gold)" />
      </svg>
    </motion.div>
  );
}
