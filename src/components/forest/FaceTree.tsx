import { blobPath, leafPath, trunkPath } from "../forest-background/shapes";
import Brow from "./parts/Brow";
import CharacterSvg from "./parts/CharacterSvg";
import { noStroke, stalkCasing, stalkCore } from "./parts/ink";
import Maw from "./parts/Maw";
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
      <PieEye
        cx={54}
        cy={110}
        rx={9}
        ry={12}
        pupil={0.25}
        veins
        lid={{ angle: 20, drop: 0.3, fill: "fill-bark" }}
      />
      <PieEye
        cx={78}
        cy={110}
        rx={9}
        ry={12}
        pupil={0.25}
        veins
        lid={{ angle: -20, drop: 0.3, fill: "fill-bark" }}
      />
      <Brow from={[63, 97]} to={[39, 88]} thick={7} />
      <Brow from={[69, 97]} to={[93, 88]} thick={7} />
      <Maw
        cx={66}
        cy={133}
        width={44}
        curve={-3}
        open={14}
        teeth={[5, 5]}
        fang={9}
        tongue
      />
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
