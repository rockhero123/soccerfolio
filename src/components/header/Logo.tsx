/**
 * The "RM" logo from `design/main.jpg`, redrawn as two cartoon letter blocks
 * with ink outlines: a parchment R and a dark-grass M stepped below it.
 */
export default function Logo() {
  const block =
    "grid size-8 place-items-center rounded-[6px] border-outline border-ink font-heading text-xl leading-none shadow-[2px_2px_0_var(--color-ink)]";
  return (
    <span aria-hidden="true" className="flex items-start">
      <span className={`${block} bg-parchment text-ink`}>R</span>
      <span className={`${block} -ml-1 mt-2.5 bg-pitch-dark text-chalk`}>
        M
      </span>
    </span>
  );
}
