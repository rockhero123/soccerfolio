/**
 * A tiny, deterministic pixel-art rasteriser for the hand-coded artwork
 * (manifest §6, pixel-art redesign).
 *
 * Sprites are painted onto a `PixelCanvas` with simple tools (rectangles,
 * discs, lines, hand-typed pixel grids, shaded leaf clumps, outlines) and then
 * exported as one SVG path per colour. Every colour is a palette token name
 * (e.g. `"leaf-500"`), rendered as `var(--color-leaf-500)`, never a raw hex.
 * Everything is seeded, so the server and the client draw the exact same pixels.
 */

/** A palette token name without the `--color-` prefix, e.g. `"wood-400"`. */
export type Token = string;

/** Maps the characters of a pixel grid to tokens. `.` and space are transparent. */
export type Palette = Record<string, Token>;

/** One colour of a finished sprite: its token and the SVG path of its pixels. */
export type PixelPath = { token: Token; d: string };

/** Seeded PRNG (mulberry32). Returns numbers in [0, 1). */
export function rng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A clump of leaves (or any round, shaded lump): centre and radius in pixels. */
export type Clump = { x: number; y: number; r: number };

export class PixelCanvas {
  readonly width: number;
  readonly height: number;
  private readonly pixels: (Token | undefined)[];

  /** Tileable canvases wrap around their edges, so patterns repeat seamlessly. */
  private readonly wrapX: boolean;
  private readonly wrapY: boolean;

  constructor(
    width: number,
    height: number,
    { wrapX = false, wrapY = false }: { wrapX?: boolean; wrapY?: boolean } = {},
  ) {
    this.width = width;
    this.height = height;
    this.wrapX = wrapX;
    this.wrapY = wrapY;
    this.pixels = new Array<Token | undefined>(width * height);
  }

  private index(x: number, y: number): number | undefined {
    let px = Math.round(x);
    let py = Math.round(y);
    if (this.wrapX) px = ((px % this.width) + this.width) % this.width;
    if (this.wrapY) py = ((py % this.height) + this.height) % this.height;
    if (px < 0 || py < 0 || px >= this.width || py >= this.height)
      return undefined;
    return py * this.width + px;
  }

  /** Whether (x, y) is inside the canvas (always true on wrapping axes). */
  inside(x: number, y: number): boolean {
    return this.index(x, y) !== undefined;
  }

  get(x: number, y: number): Token | undefined {
    const i = this.index(x, y);
    return i === undefined ? undefined : this.pixels[i];
  }

  set(x: number, y: number, token: Token | undefined): this {
    const i = this.index(x, y);
    if (i !== undefined) this.pixels[i] = token;
    return this;
  }

  /** Paints only where the canvas already has a pixel (e.g. shading a shape). */
  tint(x: number, y: number, token: Token): this {
    if (this.get(x, y) !== undefined) this.set(x, y, token);
    return this;
  }

  rect(x: number, y: number, w: number, h: number, token: Token): this {
    for (let j = 0; j < h; j++)
      for (let i = 0; i < w; i++) this.set(x + i, y + j, token);
    return this;
  }

  /** A filled ellipse centred on (cx, cy). */
  ellipse(cx: number, cy: number, rx: number, ry: number, token: Token): this {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const dx = (x - cx) / (rx + 0.35);
        const dy = (y - cy) / (ry + 0.35);
        if (dx * dx + dy * dy <= 1) this.set(x, y, token);
      }
    return this;
  }

  disc(cx: number, cy: number, r: number, token: Token): this {
    return this.ellipse(cx, cy, r, r, token);
  }

  /** A 1-pixel line (Bresenham). */
  line(x0: number, y0: number, x1: number, y1: number, token: Token): this {
    let x = Math.round(x0);
    let y = Math.round(y0);
    const tx = Math.round(x1);
    const ty = Math.round(y1);
    const dx = Math.abs(tx - x);
    const dy = -Math.abs(ty - y);
    const sx = x < tx ? 1 : -1;
    const sy = y < ty ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.set(x, y, token);
      if (x === tx && y === ty) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y += sy;
      }
    }
    return this;
  }

  /** A thick line: a disc of radius `r` dragged from one point to the other. */
  stroke(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    r: number,
    token: Token,
  ): this {
    const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      this.disc(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, r, token);
    }
    return this;
  }

  /**
   * Stamps a hand-typed pixel grid: one string per row, one character per
   * pixel, mapped through `palette`. Unknown characters, `.` and spaces are
   * transparent.
   */
  stamp(
    rows: readonly string[],
    palette: Palette,
    x = 0,
    y = 0,
    { flip = false }: { flip?: boolean } = {},
  ): this {
    rows.forEach((row, j) => {
      const chars = [...row];
      chars.forEach((char, i) => {
        const token = palette[char];
        if (token) this.set(x + (flip ? chars.length - 1 - i : i), y + j, token);
      });
    });
    return this;
  }

  /** Draws another canvas on top of this one at (x, y). */
  draw(other: PixelCanvas, x = 0, y = 0, { flip = false } = {}): this {
    for (let j = 0; j < other.height; j++)
      for (let i = 0; i < other.width; i++) {
        const token = other.get(flip ? other.width - 1 - i : i, j);
        if (token) this.set(x + i, y + j, token);
      }
    return this;
  }

  /**
   * Adds a 1-pixel outline around every painted shape (4-neighbours, so
   * corners stay soft, like hand-placed pixel art).
   */
  outline(token: Token, { corners = false }: { corners?: boolean } = {}): this {
    const add: [number, number][] = [];
    const near = corners
      ? [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
          [1, 1],
          [-1, -1],
          [1, -1],
          [-1, 1],
        ]
      : [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ];
    for (let y = 0; y < this.height; y++)
      for (let x = 0; x < this.width; x++) {
        if (this.get(x, y) !== undefined) continue;
        if (near.some(([dx, dy]) => this.get(x + dx, y + dy) !== undefined))
          add.push([x, y]);
      }
    for (const [x, y] of add) this.set(x, y, token);
    return this;
  }

  /**
   * Shaded leaf clumps, the signature of Stardew-like foliage: each clump is
   * a round lump lit from the top left, painted back to front so overlapping
   * clumps keep a dark rim where they meet, with sparkles of light leaves on
   * the lit side. `ramp` runs from darkest to lightest.
   */
  clumps(clumps: readonly Clump[], ramp: readonly Token[], seed: number): this {
    const rand = rng(seed);
    const last = ramp.length - 1;
    for (const { x: cx, y: cy, r } of clumps) {
      for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
        for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
          const dx = x - cx;
          const dy = y - cy;
          // A slightly bumpy rim, so the clump reads as many leaves.
          const angle = Math.atan2(dy, dx);
          const bump = 1 + 0.12 * Math.sin(angle * 5 + cx) * Math.cos(angle * 3);
          const d = Math.hypot(dx, dy) / ((r + 0.4) * bump);
          if (d > 1) continue;
          // Light from the top left: brighter there, darker at the bottom right.
          const lit = (-dx - dy * 1.3) / (r * 2.3) + 0.45 - d * 0.35;
          const noise = (rand() - 0.5) * 0.22;
          let level = Math.round((lit + noise) * last + 1);
          if (d > 0.82 && dy > -r * 0.2) level = Math.min(level, 1);
          this.set(x, y, ramp[Math.max(0, Math.min(last, level))]);
        }
      // Sparkles: little leaves catching the light.
      const sparkles = Math.round(r * 0.9);
      for (let i = 0; i < sparkles; i++) {
        const a = Math.PI * (1.05 + rand() * 0.75);
        const dist = r * (0.25 + rand() * 0.55);
        const sx = Math.round(cx + Math.cos(a) * dist);
        const sy = Math.round(cy + Math.sin(a) * dist);
        this.tint(sx, sy, ramp[last]);
        if (rand() > 0.5) this.tint(sx + 1, sy, ramp[last - 1]);
      }
    }
    return this;
  }

  /**
   * A smoothly shaded ellipse (a body, a cap, a belly): bands of the ramp
   * (dark → light) lit from the top left, with a checkered dither where two
   * bands meet, the way pixel artists blend shades by hand.
   */
  ball(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    ramp: readonly Token[],
    { light = 0.5 }: { light?: number } = {},
  ): this {
    const last = ramp.length - 1;
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const dx = (x - cx) / (rx + 0.35);
        const dy = (y - cy) / (ry + 0.35);
        const d = dx * dx + dy * dy;
        if (d > 1) continue;
        // Brightest towards the top left, darkest at the bottom-right rim.
        const lit = light - dx * 0.45 - dy * 0.6 - d * 0.35;
        const level = (lit + 0.5) * last;
        const base = Math.floor(level);
        const dither = level - base > 0.5 && (x + y) % 2 === 0 ? 1 : 0;
        this.set(x, y, ramp[Math.max(0, Math.min(last, base + dither))]);
      }
    return this;
  }

  /**
   * Exports the canvas as one SVG path per token. Horizontal runs of the same
   * colour are merged, and identical runs on the rows below are merged into
   * rectangles. Each rectangle after the first starts with a relative move
   * from the previous one (after `z` the pen is back at its start), so the
   * coordinates stay short and the markup small.
   */
  paths(): PixelPath[] {
    const used = new Uint8Array(this.width * this.height);
    const byToken = new Map<Token, { parts: string[]; x: number; y: number }>();
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const token = this.get(x, y);
        if (!token || used[y * this.width + x]) continue;
        let w = 1;
        while (
          x + w < this.width &&
          !used[y * this.width + x + w] &&
          this.get(x + w, y) === token
        )
          w++;
        let h = 1;
        const rowMatches = (row: number) => {
          for (let i = 0; i < w; i++)
            if (
              this.get(x + i, row) !== token ||
              used[row * this.width + x + i]
            )
              return false;
          return true;
        };
        while (y + h < this.height && rowMatches(y + h)) h++;
        for (let j = 0; j < h; j++)
          for (let i = 0; i < w; i++) used[(y + j) * this.width + x + i] = 1;
        const rect = `h${w}v${h}h-${w}z`;
        const entry = byToken.get(token);
        if (entry) {
          entry.parts.push(`m${x - entry.x} ${y - entry.y}${rect}`);
          entry.x = x;
          entry.y = y;
        } else {
          byToken.set(token, { parts: [`M${x} ${y}${rect}`], x, y });
        }
      }
    }
    return [...byToken].map(([token, { parts }]) => ({
      token,
      d: parts.join("").replace(/ -/g, "-"),
    }));
  }
}

/** Builds a canvas from hand-typed rows (all rows padded to the longest). */
export function fromRows(rows: readonly string[], palette: Palette): PixelCanvas {
  const width = Math.max(...rows.map((row) => [...row].length));
  return new PixelCanvas(width, rows.length).stamp(rows, palette);
}

/** A finished sprite: its canvas and its precomputed SVG paths. */
export type Sprite = { canvas: PixelCanvas; paths: readonly PixelPath[] };

/** Freezes a canvas into a sprite (computes its paths once, at module level). */
export function sprite(canvas: PixelCanvas): Sprite {
  return { canvas, paths: canvas.paths() };
}
