import { leafPath } from "../forest-background/shapes";
import CharacterSvg from "./parts/CharacterSvg";
import { stalkCasing, stalkCore } from "./parts/ink";
import Maw from "./parts/Maw";
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
      <PieEye
        cx={32}
        cy={46}
        rx={5.5}
        ry={7}
        pupil={0.3}
        lid={{ angle: 20, drop: 0.35, fill: "fill-cartoon-red" }}
      />
      <PieEye
        cx={48}
        cy={46}
        rx={5.5}
        ry={7}
        pupil={0.3}
        lid={{ angle: -20, drop: 0.35, fill: "fill-cartoon-red" }}
      />
      <Maw
        cx={40}
        cy={54}
        width={28}
        curve={1}
        open={6}
        teeth={[4, 3]}
        fang={5}
      />
    </CharacterSvg>
  );
}
