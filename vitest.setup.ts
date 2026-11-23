import "@testing-library/jest-dom/vitest";

// jsdom has no matchMedia; components that read media queries (e.g. the
// easter egg's prefers-reduced-motion check) get a "no match" stub.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
