import type { ReactNode } from "react";

type TileWrapProps = {
  id: string;
  /** Offset of the neighbouring copies (tile width or height). */
  dx?: number;
  dy?: number;
  children: ReactNode;
};

/**
 * Draws a layer once and reuses it in the neighbouring tile positions with `<use>`,
 * so shapes that cross a pattern edge wrap around seamlessly.
 */
export default function TileWrap({ id, dx = 0, dy = 0, children }: TileWrapProps) {
  return (
    <>
      <g id={id}>{children}</g>
      <use href={`#${id}`} x={-dx} y={-dy} />
      <use href={`#${id}`} x={dx} y={dy} />
    </>
  );
}
