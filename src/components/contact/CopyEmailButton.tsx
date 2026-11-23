"use client";

import { useEffect, useRef, useState } from "react";

type Status = "" | "copied" | "failed";

const MESSAGES: Record<Status, string> = {
  "": "",
  copied: "Email copied!",
  failed: "Copy failed",
};

/** How long the confirmation stays, in ms. */
export const MESSAGE_MS = 2000;

/**
 * Copies Ricardo's email to the clipboard (spec 007 US-1 AC4) and confirms it
 * for about 2 seconds in a polite live region, so screen readers hear it too.
 */
export default function CopyEmailButton({
  email,
  className = "",
}: {
  email: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    let next: Status = "copied";
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      next = "failed";
    }
    setStatus(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), MESSAGE_MS);
  }

  return (
    <span className="flex flex-col items-center gap-2">
      <button type="button" onClick={copy} className={className}>
        Copy email
      </button>
      <span
        role="status"
        aria-live="polite"
        data-copy-status=""
        className="min-h-6 font-body text-base font-medium text-ink"
      >
        {MESSAGES[status]}
      </span>
    </span>
  );
}
