import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import TitleBanner from "./TitleBanner";

afterEach(cleanup);

describe("TitleBanner — AC1: <h2> on a title banner with GrassStrip", () => {
  it("renders the title as an <h2> with the given id, in the heading font", () => {
    render(<TitleBanner title="Skills" headingId="skills-title" />);
    const heading = screen.getByRole("heading", { level: 2, name: "Skills" });
    expect(heading).toHaveAttribute("id", "skills-title");
    expect(heading).toHaveClass("font-heading");
  });

  it("grows a decorative grass strip along its bottom edge", () => {
    const { container } = render(<TitleBanner title="Skills" headingId="t" />);
    const grass = container.querySelector("[data-grass-strip]")!;
    expect(grass).toHaveAttribute("aria-hidden", "true");
    expect(grass).toHaveClass("absolute", "bottom-0");
  });

  it.each([
    ["dark", "bg-pitch-dark", "text-chalk"],
    ["bright", "bg-pitch", "text-ink"],
  ] as const)(
    "the %s tone uses an allowed manifest §6 pair (%s with %s)",
    (tone, bg, text) => {
      const { container } = render(
        <TitleBanner title="T" headingId="t" tone={tone} />,
      );
      const banner = container.querySelector("[data-title-banner]")!;
      expect(banner).toHaveClass(bg, text);
      // Never chalk text on bright pitch.
      expect(banner.className).not.toMatch(
        /bg-pitch\s.*text-chalk|text-chalk.*bg-pitch(\s|$)/,
      );
    },
  );

  it("looks like a rubber-hose sign: ink outline and cartoon drop shadow", () => {
    const { container } = render(<TitleBanner title="T" headingId="t" />);
    expect(container.querySelector("[data-title-banner]")).toHaveClass(
      "border-outline",
      "border-ink",
      "shadow-[4px_4px_0_var(--color-ink)]",
    );
  });
});
