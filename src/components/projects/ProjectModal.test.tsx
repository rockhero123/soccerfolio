import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { projects } from "@/content/projects";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

// jsdom has <dialog> but not the modal methods; mimic them on the `open` attribute.
beforeEach(() => {
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.removeAttribute("open");
  };
});

afterEach(() => {
  cleanup();
  history.replaceState(null, "", "/");
  document.documentElement.style.overflow = "";
});

const bySlug = (slug: string) => projects.find((p) => p.slug === slug)!;

function openAt(slug: string, withCard = false) {
  history.replaceState(null, "", `/#project-${slug}`);
  const utils = render(
    <>
      {withCard && <ProjectCard project={bySlug(slug)} />}
      <ProjectModal />
    </>,
  );
  return { ...utils, dialog: document.querySelector("dialog")! };
}

describe("ProjectModal — opens from the project's link", () => {
  it("stays closed without a #project- hash and opens for one", () => {
    render(<ProjectModal />);
    expect(document.querySelector("dialog")).not.toHaveAttribute("open");
    cleanup();
    const { dialog } = openAt("jogo");
    expect(dialog).toHaveAttribute("open");
  });

  it("opens when the hash changes, e.g. after a card click", () => {
    render(<ProjectModal />);
    act(() => {
      history.replaceState(null, "", "/#project-borondo");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Borondo",
    );
  });

  it("ignores unknown projects", () => {
    const { dialog } = openAt("nope");
    expect(dialog).not.toHaveAttribute("open");
  });
});

describe("ProjectModal — AC1: every field, and images", () => {
  it("shows title, description, date, client, category, tech and the live link", () => {
    const { dialog } = openAt("jogo");
    const p = bySlug("jogo");
    const panel = within(dialog);
    expect(panel.getByRole("heading", { level: 2 })).toHaveTextContent(p.title);
    for (const text of [p.description, p.date, p.client, p.category]) {
      expect(dialog).toHaveTextContent(text);
    }
    const tags = within(
      panel.getByRole("list", { name: "Tech stack" }),
    ).getAllByRole("listitem");
    expect(tags.map((t) => t.textContent)).toEqual(p.tech);
    expect(panel.getByRole("link", { name: /Live site/ })).toHaveAttribute(
      "href",
      p.liveUrl,
    );
    expect(panel.queryByRole("link", { name: /Code/ })).toBeNull();
  });

  it("shows all the project's portraits with alt text", () => {
    const { dialog } = openAt("wild-friends");
    const imgs = within(dialog).getAllByRole("img");
    expect(imgs.map((i) => i.getAttribute("alt"))).toEqual(
      bySlug("wild-friends").portraits.map((p) => p.alt),
    );
  });

  it("shows the preview image for projects without portraits", () => {
    for (const slug of ["sensturo", "move-on", "hockey-town"]) {
      const { dialog } = openAt(slug);
      expect(bySlug(slug).portraits).toHaveLength(0);
      const imgs = within(dialog).getAllByRole("img");
      expect(imgs.map((i) => i.getAttribute("alt"))).toEqual([
        bySlug(slug).image.alt,
      ]);
      cleanup();
    }
  });

  it("has no empty links when a project has no URLs", () => {
    const { dialog } = openAt("sensturo");
    expect(within(dialog).queryByRole("link")).toBeNull();
  });
});

describe("ProjectModal — AC2: scrolls inside, the page stays still", () => {
  it("lets the panel scroll and locks the page while open", () => {
    const { dialog } = openAt("lime-delivery");
    const panel = dialog.querySelector("[data-modal-panel]")!;
    expect(panel).toHaveClass("overflow-y-auto");
    expect(panel.className).toContain("max-h-[min(90dvh,56rem)]");
    expect(document.documentElement.style.overflow).toBe("hidden");
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(document.documentElement.style.overflow).toBe("");
  });
});

describe("ProjectModal — AC3: X, Escape and backdrop close it", () => {
  it("closes with the X button and clears the hash", () => {
    const { dialog } = openAt("jogo");
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(dialog).not.toHaveAttribute("open");
    expect(location.hash).toBe("");
  });

  it("closes with Escape (the dialog's cancel event)", () => {
    const { dialog } = openAt("jogo");
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(dialog).not.toHaveAttribute("open");
    expect(location.hash).toBe("");
  });

  it("closes on a backdrop click but not on a click inside the panel", () => {
    const { dialog } = openAt("jogo");
    fireEvent.click(dialog.querySelector("[data-modal-panel] p")!);
    expect(dialog).toHaveAttribute("open");
    fireEvent.click(dialog);
    expect(dialog).not.toHaveAttribute("open");
  });
});

describe("ProjectModal — AC4: an accessible dialog", () => {
  it("is a modal dialog labelled by the project title", () => {
    openAt("ingaser");
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("Ingaser");
  });

  it("moves focus to Close on open and back to the card on close", () => {
    openAt("ingaser", true);
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(
      screen.getByRole("link", { name: "Ingaser — view details" }),
    ).toHaveFocus();
  });
});

describe("ProjectModal — AC5: cartoon style", () => {
  it("is a rounded mint panel with an ink outline and ink text", () => {
    const { dialog } = openAt("jogo");
    expect(dialog.querySelector("[data-modal-panel]")).toHaveClass(
      "bg-mint",
      "text-ink",
      "border-ink",
      "border-outline-lg",
      "rounded-card",
    );
  });
});
