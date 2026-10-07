import Brow from "./parts/Brow";
import CharacterSvg from "./parts/CharacterSvg";
import { detail } from "./parts/ink";
import Maw from "./parts/Maw";
import PieEye from "./parts/PieEye";

/** A cheerful toadstool with a spotted red cap and a big open smile. */
export default function Mushroom({ className }: { className?: string }) {
  return (
    <CharacterSvg name="mushroom" viewBox="0 0 100 110" className={className}>
      <path
        d="M32 108C30 90 34 72 38 62H62C66 72 70 90 68 108Z"
        className="fill-parchment"
      />
      <path
        d="M8 64C8 30 30 10 50 10S92 30 92 64C78 71 22 71 8 64Z"
        className="fill-cartoon-red"
      />
      {[
        [30, 36, 7],
        [55, 23, 6],
        [72, 46, 8],
        [47, 50, 5],
      ].map(([cx, cy, r]) => (
        <circle
          key={cx}
          cx={cx}
          cy={cy}
          r={r}
          className={`fill-parchment ${detail}`}
        />
      ))}
      <Brow from={[47, 66]} to={[33, 62]} thick={4} />
      <Brow from={[53, 64]} to={[65, 58]} thick={4} />
      <PieEye cx={42} cy={77} rx={7} ry={9} pupil={0.3} veins />
      <PieEye
        cx={58}
        cy={75}
        rx={5}
        ry={6.5}
        pupil={0.35}
        veins
        look={[1, 1]}
      />
      <Maw
        cx={50}
        cy={89}
        width={30}
        curve={-2}
        open={10}
        teeth={[4, 3]}
        fang={6}
        tongue
      />
    </CharacterSvg>
  );
}
