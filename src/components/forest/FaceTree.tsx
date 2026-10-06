import { blobPath, leafPath, trunkPath } from "../forest-background/shapes";
import CharacterSvg from "./parts/CharacterSvg";
import Cheek from "./parts/Cheek";
import { detail, noStroke, stalkCasing, stalkCore } from "./parts/ink";
import PieEye from "./parts/PieEye";

/** A jolly old tree with a face, bushy brows and rubber-hose branch arms. */
export default function FaceTree({ className }: { className?: string }) {
  const arms = "M44 122C30 114 22 102 16 88M86 126C100 122 110 132 118 120";
  return (
    <CharacterSvg name="face-tree" viewBox="0 0 132 212" className={className}>
      <path
        d="M24 210C38 202 42 190 44 176H88C90 190 94 202 108 210Z"
        className="fill-bark"
      />
      <path d={trunkPath(66, 64, 196, 46, 6)} className="fill-bark" />
      <path d={arms} className={stalkCasing} />
      <path d={arms} className={`stroke-bark ${stalkCore}`} />
      <path
        d={leafPath(18, 11)}
        transform="translate(16 88) rotate(-20)"
        className="fill-moss"
      />
      <path
        d={leafPath(16, 10)}
        transform="translate(118 120) rotate(40)"
        className="fill-moss"
      />
      <path
        d={blobPath(66, 46, 60, 42, 9, 17)}
        className="fill-forest-mid-leaf"
      />
      <path
        d={blobPath(58, 38, 40, 26, 7, 23)}
        className={`fill-moss ${noStroke}`}
      />
      <PieEye cx={54} cy={112} rx={8} ry={11} look={[1, 1]} />
      <PieEye cx={78} cy={112} rx={8} ry={11} look={[1, 1]} />
      <path d="M42 96Q54 88 64 98M68 98Q78 88 90 96" className="fill-none" />
      <path d="M48 136Q66 160 84 136Q66 146 48 136Z" className="fill-ink" />
      <rect
        x={61}
        y={139}
        width={8}
        height={7}
        className={`fill-parchment ${detail}`}
      />
      <Cheek cx={42} cy={130} r={5} />
      <Cheek cx={90} cy={130} r={5} />
      <ellipse
        cx={82}
        cy={172}
        rx={5}
        ry={8}
        className={`fill-ink ${noStroke}`}
      />
    </CharacterSvg>
  );
}
