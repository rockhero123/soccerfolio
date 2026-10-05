import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("unused starter assets are removed (AC3)", () => {
  it.each(["file.svg", "globe.svg", "next.svg", "vercel.svg", "window.svg"])(
    "public/%s does not exist",
    (file) => {
      expect(existsSync(join(process.cwd(), "public", file))).toBe(false);
    },
  );
});
