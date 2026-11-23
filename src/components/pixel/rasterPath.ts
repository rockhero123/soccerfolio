/**
 * Rasterises SVG path data into a pixel mask, at build time: used to turn the
 * official skill logos (spec 004, manifest §6 "Skill logos") into crisp pixel
 * icons that match the pixel-art style. Supports every path command
 * (M L H V C S Q T A Z, absolute and relative) and the nonzero fill rule.
 */

type Point = [number, number];

const COMMAND = /([MLHVCSQTAZmlhvcsqtaz])|(-?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)/g;

/** Splits path data into commands and numbers ("-.5.3" → -0.5, 0.3). */
function tokenize(d: string): (string | number)[] {
  const tokens: (string | number)[] = [];
  for (const [, cmd, num] of d.matchAll(COMMAND))
    tokens.push(cmd ?? Number(num));
  return tokens;
}

/** Arc flags may be written without separators ("a1 1 0 011 1"). */
function readFlag(tokens: (string | number)[], i: number): [number, number] {
  const t = tokens[i];
  return [Number(t) ? 1 : 0, i + 1];
}

/** Points along an elliptical arc (SVG endpoint parameterisation). */
function arcPoints(
  [x1, y1]: Point,
  rxIn: number,
  ryIn: number,
  phiDeg: number,
  large: number,
  sweep: number,
  [x2, y2]: Point,
): Point[] {
  let rx = Math.abs(rxIn);
  let ry = Math.abs(ryIn);
  if (!rx || !ry) return [[x2, y2]];
  const phi = (phiDeg * Math.PI) / 180;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const x1p = cos * dx + sin * dy;
  const y1p = -sin * dx + cos * dy;
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    rx *= Math.sqrt(lambda);
    ry *= Math.sqrt(lambda);
  }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const coef = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(0, num / den));
  const cxp = (coef * rx * y1p) / ry;
  const cyp = (-coef * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2;
  const cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const angle = (ux: number, uy: number, vx: number, vy: number) =>
    Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  const t1 = angle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dt = angle((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!sweep && dt > 0) dt -= Math.PI * 2;
  if (sweep && dt < 0) dt += Math.PI * 2;
  const steps = Math.max(4, Math.ceil(Math.abs(dt) * 8));
  const points: Point[] = [];
  for (let i = 1; i <= steps; i++) {
    const t = t1 + (dt * i) / steps;
    points.push([
      cx + rx * Math.cos(t) * cos - ry * Math.sin(t) * sin,
      cy + rx * Math.cos(t) * sin + ry * Math.sin(t) * cos,
    ]);
  }
  return points;
}

/** Flattens path data into closed polygons. */
export function flatten(d: string): Point[][] {
  const tokens = tokenize(d);
  const polys: Point[][] = [];
  let poly: Point[] = [];
  let cur: Point = [0, 0];
  let start: Point = [0, 0];
  let lastCtrl: Point | null = null;
  let lastQuad: Point | null = null;
  let cmd = "";
  let i = 0;
  const num = () => Number(tokens[i++]);
  const close = () => {
    if (poly.length > 1) polys.push(poly);
    poly = [];
  };
  const cubic = (p1: Point, p2: Point, p3: Point) => {
    const [x0, y0] = cur;
    for (let s = 1; s <= 12; s++) {
      const t = s / 12;
      const u = 1 - t;
      poly.push([
        u * u * u * x0 + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
        u * u * u * y0 + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
      ]);
    }
    cur = p3;
  };
  const quad = (p1: Point, p2: Point) => {
    const [x0, y0] = cur;
    for (let s = 1; s <= 10; s++) {
      const t = s / 10;
      const u = 1 - t;
      poly.push([
        u * u * x0 + 2 * u * t * p1[0] + t * t * p2[0],
        u * u * y0 + 2 * u * t * p1[1] + t * t * p2[1],
      ]);
    }
    cur = p2;
  };
  while (i < tokens.length) {
    if (typeof tokens[i] === "string") cmd = tokens[i++] as string;
    const rel = cmd === cmd.toLowerCase();
    const [ox, oy] = rel ? cur : [0, 0];
    switch (cmd.toUpperCase()) {
      case "M": {
        close();
        cur = [ox + num(), oy + num()];
        start = cur;
        poly.push(cur);
        // Further pairs after a moveto are linetos.
        cmd = rel ? "l" : "L";
        lastCtrl = lastQuad = null;
        continue;
      }
      case "L":
        cur = [ox + num(), oy + num()];
        poly.push(cur);
        break;
      case "H":
        cur = [(rel ? cur[0] : 0) + num(), cur[1]];
        poly.push(cur);
        break;
      case "V":
        cur = [cur[0], (rel ? cur[1] : 0) + num()];
        poly.push(cur);
        break;
      case "C": {
        const p1: Point = [ox + num(), oy + num()];
        const p2: Point = [ox + num(), oy + num()];
        const p3: Point = [ox + num(), oy + num()];
        cubic(p1, p2, p3);
        lastCtrl = p2;
        lastQuad = null;
        continue;
      }
      case "S": {
        const p1: Point = lastCtrl ? [2 * cur[0] - lastCtrl[0], 2 * cur[1] - lastCtrl[1]] : cur;
        const p2: Point = [ox + num(), oy + num()];
        const p3: Point = [ox + num(), oy + num()];
        cubic(p1, p2, p3);
        lastCtrl = p2;
        lastQuad = null;
        continue;
      }
      case "Q": {
        const p1: Point = [ox + num(), oy + num()];
        const p2: Point = [ox + num(), oy + num()];
        quad(p1, p2);
        lastQuad = p1;
        lastCtrl = null;
        continue;
      }
      case "T": {
        const p1: Point = lastQuad ? [2 * cur[0] - lastQuad[0], 2 * cur[1] - lastQuad[1]] : cur;
        const p2: Point = [ox + num(), oy + num()];
        quad(p1, p2);
        lastQuad = p1;
        lastCtrl = null;
        continue;
      }
      case "A": {
        const rx = num();
        const ry = num();
        const phi = num();
        let large: number;
        let sweep: number;
        [large, i] = readFlag(tokens, i);
        [sweep, i] = readFlag(tokens, i);
        const end: Point = [ox + num(), oy + num()];
        poly.push(...arcPoints(cur, rx, ry, phi, large, sweep, end));
        cur = end;
        break;
      }
      case "Z":
        cur = start;
        close();
        poly.push(cur);
        break;
      default:
        i++;
    }
    lastCtrl = lastQuad = null;
  }
  close();
  return polys;
}

/** Nonzero winding number of (x, y) against the polygons. */
function winding(polys: Point[][], x: number, y: number): number {
  let w = 0;
  for (const poly of polys)
    for (let k = 0; k < poly.length; k++) {
      const [x0, y0] = poly[k];
      const [x1, y1] = poly[(k + 1) % poly.length];
      if (y0 <= y) {
        if (y1 > y && (x1 - x0) * (y - y0) - (x - x0) * (y1 - y0) > 0) w++;
      } else if (y1 <= y && (x1 - x0) * (y - y0) - (x - x0) * (y1 - y0) < 0) w--;
    }
  return w;
}

/**
 * Rasterises path data from `viewBox` into a `size` × `size` mask: a pixel is
 * set when at least `threshold` of its 4 × 4 samples fall inside the shape.
 */
export function rasterize(
  d: string,
  viewBox: string,
  size: number,
  threshold = 0.45,
): boolean[][] {
  const [vx, vy, vw, vh] = viewBox.split(/[\s,]+/).map(Number);
  const polys = flatten(d);
  const scale = Math.max(vw, vh) / size;
  const offX = vx - (size * scale - vw) / 2;
  const offY = vy - (size * scale - vh) / 2;
  const mask: boolean[][] = [];
  for (let y = 0; y < size; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < size; x++) {
      let hits = 0;
      for (let sy = 0; sy < 4; sy++)
        for (let sx = 0; sx < 4; sx++) {
          const px = offX + (x + (sx + 0.5) / 4) * scale;
          const py = offY + (y + (sy + 0.5) / 4) * scale;
          if (winding(polys, px, py) !== 0) hits++;
        }
      row.push(hits / 16 >= threshold);
    }
    mask.push(row);
  }
  return mask;
}
