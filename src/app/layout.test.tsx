import { isValidElement, type ReactElement } from "react";
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

describe("RootLayout metadata (AC3)", () => {
  it("replaces the create-next-app metadata", () => {
    expect(metadata.title).not.toMatch(/create next app/i);
    expect(metadata.description).not.toMatch(/create next app/i);
  });
});
