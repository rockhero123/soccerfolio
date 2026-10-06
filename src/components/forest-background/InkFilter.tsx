type InkFilterProps = {
  id: string;
  /** Size of the pattern tile the filter is used in, in SVG user units. */
  width: number;
  height: number;
};

/** Extra room around the tile so displaced edges can pull in the wrapped neighbours. */
const PAD = 24;

/**
 * The hand-painted look of the forest, as one static SVG filter applied once per
 * pattern tile (the browser renders a tile once and repeats it, so this stays cheap):
 *
 * 1. Hand-inked lines: low-frequency noise displaces every shape by a pixel or two,
 *    so outlines wobble and vary in width like ink drawn with a brush.
 * 2. Watercolour wash: a soft noise paints darker and lighter blotches and a fine
 *    grain inside the shapes only (`atop`), never on the empty mist.
 *
 * All noise is computed on exactly one tile (`stitchTiles`) and repeated with `feTile`,
 * so the texture lines up across tile edges and the pattern stays seamless.
 */
export default function InkFilter({ id, width, height }: InkFilterProps) {
  const tile = { x: 0, y: 0, width, height };
  return (
    <filter
      id={id}
      filterUnits="userSpaceOnUse"
      primitiveUnits="userSpaceOnUse"
      x={-PAD}
      y={-PAD}
      width={width + PAD * 2}
      height={height + PAD * 2}
      colorInterpolationFilters="sRGB"
    >
      {/* 1. Hand-inked wobble. */}
      <feTurbulence
        {...tile}
        type="fractalNoise"
        baseFrequency="0.03"
        numOctaves={2}
        seed={7}
        stitchTiles="stitch"
        result="wobble-tile"
      />
      <feTile in="wobble-tile" result="wobble" />
      <feDisplacementMap
        in="SourceGraphic"
        in2="wobble"
        scale={7}
        xChannelSelector="R"
        yChannelSelector="G"
        result="inked"
      />

      {/* 2. Watercolour wash: R → darker blotches, G → lighter blotches. */}
      <feTurbulence
        {...tile}
        type="fractalNoise"
        baseFrequency="0.014 0.022"
        numOctaves={4}
        seed={23}
        stitchTiles="stitch"
        result="wash-tile"
      />
      <feTile in="wash-tile" result="wash" />
      <feColorMatrix
        in="wash"
        type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.4 0 0 0 -1.05"
        result="shade-mask"
      />
      <feFlood
        className="[flood-color:var(--color-ink)]"
        floodOpacity={0.32}
        result="shade-ink"
      />
      <feComposite
        in="shade-ink"
        in2="shade-mask"
        operator="in"
        result="shade"
      />
      <feColorMatrix
        in="wash"
        type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 -2.4 0 0 1.05"
        result="light-mask"
      />
      <feFlood
        className="[flood-color:var(--color-chalk)]"
        floodOpacity={0.3}
        result="light-chalk"
      />
      <feComposite
        in="light-chalk"
        in2="light-mask"
        operator="in"
        result="light"
      />

      {/* Fine paper grain. */}
      <feTurbulence
        {...tile}
        type="fractalNoise"
        baseFrequency="0.7"
        numOctaves={1}
        seed={41}
        stitchTiles="stitch"
        result="grain-tile"
      />
      <feTile in="grain-tile" result="grain" />
      <feColorMatrix
        in="grain"
        type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 3 0 -1.75"
        result="grain-mask"
      />
      <feFlood
        className="[flood-color:var(--color-ink)]"
        floodOpacity={0.14}
        result="grain-ink"
      />
      <feComposite
        in="grain-ink"
        in2="grain-mask"
        operator="in"
        result="specks"
      />

      <feMerge result="paint">
        <feMergeNode in="shade" />
        <feMergeNode in="light" />
        <feMergeNode in="specks" />
      </feMerge>
      <feComposite in="paint" in2="inked" operator="atop" />
    </filter>
  );
}
