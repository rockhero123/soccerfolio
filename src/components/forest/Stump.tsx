import { leafPath } from "../forest-background/shapes";
import Brow from "./parts/Brow";
import CharacterSvg from "./parts/CharacterSvg";
import { detail, stalkCasing, stalkCore } from "./parts/ink";
import Maw from "./parts/Maw";
import PieEye from "./parts/PieEye";

/** A grumpy old tree stump with growth rings and one stubborn sprout. */
export default function Stump({ className }: { className?: string }) {
  const sprout = "M88 38Q90 28 94 18";
  return (
    <CharacterSvg name="stump" viewBox="0 0 120 100" className={className}>
      <path d={sprout} className={stalkCasing} />
      <path d={sprout} className={`stroke-moss ${stalkCore}`} />
      <path
        d={leafPath(18, 11)}
        transform="translate(94 18) rotate(35)"
        className="fill-moss"
      />
      <path
        d="M4 96C14 88 18 74 20 40H100C102 74 106 88 116 96Z"
        className="fill-bark"
      />
      <ellipse
        cx={60}
        cy={40}
        rx={40}
        ry={12}
        className="fill-forest-bark-light"
      />
      <ellipse
        cx={60}
        cy={40}
        rx={26}
        ry={7}
        className={`fill-none ${detail}`}
      />
      <ellipse
        cx={60}
        cy={40}
        rx={11}
        ry={3}
        className={`fill-none ${detail}`}
      />
      <path
        d="M28 56q4 16 0 30M93 56q-4 16 0 28"
        className={`fill-none ${detail}`}
        strokeOpacity={0.6}
      />
      <PieEye
        cx={47}
        cy={62}
        rx={7}
        ry={9}
        pupil={0.3}
        veins
        lid={{ angle: 25, drop: 0.35, fill: "fill-bark" }}
      />
      <PieEye
        cx={73}
        cy={62}
        rx={7}
        ry={9}
        pupil={0.3}
        veins
        lid={{ angle: -25, drop: 0.35, fill: "fill-bark" }}
      />
      <Brow from={[56, 52]} to={[36, 45]} thick={6} />
      <Brow from={[64, 52]} to={[84, 45]} thick={6} />
      <Maw
        cx={60}
        cy={77}
        width={34}
        curve={-4}
        open={11}
        teeth={[4, 4]}
        fang={7}
        tongue
      />
    </CharacterSvg>
  );
}
