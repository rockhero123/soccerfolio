import CharacterSvg from "./parts/CharacterSvg";
import Cheek from "./parts/Cheek";
import { detail } from "./parts/ink";
import PieEye from "./parts/PieEye";

/** A grinning frog with bulging eyes and a mouth from cheek to cheek. */
export default function Frog({ className }: { className?: string }) {
  return (
    <CharacterSvg name="frog" viewBox="0 0 110 84" className={className}>
      <circle cx={34} cy={26} r={15} className="fill-moss" />
      <circle cx={76} cy={26} r={15} className="fill-moss" />
      <path d="M8 76C4 50 24 30 55 30S106 50 102 76Z" className="fill-moss" />
      <ellipse cx={30} cy={78} rx={10} ry={4} className="fill-moss" />
      <ellipse cx={80} cy={78} rx={10} ry={4} className="fill-moss" />
      <PieEye cx={34} cy={24} rx={9} ry={10} look={[-1, 1]} />
      <PieEye cx={76} cy={24} rx={9} ry={10} look={[-1, 1]} />
      <path
        d="M24 50Q55 74 86 50Q55 62 24 50Z"
        className={`fill-cartoon-red ${detail}`}
      />
      <Cheek cx={19} cy={52} r={5} />
      <Cheek cx={91} cy={52} r={5} />
    </CharacterSvg>
  );
}
