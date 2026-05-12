'use client';

import { motion } from 'framer-motion';

type Props = {
  label: string;
  className?: string;
};

/**
 * Spec: vertical 2px gold line, 60px tall, with gentle pulse +
 * "גלול למטה" text BELOW. Used at the bottom-center of the hero.
 */
export function ScrollCue({ label, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.0, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex flex-col items-center gap-4 ${className ?? ''}`}
    >
      {/* Vertical gold line — 2px wide, 60px tall, pulsing scaleY */}
      <span
        aria-hidden
        className="block w-[2px] h-[60px] bg-gradient-to-b from-gold-light/0 via-gold to-gold-light/30 origin-top"
      >
        <motion.span
          className="block w-full h-full bg-gold origin-top"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      </span>
      <span className="font-display-en text-[11px] tracking-eyebrow uppercase text-ivory/80">
        {label}
      </span>
    </motion.div>
  );
}
