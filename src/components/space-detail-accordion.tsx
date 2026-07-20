"use client";

import { useState } from "react";
import { averageRating, Stars } from "@/components/rating";
import type { Space } from "@/lib/types";

type SectionKey = "about" | "amenities" | "rules" | "reviews" | "location";

const statIcon = {
  stroke: "#CA0000",
  strokeWidth: 1.5,
  fill: "none",
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
};

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "about", label: "About this space" },
  { key: "amenities", label: "Amenities" },
  { key: "rules", label: "Space rules" },
  { key: "reviews", label: "Reviews" },
  { key: "location", label: "Location" },
];

export function SpaceDetailAccordion({ space }: { space: Space }) {
  const [open, setOpen] = useState<SectionKey | null>("about");

  const amenityGroups = [
    { label: "Amenities", items: space.amenities },
    { label: "Kitchen facilities", items: space.kitchenFacilities },
    { label: "Equipment included", items: space.equipmentIncluded },
  ]
    .map((g) => ({ ...g, items: g.items.filter((i) => i !== "None") }))
    .filter((g) => g.items.length > 0);

  const mapQuery = encodeURIComponent(`${space.suburb}, Melbourne`);

  const stats = [
    {
      label: "space type",
      value: space.type,
      icon: (
        <svg {...statIcon}>
          <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
        </svg>
      ),
    },
    {
      label: "min. days",
      value: space.minBookingDuration,
      icon: (
        <svg {...statIcon}>
          <rect x="3" y="5" width="18" height="16" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      ),
    },
    {
      label: "covers",
      value: String(space.capacity),
      icon: (
        <svg {...statIcon}>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5M16 5a3.5 3.5 0 010 7M18 15c2 .8 3.5 2.4 3.5 5" />
        </svg>
      ),
    },
    {
      label: "sq ft",
      value: space.sqft.toLocaleString(),
      icon: (
        <svg {...statIcon}>
          <path d="M4 20L20 4M4 20v-5m0 5h5M20 4v5m0-5h-5" />
        </svg>
      ),
    },
  ];

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
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="flex aspect-square flex-col items-center justify-center gap-2 bg-white px-3 text-center"
                        >
                          {stat.icon}
                          <span className="text-sm font-semibold leading-tight text-ink">
                            {stat.value}
                          </span>
                          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-ink/40">
                            {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p>{space.description}</p>
                    {space.whatCanYouDo && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40">
                          What you can do here
                        </p>
                        <p className="mt-2">{space.whatCanYouDo}</p>
                      </div>
                    )}
                    <p className="text-ink/50">
                      Minimum booking: {space.minBookingDuration}
                    </p>
                  </div>
                )}

                {section.key === "amenities" &&
                  (amenityGroups.length === 0 ? (
                    <p>No amenities listed.</p>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {amenityGroups.map((group) => (
                        <div key={group.label}>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40">
                            {group.label}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {group.items.map((item) => (
                              <span
                                key={item}
                                className="bg-white px-4 py-2 text-sm text-ink/70"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}

                {section.key === "rules" &&
                  (space.spaceRules.length === 0 ? (
                    <p>No specific rules for this space.</p>
                  ) : (
                    <ul className="flex flex-col gap-1.5">
                      {space.spaceRules.map((rule) => (
                        <li key={rule} className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 bg-accent" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  ))}

                {section.key === "reviews" &&
                  (space.reviews.length === 0 ? (
                    <p>No reviews yet — this space is new to Blanked.</p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <p className="flex items-center gap-2 text-ink/70">
                        <Stars value={averageRating(space.reviews)} />
                        {averageRating(space.reviews).toFixed(1)} ·{" "}
                        {space.reviews.length} review
                        {space.reviews.length === 1 ? "" : "s"}
                      </p>
                      <div className="flex flex-col gap-3">
                        {space.reviews.map((review) => (
                          <div
                            key={review.author + review.date}
                            className="bg-white p-5"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <Stars value={review.rating} />
                              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-ink/35">
                                {review.date}
                              </span>
                            </div>
                            <p className="mt-3">&ldquo;{review.text}&rdquo;</p>
                            <p className="mt-3 text-sm font-medium text-ink">
                              {review.author}
                              <span className="ml-2 text-[10px] font-medium uppercase tracking-[0.15em] text-ink/40">
                                {review.authorRole}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                {section.key === "location" && (
                  <div className="flex flex-col gap-3">
                    <p>{space.suburb}, Melbourne</p>
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
