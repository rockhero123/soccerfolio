import { skills, type Skill, type SkillLine } from "@/content/skills";
import BoardStrategy from "./BoardStrategy";
import SkillJersey from "./SkillJersey";
import PixelArt from "../pixel/PixelArt";
import { NAIL } from "../sprites/props";

/** Lines from the top of the board (attack) to the bottom (goal). */
const LINES: { line: SkillLine; label: string }[] = [
  { line: "forwards", label: "Forwards" },
  { line: "midfielders", label: "Midfielders" },
  { line: "defenders", label: "Defenders" },
  { line: "goalkeeper", label: "Goalkeeper" },
];

/** Chalk lines on the slate: one art pixel wide, a little faded. */
const chalkLine = "border-paper-100/70 border-[length:var(--px)]";

/** A nail head in one corner of the wooden frame. */
function Nail({ corner }: { corner: string }) {
  return (
    <PixelArt
      art={NAIL}
      className={`absolute ${corner}`}
      data={{ "data-board": "nail" }}
    />
  );
}

/**
 * The skills tactics board (spec 004 US-2), in pixel art: a coach's board in a
 * bevelled wooden frame, with a dark slate surface (`stone-800`, distinct from
 * the `pitch-dark` jerseys), chalky `parchment` pitch markings, the coach's chalk strategy, and the eleven
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
      className="relative -mx-5 pixel-frame-board p-[calc(4*var(--px))] [--px:2px] sm:mx-0 sm:[--px:3px] md:[--px:4px]"
    >
      <Nail corner="top-0 left-0" />
      <Nail corner="top-0 right-0" />
      <Nail corner="bottom-0 left-0" />
      <Nail corner="bottom-0 right-0" />

      <div
        data-board="surface"
        className="relative overflow-hidden bg-stone-800 px-0 py-10 md:px-6 md:py-20"
      >
        {/* Pitch markings, in chalky parchment. */}
        <div
          aria-hidden="true"
          data-board="markings"
          className="pointer-events-none absolute inset-[calc(2*var(--px))]"
        >
          <div
            data-board-marking="boundary"
            className={`absolute inset-0 ${chalkLine}`}
          />
          <div
            data-board-marking="halfway"
            className={`absolute inset-x-0 top-1/2 border-t-0 border-x-0 border-b-0 ${chalkLine} !border-t-[length:var(--board-line)]`}
          />
          <div
            data-board-marking="center-circle"
            className={`absolute top-1/2 left-1/2 aspect-square w-[26%] -translate-1/2 ${chalkLine} rounded-full`}
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
          className="relative flex flex-col gap-8 md:gap-20"
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
                      className={`flex ${players.length > 3 ? "w-1/4" : "w-1/3"} min-w-0 justify-center`}
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
