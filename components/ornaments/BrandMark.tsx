type Props = {
  className?: string;
  size?: number;
};

export function BrandMark({ className, size = 32 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
      <path
        d="M 13.5 20 a 6.5 6.5 0 1 0 13 0 a 5 5 0 1 1 -10 0 Z"
        fill="currentColor"
      />
      <circle cx="28.2" cy="16.5" r="1" fill="currentColor" />
    </svg>
  );
}
