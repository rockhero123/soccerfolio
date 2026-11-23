import type { PixelPath } from "./canvas";

/** The SVG paths of a canvas, coloured with palette tokens. */
export default function PixelPaths({ paths }: { paths: readonly PixelPath[] }) {
  return (
    <>
      {paths.map(({ token, d }) => (
        <path key={token} d={d} fill={`var(--color-${token})`} />
      ))}
    </>
  );
}
