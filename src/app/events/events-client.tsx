"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/event-card";
import type { Event } from "@/lib/types";

const filters = ["All", "This Week", "This Month", "Free", "Past"] as const;
type Filter = (typeof filters)[number];

const ranges = [
  { key: "pm7", label: "±7 days", phrase: "within ±7 days of" },
  { key: "week", label: "Week of", phrase: "in the week of" },
  { key: "next14", label: "Next 14 days", phrase: "in the 14 days from" },
] as const;
type Range = (typeof ranges)[number]["key"];

const DAY = 86400000;

function isoDay(t: number) {
  return new Date(t).toISOString().slice(0, 10);
}

function windowFor(iso: string, range: Range): [string, string] {
  const [y, m, d] = iso.split("-").map(Number);
  const base = Date.UTC(y, m - 1, d);
  if (range === "pm7") return [isoDay(base - 7 * DAY), isoDay(base + 7 * DAY)];
  if (range === "next14") return [isoDay(base), isoDay(base + 14 * DAY)];
  const offsetToMonday = (new Date(base).getUTCDay() + 6) % 7;
  const monday = base - offsetToMonday * DAY;
  return [isoDay(monday), isoDay(monday + 6 * DAY)];
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function EventsClient({
  events,
  chefNames,
}: {
  events: Event[];
  chefNames: Record<string, string>;
}) {
  const [filter, setFilter] = useState<Filter>("All");
  const [date, setDate] = useState("");
  const [range, setRange] = useState<Range>("pm7");

  const dateWindow = date ? windowFor(date, range) : null;

  const filtered = useMemo(() => {
    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);
    const monthEnd = new Date(now);
    monthEnd.setMonth(now.getMonth() + 1);

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      if (dateWindow) {
        const day = event.date.slice(0, 10);
        if (day < dateWindow[0] || day > dateWindow[1]) return false;
      } else if (filter === "This Week") {
        return eventDate >= now && eventDate <= weekEnd;
      } else if (filter === "This Month") {
        return eventDate >= now && eventDate <= monthEnd;
      }
      if (filter === "Free") return event.price === "Free";
      if (filter === "Past") return eventDate < now;
      return true;
    });
  }, [events, filter, dateWindow]);

  function chooseFilter(f: Filter) {
    setFilter(f);
    if (f === "All" || f === "This Week" || f === "This Month") setDate("");
  }

  function chooseDate(value: string) {
    setDate(value);
    if (value && (filter === "This Week" || filter === "This Month")) {
      setFilter("All");
    }
  }

  const count = `${filtered.length} ${filtered.length === 1 ? "event" : "events"}`;
  const heading = date
    ? `${count} ${
        ranges.find((r) => r.key === range)?.phrase
      } ${formatDay(date)}`
    : filter === "All"
    ? "All events"
    : count;

  return (
    <div className="px-[9px] pb-24 pt-20">
      <div>
        <h1 className="text-6xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-[100px]">
          Events
        </h1>
        <p className="mt-4 text-[11px] font-semibold text-ink/40">
          Melbourne&rsquo;s best pop-up dining, presented by Blanked
        </p>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => chooseFilter(f)}
            className={`px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
              filter === f && !date
                ? "bg-accent text-white"
                : "bg-white text-ink/50 hover:text-ink"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-stretch justify-center border border-divider bg-white font-mono text-xs uppercase tracking-[0.1em] text-ink/60">
        <label className="flex w-full items-center justify-between gap-2 px-4 py-3 sm:w-auto sm:justify-start">
          <span>Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => chooseDate(e.target.value)}
            className="bg-transparent text-ink outline-none"
          />
        </label>
        <label className="flex w-full items-center justify-between gap-2 border-t border-divider px-4 py-3 sm:w-auto sm:justify-start sm:border-l sm:border-t-0">
          <span>Range</span>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as Range)}
            className="bg-transparent text-ink outline-none"
          >
            {ranges.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        {date && (
          <button
            type="button"
            onClick={() => setDate("")}
            className="w-full border-t border-divider px-4 py-3 text-left text-ink/50 hover:text-ink sm:w-auto sm:border-l sm:border-t-0"
          >
            Clear ×
          </button>
        )}
      </div>

      <div className="mt-12 border-t border-divider pt-8">
        <h2 className="text-[11px] font-semibold text-ink/40">
          {heading}
        </h2>
        {filtered.length === 0 ? (
          <p className="mt-6 text-sm text-ink/50">
            No events in this window yet — check back soon.
          </p>
        ) : (
          <div className="-mx-[3px] mt-6 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
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
