import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CopyEmailButton, { MESSAGE_MS } from "./CopyEmailButton";

const EMAIL = "ricardo.martinezc10@gmail.com";

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn(writeText) },
    configurable: true,
  });
  return navigator.clipboard.writeText as ReturnType<typeof vi.fn>;
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

async function click() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Copy email" }));
  });
}

describe("CopyEmailButton — spec 007 US-1 AC4", () => {
  it("copies the email and confirms it in a polite live region for about 2 seconds", async () => {
    const write = mockClipboard(() => Promise.resolve());
    render(<CopyEmailButton email={EMAIL} />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toBeEmptyDOMElement();

    await click();
    expect(write).toHaveBeenCalledWith(EMAIL);
    expect(status).toHaveTextContent("Email copied!");

    act(() => vi.advanceTimersByTime(MESSAGE_MS - 100));
    expect(status).toHaveTextContent("Email copied!");
    act(() => vi.advanceTimersByTime(200));
    expect(status).toBeEmptyDOMElement();
    expect(MESSAGE_MS).toBe(2000);
  });

  it("restarts the timer when clicked again", async () => {
    mockClipboard(() => Promise.resolve());
    render(<CopyEmailButton email={EMAIL} />);
    await click();
    act(() => vi.advanceTimersByTime(1500));
    await click();
    act(() => vi.advanceTimersByTime(1500));
    expect(screen.getByRole("status")).toHaveTextContent("Email copied!");
  });

  it("says 'Copy failed' when the clipboard refuses", async () => {
    mockClipboard(() => Promise.reject(new Error("denied")));
    render(<CopyEmailButton email={EMAIL} />);
    await click();
    expect(screen.getByRole("status")).toHaveTextContent("Copy failed");
  });
});
