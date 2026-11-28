import { contactGame, type Lineup } from "@/content/contactGame";
import { BALL_R, PIN_R, PITCH, type Body, type Team, type World } from "./physics";

/** Where a 1-2-2 team stands in its own half, for the bottom (visitor) side. */
const SPOTS = {
  keeper: [PITCH.w / 2, PITCH.h - 14],
  defenders: [
    [PITCH.w * 0.3, PITCH.h - 42],
    [PITCH.w * 0.7, PITCH.h - 42],
  ],
  forwards: [
    [PITCH.w * 0.3, PITCH.h - 70],
    [PITCH.w * 0.7, PITCH.h - 70],
  ],
} as const;

const pin = (team: Team, name: string, x: number, y: number): Body => ({
  x,
  y,
  vx: 0,
  vy: 0,
  r: PIN_R,
  mass: 2,
  team,
  name,
});

function team(side: Team, { keeper, defenders, forwards }: Lineup): Body[] {
  // The machine stands mirrored in the top half; its left-to-right names are
  // as seen on screen.
  const place = (x: number, y: number): [number, number] =>
    side === "visitor" ? [x, y] : [x, PITCH.h - y];
  return [
    pin(side, keeper, ...place(...SPOTS.keeper)),
    pin(side, defenders[0], ...place(...SPOTS.defenders[0])),
    pin(side, defenders[1], ...place(...SPOTS.defenders[1])),
    pin(side, forwards[0], ...place(...SPOTS.forwards[0])),
    pin(side, forwards[1], ...place(...SPOTS.forwards[1])),
  ];
}

/** A fresh kick-off: both teams in place, the ball on the centre spot. */
export function kickOff(): World {
  return {
    pins: [
      ...team("machine", contactGame.teams.machine),
      ...team("visitor", contactGame.teams.visitor),
    ],
    ball: { x: PITCH.w / 2, y: PITCH.h / 2, vx: 0, vy: 0, r: BALL_R, mass: 1 },
  };
}
