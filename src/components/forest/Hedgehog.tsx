import Brow from "./parts/Brow";
import CharacterSvg from "./parts/CharacterSvg";
import { noStroke } from "./parts/ink";
import Maw from "./parts/Maw";
import PieEye from "./parts/PieEye";

/** A bashful hedgehog peeking out from a back of rubbery spikes. */
export default function Hedgehog({ className }: { className?: string }) {
  return (
    <CharacterSvg name="hedgehog" viewBox="0 0 122 82" className={className}>
      <ellipse
        cx={40}
        cy={76}
        rx={9}
        ry={4}
        className="fill-forest-bark-light"
      />
      <ellipse
        cx={72}
        cy={76}
        rx={9}
        ry={4}
        className="fill-forest-bark-light"
      />
      <path
        d="M14 72L6 58L17 55L12 41L25 43L24 28L37 34L40 19L52 29L60 16L67 29L77 20L80 35L92 32L88 47L98 51L92 62Z"
        className="fill-bark"
      />
      <path
        d="M58 72C58 50 82 40 100 50C109 55 117 60 115 67C111 74 90 76 58 72Z"
        className="fill-forest-bark-light"
      />
      <circle cx={115} cy={65} r={4.5} className={`fill-ink ${noStroke}`} />
      <PieEye
        cx={92}
        cy={55}
        rx={6.5}
        ry={8.5}
        pupil={0.3}
        veins
        lid={{ angle: 25, drop: 0.35, fill: "fill-forest-bark-light" }}
      />
      <Brow from={[97, 46]} to={[83, 41]} thick={4} />
      <Maw
        cx={103}
        cy={65}
        width={24}
        curve={2}
        open={6}
        teeth={[3, 2]}
        fang={5}
      />
    </CharacterSvg>
  );
}
