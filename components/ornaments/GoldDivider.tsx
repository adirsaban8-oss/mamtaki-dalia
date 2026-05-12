type Props = {
  className?: string;
};

export function GoldDivider({ className }: Props) {
  return (
    <span
      aria-hidden
      className={`inline-block h-[1px] w-12 bg-gradient-to-r from-transparent via-gold to-transparent ${className ?? ''}`}
    />
  );
}
