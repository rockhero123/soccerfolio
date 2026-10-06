import CharacterSvg from "./parts/CharacterSvg";
import Cheek from "./parts/Cheek";
import { detail, noStroke } from "./parts/ink";
import PieEye from "./parts/PieEye";

/** A wiggly caterpillar: bouncy moss segments and a beaming yellow head. */
export default function Caterpillar({ className }: { className?: string }) {
  return (
    <CharacterSvg name="caterpillar" viewBox="0 0 132 72" className={className}>
      <path
        d="M14 62v6M32 64v6M50 62v6M68 64v6"
        className={`fill-none ${detail}`}
      />
      {[
        [16, 52, "fill-forest-mid-light"],
        [33, 46, "fill-moss"],
        [51, 52, "fill-forest-mid-light"],
        [69, 46, "fill-moss"],
      ].map(([cx, cy, fill]) => (
        <circle key={cx} cx={cx} cy={cy} r={14} className={String(fill)} />
      ))}
      <path
        d="M88 18Q84 4 77 4M104 18Q110 4 117 6"
        className={`fill-none ${detail}`}
      />
      <circle cx={77} cy={4} r={3} className={`fill-ink ${noStroke}`} />
      <circle cx={117} cy={6} r={3} className={`fill-ink ${noStroke}`} />
      <circle cx={96} cy={38} r={22} className="fill-cartoon-yellow" />
      <PieEye cx={89} cy={34} rx={5} ry={7} look={[1, 0]} />
      <PieEye cx={103} cy={34} rx={5} ry={7} look={[1, 0]} />
      <path d="M85 46Q96 58 107 46Z" className={`fill-cartoon-red ${detail}`} />
      <Cheek cx={82} cy={44} r={3.5} />
      <Cheek cx={110} cy={44} r={3.5} />
    </CharacterSvg>
  );
}
