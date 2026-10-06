import type { ReactNode } from "react";

type CharacterSvgProps = {
  /** Kebab-case name, exposed as `data-character` for placement and tests. */
  name: string;
  viewBox: string;
  /** Size of the character, usually a height (its width follows the viewBox). */
  className?: string;
  children: ReactNode;
};

/**
 * The frame every forest character is drawn in: a decorative, unfocusable SVG
 * whose shapes inherit a bold, rounded `ink` outline (manifest §6: 4px for large
 * shapes). Details opt into the thinner outline token.
 */
export default function CharacterSvg({
  name,
  viewBox,
  className = "",
  children,
}: CharacterSvgProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-character={name}
      viewBox={viewBox}
      className={`block w-auto overflow-visible ${className}`}
    >
      <g
        className="stroke-ink stroke-outline-lg"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {children}
      </g>
    </svg>
  );
}
