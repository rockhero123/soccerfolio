import CharacterSvg from "./parts/CharacterSvg";
import { detail, noStroke } from "./parts/ink";
import PieEye from "./parts/PieEye";

/** A surprised acorn dangling from the canopy on its stalk. */
export default function Acorn({ className }: { className?: string }) {
  return (
    <CharacterSvg name="acorn" viewBox="0 0 70 108" className={className}>
      <path d="M35 0V20" className={`fill-none ${detail}`} />
      <path
        d="M12 44C12 80 26 104 35 104S58 80 58 44Z"
        className="fill-forest-bark-light"
      />
      <path
        d="M8 46C6 28 20 18 35 18S64 28 62 46C48 53 22 53 8 46Z"
        className="fill-bark"
      />
      <path
        d="M18 30l7 14M30 24l7 22M43 24l6 20M53 30l3 12"
        className={`fill-none ${detail}`}
        strokeOpacity={0.6}
      />
      <PieEye cx={28} cy={64} rx={4.5} ry={6.5} look={[0, -1]} />
      <PieEye cx={42} cy={64} rx={4.5} ry={6.5} look={[0, -1]} />
      <path
        d="M22 54Q28 50 32 54M38 54Q42 50 48 54"
        className={`fill-none ${detail}`}
      />
      <ellipse
        cx={35}
        cy={81}
        rx={4}
        ry={5}
        className={`fill-ink ${noStroke}`}
      />
    </CharacterSvg>
  );
}
