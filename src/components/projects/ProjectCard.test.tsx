import { cleanup, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { projects, type Project } from "@/content/projects";
import ProjectCard from "./ProjectCard";
import ProjectGrid from "./ProjectGrid";

afterEach(cleanup);

const ORDER = [
  "Jogo",
  "Lime Delivery",
  "Sensturo",
  "Ingaser",
  "Borondo",
  "Move On",
  "Hockey Town",
  "Wild Friends",
];

const base: Project = {
  ...projects[0],
  slug: "fixture",
  title: "Fixture",
  liveUrl: undefined,
  repoUrl: undefined,
};

describe("ProjectGrid — AC1: a card per project, in order", () => {
  it("renders every project from projects.ts, in the spec order", () => {
    render(<ProjectGrid />);
    const titles = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(titles).toEqual(ORDER);
    expect(projects.map((p) => p.title)).toEqual(ORDER);
  });

  it("uses the design thumbnails from public/images/projects", () => {
    const files = projects.map((p) => p.image.src.split("/").pop());
    expect(files).toEqual([
      "p10.png",
      "p3.png",
      "p1.png",
      "p12.png",
      "p2.png",
      "p9.png",
      "p4.png",
      "p7.png",
    ]);
    projects.forEach((p) =>
      expect(p.image.src).toMatch(/^\/images\/projects\//),
    );
  });
});

describe("ProjectCard — AC2: image, title, summary, tech and existing links", () => {
  it("shows a lazy preview image with alt text, the title, summary and tech tags", () => {
    const { container } = render(<ProjectCard project={projects[0]} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", projects[0].image.alt);
    expect(img).toHaveAttribute("loading", "lazy");
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Jogo");
    expect(container).toHaveTextContent(projects[0].summary);
    const tags = within(
      screen.getByRole("list", { name: "Tech stack" }),
    ).getAllByRole("listitem");
    expect(tags.map((t) => t.textContent)).toEqual(projects[0].tech);
  });

  it("keeps every summary to 1–2 sentences", () => {
    projects.forEach((p) => {
      const sentences = p.summary.split(/(?<=[.!?])\s+/).filter(Boolean);
      expect(sentences.length, p.title).toBeLessThanOrEqual(2);
    });
  });

  it("links to the live site and repository when they exist, in a new tab", () => {
    render(
      <ProjectCard
        project={{
          ...base,
          liveUrl: "https://live.example",
          repoUrl: "https://repo.example",
        }}
      />,
    );
    const live = screen.getByRole("link", { name: /Live site/ });
    const code = screen.getByRole("link", { name: /Code/ });
    expect(live).toHaveAttribute("href", "https://live.example");
    expect(code).toHaveAttribute("href", "https://repo.example");
    for (const a of [live, code]) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("renders no empty links when the URLs are missing", () => {
    render(<ProjectCard project={base} />);
    expect(screen.queryByRole("link", { name: /Live site|Code/ })).toBeNull();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });
});

describe("ProjectCard — AC3: pixel card with grass", () => {
  it("is a paper menu box with a wooden pixel frame, ink text and pixel grass at the bottom", () => {
    const { container } = render(<ProjectCard project={projects[0]} />);
    const card = container.querySelector("[data-project]")!;
    expect(card).toHaveClass("pixel-frame-paper", "text-ink");
    expect(card.className).not.toMatch(/rounded/);
    const grass = card.querySelector("[data-grass-strip]")!;
    expect(grass).toHaveAttribute("aria-hidden", "true");
    expect(grass).toHaveClass("absolute", "-bottom-[calc(2*var(--px))]");
  });

  it("shows tags as pixel chips and links as pixel buttons", () => {
    const { container } = render(<ProjectCard project={projects[0]} />);
    container
      .querySelectorAll('[aria-label="Tech stack"] li')
      .forEach((tag) => expect(tag).toHaveClass("bg-paper-300"));
    expect(screen.getByRole("link", { name: /Live site/ })).toHaveClass(
      "pixel-button",
      "bg-gold-500",
      "text-ink",
    );
  });

  it("uses tokens only", () => {
    const html = renderToStaticMarkup(<ProjectGrid />);
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![-\w])/);
  });
});

describe("ProjectCard — AC4: the whole card opens the detail view", () => {
  it("has one focusable open link to #project-<slug>, stretched over the card", () => {
    render(<ProjectCard project={projects[0]} />);
    const open = screen.getByRole("link", { name: "Jogo — view details" });
    expect(open).toHaveAttribute("href", "#project-jogo");
    expect(open.className).toContain("after:absolute");
    expect(open.className).toContain("after:inset-0");
  });

  it("does not nest interactive elements, and raises the live/repo links above the open link", () => {
    const { container } = render(<ProjectCard project={projects[0]} />);
    container
      .querySelectorAll("a")
      .forEach((a) => expect(a.querySelector("a, button")).toBeNull());
    expect(screen.getByRole("link", { name: /Live site/ })).toHaveClass(
      "relative",
      "z-10",
    );
  });

  it("gives every project a unique slug", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9-]+$/));
  });
});

describe("ProjectGrid — AC5: responsive columns", () => {
  it("is 1 column on phones, 2 from 768px and 3 from 1280px", () => {
    const { container } = render(<ProjectGrid />);
    expect(container.querySelector("[data-project-grid]")).toHaveClass(
      "grid-cols-1",
      "md:grid-cols-2",
      "xl:grid-cols-3",
    );
  });
});
