import { isValidElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const fontCalls = vi.hoisted(() => ({
  lilita: [] as unknown[],
  sourceSans: [] as unknown[],
}));

vi.mock("next/font/google", () => ({
  Lilita_One: (options: { variable: string }) => {
    fontCalls.lilita.push(options);
    return { className: "lilita", variable: "lilita-variable", style: {} };
  },
  Source_Sans_3: (options: { variable: string }) => {
    fontCalls.sourceSans.push(options);
    return { className: "source", variable: "source-variable", style: {} };
  },
}));

const { default: RootLayout, metadata } = await import("./layout");

type HtmlProps = { lang: string; className: string; children: ReactElement };

describe("RootLayout fonts (AC2)", () => {
  it("loads Lilita One and Source Sans 3 via next/font/google with swap", () => {
    expect(fontCalls.lilita).toEqual([
      expect.objectContaining({
        weight: "400",
        variable: "--font-lilita-one",
        display: "swap",
      }),
    ]);
    expect(fontCalls.sourceSans).toEqual([
      expect.objectContaining({
        variable: "--font-source-sans-3",
        display: "swap",
      }),
    ]);
  });

  it("exposes both font variables on <html> and uses font-body", () => {
    const tree = RootLayout({
      children: <p>child</p>,
      params: Promise.resolve({}),
    } as Parameters<typeof RootLayout>[0]);
    expect(isValidElement(tree)).toBe(true);
    const html = tree as ReactElement<HtmlProps>;
    expect(html.type).toBe("html");
    expect(html.props.lang).toBe("en");
    expect(html.props.className).toContain("lilita-variable");
    expect(html.props.className).toContain("source-variable");
    const body = html.props.children as ReactElement<{ className: string }>;
    expect(body.props.className).toContain("font-body");
  });
});

describe("RootLayout page shell (US-6 AC2)", () => {
  const markup = () =>
    renderToStaticMarkup(
      RootLayout({
        children: <p>child</p>,
        params: Promise.resolve({}),
      } as Parameters<typeof RootLayout>[0]),
    );

  it("uses semantic <header>, <main> and <footer>, in that order, with lang=en", () => {
    const html = markup();
    expect(html).toMatch(/^<html lang="en"/);
    const header = html.indexOf("<header");
    const main = html.indexOf("<main");
    const footer = html.indexOf("<footer");
    expect(header).toBeGreaterThan(-1);
    expect(main).toBeGreaterThan(header);
    expect(footer).toBeGreaterThan(main);
    expect(html).toMatch(/<main[^>]*id="main"[^>]*>[\s\S]*<p>child<\/p>[\s\S]*<\/main>/);
  });

  it("starts the header with a skip link to the main content", () => {
    expect(markup()).toMatch(
      /<header><a href="#main"[^>]*>Skip to content<\/a>/,
    );
  });

  it("closes the page with a footer sign on a parchment surface", () => {
    expect(markup()).toMatch(
      /<footer[^>]*><p class="[^"]*bg-parchment[^"]*text-ink/,
    );
  });
});

describe("RootLayout metadata (AC3)", () => {
  it("replaces the create-next-app metadata", () => {
    expect(metadata.title).not.toMatch(/create next app/i);
    expect(metadata.description).not.toMatch(/create next app/i);
  });
});
