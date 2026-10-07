import type { ReactNode } from "react";

/**
 * Temporary content card for sections that later specs fill in. Text sits on a
 * `mint` surface with `ink` text (manifest §6: text on the field is always on a surface).
 */
export default function PlaceholderCard({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md rounded-card border-outline border-ink bg-mint p-6 text-center text-ink">
      {children}
    </div>
  );
}
