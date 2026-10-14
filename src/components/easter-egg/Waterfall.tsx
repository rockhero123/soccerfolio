import type { CSSProperties } from "react";
import { blobPath, leafPath } from "../forest-background/shapes";
import FallenLeaf from "../soccer-field/debris/FallenLeaf";
import Twig from "../soccer-field/debris/Twig";

/**
 * The scene is one 1000 × 320 drawing, layered from back to front so every
 * part overlaps the next: misty jungle → stacked rock cliffs → a wide cascade of
 * three tiers, with terrace pools running sideways between them → the pool →
 * leaves in the rock cracks, and leaves and sticks floating on the water. It is cropped to fill the space (`slice`), so on
 * narrow screens the falls stay centred and the side plants are trimmed.
 */

/** Mossy boulders per tier: [cx, cy, rx, ry, seed]. */
const ROCKS: Record<
  "back" | "mid" | "front",
  [number, number, number, number, number][]
> = {
  back: [
    [350, 30, 14, 12, 3],
    [453, 26, 13, 11, 8],
    [548, 26, 13, 11, 13],
    [652, 30, 14, 12, 21],
  ],
  mid: [
    [356, 124, 16, 12, 34],
    [498, 126, 16, 12, 41],
    [640, 124, 16, 12, 44],
  ],
  front: [
    [366, 192, 16, 11, 55],
    [498, 194, 16, 11, 61],
    [630, 192, 16, 11, 64],
  ],
};

/** Leaves and sticks floating on the terraces and the pool: [kind, x, y, angle, colour]. */
const FLOATING: ["leaf" | "stick", number, number, number, string][] = [
  ["leaf", 320, 114, 70, "fill-moss"],
  ["stick", 640, 118, 80, "stroke-bark"],
  ["leaf", 470, 178, 110, "fill-cartoon-yellow"],
  ["leaf", 280, 246, 60, "fill-forest-mid-leaf"],
  ["stick", 560, 252, 100, "stroke-bark"],
  ["leaf", 700, 250, 120, "fill-cartoon-red"],
];

/** Cliff rocks at or below this height stand in the pool, in front of it. */
const LOWER_CLIFF = 190;

/** Stacked rocky cliffs framing both sides of the falls: [cx, cy, rx, ry, seed]. */
const CLIFFS: [number, number, number, number, number][] = [
  [70, 46, 120, 64, 101],
  [176, 92, 70, 44, 103],
  [60, 150, 110, 58, 105],
  [158, 196, 80, 42, 107],
  [70, 250, 120, 50, 109],
  [930, 46, 120, 64, 111],
  [824, 92, 70, 44, 113],
  [940, 150, 110, 58, 115],
  [842, 196, 80, 42, 117],
  [930, 250, 120, 50, 119],
];

/** One continuous sheet of falling water per tier: [left, right, top, height]. */
const FALLS: Record<
  "back" | "mid" | "front",
  [number, number, number, number]
> = {
  back: [262, 738, 22, 88],
  mid: [234, 766, 122, 52],
  front: [212, 788, 188, 36],
};

/** Wide terrace pools between the tiers, where the water runs sideways: [y, left, right]. */
const TERRACES: [number, number, number][] = [
  [108, 236, 764],
  [172, 206, 794],
];

/** Spray droplets at the foot of each tier: [x, y, r, dx, delay]. */
const SPRAY: [number, number, number, number, number][] = [
  [300, 112, 4, -10, 0],
  [400, 112, 5, -4, 0.5],
  [500, 112, 4, 2, 0.9],
  [600, 112, 5, 6, 0.2],
  [700, 112, 4, 10, 0.6],
  [290, 176, 5, -14, 0.3],
  [430, 176, 4, -6, 0.7],
  [570, 176, 4, 6, 0.1],
  [706, 176, 5, 14, 0.8],
  [286, 226, 5, -16, 0.2],
  [432, 228, 4, -6, 1],
  [566, 228, 5, 6, 0.4],
  [712, 226, 5, 16, 0.6],
];

/**
 * A rock. `stone` is a natural grey rock in the water (shaded underside, light
 * highlight); `cliff` is a dark-green, moss-topped rock for the side cliffs.
 */
function Boulder({
  cx,
  cy,
  rx,
  ry,
  seed,
  variant = "stone",
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  seed: number;
  variant?: "stone" | "cliff";
}) {
  const stone = variant === "stone";
  return (
    <g data-waterfall={stone ? "rock" : "cliff-rock"}>
      <path
        d={blobPath(cx, cy, rx, ry, 8, seed)}
        className={`${stone ? "fill-silver" : "fill-forest-deep-light"} stroke-ink stroke-outline-lg`}
        strokeLinejoin="round"
      />
      <path
        d={blobPath(
          cx + rx * 0.18,
          cy + ry * 0.28,
          rx * 0.66,
          ry * 0.46,
          6,
          seed + 2,
        )}
        className={stone ? "fill-silver-shade" : "fill-forest-deep"}
        fillOpacity={stone ? 0.8 : 0.45}
      />
      {stone ? (
        <path
          d={blobPath(
            cx - rx * 0.2,
            cy - ry * 0.45,
            rx * 0.42,
            ry * 0.2,
            6,
            seed + 4,
          )}
          className="fill-silver-light"
          fillOpacity={0.9}
        />
      ) : (
        <>
          <path
            d={blobPath(
              cx - rx * 0.12,
              cy - ry * 0.55,
              rx * 0.72,
              ry * 0.32,
              7,
              seed + 4,
            )}
            className="fill-moss"
          />
          <path
            d={blobPath(
              cx - rx * 0.25,
              cy - ry * 0.66,
              rx * 0.3,
              ry * 0.12,
              5,
              seed + 6,
            )}
            className="fill-forest-mid-light"
          />
        </>
      )}
    </g>
  );
}

/**
 * A sheet of water: a lip curling over the top edge, softly bowed sides and a
 * scalloped foot where it breaks into foam — no straight edges.
 */
function sheet(
  left: number,
  right: number,
  top: number,
  height: number,
): string {
  const b = top + height;
  const scallops = Math.round((right - left) / 46);
  const step = (right - left) / scallops;
  const foot = Array.from({ length: scallops }, (_, i) => {
    const x0 = right - i * step;
    return `Q${(x0 - step / 2).toFixed(1)} ${b + (i % 2 ? 10 : 6)} ${(x0 - step).toFixed(1)} ${b}`;
  }).join("");
  return `M${left} ${top + 5}Q${(left + right) / 2} ${top - 8} ${right} ${top + 5}Q${right + 8} ${top + height / 2} ${right} ${b}${foot}Q${left - 8} ${top + height / 2} ${left} ${top + 5}Z`;
}

function Fall({
  left,
  right,
  top,
  height,
  delay,
}: {
  left: number;
  right: number;
  top: number;
  height: number;
  delay: number;
}) {
  const width = right - left;
  const count = Math.round(width / 14);
  const lines = Array.from(
    { length: count },
    (_, i) => left + 8 + (i * (width - 16)) / (count - 1),
  );
  return (
    <g data-waterfall="fall">
      <path
        d={sheet(left, right, top, height)}
        className="fill-mint"
        fillOpacity={0.9}
      />
      {/* Soft lighter bands where the water runs thickest. */}
      {[0.22, 0.5, 0.78].map((t) => (
        <ellipse
          key={t}
          cx={left + width * t}
          cy={top + height / 2}
          rx={width * 0.07}
          ry={height * 0.42}
          className="fill-chalk"
          fillOpacity={0.28}
        />
      ))}
      {/* Falling streaks: gently curving dashed white lines sliding down. */}
      <path
        d={lines
          .map(
            (lx, i) =>
              `M${lx.toFixed(1)} ${top + 6}Q${(lx + (i % 2 ? 3 : -3)).toFixed(1)} ${top + height / 2} ${lx.toFixed(1)} ${top + height - 2}`,
          )
          .join("")}
        className="fill-none stroke-chalk [stroke-width:3px] motion-safe:animate-water-dash"
        strokeDasharray="18 30"
        strokeLinecap="round"
        style={{ animationDelay: `${-delay}s` }}
      />
      {/* Lip where the water curls over the edge. */}
      <path
        d={`M${left - 2} ${top + 6}Q${(left + right) / 2} ${top - 10} ${right + 2} ${top + 6}Q${(left + right) / 2} ${top + 4} ${left - 2} ${top + 6}Z`}
        className="fill-chalk"
        fillOpacity={0.9}
      />
    </g>
  );
}

/** A sprig of leaves growing from a rock crack, fanning out from its base. */
function LeafSprig({
  x,
  y,
  flip = false,
}: {
  x: number;
  y: number;
  flip?: boolean;
}) {
  const leaves: [number, number, string][] = [
    [-50, 26, "fill-forest-mid-leaf"],
    [-18, 32, "fill-moss"],
    [14, 28, "fill-forest-mid-leaf"],
    [44, 22, "fill-moss"],
  ];
  return (
    <g
      data-waterfall="leaves"
      transform={`translate(${x} ${y}) ${flip ? "scale(-1 1)" : ""}`}
    >
      {leaves.map(([angle, length, fill]) => (
        <path
          key={angle}
          d={leafPath(length, length * 0.5)}
          transform={`rotate(${angle})`}
          className={`${fill} stroke-ink [stroke-width:1.8px]`}
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

/** A wide terrace pool between two tiers: the water runs sideways before falling again. */
function terrace(index: number) {
  const [y, left, right] = TERRACES[index];
  const mid = (left + right) / 2;
  return (
    <g data-waterfall="terrace">
      <path
        d={`M${left} ${y}Q${mid} ${y - 10} ${right} ${y}Q${right + 10} ${y + 8} ${right} ${y + 16}Q${mid} ${y + 22} ${left} ${y + 16}Q${left - 10} ${y + 8} ${left} ${y}Z`}
        className="fill-mint stroke-ink stroke-outline"
        fillOpacity={0.92}
        strokeLinejoin="round"
      />
      <path
        d={`M${left + 30} ${y + 8}Q${left + 85} ${y + 3} ${left + 140} ${y + 8}M${mid - 80} ${y + 5}Q${mid - 10} ${y} ${mid + 60} ${y + 5}M${right - 160} ${y + 9}Q${right - 100} ${y + 4} ${right - 40} ${y + 9}`}
        className="fill-none stroke-chalk [stroke-width:3px] motion-safe:animate-water-drift"
        strokeLinecap="round"
      />
    </g>
  );
}

/**
 * The easter egg's waterfall (spec 900 US-1): one composed cartoon jungle scene
 * across the top of the field, from its top edge down to just above the
 * Introduction banner. A cascade pours over grey stones into
 * a wide pool, framed by misty jungle and stacked rock cliffs. It has no
 * hard bottom edge: the scene fades out progressively into the grass.
 *
 * Only `motion-safe:` CSS animations move it (falling streaks, spray, pool
 * ripples), so it stands still with prefers-reduced-motion. Purely decorative.
 */
export default function Waterfall() {
  return (
    <div
      aria-hidden="true"
      data-waterfall="root"
      className="pointer-events-none absolute inset-x-0 top-0 h-[calc(var(--field-inset)+var(--penalty-w)*0.425+3.25rem)] select-none [mask-image:linear-gradient(to_bottom,black_0_74%,transparent_100%)] md:h-[calc(var(--field-inset)+var(--penalty-w)*0.425+4.75rem)]"
    >
      <svg
        viewBox="0 0 1000 320"
        preserveAspectRatio="xMidYMid slice"
        className="size-full"
        focusable="false"
      >
        <defs>
          <linearGradient id="waterfall-mist" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0"
              className="[stop-color:var(--color-forest-mid-shade)]"
            />
            <stop
              offset="0.55"
              className="[stop-color:var(--color-forest-mid-light)]"
            />
            <stop offset="1" className="[stop-color:var(--color-mint)]" />
          </linearGradient>
        </defs>

        {/* 1. Misty jungle in the distance, with light rays. */}
        <rect
          width="1000"
          height="320"
          fill="url(#waterfall-mist)"
          data-waterfall="sky"
        />
        <path
          d="M120 0L60 320H110ZM260 0L230 320H270ZM740 0L770 320H730ZM880 0L940 320H890Z"
          className="fill-forest-mid-shade"
          fillOpacity={0.35}
        />
        <path
          d="M440 0L380 200H420ZM560 0L620 200H580Z"
          className="fill-chalk"
          fillOpacity={0.18}
        />
        <path
          d={blobPath(500, 40, 260, 50, 11, 91)}
          className="fill-forest-mid-shade"
          fillOpacity={0.4}
        />

        {/* 2. Stacked rock cliffs on both sides, joining the tiers to the ground. */}
        {CLIFFS.filter(([, cy]) => cy < LOWER_CLIFF).map(
          ([cx, cy, rx, ry, seed]) => (
            <Boulder
              key={seed}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              seed={seed}
              variant="cliff"
            />
          ),
        )}

        {/* 3. The cascade: each tier's falls pour behind its boulders. */}
        <Fall
          left={FALLS.back[0]}
          right={FALLS.back[1]}
          top={FALLS.back[2]}
          height={FALLS.back[3]}
          delay={0}
        />
        {ROCKS.back.map(([cx, cy, rx, ry, seed]) => (
          <Boulder key={seed} cx={cx} cy={cy} rx={rx} ry={ry} seed={seed} />
        ))}
        {terrace(0)}
        <Fall
          left={FALLS.mid[0]}
          right={FALLS.mid[1]}
          top={FALLS.mid[2]}
          height={FALLS.mid[3]}
          delay={0.3}
        />
        {ROCKS.mid.map(([cx, cy, rx, ry, seed]) => (
          <Boulder key={seed} cx={cx} cy={cy} rx={rx} ry={ry} seed={seed} />
        ))}
        {terrace(1)}

        {/* 4. The pool at the foot of the falls, with drifting ripples. */}
        <path
          d="M-20 222Q500 198 1020 222V330H-20Z"
          className="fill-mint"
          fillOpacity={0.92}
          data-waterfall="pool"
        />
        <path
          d="M170 242Q200 236 230 242T290 242M340 254Q370 248 400 254T460 254M520 246Q550 240 580 246T640 246M700 242Q730 236 760 242T820 242M250 266Q280 260 310 266T370 266M600 266Q630 260 660 266T720 266"
          className="fill-none stroke-chalk [stroke-width:3px] motion-safe:animate-water-drift"
          strokeLinecap="round"
          data-waterfall="ripples"
        />

        {/* Leaves and a stick carried along on the water. */}
        {FLOATING.map(([kind, x, y, angle, fill], i) => (
          <g
            key={i}
            data-waterfall={kind}
            className="motion-safe:animate-water-drift"
            style={{ animationDelay: `${-i * 0.7}s` }}
          >
            {kind === "leaf" ? (
              <FallenLeaf
                x={x}
                y={y}
                angle={angle}
                length={20}
                width={11}
                fill={fill}
              />
            ) : (
              <Twig x={x} y={y} angle={angle} length={24} wood={fill} />
            )}
          </g>
        ))}

        {/* Lower cliff rocks stand in the pool, hiding where it meets the cliffs. */}
        {CLIFFS.filter(([, cy]) => cy >= LOWER_CLIFF).map(
          ([cx, cy, rx, ry, seed]) => (
            <Boulder
              key={seed}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              seed={seed}
              variant="cliff"
            />
          ),
        )}

        <Fall
          left={FALLS.front[0]}
          right={FALLS.front[1]}
          top={FALLS.front[2]}
          height={FALLS.front[3]}
          delay={0.5}
        />
        {ROCKS.front.map(([cx, cy, rx, ry, seed]) => (
          <Boulder key={seed} cx={cx} cy={cy} rx={rx} ry={ry} seed={seed} />
        ))}

        {/* Spray bursting where the water lands. */}
        <g data-waterfall="spray">
          {SPRAY.map(([x, y, r, dx, delay], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              className="fill-chalk [transform-box:fill-box] motion-safe:animate-droplet"
              style={
                {
                  animationDelay: `${-delay}s`,
                  "--dx": `${dx}px`,
                } as CSSProperties
              }
            />
          ))}
        </g>

        {/* 5. Leaves growing from the rock cracks. */}
        <LeafSprig x={196} y={232} />
        <LeafSprig x={150} y={120} />
        <LeafSprig x={804} y={232} flip />
        <LeafSprig x={850} y={120} flip />
      </svg>
    </div>
  );
}
