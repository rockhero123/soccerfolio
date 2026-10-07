import { leafPath } from "../forest-background/shapes";
import CharacterSvg from "./parts/CharacterSvg";
import { detail } from "./parts/ink";
import Maw from "./parts/Maw";
import PieEye from "./parts/PieEye";

/** A sleepy-eyed pinecone in a coat of scales, with a leafy top. */
export default function Pinecone({ className }: { className?: string }) {
  const scales = [72, 82, 92]
    .map((y, i) => {
      const inset = i * 4;
      return `M${16 + inset} ${y}q${9 - inset / 3} 7 ${19 - inset} 0q${9 - inset / 3} 7 ${19 - inset} 0`;
    })
    .join("");
  return (
    <CharacterSvg name="pinecone" viewBox="0 0 70 108" className={className}>
      <path
        d={leafPath(20, 11)}
        transform="translate(35 24) rotate(-35)"
        className="fill-forest-mid-leaf"
      />
      <path
        d={leafPath(18, 10)}
        transform="translate(35 24) rotate(35)"
        className="fill-forest-mid-leaf"
      />
      <path
        d="M35 104C14 92 8 60 14 38C20 20 50 20 56 38C62 60 56 92 35 104Z"
        className="fill-bark"
      />
      <path d={scales} className={`fill-none ${detail}`} />
      <PieEye
        cx={28}
        cy={50}
        rx={6}
        ry={7}
        pupil={0.3}
        lid={{ angle: 15, drop: 0.45, fill: "fill-bark" }}
      />
      <PieEye
        cx={42}
        cy={50}
        rx={6}
        ry={7}
        pupil={0.3}
        lid={{ angle: -15, drop: 0.45, fill: "fill-bark" }}
      />
      <Maw
        cx={35}
        cy={61}
        width={28}
        curve={3}
        open={5}
        teeth={[4, 0]}
        fang={5}
      />
    </CharacterSvg>
  );
}
