"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { NavGrid } from "@/components/nav-grid";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Home renders the full nav grid inside its hero — no top box there.
  if (pathname === "/") return null;

  return (
    <header className="sticky top-4 z-50 flex flex-col items-center pt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="border border-divider bg-white px-8 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-background"
      >
        Blanked
      </button>
      {open && (
        <div className="mt-1 w-full max-w-xl px-4">
          <NavGrid variant="light" onNavigate={() => setOpen(false)} />
        </div>
      )}
    </header>
  );
}
