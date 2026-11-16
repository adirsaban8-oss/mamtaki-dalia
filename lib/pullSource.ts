/**
 * The media behind the home "Pull" hero (kanafeh cheese stretch).
 * Swap the source here — nothing else needs to change.
 *
 *  - kind 'frames': an image sequence scrubbed by scroll. A few frames
 *    cross-fade; 12 or more are drawn one by one on a canvas.
 *  - kind 'video':  a short muted clip; scroll sets currentTime.
 *
 * TODO(stage 2): replace the placeholder with the real stretch video
 * from the shop (brand-assets/knafeh/), e.g.
 *   { kind: 'video', mp4: '/videos/pull.mp4', webm: '/videos/pull.webm', poster: '/images/pull-poster.webp' }
 */
export type PullSource =
  | { kind: 'frames'; frames: string[]; poster: string }
  | { kind: 'video'; mp4: string; webm?: string; poster: string };

/** Placeholder: four AI stills (marked ⚠️ in docs/redesign/01-inventory.md). */
export const PULL_SOURCE: PullSource = {
  kind: 'frames',
  frames: [1, 2, 3, 4].map((n) => `/images/hero-scene/f${n}.webp`),
  poster: '/images/hero-scene/f1.webp',
};
