import Clover from "./Clover";
import FallenLeaf from "./FallenLeaf";
import Feather from "./Feather";
import GrassTuft from "./GrassTuft";
import type { Piece } from "./pieces";
import Stem from "./Stem";
import Twig from "./Twig";

/** Draws one piece of fallen debris with the component for its kind. */
export default function DebrisPiece({ piece }: { piece: Piece }) {
  switch (piece.kind) {
    case "leaf":
      return <FallenLeaf {...piece} />;
    case "feather":
      return <Feather {...piece} />;
    case "twig":
      return <Twig {...piece} />;
    case "stem":
      return <Stem {...piece} />;
    case "tuft":
      return <GrassTuft {...piece} />;
    case "clover":
      return <Clover {...piece} />;
  }
}
