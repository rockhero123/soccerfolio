import type { LeafTone } from "./FallenLeaf";

type At = { x: number; y: number; angle: number };

/** One piece of fallen forest debris, placed in a pattern tile. */
export type Piece =
  | (At & { kind: "leaf"; length: number; width: number; tone: LeafTone })
  | (At & { kind: "twig" | "stem"; length: number })
  | (At & {
      kind: "feather";
      length: number;
      width: number;
      tip: "red" | "yellow";
    })
  | (At & { kind: "tuft" | "clover"; size: number; tone: "light" | "dark" });
