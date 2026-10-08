import { skills, type Skill, type SkillLine } from "@/content/skills";
import BoardStrategy from "./BoardStrategy";
import SkillJersey from "./SkillJersey";

/** Lines from the top of the board (attack) to the bottom (goal). */
const LINES: { line: SkillLine; label: string }[] = [
  { line: "forwards", label: "Forwards" },
  { line: "midfielders", label: "Midfielders" },
  { line: "defenders", label: "Defenders" },
  { line: "goalkeeper", label: "Goalkeeper" },
];

const chalkLine = "border-parchment border-[length:var(--board-line)]";

/** A nail head in one corner of the wooden frame. */
function Nail({ corner }: { corner: string }) {
  return (
    <span
      aria-hidden="true"
      data-board="nail"
      className={`absolute size-2 rounded-full border border-ink bg-forest-bark-shade md:size-2.5 ${corner}`}
    />
  );
}

/**
 * The skills tactics board (spec 004 US-2): a coach's board in a wooden frame,
 * with a dark slate surface (`forest-deep-shade`, distinct from the `pitch-dark`
 * jerseys), `parchment` pitch markings, the coach's chalk strategy, and the eleven
 * skill jerseys standing in a 1-4-3-3 formation — forwards at the top,
 * goalkeeper at the bottom.
 *
 * For screen readers the team is a list grouped by line; the board artwork is

 * decorative. Jerseys take a third of the row (a quarter in the back four), so
 * the goalkeeper is never bigger than the rest; on phones the frame is thin and the board uses the field's side
 * padding, so four defenders fit side by side with readable names.
 */
export default function TacticsBoard({ team = skills }: { team?: Skill[] }) {
  return (
    <div
      data-board="frame"
      className="relative -mx-5 rounded-[1.25rem] border-outline-lg border-ink bg-bark p-1.5 shadow-[4px_5px_0_var(--color-ink)] [--board-line:2px] sm:mx-0 md:p-3 md:[--board-line:3px]"
    >
      <Nail corner="top-1 left-1 md:top-1.5 md:left-1.5" />
      <Nail corner="top-1 right-1 md:top-1.5 md:right-1.5" />
      <Nail corner="bottom-1 left-1 md:bottom-1.5 md:left-1.5" />
      <Nail corner="bottom-1 right-1 md:bottom-1.5 md:right-1.5" />

      <div
        data-board="surface"
        className="relative overflow-hidden rounded-[0.9rem] border-outline border-ink bg-forest-deep-shade px-1 py-6 md:px-6 md:py-10"
      >
        {/* Pitch markings, in chalky parchment. */}
        <div
          aria-hidden="true"
          data-board="markings"
          className="pointer-events-none absolute inset-2 md:inset-3"
        >
          <div
            data-board-marking="boundary"
            className={`absolute inset-0 rounded-[0.4rem] ${chalkLine}`}
          />
          <div
            data-board-marking="halfway"
            className={`absolute inset-x-0 top-1/2 border-t-0 border-x-0 border-b-0 ${chalkLine} !border-t-[length:var(--board-line)]`}
          />
          <div
            data-board-marking="center-circle"
            className={`absolute top-1/2 left-1/2 aspect-square w-[26%] -translate-1/2 rounded-full ${chalkLine}`}
          />
          <div
            data-board-marking="box-top"
            className={`absolute top-0 left-1/2 h-[13%] w-[52%] -translate-x-1/2 border-t-0 ${chalkLine}`}
          />
          <div
            data-board-marking="box-bottom"
            className={`absolute bottom-0 left-1/2 h-[13%] w-[52%] -translate-x-1/2 border-b-0 ${chalkLine}`}
          />
        </div>

        <BoardStrategy />

        <ul
          aria-label="The team, in a 1-4-3-3 formation"
          className="relative flex flex-col gap-4 md:gap-7"
        >
          {LINES.map(({ line, label }) => {
            const players = team.filter((skill) => skill.line === line);
            return (
              <li key={line} data-formation-line={line}>
                <h3 className="sr-only">{label}</h3>
                <ul className="flex justify-evenly md:gap-4">
                  {players.map((skill) => (
                    <li
                      key={skill.name}
                      className={`flex ${players.length > 3 ? "w-1/4" : "w-1/3"} max-w-[8.5rem] min-w-0 justify-center px-px`}
                    >
                      <SkillJersey skill={skill} />
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
