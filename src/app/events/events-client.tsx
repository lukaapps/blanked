"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/event-card";
import { PageHeader } from "@/components/page-header";
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
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-20">
      <PageHeader
        title="Events"
        caption="Melbourne's best pop-up dining, presented by Blanked"
      />

      <div className="mt-12 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
              filter === f
                ? "bg-ink text-background"
                : "bg-white text-ink/50 hover:text-ink"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-sm text-ink/50">
          No events in this window yet — check back soon.
        </p>
      ) : (
        <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
