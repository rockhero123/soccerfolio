type At = { x: number; y: number; angle: number };

/** One piece of fallen forest debris, placed in a pattern tile, with its token colours. */
export type Piece =
  | (At & { kind: "leaf"; length: number; width: number; fill: string })
  | (At & { kind: "twig"; length: number; wood: string })
  | (At & { kind: "stem"; length: number; stalk: string; leaflet: string })
  | (At & {
      kind: "feather";
      length: number;
      width: number;
      vane: string;
      tip: string;
    })
  | (At & { kind: "clover" | "tuft"; size: number; fill: string });
