import { layerStyles, type ForestDepth } from "./layers";
import { blobPath, seededRandom } from "./shapes";

type FoliageProps = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  depth: ForestDepth;
  seed: number;
  bumps?: number;
};

/** A bumpy, ink-outlined foliage clump with a few curly highlight strokes. */
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
  const rand = seededRandom(seed * 7 + 3);
  const curls = depth === "distant" ? 0 : 3;
  const curlPaths = Array.from({ length: curls }, () => {
    const x = cx + (rand() - 0.5) * rx * 0.9;
    const y = cy + (rand() - 0.4) * ry * 0.8;
    const s = Math.min(rx, ry) * (0.18 + rand() * 0.12);
    return `M${Math.round(x - s)} ${Math.round(y)}q${Math.round(s)} ${Math.round(-s * 0.9)} ${Math.round(s * 2)} 0`;
  });

  return (
    <g>
      <path
        d={blobPath(cx, cy, rx, ry, bumps, seed)}
        className={`${style.leaf} ${style.line}`}
        strokeWidth={style.outline}
        strokeLinejoin="round"
      />
      {curlPaths.length > 0 && (
        <path
          d={curlPaths.join("")}
          className={`fill-none ${style.detail}`}
          strokeWidth={style.outline * 0.7}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}
