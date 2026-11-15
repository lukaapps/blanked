"use client";

import { useEffect, useRef, useState } from "react";

export type DateRange = { start: string | null; end: string | null };

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromISO(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatShort(s: string) {
  return fromISO(s).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
  });
}

function label({ start, end }: DateRange) {
  if (!start) return "Any date";
  if (!end) return `From ${formatShort(start)}`;
  if (start === end) return formatShort(start);
  return `${formatShort(start)} – ${formatShort(end)}`;
}

// Click a start day, then click an end day. Clicking before the start
// restarts the range. Once both are set the picker closes.
export function DateRangePicker({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (v: DateRange) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [view, setView] = useState(() => {
    const base = value.start ? fromISO(value.start) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const today = toISO(new Date());
  const year = view.getFullYear();
  const month = view.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (view.getDay() + 6) % 7; // weeks start on Monday
  const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  function pick(iso: string) {
    const { start, end } = value;
    if (!start || end || iso < start) {
      onChange({ start: iso, end: null });
      return;
    }
    onChange({ start, end: iso });
    setOpen(false);
  }

  function inRange(iso: string) {
    const { start, end } = value;
    if (!start) return false;
    if (end) return iso >= start && iso <= end;
    if (hover && hover >= start) return iso >= start && iso <= hover;
    return false;
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="block w-full px-6 py-4 text-left"
      >
        <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40">
          When
        </span>
        <span
          className={`mt-1 block text-sm ${value.start ? "" : "text-ink/40"}`}
        >
          {label(value)}
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 border border-divider bg-white p-4 sm:right-auto sm:w-[20rem]">
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              disabled={view <= currentMonthStart}
              onClick={() => setView(new Date(year, month - 1, 1))}
              className="px-2 py-1 text-sm text-ink/60 transition-colors hover:text-ink disabled:text-ink/20"
            >
              ←
            </button>
            <p className="text-sm font-semibold">
              {view.toLocaleDateString("en-AU", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setView(new Date(year, month + 1, 1))}
              className="px-2 py-1 text-sm text-ink/60 transition-colors hover:text-ink"
            >
              →
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAYS.map((d) => (
              <span
                key={d}
                className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/40"
              >
                {d}
              </span>
            ))}

            {Array.from({ length: offset }).map((_, i) => (
              <span key={`pad-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const iso = toISO(new Date(year, month, day));
              const past = iso < today;
              const isStart = iso === value.start;
              const isEnd = iso === value.end;
              const selected = isStart || isEnd;
              const between = inRange(iso) && !selected;
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={past}
                  onClick={() => pick(iso)}
                  onMouseEnter={() => setHover(iso)}
                  onMouseLeave={() => setHover(null)}
                  aria-pressed={selected}
                  className={`mx-auto flex h-9 w-9 items-center justify-center text-sm transition-colors ${
                    selected
                      ? "bg-[#442220] text-white"
                      : between
                        ? "bg-[#442220]/20"
                        : past
                          ? "text-ink/25"
                          : "hover:bg-divider"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-divider pt-3">
            <p className="text-xs text-ink/50">
              {!value.start
                ? "Choose a start date"
                : !value.end
                  ? "Now choose an end date"
                  : ""}
            </p>
            <button
              type="button"
              onClick={() => onChange({ start: null, end: null })}
              className="text-xs text-ink/50 transition-colors hover:text-ink"
            >
              Clear dates
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
