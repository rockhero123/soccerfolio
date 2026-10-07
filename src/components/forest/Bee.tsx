import { useId } from "react";
import Brow from "./parts/Brow";
import CharacterSvg from "./parts/CharacterSvg";
import { detail, noStroke } from "./parts/ink";
import Maw from "./parts/Maw";
import PieEye from "./parts/PieEye";

/** A plump, buzzing bee with striped fuzz and see-through wings. */
export default function Bee({ className }: { className?: string }) {
  const clipId = `bee-body-${useId().replace(/[^\w-]/g, "")}`;
  const body = { cx: 52, cy: 50, rx: 32, ry: 22 };
  return (
    <CharacterSvg name="bee" viewBox="0 0 100 80" className={className}>
      <defs>
        <clipPath id={clipId}>
          <ellipse {...body} />
        </clipPath>
      </defs>
      <ellipse
        cx={42}
        cy={22}
        rx={13}
        ry={18}
        transform="rotate(-20 42 22)"
        className={`fill-parchment ${detail}`}
        fillOpacity={0.85}
      />
      <ellipse
        cx={60}
        cy={20}
        rx={12}
        ry={17}
        transform="rotate(20 60 20)"
        className={`fill-parchment ${detail}`}
        fillOpacity={0.85}
      />
      <path d="M21 50L8 54L21 58Z" className="fill-ink" />
      <ellipse {...body} className="fill-cartoon-yellow" />
      <g clipPath={`url(#${clipId})`} className={noStroke}>
        <path d="M34 20Q29 50 34 80H44Q39 50 44 20Z" className="fill-ink" />
        <path d="M52 20Q47 50 52 80H61Q56 50 61 20Z" className="fill-ink" />
      </g>
      <ellipse {...body} className="fill-none" />
      <path
        d="M74 30Q73 16 79 11M83 32Q87 20 93 18"
        className={`fill-none ${detail}`}
      />
      <circle cx={79} cy={11} r={2.5} className={`fill-ink ${noStroke}`} />
      <circle cx={93} cy={18} r={2.5} className={`fill-ink ${noStroke}`} />
      <Brow from={[77, 33]} to={[65, 29]} thick={3.5} />
      <Brow from={[82, 35]} to={[93, 31]} thick={3.5} />
      <PieEye
        cx={72}
        cy={43}
        rx={6.5}
        ry={8.5}
        pupil={0.3}
        lid={{ angle: 20, drop: 0.35, fill: "fill-cartoon-yellow" }}
      />
      <PieEye
        cx={85}
        cy={45}
        rx={6}
        ry={8}
        pupil={0.3}
        lid={{ angle: -20, drop: 0.35, fill: "fill-cartoon-yellow" }}
      />
      <Maw
        cx={79}
        cy={56}
        width={20}
        curve={0}
        open={5}
        teeth={[3, 3]}
        fang={4.5}
      />
    </CharacterSvg>
  );
}
