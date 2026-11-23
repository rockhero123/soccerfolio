/**
 * The coach's chalk drawings on the tactics board (spec 004 US-2), as chunky,
 * un-smoothed pixel strokes: dashed zone
 * circles, curved runs and straight passes with arrowheads, and "X" marks for
 * the opponents — like a trainer's pitch board. Decorative.
 *
 * Drawn in a 100 × 100 box stretched over the board, matching where the lines
 * stand: forwards ≈ 14 %, midfielders ≈ 38 %, defenders ≈ 62 %, goalkeeper ≈
 * 86 % from the top; thirds and quarters across. Strokes keep their width.
 */
const chalk = "fill-none stroke-chalk";
// Square-capped, pixel-wide chalk dashes, drawn without anti-aliasing so they
// read as chunky pixel strokes on the slate.
const run = `${chalk} [stroke-width:var(--px)] [stroke-dasharray:calc(var(--px)*2)_calc(var(--px)*2)]`;
const pass = `${chalk} [stroke-width:var(--px)] [stroke-dasharray:var(--px)_calc(var(--px)*2)]`;
const head = `${chalk} [stroke-width:var(--px)]`;

export default function BoardStrategy() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      data-board="strategy"
      className="pointer-events-none absolute inset-0 size-full opacity-60"
      shapeRendering="crispEdges"
      strokeLinecap="butt"
      strokeLinejoin="miter"
    >
      {/* Zones: the midfield trio and the attacking box. */}
      <g data-strategy="zone">
        <ellipse
          cx="50"
          cy="38"
          rx="44"
          ry="13"
          className={run}
          vectorEffect="non-scaling-stroke"
        />
        <ellipse
          cx="50"
          cy="12"
          rx="22"
          ry="8"
          className={run}
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* Runs: overlapping full-back up the right wing, winger cutting inside. */}
      <g data-strategy="run">
        <path
          d="M89 58C97 46 97 32 92 22"
          className={run}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M92 22L88.5 25.5M92 22L94 26.5"
          className={head}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M80 34C74 24 66 16 60 9"
          className={run}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M60 9L60.5 13.5M60 9L64 10.5"
          className={head}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M11 58C4 46 5 32 10 22"
          className={run}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M10 22L7.5 26.5M10 22L13.5 25"
          className={head}
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* Passes: goalkeeper to the back line, through the middle to the striker. */}
      <g data-strategy="pass">
        <path
          d="M50 82L38 66"
          className={pass}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M38 66L38.5 70.5M38 66L42 67.5"
          className={head}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M36 58L48 42"
          className={pass}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M48 42L44 43.5M48 42L48 46.5"
          className={head}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M52 34L50 19"
          className={pass}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M50 19L48 22.5M50 19L52.5 22"
          className={head}
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* Opponents marked with chalk crosses. */}
      <path
        data-strategy="opponents"
        d="M29 24l4 3M33 24l-4 3M67 24l4 3M71 24l-4 3M24 49l4 3M28 49l-4 3M72 49l4 3M76 49l-4 3M48 73l4 3M52 73l-4 3"
        className={`${chalk} [stroke-width:2.5px]`}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
