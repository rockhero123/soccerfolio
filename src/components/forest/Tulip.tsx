import { leafPath } from "../forest-background/shapes";
import CharacterSvg from "./parts/CharacterSvg";
import Cheek from "./parts/Cheek";
import { detail, stalkCasing, stalkCore } from "./parts/ink";
import PieEye from "./parts/PieEye";

/** A shy red tulip peeking over its petals. */
export default function Tulip({ className }: { className?: string }) {
  const stem = "M40 128C37 106 43 84 40 62";
  return (
    <CharacterSvg name="tulip" viewBox="0 0 80 130" className={className}>
      <path d={stem} className={stalkCasing} />
      <path d={stem} className={`stroke-moss ${stalkCore}`} />
      <path
        d={leafPath(46, 18)}
        transform="translate(40 126) rotate(-28)"
        className="fill-forest-mid-leaf"
      />
      <path
        d={leafPath(40, 16)}
        transform="translate(40 120) rotate(34)"
        className="fill-forest-mid-leaf"
      />
      <path
        d="M16 30L26 44L32 26L40 40L48 26L54 44L64 30C68 52 60 66 40 66S12 52 16 30Z"
        className="fill-cartoon-red"
      />
      <PieEye cx={32} cy={49} rx={4.5} ry={6} look={[1, -1]} />
      <PieEye cx={48} cy={49} rx={4.5} ry={6} look={[1, -1]} />
      <path d="M34 58Q40 62 46 58" className={`fill-none ${detail}`} />
      <Cheek cx={26} cy={57} r={3} />
      <Cheek cx={54} cy={57} r={3} />
    </CharacterSvg>
  );
}
