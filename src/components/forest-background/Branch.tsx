import { layerStyles, type ForestDepth } from "./layers";

type BranchProps = {
  /** Centre line of the branch (an open SVG path). */
  d: string;
  thickness: number;
  depth: ForestDepth;
};

/** A curvy rubber-hose branch: a wide ink stroke under a narrower wood stroke. */
export default function Branch({ d, thickness, depth }: BranchProps) {
  const style = layerStyles[depth];
  return (
    <g className="fill-none" strokeLinecap="round">
      <path
        d={d}
        className={style.line}
        strokeWidth={thickness + style.outline * 2}
      />
      <path d={d} className={style.woodStroke} strokeWidth={thickness} />
    </g>
  );
}
