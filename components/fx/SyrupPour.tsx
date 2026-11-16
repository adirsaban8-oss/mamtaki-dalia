'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CYCLE_MS = 9000;

/**
 * A thin stream of golden syrup pours from the top of the frame onto the
 * kanafeh; where it lands a glossy pool spreads over the crust, a few drops
 * follow the stream, and the pool settles into a soft shine. Repeats every
 * few seconds. Off under prefers-reduced-motion.
 *
 * `pos` holds the Tailwind classes for the impact point (left / top and the
 * matching stream height), so phones and desktop can aim at the dish.
 */
export function SyrupPour({ start = 2.4, pos }: { start?: number; pos: { left: string; top: string; height: string } }) {
  const [cycle, setCycle] = useState(0);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const first = setTimeout(() => setOn(true), 0);
    const id = setInterval(() => setCycle((c) => c + 1), CYCLE_MS);
    return () => { clearTimeout(first); clearInterval(id); };
  }, []);

  if (!on) return null;
  const d = cycle === 0 ? start : 0;

  return (
    <div key={cycle} aria-hidden className="pointer-events-none absolute inset-0">
      {/* The stream: grows down from the top, then its tail falls away */}
      <motion.span
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)', 'inset(0 0 0% 0)', 'inset(100% 0 0% 0)'] }}
        transition={{ duration: 2.8, delay: d, times: [0, 0.22, 0.7, 1], ease: 'easeInOut' }}
        className={`absolute top-0 ${pos.left} ${pos.height} w-[7px] lg:w-[9px] -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,#8C5E12_0%,#E9B949_35%,#FFF0C2_50%,#D9A23A_68%,#8C5E12_100%)] shadow-[0_0_18px_rgba(233,185,73,0.55)]`}
      />
      {/* Drops that follow the stream */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          initial={{ top: '0%', opacity: 0 }}
          animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.9, delay: d + 1.9 + i * 0.28, ease: 'easeIn' }}
          className={`absolute ${pos.left} w-[6px] h-[10px] -translate-x-1/2 rounded-full bg-[#F3CB6B] shadow-[0_0_10px_rgba(233,185,73,0.7)]`}
          style={{ maxHeight: 10 }}
        >
          <span className={`absolute inset-0`} />
        </motion.span>
      ))}
      {/* The pool spreading over the crust, then settling into a shine */}
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1, 1.06], opacity: [0, 0.95, 0.5] }}
        transition={{ duration: 3.4, delay: d + 0.55, times: [0, 0.45, 1], ease: 'easeOut' }}
        className={`absolute ${pos.left} ${pos.top} w-[46%] lg:w-[24%] aspect-[2.3/1] -translate-x-1/2 -translate-y-1/2 rounded-[50%] mix-blend-overlay bg-[radial-gradient(closest-side,rgba(255,232,170,0.95),rgba(233,185,73,0.6)_45%,rgba(176,125,31,0.2)_75%,transparent)]`}
      />
      {/* A bright glint where the syrup lands */}
      <motion.span
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: [0.4, 1.3, 1], opacity: [0, 0.9, 0] }}
        transition={{ duration: 1.6, delay: d + 0.6, ease: 'easeOut' }}
        className={`absolute ${pos.left} ${pos.top} w-14 h-6 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,250,230,0.95),transparent)] blur-[2px]`}
      />
    </div>
  );
}
