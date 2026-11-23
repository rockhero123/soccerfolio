import { cleanup, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { contactInvite, contactItems } from "@/content/social";
import { contrast, overlay, token } from "@/test/contrast";
import { expectPixelSprite, expectTokensOnly, pixelTokens } from "@/test/pixel";
import { VIGNETTE } from "../FilmOverlay";
import ContactLineup from "./ContactLineup";

afterEach(cleanup);

function renderLineup() {
  const { container } = render(<ContactLineup />);
  return container.querySelector("[data-contact-lineup]") as HTMLElement;
}

const signs = () =>
  within(screen.getByRole("list", { name: "Contact details" })).getAllByRole("link");

describe("ContactLineup — AC1: one wooden sign per item, leaves at its foot", () => {
  it("gives every item its own pixel wooden plank with nails and a leaf garland", () => {
    renderLineup();
    for (const sign of signs()) {
      expect(sign.querySelector('[data-wood="plank"]')).toHaveClass("pixel-frame-wood");
      expect(sign.querySelectorAll('[data-wood="nail"]')).toHaveLength(2);
      const garland = sign.querySelector("[data-leaf-garland]")!;
      expectPixelSprite(garland);
      expect(garland.getAttribute("class")).toMatch(/-bottom-/);
      const tokens = pixelTokens(garland);
      expect(tokens).toContain("leaf-900");
      expect(tokens.filter((t) => t.startsWith("leaf-")).length).toBeGreaterThanOrEqual(4);
    }
  });

  it("uses tokens only", () => {
    expectTokensOnly(renderToStaticMarkup(<ContactLineup />));
  });
});

describe("ContactLineup — AC2: the lineup, two midfielders above two forwards", () => {
  it("lists phone and email as midfielders, LinkedIn and GitHub as forwards", () => {
    const lineup = renderLineup();
    const items = [...lineup.querySelectorAll("li")];
    expect(items.map((li) => li.dataset.line)).toEqual([
      "midfielders",
      "midfielders",
      "forwards",
      "forwards",
    ]);
    expect(signs().map((a) => a.dataset.contact)).toEqual([
      "phone",
      "email",
      "linkedin",
      "github",
    ]);
  });

  it("from 768px pulls the midfielders together and pushes the forwards wide", () => {
    const items = [...renderLineup().querySelectorAll("li")];
    expect(items[0]).toHaveClass("md:justify-end", "md:pr-4");
    expect(items[1]).toHaveClass("md:justify-start", "md:pl-4");
    expect(items[2]).toHaveClass("md:justify-start", "lg:pl-12");
    expect(items[3]).toHaveClass("md:justify-end", "lg:pr-12");
    expect(items[0].parentElement).toHaveClass("md:grid-cols-2");
  });

  it("stacks the signs in one column on phones", () => {
    const list = renderLineup().querySelector("ul")!;
    expect(list).toHaveClass("grid");
    expect(list.className).not.toMatch(/(^|\s)grid-cols-/);
  });
});

describe("ContactLineup — AC3: each sign is one link", () => {
  it("links each sign to its href and shows its label and value", () => {
    renderLineup();
    const links = signs();
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "tel:+573105911019",
      "mailto:ricardo.martinezc10@gmail.com",
      "https://www.linkedin.com/in/ricardomartinez10",
      "https://github.com/rockhero123",
    ]);
    contactItems.forEach(({ label, value }, i) => {
      expect(links[i]).toHaveTextContent(label);
      expect(links[i]).toHaveTextContent(value);
    });
  });

  it("opens LinkedIn and GitHub in a new tab and says so", () => {
    renderLineup();
    for (const name of [/LinkedIn/, /GitHub/]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveTextContent("(opens in a new tab)");
    }
    for (const name of [/Phone/, /^Email/])
      expect(screen.getByRole("link", { name })).not.toHaveAttribute("target");
  });

  it("draws a decorative pixel icon on every sign", () => {
    renderLineup();
    for (const sign of signs()) {
      const icon = sign.querySelector("[data-contact-icon]")!;
      expectPixelSprite(icon);
      expect(pixelTokens(icon)).toContain("ink");
    }
  });

  it("has no email buttons", () => {
    renderLineup();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByText(/send an email|copy email/i)).toBeNull();
  });
});

describe("ContactLineup — AC4: the invitation painted on the grass", () => {
  it("shows only the invitation, in white with a dark pixel edge", () => {
    const paint = renderLineup().querySelector("[data-grass-paint]")!;
    expect(paint).toHaveTextContent(contactInvite);
    expect(contactInvite).toBe("Want to build something together, or just talk football?");
    expect(paint).toHaveClass("text-paper-100", "font-heading");
    expect(paint.className).toMatch(/text-shadow:.*grass-900/);
    expect(paint.closest(".pixel-frame-wood")).toBeNull();
  });

  const chalk = token("paper-100");
  it.each([
    ["the dark stripe", token("grass-800")],
    ["the light stripe", token("grass-700")],
  ] as const)("white on %s stays at least 4.5:1 under the vignette", (_, grass) => {
    expect(contrast(chalk, overlay(grass, token("ink"), VIGNETTE))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(chalk, grass)).toBeGreaterThanOrEqual(4.5);
  });

  it("its dark edge keeps every letter readable over the light speckles", () => {
    expect(contrast(chalk, token("grass-900"))).toBeGreaterThanOrEqual(7);
  });
});

describe("ContactLineup — AC5: readable and keyboard friendly", () => {
  it("burns the sign text into the wood in ink", () => {
    renderLineup();
    for (const sign of signs()) expect(sign).toHaveClass("text-ink");
  });

  it("gives every sign the red focus ring, without outline-none", () => {
    renderLineup();
    for (const sign of signs()) {
      expect(sign).toHaveClass("focus-visible:outline-red-600");
      expect(sign).not.toHaveClass("outline-none");
    }
  });

  it("lets long values wrap after @ and / instead of overflowing", () => {
    renderLineup();
    const email = signs()[1];
    expect(email.querySelector("wbr")).not.toBeNull();
    expect(email.innerHTML).toContain("[overflow-wrap:anywhere]");
  });

  const ink = token("ink");
  it.each([
    ["the boards", token("wood-300")],
    ["a board seam", token("wood-400")],
    ["the paper icon chips", token("paper-200")],
  ] as const)("ink on %s stays at least 4.5:1 under the vignette", (_, bg) => {
    expect(contrast(ink, overlay(bg, ink, VIGNETTE))).toBeGreaterThanOrEqual(4.5);
  });
});
