'use client';

import { motion } from 'framer-motion';

type Props = {
  label: string;
  className?: string;
};

/**
 * Minimal scroll cue — a small gold chevron with gentle bounce, set
 * at the very bottom of the hero. No vertical line, no label: those
 * were competing with the headline and CTAs for vertical real-estate.
 * `label` is kept on the prop for backwards compatibility but rendered
 * as a sr-only string.
 */
export function ScrollCue({ label, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.0, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`pointer-events-none ${className ?? ''}`}
    >
      <span className="sr-only">{label}</span>
      <motion.span
        aria-hidden
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="block text-gold-light/70"
      >
        <svg width="18" height="22" viewBox="0 0 18 22" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M 9 2 L 9 16" />
          <path d="M 3 13 L 9 19 L 15 13" />
        </svg>
      </motion.span>
    </motion.div>
  );
}
