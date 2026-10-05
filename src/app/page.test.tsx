import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home page placeholder", () => {
  it("renders a heading with the heading font token", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass("font-heading");
  });

  it("uses design tokens, not starter utility classes (AC1, AC3)", () => {
    const { container } = render(<Home />);
    const html = container.innerHTML;
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,6}\b/);
    expect(html).not.toMatch(/zinc-|dark:/);
    expect(container.querySelector(".bg-mint")).not.toBeNull();
    expect(container.querySelector(".rounded-card")).not.toBeNull();
    expect(container.querySelector(".border-outline")).not.toBeNull();
  });

  it("no longer contains create-next-app starter content (AC3)", () => {
    const { container } = render(<Home />);
    expect(container).not.toHaveTextContent(/to get started/i);
    expect(container).not.toHaveTextContent(/deploy now/i);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector('a[href*="vercel.com"]')).toBeNull();
  });
});
