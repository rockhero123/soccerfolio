import Brow from "./parts/Brow";
import CharacterSvg from "./parts/CharacterSvg";
import { detail } from "./parts/ink";
import Maw from "./parts/Maw";
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
      <Brow from={[32, 49]} to={[20, 54]} thick={3.5} />
      <Brow from={[38, 49]} to={[50, 54]} thick={3.5} />
      <PieEye cx={28} cy={62} rx={6} ry={8} pupil={0.25} veins />
      <PieEye cx={42} cy={62} rx={6} ry={8} pupil={0.25} veins />
      <Maw
        cx={35}
        cy={75}
        width={16}
        curve={-2}
        open={11}
        teeth={[2, 0]}
        fang={4}
      />
    </CharacterSvg>
  );
}
