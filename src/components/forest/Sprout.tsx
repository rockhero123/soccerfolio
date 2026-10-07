import { leafPath } from "../forest-background/shapes";
import Brow from "./parts/Brow";
import CharacterSvg from "./parts/CharacterSvg";
import { stalkCasing, stalkCore } from "./parts/ink";
import Maw from "./parts/Maw";
import PieEye from "./parts/PieEye";

/** A giddy little plant: a round bud with a face, leaf arms and a leafy top. */
export default function Sprout({ className }: { className?: string }) {
  return (
    <CharacterSvg name="sprout" viewBox="0 0 100 120" className={className}>
      <path d="M12 118C20 102 80 102 88 118Z" className="fill-bark" />
      <path d="M50 106V84" className={stalkCasing} />
      <path d="M50 106V84" className={`stroke-moss ${stalkCore}`} />
      <path
        d={leafPath(22, 12)}
        transform="translate(30 76) rotate(-115)"
        className="fill-forest-mid-leaf"
      />
      <path
        d={leafPath(22, 12)}
        transform="translate(70 76) rotate(115)"
        className="fill-forest-mid-leaf"
      />
      <path
        d={leafPath(40, 24)}
        transform="translate(50 50) rotate(-45)"
        className="fill-moss"
      />
      <path
        d={leafPath(36, 22)}
        transform="translate(50 50) rotate(42)"
        className="fill-moss"
      />
      <ellipse
        cx={50}
        cy={70}
        rx={23}
        ry={20}
        className="fill-forest-mid-light"
      />
      <Brow from={[47, 58]} to={[33, 52]} thick={4} />
      <Brow from={[53, 58]} to={[67, 52]} thick={4} />
      <PieEye cx={42} cy={65} rx={6} ry={8} pupil={0.28} veins />
      <PieEye
        cx={58}
        cy={64}
        rx={6.5}
        ry={8.5}
        pupil={0.25}
        veins
        look={[1, 0]}
      />
      <Maw
        cx={50}
        cy={75}
        width={34}
        curve={-1}
        open={10}
        teeth={[5, 4]}
        fang={6}
        tongue
      />
    </CharacterSvg>
  );
}
