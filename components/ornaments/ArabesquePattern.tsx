type Props = {
  className?: string;
  opacity?: number;
};

/**
 * Decorative SVG: Islamic/Druze geometric tessellation used as a subtle
 * background ornament. Tiles seamlessly via <pattern>. Opacity should
 * stay low (4–8%) so it reads as parchment texture, not as content.
 */
export function ArabesquePattern({ className, opacity = 0.08 }: Props) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity }}
    >
      <defs>
        <pattern
          id="arabesque-tile"
          x="0"
          y="0"
          width="96"
          height="96"
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke="currentColor" strokeWidth="0.7">
            {/* Eight-point star — classic Mediterranean/Druze motif */}
            <path d="M 48 12 L 60 36 L 84 48 L 60 60 L 48 84 L 36 60 L 12 48 L 36 36 Z" />
            <path d="M 48 24 L 56 40 L 72 48 L 56 56 L 48 72 L 40 56 L 24 48 L 40 40 Z" />
            <circle cx="48" cy="48" r="3" />
            {/* Corner connectors so the tile interlocks */}
            <path d="M 0 0 L 12 12" />
            <path d="M 96 0 L 84 12" />
            <path d="M 0 96 L 12 84" />
            <path d="M 96 96 L 84 84" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#arabesque-tile)" />
    </svg>
  );
}
