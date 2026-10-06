import { INK_WEIGHT_OFFSET, layerStyles, type ForestDepth } from "./layers";
import { blobPath } from "./shapes";

type FoliageProps = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  depth: ForestDepth;
  seed: number;
  bumps?: number;
};

/**
 * A bumpy, ink-outlined foliage clump, painted like a 1930s background:
 * a shadowed rim, a lighter body, a soft highlight on top and a hand-inked outline
 * that gets heavier on the shadow side.
 */
export default function Foliage({
  cx,
  cy,
  rx,
  ry,
  depth,
  seed,
  bumps = 9,
}: FoliageProps) {
  const style = layerStyles[depth];
  const outline = blobPath(cx, cy, rx, ry, bumps, seed);
  const body = blobPath(
    cx - rx * 0.04,
    cy - ry * 0.12,
    rx * 0.84,
    ry * 0.8,
    bumps,
    seed,
  );
  const light = blobPath(
    cx - rx * 0.2,
    cy - ry * 0.4,
    rx * 0.36,
    ry * 0.24,
    6,
    seed + 5,
  );

  return (
    <g>
      {style.inkWeight && (
        <path
          d={outline}
          className={style.inkWeight}
          transform={INK_WEIGHT_OFFSET}
        />
      )}
      <path d={outline} className={style.leafShade} />
      <path d={body} className={style.leaf} />
      <path d={light} className={style.leafLight} />
      <path
        d={outline}
        data-ink="outline"
        className={`fill-none ${style.line} ${style.outline}`}
        strokeLinejoin="round"
      />
    </g>
  );
}
