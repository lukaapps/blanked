"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Chef, Event } from "@/lib/types";

type SectionKey = "about" | "chef" | "previous" | "location";

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "about", label: "About This Event" },
  { key: "chef", label: "About the Chef" },
  { key: "previous", label: "Previous Events" },
  { key: "location", label: "Location" },
];

function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function EventDetailAccordion({
  event,
  chef,
  otherEvents,
}: {
  event: Event;
  chef: Chef | null;
  otherEvents: Event[];
}) {
  const [open, setOpen] = useState<SectionKey | null>("about");

  const mapQuery = encodeURIComponent(`${event.suburb}, Melbourne`);

  return (
    <div className="mt-10 border-t border-divider">
      {SECTIONS.map((section) => {
        const isOpen = open === section.key;
        return (
          <div key={section.key} className="border-b border-divider">
            <button
              onClick={() => setOpen(isOpen ? null : section.key)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-5 text-left text-xs font-semibold uppercase tracking-[0.2em]"
            >
              {section.label}
              <span className="text-lg font-normal text-ink/40">
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {isOpen && (
              <div className="pb-6 text-sm leading-relaxed text-ink/60">
                {section.key === "about" && (
                  <div className="flex flex-col gap-6">
                    <p>{event.description}</p>
                    <p className="text-ink/50">
                      {formatDate(event.date)} · {event.time}
                    </p>
                  </div>
                )}

                {section.key === "chef" &&
                  (chef ? (
                    <div className="flex flex-col gap-4">
                      <Link
                        href={`/talent/${chef.slug}`}
                        className="flex items-center gap-4 bg-white p-4 transition-colors hover:text-accent"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-divider">
                          <Image
                            src={chef.portrait}
                            alt={chef.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-ink">{chef.name}</p>
                          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
                            {chef.role}
                          </p>
                        </div>
                      </Link>
                      <p>{chef.bio}</p>
                      <Link
                        href={`/talent/${chef.slug}`}
                        className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent hover:underline"
                      >
                        View full profile →
                      </Link>
                    </div>
                  ) : (
                    <p>Talent details coming soon.</p>
                  ))}

                {section.key === "previous" &&
                  (otherEvents.length === 0 ? (
                    <p>No previous events from this chef yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                      {otherEvents.map((e) => (
                        <Link
                          key={e.slug}
                          href={`/events/${e.slug}`}
                          className="group block"
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-divider">
                            <Image
                              src={e.images[0]}
                              alt={e.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <p className="mt-3 font-medium text-ink">
                            {e.name}
                          </p>
                          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
                            {e.suburb}, Melbourne
                          </p>
                        </Link>
                      ))}
                    </div>
                  ))}

                {section.key === "location" && (
                  <div className="flex flex-col gap-3">
                    <p>{event.suburb}, Melbourne</p>
                    <div className="aspect-[4/3] w-full overflow-hidden bg-divider">
                      <iframe
                        title="Map"
                        src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                        className="h-full w-full border-0"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-xs text-ink/40">
                      Approximate location shown. Exact address shared upon
                      booking.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
