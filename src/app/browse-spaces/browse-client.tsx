"use client";

import { useMemo, useState } from "react";
import { SpaceCard } from "@/components/space-card";
import { PageHeader, RedDot } from "@/components/page-header";
import { suburbs, spaceTypes } from "@/lib/mock-data";
import type { Space } from "@/lib/types";

export function BrowseSpacesClient({ spaces }: { spaces: Space[] }) {
  const [suburb, setSuburb] = useState("");
  const [type, setType] = useState("");
  const [when, setWhen] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);

  const filtered = useMemo(() => {
    return spaces.filter((space) => {
      if (suburb && space.suburb !== suburb) return false;
      if (type && space.type !== type) return false;
      if (maxPrice < 1000 && space.dailyRate > maxPrice) return false;
      return true;
    });
  }, [spaces, suburb, type, maxPrice]);

  const featured = spaces.filter((s) => s.featured);
  const isFiltering = suburb || type || maxPrice < 1000;

  const cellLabel =
    "block text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40";

  return (
    <div className="mx-auto max-w-7xl px-1.5 pb-24 pt-20">
      <PageHeader title="Browse Spaces" caption="Available venues" />

      <div className="relative mt-14">
        <RedDot className="absolute -left-1 top-1/2 hidden -translate-y-1/2 lg:block" />
        <div className="mx-auto flex max-w-4xl flex-col divide-y divide-divider border border-divider bg-white sm:flex-row sm:divide-x sm:divide-y-0">
          <label className="flex-1 px-6 py-4">
            <span className={cellLabel}>Where</span>
            <select
              value={suburb}
              onChange={(e) => setSuburb(e.target.value)}
              className={`mt-1 w-full bg-transparent text-sm outline-none ${
                suburb ? "" : "text-ink/40"
              }`}
            >
              <option value="">City or neighbourhood</option>
              {suburbs.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="flex-1 px-6 py-4">
            <span className={cellLabel}>When</span>
            <input
              type="date"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              className={`mt-1 w-full bg-transparent text-sm outline-none ${
                when ? "" : "text-ink/40"
              }`}
            />
          </label>

          <label className="flex-1 px-6 py-4">
            <span className={cellLabel}>What</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`mt-1 w-full bg-transparent text-sm outline-none ${
                type ? "" : "text-ink/40"
              }`}
            >
              <option value="">Any type</option>
              {spaceTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="flex-1 px-6 py-4">
            <span className={cellLabel}>
              How much — ${maxPrice === 1000 ? "1000+" : maxPrice}/day
            </span>
            <input
              type="range"
              min={0}
              max={1000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-3 w-full accent-accent"
            />
          </label>

          <div className="hidden items-center justify-center px-5 sm:flex">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#CA0000"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>
      </div>

      {!isFiltering && featured.length > 0 && (
        <div className="mt-20 border-t border-divider pt-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            Featured
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((space) => (
              <SpaceCard key={space.slug} space={space} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-20 border-t border-divider pt-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          {isFiltering ? `${filtered.length} spaces` : "All spaces"}
        </h2>
        {filtered.length === 0 ? (
          <p className="mt-6 text-sm text-ink/50">
            No spaces match those filters yet. Try widening your search.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((space) => (
              <SpaceCard key={space.slug} space={space} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
