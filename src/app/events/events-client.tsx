"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/event-card";
import type { Event } from "@/lib/types";

const filters = ["All", "This Week", "This Month", "Free", "Past"] as const;
type Filter = (typeof filters)[number];

export function EventsClient({
  events,
  chefNames,
}: {
  events: Event[];
  chefNames: Record<string, string>;
}) {
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);
    const monthEnd = new Date(now);
    monthEnd.setMonth(now.getMonth() + 1);

    return events.filter((event) => {
      const date = new Date(event.date);
      if (filter === "This Week") return date >= now && date <= weekEnd;
      if (filter === "This Month") return date >= now && date <= monthEnd;
      if (filter === "Free") return event.price === "Free";
      if (filter === "Past") return date < now;
      return true;
    });
  }, [events, filter]);

  return (
    <div className="px-1.5 pb-24 pt-20">
      <div>
        <h1 className="text-6xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-[100px]">
          Events
        </h1>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          Melbourne&rsquo;s best pop-up dining, presented by Blanked
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
              filter === f
                ? "bg-[#442220] text-white"
                : "bg-white text-ink/50 hover:text-ink"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-12 border-t border-divider pt-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          {filter === "All" ? "All events" : `${filtered.length} events`}
        </h2>
        {filtered.length === 0 ? (
          <p className="mt-6 text-sm text-ink/50">
            No events in this window yet — check back soon.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((event) => (
              <EventCard
                key={event.slug}
                event={event}
                chefName={chefNames[event.chefSlug]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
