import CharacterSvg from "./parts/CharacterSvg";
import { detail, noStroke } from "./parts/ink";
import PieEye from "./parts/PieEye";

/** A tiny, polka-dotted ladybug with a big grin on her black head. */
export default function Ladybug({ className }: { className?: string }) {
  return (
    <CharacterSvg name="ladybug" viewBox="0 0 96 72" className={className}>
      <path
        d="M28 60l-6 9M42 63v8M56 60l6 9"
        className={`fill-none ${detail}`}
      />
      <path
        d="M72 30Q70 20 64 17M82 30Q88 20 93 22"
        className={`fill-none ${detail}`}
      />
      <circle cx={77} cy={44} r={15} className="fill-ink" />
      <ellipse cx={42} cy={44} rx={32} ry={22} className="fill-cartoon-red" />
      <path d="M42 22V66" className={`fill-none ${detail}`} />
      {[
        [28, 36, 5],
        [29, 54, 4],
        [56, 35, 5],
        [55, 54, 4],
      ].map(([cx, cy, r]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={r}
          className={`fill-ink ${noStroke}`}
        />
      ))}
      <PieEye cx={75} cy={40} rx={5} ry={6.5} look={[1, 0]} />
      <PieEye cx={86} cy={41} rx={4.5} ry={6} look={[1, 0]} />
      <path
        d="M73 51Q80 57 88 50"
        className={`fill-none stroke-parchment ${detail}`}
      />
    </CharacterSvg>
  );
}
