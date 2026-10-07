import Brow from "./parts/Brow";
import CharacterSvg from "./parts/CharacterSvg";
import { detail, noStroke } from "./parts/ink";
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
      <Brow from={[63, 24]} to={[49, 18]} thick={4} />
      <Brow from={[70, 26]} to={[85, 21]} thick={4} />
      <PieEye cx={57} cy={37} rx={10} ry={12} pupil={0.25} veins />
      <PieEye cx={76} cy={39} rx={9} ry={11} pupil={0.25} veins look={[1, 0]} />
      <path d="M78 46L97 52L78 63Z" className="fill-ink" />
      <ellipse
        cx={86}
        cy={57}
        rx={5}
        ry={3}
        className={`fill-cartoon-red ${noStroke}`}
      />
      <path d="M78 46L99 49L80 53Z" className="fill-cartoon-yellow" />
      <path d="M80 58L96 65L78 63Z" className="fill-cartoon-yellow" />
    </CharacterSvg>
  );
}
