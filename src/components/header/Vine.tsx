import PixelArt from "../pixel/PixelArt";
import { fromRows, sprite } from "../pixel/canvas";

/** A short pixel vine with two leaves (6 × 10). */
const VINE = sprite(
  fromRows(
    [
      "..s...",
      "..s...",
      ".ks...",
      "kLLs..",
      ".kks..",
      "...sk.",
      "...lLk",
      "..skk.",
      "..s...",
      "..s...",
    ],
    { s: "leaf-700", k: "leaf-900", L: "leaf-400", l: "leaf-300" },
  ),
);

/** A short vine the header sign hangs from. Decorative. */
export default function Vine({ className = "" }: { className?: string }) {
  return (
    <PixelArt
      art={VINE}
      className={`absolute ${className}`}
      data={{ "data-vine": "" }}
    />
  );
}
