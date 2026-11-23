import { cleanup, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { contactItems, social } from "@/content/social";
import { contrast, overlay, token } from "@/test/contrast";
import { expectPixelSprite, expectTokensOnly, pixelTokens } from "@/test/pixel";
import { VIGNETTE } from "../FilmOverlay";
import ContactBoard from "./ContactBoard";

afterEach(cleanup);

function renderBoard() {
  const { container } = render(<ContactBoard />);
  return container.querySelector("[data-contact-board]") as HTMLElement;
}

describe("ContactBoard — AC1: a wooden board with leaves at its foot", () => {
  it("draws the pixel wooden plank with its nails", () => {
    const board = renderBoard();
    expect(board.querySelector('[data-wood="plank"]')).toHaveClass("pixel-frame-wood");
    expect(board.querySelectorAll('[data-wood="nail"]')).toHaveLength(2);
  });

  it("grows a garland of shaded leaves along its bottom edge", () => {
    const garland = renderBoard().querySelector("[data-leaf-garland]")!;
    expectPixelSprite(garland);
    expect(garland.getAttribute("class")).toMatch(/-bottom-/);
    const tokens = pixelTokens(garland);
    expect(tokens).toContain("leaf-900");
    expect(tokens.filter((t) => t.startsWith("leaf-")).length).toBeGreaterThanOrEqual(4);
  });

  it("uses tokens only", () => {
    expectTokensOnly(renderToStaticMarkup(<ContactBoard />));
  });
});

describe("ContactBoard — AC2: phone, email, LinkedIn and GitHub", () => {
  it("lists the four items in order, each one link with its href and value", () => {
    renderBoard();
    const list = screen.getByRole("list", { name: "Contact details" });
    const links = within(list).getAllByRole("link");
    expect(links.map((a) => a.getAttribute("data-contact"))).toEqual([
      "phone",
      "email",
      "linkedin",
      "github",
    ]);
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

  it("shows the values from the CV", () => {
    renderBoard();
    for (const text of [
      "+57 310 591 1019",
      "ricardo.martinezc10@gmail.com",
      "linkedin.com/in/ricardomartinez10",
      "github.com/rockhero123",
    ])
      expect(screen.getByText((_, el) => el?.textContent === text && el.tagName === "SPAN")).toBeInTheDocument();
  });

  it("opens LinkedIn and GitHub in a new tab and says so", () => {
    renderBoard();
    for (const name of [/LinkedIn/, /GitHub/]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveTextContent("(opens in a new tab)");
    }
    for (const name of [/Phone/, /^Email/]) {
      expect(screen.getByRole("link", { name })).not.toHaveAttribute("target");
    }
  });

  it("draws a decorative pixel icon for every item", () => {
    const board = renderBoard();
    for (const kind of ["phone", "email", "linkedin", "github"]) {
      const icon = board.querySelector(`[data-contact-icon="${kind}"]`)!;
      expectPixelSprite(icon);
      expect(pixelTokens(icon)).toContain("ink");
    }
  });
});

describe("ContactBoard — AC3/AC4: the email actions", () => {
  it("has a primary 'Send an email' button linking to the mailto address", () => {
    renderBoard();
    const send = screen.getByRole("link", { name: "Send an email" });
    expect(send).toHaveAttribute("href", `mailto:${social.email}`);
    expect(send).toHaveClass("pixel-button", "bg-gold-500", "text-ink");
  });

  it("has a 'Copy email' button", () => {
    renderBoard();
    expect(screen.getByRole("button", { name: "Copy email" })).toHaveClass("pixel-button");
  });
});

describe("ContactBoard — AC6: readable and keyboard friendly", () => {
  it("burns every text into the wood in ink", () => {
    const board = renderBoard();
    expect(board.querySelector(":scope > div.relative")).toHaveClass("text-ink");
  });

  it("gives links and buttons the red focus ring", () => {
    renderBoard();
    for (const el of [...screen.getAllByRole("link"), screen.getByRole("button")])
      expect(el).toHaveClass("focus-visible:outline-red-600");
  });

  it("lets long values wrap instead of overflowing", () => {
    const board = renderBoard();
    const email = board.querySelector('[data-contact="email"]')!;
    expect(email.querySelector("wbr")).not.toBeNull();
    expect(email.innerHTML).toContain("[overflow-wrap:anywhere]");
  });

  const ink = token("ink");
  it.each([
    ["the boards", token("wood-300")],
    ["a board seam", token("wood-400")],
    ["the paper chips and copy button", token("paper-200")],
    ["the send button", token("gold-500")],
  ] as const)("ink on %s stays at least 4.5:1 under the vignette", (_, bg) => {
    expect(contrast(ink, overlay(bg, ink, VIGNETTE))).toBeGreaterThanOrEqual(4.5);
  });
});
