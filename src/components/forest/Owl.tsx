import Brow from "./parts/Brow";
import CharacterSvg from "./parts/CharacterSvg";
import { detail } from "./parts/ink";
import Maw from "./parts/Maw";
import PieEye from "./parts/PieEye";

/** A stern, wise old owl with ear tufts and enormous ringed eyes. */
export default function Owl({ className }: { className?: string }) {
  return (
    <CharacterSvg name="owl" viewBox="0 0 100 122" className={className}>
      <path d="M22 32L16 4L40 22ZM78 32L84 4L60 22Z" className="fill-bark" />
      <path
        d="M50 14C80 14 90 40 88 70S70 114 50 114 12 100 12 70 20 14 50 14Z"
        className="fill-bark"
      />
      <ellipse
        cx={50}
        cy={84}
        rx={24}
        ry={25}
        className={`fill-forest-bark-light ${detail}`}
      />
      <path
        d="M40 78l4 4 4-4M52 78l4 4 4-4M46 90l4 4 4-4"
        className={`fill-none ${detail}`}
      />
      <circle cx={33} cy={46} r={16} className="fill-cartoon-yellow" />
      <circle cx={67} cy={46} r={16} className="fill-cartoon-yellow" />
      <PieEye
        cx={33}
        cy={47}
        rx={11}
        ry={12}
        pupil={0.22}
        veins
        lid={{ angle: 22, drop: 0.35, fill: "fill-bark" }}
      />
      <PieEye
        cx={67}
        cy={47}
        rx={11}
        ry={12}
        pupil={0.22}
        veins
        lid={{ angle: -22, drop: 0.35, fill: "fill-bark" }}
      />
      <Brow from={[47, 34]} to={[17, 24]} thick={6} />
      <Brow from={[53, 34]} to={[83, 24]} thick={6} />
      <path d="M44 58H56L50 72Z" className="fill-cartoon-yellow" />
      <Maw
        cx={50}
        cy={76}
        width={28}
        curve={3}
        open={5}
        teeth={[4, 0]}
        fang={6}
      />
      <path
        d="M38 112l-4 7M38 112v8M38 112l4 7M62 112l-4 7M62 112v8M62 112l4 7"
        className={`fill-none ${detail}`}
      />
    </CharacterSvg>
  );
}
