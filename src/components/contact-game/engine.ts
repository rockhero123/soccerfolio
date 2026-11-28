import { chooseShot } from "./cpu";
import { kickOff } from "./lineup";
import { goalScored, isMoving, shoot, step, type Body, type Team, type World } from "./physics";

/**
 * The contact game's rules (spec 900 US-3): a 3-2-1 countdown and whistle,
 * the machine shooting first, alternating turns, goals and a winner. Pure
 * logic, driven by `update(dt)` and pointer input in art pixels; the React
 * component draws it and listens to its events. No DOM.
 */

export type Phase =
  | "countdown"
  | "machine-aim"
  | "visitor"
  | "moving"
  | "goal"
  | "won"
  | "lost";

export type GameEvent =
  | { type: "whistle" }
  | { type: "phase"; phase: Phase }
  | { type: "goal"; team: Team }
  | { type: "won" }
  | { type: "lost" };

export type Aim = { pin: Body; dx: number; dy: number; power: number };

/** Seconds per countdown number. */
export const COUNT_S = 1;
/** How long the machine shows its aim before shooting. */
export const MACHINE_AIM_S = 1.1;
/** How long "GOAL!" stays before the kick-off. */
export const GOAL_S = 1.6;
/** Drag length (art pixels) for a full-power shot. */
export const FULL_DRAG = 45;
/** Shots weaker than this are cancelled (a tap, not a drag). */
export const MIN_POWER = 0.08;
/** Physics sub-step, in seconds. */
const STEP = 1 / 240;

type Options = {
  goalsToWin: number;
  rand?: () => number;
  /** The machine's aiming error, in radians. */
  error?: number;
  onEvent?: (event: GameEvent) => void;
};

export class GameEngine {
  world: World = kickOff();
  phase: Phase = "countdown";
  score: Record<Team, number> = { visitor: 0, machine: 0 };
  /** Whose shot it is (or will be). */
  turn: Team = "machine";
  /** The countdown number shown (3, 2, 1). */
  count = 3;
  /** The aiming arrow being shown, if any. */
  aim: Aim | null = null;
  /** Recent ball positions, newest last, for the trail. */
  trail: { x: number; y: number }[] = [];

  private timer = 0;
  private planned: Aim | null = null;
  private readonly goalsToWin: number;
  private readonly rand: () => number;
  private readonly error: number;
  private readonly emit: (event: GameEvent) => void;

  constructor({ goalsToWin, rand = Math.random, error, onEvent }: Options) {
    this.goalsToWin = goalsToWin;
    this.rand = rand;
    this.error = error ?? 0.16;
    this.emit = onEvent ?? (() => {});
  }

  private setPhase(phase: Phase) {
    this.phase = phase;
    this.timer = 0;
    this.emit({ type: "phase", phase });
  }

  /** The next turn: the machine aims first, the visitor waits for input. */
  private startTurn(team: Team) {
    this.turn = team;
    this.aim = null;
    if (team === "machine") {
      const shot = chooseShot(this.world, this.rand, this.error);
      this.planned = { pin: shot.pin, dx: shot.dx, dy: shot.dy, power: shot.power };
      this.setPhase("machine-aim");
    } else {
      this.planned = null;
      this.setPhase("visitor");
    }
  }

  private fire({ pin, dx, dy, power }: Aim) {
    shoot(pin, dx, dy, power);
    this.aim = null;
    this.trail = [];
    this.setPhase("moving");
  }

  update(dt: number) {
    this.timer += dt;
    switch (this.phase) {
      case "countdown": {
        const left = 3 - Math.floor(this.timer / COUNT_S);
        if (left >= 1) {
          this.count = left;
          return;
        }
        this.emit({ type: "whistle" });
        this.startTurn("machine");
        return;
      }
      case "machine-aim": {
        const plan = this.planned!;
        // The arrow grows to the planned power, then the machine shoots.
        const grow = Math.min(1, this.timer / (MACHINE_AIM_S * 0.75));
        this.aim = { ...plan, power: plan.power * grow };
        if (this.timer >= MACHINE_AIM_S) this.fire(plan);
        return;
      }
      case "moving": {
        let left = dt;
        while (left > 0) {
          const h = Math.min(STEP, left);
          step(this.world, h);
          left -= h;
          const scorer = goalScored(this.world.ball);
          if (scorer) return this.goal(scorer);
        }
        this.trail.push({ x: this.world.ball.x, y: this.world.ball.y });
        if (this.trail.length > 8) this.trail.shift();
        if (!isMoving(this.world)) {
          this.trail = [];
          this.startTurn(this.turn === "machine" ? "visitor" : "machine");
        }
        return;
      }
      case "goal": {
        if (this.timer < GOAL_S) return;
        this.world = kickOff();
        // The team that conceded kicks off.
        this.startTurn(this.lastScorer === "visitor" ? "machine" : "visitor");
        return;
      }
      default:
        return;
    }
  }

  private lastScorer: Team = "visitor";

  private goal(team: Team) {
    this.score = { ...this.score, [team]: this.score[team] + 1 };
    this.lastScorer = team;
    this.trail = [];
    this.emit({ type: "goal", team });
    if (this.score[team] >= this.goalsToWin) {
      this.setPhase(team === "visitor" ? "won" : "lost");
      this.emit({ type: team === "visitor" ? "won" : "lost" });
      return;
    }
    this.setPhase("goal");
  }

  /** Starts aiming if (x, y) is on one of the visitor's pins on their turn. */
  pointerDown(x: number, y: number): boolean {
    if (this.phase !== "visitor") return false;
    const pin = this.world.pins.find(
      (p) => p.team === "visitor" && Math.hypot(p.x - x, p.y - y) <= p.r + 4,
    );
    if (!pin) return false;
    this.aim = { pin, dx: 0, dy: -1, power: 0 };
    return true;
  }

  /** Dragging back from the pin aims the opposite way, like a slingshot. */
  pointerMove(x: number, y: number) {
    if (this.phase !== "visitor" || !this.aim) return;
    const { pin } = this.aim;
    const dx = pin.x - x;
    const dy = pin.y - y;
    const len = Math.hypot(dx, dy);
    if (len === 0) return;
    this.aim = { pin, dx: dx / len, dy: dy / len, power: Math.min(1, len / FULL_DRAG) };
  }

  /** Releasing shoots, unless it was only a tap. */
  pointerUp() {
    if (this.phase !== "visitor" || !this.aim) return;
    const aim = this.aim;
    this.aim = null;
    if (aim.power >= MIN_POWER) this.fire(aim);
  }

  /** A new match after a loss. */
  restart() {
    this.world = kickOff();
    this.score = { visitor: 0, machine: 0 };
    this.trail = [];
    this.aim = null;
    this.count = 3;
    this.setPhase("countdown");
  }
}
