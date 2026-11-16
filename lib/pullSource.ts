/**
 * The media behind the home "Pull" hero. Swap the source here — nothing
 * else needs to change.
 *
 *  - kind 'living': one real photo brought to life (slow macro drift,
 *    steam, glisten). No cheese stretch is shown.
 *  - kind 'frames': an image sequence scrubbed by scroll. A few frames
 *    cross-fade; 12 or more are drawn one by one on a canvas.
 *  - kind 'video':  a short muted clip; scroll sets currentTime.
 *
 * When the shop's real stretch video arrives (brand-assets/knafeh/), use e.g.
 *   { kind: 'video', mp4: '/videos/pull.mp4', webm: '/videos/pull.webm', poster: '/images/pull/poster.webp' }
 */
export type PullSource =
  | { kind: 'living'; image: string; /** focus point for the macro drift, % of the image */ focus: [number, number] }
  | { kind: 'frames'; frames: string[]; poster: string }
  | { kind: 'video'; mp4: string; webm?: string; poster: string };

/**
 * The shop's kanafeh with ice cream (brand-assets/knafeh/kanafeh-ice-cream.png): frame 1 is a
 * clean-up of that photo; frames 2–4 add the fork and the cheese stretch (AI edits, ⚠️) —
 * each one edited from the previous, so the dish stays the same. A real video replaces them.
 * For a still version use { kind: 'living', image: '/images/pull/f1.webp', focus: [58, 32] }
 * (or image '/images/pull/original.webp' for the untouched crop).
 */
export const PULL_SOURCE: PullSource = {
  kind: 'frames',
  frames: [1, 2, 3, 4].map((n) => `/images/pull/f${n}.webp`),
  poster: '/images/pull/f1.webp',
};
