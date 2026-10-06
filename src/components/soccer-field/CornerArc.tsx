type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

/** Places and mirrors the top-left arc into each corner of the boundary. */
const placement: Record<Corner, string> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0 -scale-x-100",
  "bottom-left": "bottom-0 left-0 -scale-y-100",
  "bottom-right": "bottom-0 right-0 -scale-100",
};

/** A quarter-circle chalk arc in one corner of the field boundary. */
export default function CornerArc({ corner }: { corner: Corner }) {
  return (
    <svg
      viewBox="0 0 20 20"
      data-marking="corner-arc"
      className={`absolute size-4 overflow-visible md:size-5 ${placement[corner]}`}
      focusable="false"
    >
      <path
        d="M0 16A16 16 0 0 0 16 0"
        className="fill-none stroke-chalk stroke-outline"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
