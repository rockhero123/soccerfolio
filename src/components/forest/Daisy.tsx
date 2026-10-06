import { leafPath } from "../forest-background/shapes";
import CharacterSvg from "./parts/CharacterSvg";
import Cheek from "./parts/Cheek";
import { detail, stalkCasing, stalkCore } from "./parts/ink";
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
      <PieEye cx={38} cy={41} rx={4.5} ry={6.5} look={[0, 1]} />
      <PieEye cx={52} cy={41} rx={4.5} ry={6.5} look={[0, 1]} />
      <path d="M37 51Q45 60 53 51" className={`fill-none ${detail}`} />
      <Cheek cx={33} cy={50} r={3} />
      <Cheek cx={57} cy={50} r={3} />
    </CharacterSvg>
  );
}
