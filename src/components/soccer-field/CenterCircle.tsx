/**
 * The centre circle and centre spot. The viewBox is square, so the circle
 * stays round at any size; the halfway line itself is drawn by `SoccerField`.
 */
export default function CenterCircle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      data-marking="center-circle"
      className={`overflow-visible ${className}`}
      focusable="false"
    >
      <circle
        cx="100"
        cy="100"
        r="98"
        className="fill-none stroke-chalk stroke-outline"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        data-marking="center-spot"
        cx="100"
        cy="100"
        r="6"
        className="fill-chalk"
      />
    </svg>
  );
}
