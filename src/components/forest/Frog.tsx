import CharacterSvg from "./parts/CharacterSvg";
import Maw from "./parts/Maw";
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
      <PieEye
        cx={34}
        cy={24}
        rx={10}
        ry={11}
        pupil={0.25}
        veins
        look={[-3, 0]}
      />
      <PieEye
        cx={76}
        cy={24}
        rx={10}
        ry={11}
        pupil={0.25}
        veins
        look={[3, 2]}
      />
      <Maw
        cx={55}
        cy={46}
        width={70}
        curve={2}
        open={17}
        teeth={[7, 6]}
        fang={8}
        tongue
      />
    </CharacterSvg>
  );
}
