import { leafPath } from "../forest-background/shapes";
import CharacterSvg from "./parts/CharacterSvg";
import { stalkCasing, stalkCore } from "./parts/ink";
import Maw from "./parts/Maw";
import PieEye from "./parts/PieEye";

/** A daisy with eyes: parchment petals around a sunny, smiling face. */
export default function Daisy({ className }: { className?: string }) {
  const stem = "M45 128C41 110 49 94 45 70";
  return (
    <CharacterSvg name="daisy" viewBox="0 0 90 130" className={className}>
      <path d={stem} className={stalkCasing} />
      <path d={stem} className={`stroke-moss ${stalkCore}`} />
      <path
        d={leafPath(30, 16)}
        transform="translate(45 112) rotate(55)"
        className="fill-forest-mid-leaf"
      />
      <path
        d={leafPath(26, 14)}
        transform="translate(45 100) rotate(-60)"
        className="fill-forest-mid-leaf"
      />
      {Array.from({ length: 11 }, (_, i) => (
        <ellipse
          key={i}
          cx={45}
          cy={22}
          rx={8}
          ry={15}
          transform={`rotate(${(i * 360) / 11} 45 44)`}
          className="fill-parchment"
        />
      ))}
      <circle cx={45} cy={44} r={18} className="fill-cartoon-yellow" />
      <PieEye
        cx={38}
        cy={38}
        rx={5.5}
        ry={7}
        pupil={0.3}
        lid={{ angle: 20, drop: 0.3, fill: "fill-cartoon-yellow" }}
      />
      <PieEye
        cx={52}
        cy={38}
        rx={5.5}
        ry={7}
        pupil={0.3}
        lid={{ angle: -20, drop: 0.3, fill: "fill-cartoon-yellow" }}
      />
      <Maw
        cx={45}
        cy={47}
        width={28}
        curve={2}
        open={8}
        teeth={[4, 4]}
        fang={5}
      />
    </CharacterSvg>
  );
}
