import { leafPath } from "../forest-background/shapes";
import CharacterSvg from "./parts/CharacterSvg";
import Cheek from "./parts/Cheek";
import { detail, stalkCasing, stalkCore } from "./parts/ink";
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
      <PieEye cx={42} cy={66} rx={5} ry={7} look={[-1, 1]} />
      <PieEye cx={58} cy={66} rx={5} ry={7} look={[-1, 1]} />
      <path d="M41 77Q50 90 59 77Z" className={`fill-cartoon-red ${detail}`} />
      <Cheek cx={35} cy={76} r={3.5} />
      <Cheek cx={65} cy={76} r={3.5} />
    </CharacterSvg>
  );
}
