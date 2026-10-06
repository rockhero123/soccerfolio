import CharacterSvg from "./parts/CharacterSvg";
import Cheek from "./parts/Cheek";
import { detail } from "./parts/ink";
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
      <PieEye cx={43} cy={79} rx={6} ry={8} look={[1, 1]} />
      <PieEye cx={57} cy={79} rx={6} ry={8} look={[1, 1]} />
      <path d="M41 91Q50 104 59 91Z" className={`fill-cartoon-red ${detail}`} />
      <Cheek cx={36} cy={91} />
      <Cheek cx={64} cy={91} />
    </CharacterSvg>
  );
}
