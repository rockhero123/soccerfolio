import { isValidElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const fontCalls = vi.hoisted(() => ({
  jersey: [] as unknown[],
  pixelify: [] as unknown[],
}));

vi.mock("next/font/google", () => ({
  Jersey_10: (options: { variable: string }) => {
    fontCalls.jersey.push(options);
    return { className: "jersey", variable: "jersey-variable", style: {} };
  },
  Pixelify_Sans: (options: { variable: string }) => {
    fontCalls.pixelify.push(options);
    return { className: "pixelify", variable: "pixelify-variable", style: {} };
  },
}));

const { default: RootLayout, metadata } = await import("./layout");

type HtmlProps = {
  lang: string;
  className: string;
  children: ReactElement | ReactElement[];
};

describe("RootLayout fonts (AC2)", () => {
  it("loads Jersey 10 and Pixelify Sans via next/font/google with swap", () => {
    expect(fontCalls.jersey).toEqual([
      expect.objectContaining({
        weight: "400",
        variable: "--font-jersey-10",
        display: "swap",
      }),
    ]);
    expect(fontCalls.pixelify).toEqual([
      expect.objectContaining({
        variable: "--font-pixelify-sans",
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
    expect(html.props.className).toContain("jersey-variable");
    expect(html.props.className).toContain("pixelify-variable");
    // <html> holds <head> (the theater script) and <body>.
    const children = [html.props.children].flat() as ReactElement<{
      className: string;
    }>[];
    const body = children.find((child) => child.type === "body")!;
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
    expect(html).toMatch(
      /<main[^>]*id="main"[^>]*>[\s\S]*<p>child<\/p>[\s\S]*<\/main>/,
    );
  });

  it("starts the header with a skip link to the main content", () => {
    expect(markup()).toMatch(
      /<header><a href="#main"[^>]*>Skip to content<\/a>/,
    );
  });

  it("closes the page with a footer sign: a pixel button on parchment paper", () => {
    expect(markup()).toMatch(
      /<footer[^>]*><p class="[^"]*pixel-button[^"]*bg-paper-200[^"]*text-ink/,
    );
  });
});

describe("RootLayout metadata (AC3)", () => {
  it("titles the page with the name and the role Software Engineer (spec 002 US-2 AC4)", () => {
    expect(metadata.title).toBe("Ricardo Martinez — Software Engineer");
  });

  it("replaces the create-next-app metadata", () => {
    expect(metadata.title).not.toMatch(/create next app/i);
    expect(metadata.description).not.toMatch(/create next app/i);
  });
});
