"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Chef } from "@/lib/types";

// Editorial index of the community. On desktop, hovering or focusing a row
// swaps the sticky portrait on the right. On smaller screens the list stands
// alone and each row links straight to the profile.
export function TalentIndex({ chefs }: { chefs: Chef[] }) {
  const [active, setActive] = useState<Chef | null>(chefs[0] ?? null);

  return (
    <div className="grid gap-y-10 lg:grid-cols-2 lg:gap-x-[9px]">
      <ul className="border-t border-divider">
        {chefs.map((chef, i) => (
          <li key={chef.slug} className="border-b border-divider">
            <Link
              href={`/talent/${chef.slug}`}
              onMouseEnter={() => setActive(chef)}
              onFocus={() => setActive(chef)}
              className="group flex items-baseline gap-4 py-5 sm:gap-8 sm:py-7"
            >
              <span className="w-20 shrink-0 text-[11px] font-semibold tabular-nums tracking-[0.2em] text-ink/40">
                BLK{String(i + 1).padStart(3, "0")}
              </span>
              <span className="flex-1 text-3xl font-bold tracking-tight transition-colors group-hover:text-accent sm:text-5xl">
                {chef.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {active && (
        <div className="hidden lg:block lg:sticky lg:top-32 lg:self-start">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-divider">
            <Image
              key={active.slug}
              src={active.portrait}
              alt={active.name}
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <p className="text-sm font-bold">{active.name}</p>
            <p className="text-sm text-ink/60">{active.role}</p>
          </div>
        </div>
      )}
    </div>
  );
}
