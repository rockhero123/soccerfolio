import { leafPath } from "../forest-background/shapes";

/** A short vine the header sign hangs from, with one leaf. Decorative. */
export default function Vine({ className = "" }: { className?: string }) {
  const stalk = "M6 0Q2 8 6 16T6 30";
  return (
    <svg
      viewBox="0 0 16 30"
      aria-hidden="true"
      focusable="false"
      className={`absolute h-7.5 w-4 overflow-visible ${className}`}
    >
      <path
        d={stalk}
        className="fill-none stroke-ink [stroke-width:calc(var(--stroke-width-outline)*1.8)]"
        strokeLinecap="round"
      />
      <path
        d={stalk}
        className="fill-none stroke-moss [stroke-width:calc(var(--stroke-width-outline)*0.8)]"
        strokeLinecap="round"
      />
      <path
        d={leafPath(9, 6)}
        transform="translate(6 12) rotate(60)"
        className="fill-forest-mid-leaf stroke-ink stroke-outline"
      />
    </svg>
  );
}
