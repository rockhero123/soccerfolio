import CharacterSvg from "./parts/CharacterSvg";
import { detail } from "./parts/ink";
import Maw from "./parts/Maw";
import PieEye from "./parts/PieEye";

/** A slow, smiling snail with a swirly shell and eyes on wobbly stalks. */
export default function Snail({ className }: { className?: string }) {
  return (
    <CharacterSvg name="snail" viewBox="0 0 124 92" className={className}>
      <path
        d="M98 42Q96 26 94 18M106 42Q110 28 116 20"
        className={`fill-none ${detail}`}
      />
      <path
        d="M6 88Q8 76 30 74H90Q98 62 96 40Q104 34 110 40Q114 68 104 82Q100 88 90 88Z"
        className="fill-forest-mid-light"
      />
      <circle cx={50} cy={50} r={30} className="fill-forest-bark-light" />
      <path
        d="M50 50m0-6a6 6 0 1 1-6 6a12 12 0 1 1 12 12a18 18 0 1 1-18-18a24 24 0 1 1 24 24"
        className={`fill-none ${detail}`}
      />
      <PieEye cx={93} cy={14} rx={8} ry={9.5} pupil={0.25} veins />
      <PieEye
        cx={117}
        cy={16}
        rx={6}
        ry={7.5}
        pupil={0.3}
        veins
        look={[1, 1]}
      />
      <Maw
        cx={101}
        cy={59}
        width={22}
        curve={1}
        open={7}
        teeth={[3, 2]}
        fang={5}
        tongue
      />
    </CharacterSvg>
  );
}
