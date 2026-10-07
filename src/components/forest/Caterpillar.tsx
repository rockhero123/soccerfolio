import Brow from "./parts/Brow";
import CharacterSvg from "./parts/CharacterSvg";
import { detail, noStroke } from "./parts/ink";
import Maw from "./parts/Maw";
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
      <Brow from={[93, 24]} to={[81, 19]} thick={4} />
      <Brow from={[99, 24]} to={[111, 19]} thick={4} />
      <PieEye cx={88} cy={32} rx={6.5} ry={8.5} pupil={0.25} veins />
      <PieEye
        cx={104}
        cy={32}
        rx={6.5}
        ry={8.5}
        pupil={0.25}
        veins
        look={[1, 1]}
      />
      <Maw
        cx={96}
        cy={45}
        width={34}
        curve={0}
        open={10}
        teeth={[5, 4]}
        fang={6}
        tongue
      />
    </CharacterSvg>
  );
}
