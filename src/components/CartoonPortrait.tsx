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
 * features — short dark hair, a dark beard joined to the moustache, strong
 * brows and big ears — with a big cartoon head, huge pie-cut eyes and an
 * enormous grin, bursting onto the pitch in a Colombia shirt: a sunburst and
 * speed lines behind him, a waving rubber-hose arm and puffs of smoke because
 * he is that fast.
 *
 * Everything sits inside a circle except the hair, the smoke and the waving
 * glove, which break out over its edge. The portrait is meaningful, so it is
 * exposed as one image with a label.
 */
export default function CartoonPortrait({
  className = "",
}: {
  className?: string;
}) {
  const id = useId().replace(/[^\w-]/g, "");
  const circleClip = `portrait-circle-${id}`;
  const shirtClip = `portrait-shirt-${id}`;
  const mouthClip = `portrait-mouth-${id}`;
  const shirt =
    "M30 262C36 208 76 190 100 184L118 196L136 184C160 190 200 208 206 262Z";
  const mouth = "M82 134Q118 146 154 134Q151 174 118 179Q85 174 82 134Z";

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
        <clipPath id={shirtClip}>
          <path d={shirt} />
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

          {/* Neck and Colombia shirt: yellow, blue and red bands. */}
          <path d="M104 160H132V192H104Z" className="fill-skin-shade" />
          <path
            d={shirt}
            data-portrait-part="shirt"
            className="fill-cartoon-yellow"
          />
          <g
            clipPath={`url(#${shirtClip})`}
            data-portrait-part="flag"
            className="stroke-none"
          >
            <rect
              x="0"
              y="198"
              width="240"
              height="9"
              className="fill-cartoon-blue"
            />
            <rect
              x="0"
              y="207"
              width="240"
              height="60"
              className="fill-cartoon-red"
            />
          </g>
          <path d={shirt} className="fill-none" />
          <path
            d="M100 184L118 199L136 184"
            className="fill-none stroke-cartoon-blue [stroke-width:calc(var(--stroke-width-outline-lg)*1.6)]"
          />
          <path d="M100 184L118 199L136 184" className={detail} />

          {/* Big round cartoon ears. */}
          <ellipse cx="70" cy="110" rx="12" ry="17" className="fill-skin" />
          <ellipse cx="166" cy="110" rx="12" ry="17" className="fill-skin" />
          <path
            d="M72 102Q65 110 72 119M164 102Q171 110 164 119"
            className={detail}
          />

          {/* A big bean-shaped cartoon head. */}
          <path
            d="M118 42C152 42 168 70 168 104C168 142 147 170 118 172C89 170 68 142 68 104C68 70 84 42 118 42Z"
            className="fill-skin"
          />
          {/* His dark beard, wrapping the jaw under the grin. */}
          <path
            data-portrait-part="beard"
            d="M70 116C72 154 92 186 118 188C144 186 164 154 166 116C162 136 157 148 152 154C147 176 133 184 118 184C103 184 89 176 84 154C79 148 74 136 70 116Z"
            className={beardFill}
          />
          <Cheek cx={86} cy={128} r={7} />
          <Cheek cx={150} cy={128} r={7} />

          {/* An enormous grin: a row of teeth and a red tongue. */}
          <path data-portrait-part="grin" d={mouth} className="fill-ink" />
          <g clipPath={`url(#${mouthClip})`}>
            <path
              data-portrait-part="teeth"
              d="M80 128H156V148Q118 156 80 148Z"
              className="fill-parchment stroke-none"
            />
            <path
              d="M95 134V151M106 137V153M118 138V154M130 137V153M141 134V151"
              className={detail}
            />
            <ellipse
              data-portrait-part="tongue"
              cx="118"
              cy="171"
              rx="20"
              ry="10"
              className="fill-cartoon-red stroke-outline"
            />
          </g>
          <path d={mouth} className="fill-none" />
          {/* His moustache, sitting on the grin. */}
          <path
            data-portrait-part="moustache"
            d="M86 133Q102 121 118 128Q134 121 150 133Q134 130 118 135Q102 130 86 133Z"
            className={beardFill}
          />

          {/* A round cartoon nose. */}
          <ellipse
            cx="118"
            cy="120"
            rx="10"
            ry="8"
            className="fill-skin-shade"
          />
          <ellipse
            cx="114"
            cy="117"
            rx="3"
            ry="2"
            className="fill-parchment stroke-none"
          />

          {/* Huge, tall pie-cut eyes and brows raised high with excitement. */}
          <PieEye cx={102} cy={96} rx={12} ry={17} pupil={0.55} look={[2, 3]} />
          <PieEye cx={134} cy={96} rx={12} ry={17} pupil={0.55} look={[2, 3]} />
          <Brow from={[109, 71]} to={[89, 75]} thick={6} />
          <Brow from={[127, 71]} to={[147, 75]} thick={6} />
        </g>

        <circle
          cx={cx}
          cy={cy}
          r={r}
          data-portrait-part="frame"
          className="fill-none"
        />

        {/* Short dark hair with a cowlick, breaking out over the top of the circle. */}
        <path
          data-portrait-part="hair"
          d="M70 90C66 60 88 32 118 30C148 32 170 60 166 90C162 77 154 68 142 63C130 58 106 58 94 63C82 68 74 77 70 90ZM112 32Q106 16 120 10Q116 21 128 22Q122 27 125 33Z"
          className="fill-ink"
        />
        <path
          d="M98 43Q118 36 138 43M86 53Q118 44 150 53"
          className="fill-none stroke-parchment [stroke-width:calc(var(--stroke-width-outline)*0.6)]"
          strokeOpacity={0.35}
        />
        {/* Excitement marks popping around his head. */}
        <path
          data-portrait-part="excitement"
          d="M52 46L40 36M46 60L32 58M56 32L52 18M184 46L196 36M190 60L204 58M180 32L184 18"
          className="fill-none stroke-ink stroke-outline-lg"
        />

        {/* A rubber-hose arm waving a white cartoon glove out of the circle. */}
        <g data-portrait-part="glove">
          <path
            d="M176 206C204 196 214 172 208 148"
            className="fill-none stroke-ink [stroke-width:calc(var(--stroke-width-outline-lg)*2.6)]"
          />
          <ellipse
            cx="208"
            cy="146"
            rx="11"
            ry="6"
            className="fill-parchment"
          />
          <path
            d="M197 142C192 126 198 110 208 110C214 102 226 108 223 118C230 121 229 136 219 141Z"
            className="fill-parchment"
          />
          <path d="M206 118V130M213 116V128" className={detail} />
        </g>

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
