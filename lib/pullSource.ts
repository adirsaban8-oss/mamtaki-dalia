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
 * Living Photo of the shop's kanafeh with ice cream. The image is frame 1:
 * a clean-up of brand-assets/knafeh/kanafeh-ice-cream.png (⚠️ AI-sharpened).
 * To use the untouched crop instead, point `image` at /images/pull/original.webp.
 */
export const PULL_SOURCE: PullSource = {
  kind: 'living',
  image: '/images/pull/f1.webp',
  focus: [58, 32],
};
