import { useId } from "react";
import { hero } from "@/content/hero";
import Brow from "./forest/parts/Brow";
import Cheek from "./forest/parts/Cheek";
import PieEye from "./forest/parts/PieEye";

/** The circle the portrait is clipped to, in the 240 × 240 drawing. */
export const PORTRAIT_CIRCLE = { cx: 120, cy: 132, r: 84 } as const;

const { cx, cy, r } = PORTRAIT_CIRCLE;
const detail = "fill-none stroke-ink stroke-outline";
const beardFill = "fill-forest-bark-shade";

/** Sunburst rays behind him: twelve wedges around the circle's centre. */
const RAYS = Array.from({ length: 12 }, (_, i) => {
  const a0 = ((i * 30 - 7) * Math.PI) / 180;
  const a1 = ((i * 30 + 7) * Math.PI) / 180;
  const p = (a: number) =>
    `${Math.round(cx + 140 * Math.cos(a))} ${Math.round(cy + 140 * Math.sin(a))}`;
  return `M${cx} ${cy}L${p(a0)}L${p(a1)}Z`;
}).join("");

/** Smoke puffs [x, y, radius] bursting out of the bottom of the circle. */
const SMOKE: [number, number, number][] = [
  [40, 214, 15],
  [60, 224, 12],
  [24, 226, 10],
  [50, 198, 9],
  [16, 196, 6],
  [8, 182, 4],
  [200, 214, 14],
  [218, 204, 9],
  [184, 228, 11],
  [226, 222, 7],
];

/**
 * The hero's cartoon portrait of Ricardo (spec 002 US-1): an original, static,
 * hand-coded SVG in the Cuphead / 1930s rubber-hose style. He keeps his own
 * features — short dark hair, a moustache and a partial beard along the jaw,
 * strong brows and big ears — with a big cartoon head, huge pie-cut eyes and a
 * roguish, toothy smirk, in the yellow Colombia shirt. A sunburst, speed lines,
 * excitement marks and puffs of smoke show he is fast.
 *
 * Everything sits inside a circle except the hair, the excitement marks and
 * the smoke, which break out over its edge. The portrait is meaningful, so it
 * is exposed as one image with a label.
 */
export default function CartoonPortrait({
  className = "",
}: {
  className?: string;
}) {
  const id = useId().replace(/[^\w-]/g, "");
  const circleClip = `portrait-circle-${id}`;
  const mouthClip = `portrait-mouth-${id}`;
  // His yellow shirt with a round crew-neck collar.
  const shirt =
    "M24 262C30 214 64 196 96 190Q118 208 140 190C172 196 206 214 212 262Z";
  // A closed, cocky smirk full of clenched teeth: the right corner pulled up.
  const mouth = "M96 139Q120 142 148 123Q146 151 122 155Q100 155 96 139Z";

  return (
    <svg
      viewBox="0 0 240 240"
      role="img"
      aria-label={hero.portrait.label}
      data-portrait=""
      className={`block h-auto overflow-visible ${className}`}
      focusable="false"
    >
      <defs>
        <clipPath id={circleClip}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <clipPath id={mouthClip}>
          <path d={mouth} />
        </clipPath>
      </defs>

      <g
        className="stroke-ink stroke-outline-lg"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* An epic sunburst on the pitch behind him. */}
        <circle cx={cx} cy={cy} r={r} className="fill-pitch stroke-none" />
        <g clipPath={`url(#${circleClip})`}>
          <path
            data-portrait-part="sunburst"
            d={RAYS}
            className="fill-chalk stroke-none"
            fillOpacity={0.2}
          />
          {/* Speed lines: he just sprinted in from the left. */}
          <path
            data-portrait-part="speed-lines"
            d="M38 92H74M34 114H66M40 156H76M46 178H84"
            className="fill-none stroke-parchment [stroke-width:calc(var(--stroke-width-outline)*1.3)]"
          />

          {/* Neck and his yellow Colombia shirt. */}
          <path d="M104 166V200H132V166Z" className="fill-skin-shade" />
          <path
            d={shirt}
            data-portrait-part="shirt"
            className="fill-cartoon-yellow"
          />
          <path
            data-portrait-part="collar"
            d="M100 194Q118 210 136 194"
            className={detail}
          />

          <g>
            {/* Big round cartoon ears. */}
            <ellipse cx="70" cy="110" rx="12" ry="17" className="fill-skin" />
            <ellipse cx="166" cy="110" rx="12" ry="17" className="fill-skin" />
            <path
              d="M72 102Q65 110 72 119M164 102Q171 110 164 119"
              className={detail}
            />

            {/* A big bean-shaped cartoon head, with a strong chin. */}
            <path
              d="M118 42C152 42 168 70 168 104C168 146 146 182 118 184C90 182 68 146 68 104C68 70 84 42 118 42Z"
              className="fill-skin stroke-none"
            />
            {/* A partial beard: sideburns and a strap along the jaw down to the chin,
                with skin between it and the moustache. */}
            <path
              data-portrait-part="beard"
              d="M68 104C68 146 90 182 118 184C146 182 168 146 168 104L163 104C163 140 149 163 128 166Q118 168 108 166C87 163 73 140 73 104Z"
              className={beardFill}
            />
            {/* The head outline, drawn once over the beard so it never breaks. */}
            <path
              data-portrait-part="head"
              d="M118 42C152 42 168 70 168 104C168 146 146 182 118 184C90 182 68 146 68 104C68 70 84 42 118 42Z"
              className="fill-none"
            />
            <Cheek cx={84} cy={122} r={7} />
            <Cheek cx={152} cy={122} r={7} />

            {/* A rude little smirk: two rows of clenched teeth. */}
            <path
              data-portrait-part="grin"
              d={mouth}
              className="fill-parchment"
            />
            <g clipPath={`url(#${mouthClip})`}>
              <path
                data-portrait-part="teeth"
                d="M96 146Q121 148 148 135M106 139V155M117 140V156M128 138V156M139 131V154"
                className={detail}
              />
            </g>
            <path d={mouth} className="fill-none" />
            {/* The smirk's crease at the raised corner. */}
            <path
              data-portrait-part="smirk"
              d="M147 119Q155 119 157 127"
              className={detail}
            />
            {/* His moustache, its tips drooping down past the corners of the smirk. */}
            <path
              data-portrait-part="moustache"
              d="M88 152C85 141 91 130 104 128C112 127 116 128 120 127C130 121 142 116 149 118C156 121 155 133 150 146C148 137 145 130 140 129C134 129 126 134 120 136C110 138 100 136 95 140C91 143 89 148 88 152Z"
              className={beardFill}
            />

            {/* A round cartoon nose. */}
            <ellipse
              cx="118"
              cy="117"
              rx="10"
              ry="8"
              className="fill-skin-shade"
            />
            <ellipse
              cx="114"
              cy="114"
              rx="3"
              ry="2"
              className="fill-parchment stroke-none"
            />

            {/* Huge pie-cut eyes looking straight at you, lids lowered a touch: sly. */}
            <PieEye
              cx={102}
              cy={93}
              rx={12}
              ry={17}
              pupil={0.55}
              look={[1, 1]}
              lid={{ angle: 6, drop: 0.18, fill: "fill-skin" }}
            />
            <PieEye
              cx={134}
              cy={93}
              rx={12}
              ry={17}
              pupil={0.55}
              look={[-1, 1]}
              lid={{ angle: -6, drop: 0.18, fill: "fill-skin" }}
            />
            {/* The left brow is the right one mirrored, so both match exactly. */}
            <g transform="translate(236 0) scale(-1 1)">
              <Brow from={[125, 73]} to={[153, 63]} thick={9} />
            </g>
            <Brow from={[125, 73]} to={[153, 63]} thick={9} />
          </g>
        </g>

        <circle
          cx={cx}
          cy={cy}
          r={r}
          data-portrait-part="frame"
          className="fill-none"
        />

        {/* Short buzz-cut hair hugging his head, poking out over the top of the circle. */}
        <g>
          <path
            data-portrait-part="hair"
            d="M74 72C72 52 92 37 118 36C144 37 164 52 162 72C156 62 146 57 134 55C124 53 112 53 102 55C90 57 80 62 74 72Z"
            className="fill-ink"
          />
          <path
            d="M98 44Q118 39 138 44"
            className="fill-none stroke-parchment [stroke-width:calc(var(--stroke-width-outline)*0.6)]"
            strokeOpacity={0.35}
          />
        </g>
        {/* Excitement marks popping around his head. */}
        <path
          data-portrait-part="excitement"
          d="M52 46L40 36M46 60L32 58M56 32L52 18M184 46L196 36M190 60L204 58M180 32L184 18"
          className="fill-none stroke-ink stroke-outline-lg"
        />

        {/* Puffs of smoke: he is that fast. Outlines first, then fills, so each
            cluster reads as one cloud. */}
        <g data-portrait-part="smoke">
          {SMOKE.map(([x, y, size]) => (
            <circle
              key={`o-${x}-${y}`}
              cx={x}
              cy={y}
              r={size}
              className="fill-parchment [stroke-width:calc(var(--stroke-width-outline-lg)*2)]"
            />
          ))}
          {SMOKE.map(([x, y, size]) => (
            <circle
              key={`f-${x}-${y}`}
              cx={x}
              cy={y}
              r={size}
              className="fill-parchment stroke-none"
            />
          ))}
          <path
            d="M70 236Q86 230 96 238M150 238Q160 230 176 236"
            className={detail}
          />
        </g>
      </g>
    </svg>
  );
}
