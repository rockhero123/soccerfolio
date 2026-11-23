import PixelArt from "../pixel/PixelArt";
import { LOGO } from "./logoArt";

/**
 * The "RM" logo from `design/main.jpg`, redrawn as two pixel-art letter blocks:
 * a parchment R and a dark-grass M stepped below it. Decorative (the link
 * around it carries the name).
 */
export default function Logo() {
  return <PixelArt art={LOGO} data={{ "data-logo": "rm" }} />;
}
