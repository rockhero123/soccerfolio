import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cleanup, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { hero } from "@/content/hero";
import { site } from "@/content/site";
import EnchantedMirror from "./EnchantedMirror";

afterEach(cleanup);

function renderMirror() {
  const { container } = render(
    <EnchantedMirror portrait={<svg role="img" aria-label="Portrait" />} />,
  );
  const frame = container.querySelector('[data-mirror="frame"]') as HTMLElement;
  return { container, frame };
}

describe("EnchantedMirror — AC1: an ornate enchanted mirror with grass", () => {
  it("draws a rounded, polished silver frame with an ink outline around the glass", () => {
    const { frame } = renderMirror();
    const rim = frame.querySelector(".bg-silver")!;
    expect(rim).toHaveClass("border-ink", "border-outline-lg");
    // A metallic gradient from light to shaded silver.
    expect(rim).toHaveClass(
      "bg-linear-135",
      "from-silver-light",
      "via-silver",
      "to-silver-shade",
    );
    expect(rim.className).toMatch(/rounded-\[/);
    const glass = rim.querySelector(".bg-mint")!;
    expect(glass).toHaveClass("border-ink");
    expect(glass.className).toMatch(/rounded-\[/);
  });

  it("is magical: silver sparkles and painted shine on the glass, with no crest", () => {
    const { frame } = renderMirror();
    expect(frame.querySelector('[data-mirror="crest"]')).toBeNull();
    frame
      .querySelectorAll('[data-mirror="sparkle"] path')
      .forEach((p) => expect(p).toHaveClass("fill-silver-light"));
    expect(
      frame.querySelectorAll('[data-mirror="sparkle"]').length,
    ).toBeGreaterThanOrEqual(3);
    expect(
      frame.querySelector('[data-mirror="shine"] .fill-chalk'),
    ).not.toBeNull();
  });

  it("grows tall grass along its bottom edge", () => {
    const { frame } = renderMirror();
    const grass = frame.querySelector("[data-grass-strip]")!;
    expect(grass).toHaveClass("absolute", "bottom-0");
    expect(grass.parentElement).toBe(frame);
  });

  it("holds the portrait inside the glass", () => {
    const { frame } = renderMirror();
    const glass = frame.querySelector(".bg-mint")!;
    expect(
      within(glass as HTMLElement).getByRole("img", { name: "Portrait" }),
    ).toBeInTheDocument();
  });

  it("keeps all the ornaments decorative", () => {
    const { frame } = renderMirror();
    frame
      .querySelectorAll('[data-mirror="sparkle"], [data-mirror="shine"]')
      .forEach((el) => expect(el).toHaveAttribute("aria-hidden", "true"));
  });
});

describe("EnchantedMirror — AC2/AC3: nickname and role", () => {
  it('shows "Richi" in bold as the only <h1>, named "Ricardo Martinez (Richi)"', () => {
    const { frame } = renderMirror();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveAccessibleName("Ricardo Martinez (Richi)");
    expect(h1).toHaveClass("font-heading");
    // Only the nickname is drawn; the full name is for screen readers and search.
    expect(h1.querySelector('[aria-hidden="true"]')).toHaveTextContent(
      /^Richi$/,
    );
    expect(h1.querySelector(".sr-only")).toHaveTextContent(
      /^Ricardo Martinez \(Richi\)$/,
    );
    expect(frame.querySelectorAll("h1")).toHaveLength(1);
  });

  it("shows the role below the name in regular weight", () => {
    const { frame } = renderMirror();
    const role = frame.querySelector('[data-mirror="role"]')!;
    expect(role).toHaveTextContent("Software Engineer");
    expect(role).toHaveClass("font-body", "font-normal");
    const h1 = frame.querySelector("h1")!;
    expect(
      h1.compareDocumentPosition(role) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});

describe("EnchantedMirror — AC4: name and role from the content files", () => {
  it("takes the nickname, full name and role from hero.ts / site.ts", () => {
    expect(hero.nickname).toBe("Richi");
    expect(hero.name).toBe(site.name);
    expect(hero.role).toBe(site.role);
    expect(site.role).toBe("Software Engineer");
  });
});

describe("EnchantedMirror — AC5: readable text in tokens only", () => {
  it("puts ink text on the mint glass (an allowed manifest §6 pair)", () => {
    const { frame } = renderMirror();
    const text = frame.querySelector("h1")!.parentElement!;
    expect(text).toHaveClass("text-ink");
    expect(text.closest(".bg-mint")).not.toBeNull();
  });

  it("mixes its silver tones from the ink and chalk tokens", () => {
    const css = readFileSync(
      join(process.cwd(), "src/app/globals.css"),
      "utf8",
    );
    for (const name of ["silver-light", "silver", "silver-shade"]) {
      const value = css.match(new RegExp(`--color-${name}:\\s*([^;]+);`))![1];
      expect(value).toMatch(
        /^color-mix\(in oklab, var\(--color-ink\) \d+%, var\(--color-chalk\)\)$/,
      );
    }
  });

  it("uses no raw hex colours", () => {
    const html = renderToStaticMarkup(<EnchantedMirror portrait={null} />);
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![-\w])/);
    expect(html).not.toMatch(/(fill|stroke)="(?!url\(|none)/);
  });
});
