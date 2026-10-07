import { noStroke } from "./ink";

/** A rosy, painted cheek. */
export default function Cheek({
  cx,
  cy,
  r = 4,
}: {
  cx: number;
  cy: number;
  r?: number;
}) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={r}
      ry={r * 0.7}
      className={`fill-cartoon-red ${noStroke}`}
      fillOpacity={0.45}
    />
  );
}
