import CharacterSvg from "./parts/CharacterSvg";
import { detail } from "./parts/ink";
import PieEye from "./parts/PieEye";

/** A round little songbird with huge pie-cut eyes and a chirpy beak. */
export default function Bird({ className }: { className?: string }) {
  return (
    <CharacterSvg name="bird" viewBox="0 0 100 92" className={className}>
      <path d="M20 50L3 36L7 55L0 66L22 60Z" className="fill-cartoon-red" />
      <path d="M44 80L42 90M58 80L60 90" className={`fill-none ${detail}`} />
      <ellipse cx={50} cy={52} rx={34} ry={30} className="fill-cartoon-red" />
      <ellipse
        cx={57}
        cy={63}
        rx={20}
        ry={15}
        className={`fill-parchment ${detail}`}
      />
      <path
        d="M28 50C32 36 52 40 50 57C44 63 30 61 28 50Z"
        className="fill-bark"
      />
      <path d="M48 24Q51 12 59 18" className={`fill-none ${detail}`} />
      <PieEye cx={57} cy={38} rx={9} ry={11} look={[2, 1]} />
      <PieEye cx={75} cy={40} rx={8} ry={10} look={[2, 1]} />
      <path d="M79 50L97 55L79 61Z" className="fill-cartoon-yellow" />
    </CharacterSvg>
  );
}
