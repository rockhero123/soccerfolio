import { sprite } from "../pixel/canvas";
import PixelArt from "../pixel/PixelArt";
import { ingot } from "./gameArt";

const INGOT_ART = sprite(ingot());

/**
 * The CONTACT button's artwork (spec 900 US-3 AC1): a pixel gold ingot with
 * leaves around its border. Server-rendered and decorative; the label is real
 * text laid over its front face by `ContactGate`.
 */
export default function GoldIngot() {
  return <PixelArt art={INGOT_ART} data={{ "data-gold-ingot": "" }} />;
}
