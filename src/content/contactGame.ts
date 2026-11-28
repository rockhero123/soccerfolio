/** The contact game (spec 900 US-3): two 5-a-side teams in a 1-2-2 shape. */
export type Lineup = {
  keeper: string;
  /** Left to right, as seen on screen. */
  defenders: readonly [string, string];
  forwards: readonly [string, string];
};

export const contactGame = {
  goalsToWin: 3,
  teams: {
    /** The visitor's team: green, defending the bottom goal. */
    visitor: {
      keeper: "Casillas",
      defenders: ["James", "Pirlo"],
      forwards: ["Bale", "Zlatan"],
    },
    /** The machine's team: red, defending the top goal. */
    machine: {
      keeper: "Courtois",
      defenders: ["Neymar", "De Bruyne"],
      forwards: ["Messi", "Cristiano Ronaldo"],
    },
  } satisfies Record<string, Lineup>,
} as const;
